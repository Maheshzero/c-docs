const ipLimits = new Map();
let salt;

export default {
  async fetch(request, env) {
    const userAgent = request.headers.get("User-Agent") || "";
    const lowerUA = userAgent.toLowerCase();
    const isBot =
      !userAgent ||
      lowerUA.includes("curl") ||
      lowerUA.includes("wget") ||
      lowerUA.includes("python") ||
      lowerUA.includes("scrapy") ||
      lowerUA.includes("headless") ||
      lowerUA.includes("selenium") ||
      lowerUA.includes("playwright");

    if (isBot) {
      return new Response("", { status: 403 });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("", { status: 405 });
    }

    const clientIP = request.headers.get("CF-Connecting-IP") || "127.0.0.1";
    if (!salt) salt = crypto.randomUUID();
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
        if (data.count > 60) {
          return new Response("", { status: 429 });
        }
      }
    }

    pruneIpLimits();

    const url = new URL(request.url);
    const assetRequest =
      url.pathname === "/"
        ? new Request(new URL("/index.html", request.url), request)
        : request;

    const assetsBinding =
      (env && env.ASSETS) ||
      (typeof ASSETS !== "undefined" ? ASSETS : undefined);

    if (!assetsBinding) {
      return new Response("Static asset binding not available", { status: 500 });
    }

    async function fetchAsset(pathname) {
      const targetUrl = new URL(request.url);
      targetUrl.pathname = pathname;
      const req = new Request(targetUrl.toString(), request);
      return assetsBinding.fetch(req);
    }

    const assetPath = assetRequest.url ? new URL(assetRequest.url).pathname : url.pathname;
    const candidates = [];
    if (assetPath === "/") {
      candidates.push("/index.html", "/dist/index.html", "/dist/dist/index.html");
    } else {
      candidates.push(assetPath);
      if (!assetPath.startsWith("/dist/")) {
        candidates.push(`/dist${assetPath}`);
      }
      if (assetPath.startsWith("/dist/")) {
        candidates.push(assetPath.replace(/^\/dist\//, "/"));
      }
      if (!assetPath.startsWith("/dist/dist/")) {
        candidates.push(`/dist/dist${assetPath}`);
      }
    }

    let response;
    for (const candidate of candidates) {
      response = await fetchAsset(candidate);
      if (response.status !== 404) break;
    }

    if (!response) {
      return new Response("Asset fetch failed", { status: 500 });
    }

    const hasNoBody =
      response.status === 204 ||
      response.status === 304 ||
      (response.status >= 300 && response.status < 400);
    const body = hasNoBody ? null : response.body;
    const headers = new Headers(response.headers);
    const pathnameToUse = new URL(response.url).pathname;
    const contentType = headers.get("content-type");
    if (!contentType || !contentType.trim()) {
      if (pathnameToUse.endsWith(".js")) {
        headers.set("Content-Type", "application/javascript; charset=utf-8");
      } else if (pathnameToUse.endsWith(".css")) {
        headers.set("Content-Type", "text/css; charset=utf-8");
      } else if (pathnameToUse.endsWith(".html")) {
        headers.set("Content-Type", "text/html; charset=utf-8");
      } else if (pathnameToUse.endsWith(".svg")) {
        headers.set("Content-Type", "image/svg+xml");
      }
    }
    const newResponse = new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });

    newResponse.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self';"
    );
    newResponse.headers.set("X-Frame-Options", "DENY");
    newResponse.headers.set("X-Content-Type-Options", "nosniff");
    newResponse.headers.set("Referrer-Policy", "no-referrer");
    newResponse.headers.set("Cache-Control", "public, max-age=3600, s-maxage=86400");
    newResponse.headers.delete("Server");
    newResponse.headers.delete("X-Powered-By");
    newResponse.headers.delete("CF-Ray");

    return newResponse;
  },
};

async function hashIP(ip, salt) {
  const msgBuffer = new TextEncoder().encode(ip + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

let lastPrune = Date.now();
function pruneIpLimits() {
  const now = Date.now();
  if (now - lastPrune < 300000) return;
  lastPrune = now;
  for (const [key, value] of ipLimits.entries()) {
    if (now > value.resetTime) {
      ipLimits.delete(key);
    }
  }
}
