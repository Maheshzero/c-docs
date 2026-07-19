import fs from 'fs';
import path from 'path';

const projectDir = '/home/mahesh-s/Downloads/c-docs-app';
const distDir = path.join(projectDir, 'dist');

// Ensure dist directory is clean and exists
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

console.log('🧹 Cleaned and created dist/ directory');

// Helper to copy files recursively
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Copy index.html
fs.copyFileSync(path.join(projectDir, 'src/pages/index.html'), path.join(distDir, 'index.html'));
console.log('📄 Copied index.html');

// 2. Copy docs folder recursively
copyDirSync(path.join(projectDir, 'src/pages/docs'), path.join(distDir, 'docs'));
console.log('📂 Copied docs/ markdown files');

// 3. Copy public folder files directly to dist root
const publicDir = path.join(projectDir, 'public');
if (fs.existsSync(publicDir)) {
  const publicFiles = fs.readdirSync(publicDir);
  for (const file of publicFiles) {
    const srcPath = path.join(publicDir, file);
    const destPath = path.join(distDir, file);
    if (fs.lstatSync(srcPath).isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
console.log('📦 Copied public/ assets directly to dist/');

// Helper to strip comments and whitespace from JS
function compileJS(srcPath, destPath) {
  let code = fs.readFileSync(srcPath, 'utf8');
  
  // Safe Regex comment stripping (preserving string/regex literals)
  code = code.replace(/("([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`|\/([^\/\\\n]|\\.)+\/[gimuy]*)|(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, (m, g1) => g1 ? g1 : "");
  
  // Clean up duplicate whitespaces/newlines slightly to keep it compact
  code = code.replace(/\n\s*\n/g, '\n').trim();
  
  fs.writeFileSync(destPath, code, 'utf8');
}

// Helper to strip comments and whitespace from CSS
function compileCSS(srcPath, destPath) {
  let css = fs.readFileSync(srcPath, 'utf8');
  
  // Safe Regex block comment stripping (preserving strings)
  css = css.replace(/("([^"\\]|\\.)*"|'([^'\\]|\\.)*')|(\/\*[\s\S]*?\*\/)/g, (m, g1) => g1 ? g1 : "");
  
  // Collapse whitespace
  css = css.replace(/\s+/g, ' ').trim();
  
  fs.writeFileSync(destPath, css, 'utf8');
}

// 4. Compile style.css
compileCSS(path.join(projectDir, 'src/components/style.css'), path.join(distDir, 'style.css'));
console.log('🎨 Compiled style.css (comment-free)');

// 5. Compile JS files
compileJS(path.join(projectDir, 'src/core/app.js'), path.join(distDir, 'app.min.js'));
compileJS(path.join(projectDir, 'src/core/compiler.js'), path.join(distDir, 'compiler.min.js'));
compileJS(path.join(projectDir, 'src/core/data.js'), path.join(distDir, 'data.min.js'));
console.log('⚡ Compiled core JS files to minified versions (comment-free)');

console.log('✅ Build successful! All clean assets stored in dist/');
