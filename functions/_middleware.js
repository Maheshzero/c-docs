// Keep it in memory. It resets when the isolate is recycled.
const ipLimits = new Map();
const salt = crypto.randomUUID(); // Rotating salt per isolate instance

export async function onRequest(context) {
  const { request } = context;
  const userAgent = request.headers.get("User-Agent") || "";
  
  // 1. Bot check (User-Agent filtering)
  const lowerUA = userAgent.toLowerCase();
  const isBot = !userAgent || 
                lowerUA.includes("curl") || 
                lowerUA.includes("wget") || 
                lowerUA.includes("python") || 
                lowerUA.includes("scrapy") || 
                lowerUA.includes("headless") || 
                lowerUA.includes("selenium") || 
                lowerUA.includes("playwright");
                
  if (isBot) {
    return new Response("Access Denied: Automated requests are not allowed.", { status: 403 });
  }

  // 2. HTTP Method restriction
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // 3. In-memory Rate Limiter (Token Bucket per Isolate)
  const clientIP = request.headers.get("CF-Connecting-IP") || "127.0.0.1";
  const ipHash = await hashIP(clientIP, salt);
  const now = Date.now();
  
  if (!ipLimits.has(ipHash)) {
    ipLimits.set(ipHash, { count: 1, resetTime: now + 60000 });
  } else {
    const data = ipLimits.get(ipHash);
    if (now > data.resetTime) {
      data.count = 1;
      data.resetTime = now + 60000;
    } else {
      data.count += 1;
      if (data.count > 60) { // Limit to 60 requests per minute
        return new Response("Too Many Requests. Please slow down.", { status: 429 });
      }
    }
  }

  // Clean up memory occasionally (prune expired entries)
  pruneIpLimits();

  // 4. Fetch the static asset
  const response = await context.next();

  // 5. Hardening Headers (inject security and privacy headers)
  // Ensure the body is null for status codes that prohibit a response body
  const hasNoBody = response.status === 204 || 
                    response.status === 304 || 
                    (response.status >= 300 && response.status < 400);
  const body = hasNoBody ? null : response.body;

  // Create a mutable copy of the response
  const newResponse = new Response(body, response);
  
  // Security Sandbox (CSP - allow inline scripts/styles for C-Docs buttons)
  newResponse.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self';");
  
  // Clickjacking mitigation
  newResponse.headers.set("X-Frame-Options", "DENY");
  
  // MIME Sniffing protection
  newResponse.headers.set("X-Content-Type-Options", "nosniff");
  
  // Referrer anonymity
  newResponse.headers.set("Referrer-Policy", "no-referrer");
  
  // Cache Policy: Cache everything static for 1 day in CDN edge, 1 hour in browser
  newResponse.headers.set("Cache-Control", "public, max-age=3600, s-maxage=86400");
  
  // Anonymization: Scrub Cloudflare infrastructure details and server versions
  newResponse.headers.delete("Server");
  newResponse.headers.delete("X-Powered-By");
  newResponse.headers.delete("CF-Ray");
  
  return newResponse;
}

// SHA-256 IP hasher
async function hashIP(ip, salt) {
  const msgBuffer = new TextEncoder().encode(ip + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// Simple periodic pruning of the Map to keep memory clean
let lastPrune = Date.now();
function pruneIpLimits() {
  const now = Date.now();
  if (now - lastPrune < 300000) return; // limit pruning to every 5 minutes
  lastPrune = now;
  for (const [key, value] of ipLimits.entries()) {
    if (now > value.resetTime) {
      ipLimits.delete(key);
    }
  }
}
