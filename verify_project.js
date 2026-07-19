import fs from 'fs';
import { execSync } from 'child_process';

console.log('============================================================');
console.log('      os-uce REDESIGN AUTOMATED VERIFICATION REPORT         ');
console.log('============================================================\n');

let failedTests = 0;
let passedTests = 0;

function report(testName, passed, details = '') {
  if (passed) {
    console.log(`[PASS] ${testName}`);
    if (details) console.log(`       -> ${details}`);
    passedTests++;
  } else {
    console.log(`[FAIL] ${testName}`);
    if (details) console.log(`       -> ERROR: ${details}`);
    failedTests++;
  }
}

// Set working directory dynamically
const projectDir = '/home/mahesh-s/Downloads/c-docs-app';

// 1. JavaScript Syntax Check
try {
  execSync(`node -c ${projectDir}/src/core/app.js ${projectDir}/src/core/compiler.js ${projectDir}/src/core/data.js ${projectDir}/src/core/docs_content.js`);
  report('JavaScript Syntax Checks', true, 'All JS files parsed and compiled with zero syntax errors.');
} catch (error) {
  report('JavaScript Syntax Checks', false, error.message);
}

// 2. HTML Loading Order Check
try {
  const indexHtml = fs.readFileSync(`${projectDir}/src/pages/index.html`, 'utf8');
  
  const markedIdx = indexHtml.indexOf('src="marked.min.js"');
  const dataIdx = indexHtml.indexOf('src="data.js"') !== -1 ? indexHtml.indexOf('src="data.js"') : indexHtml.indexOf('src="data.min.js"');
  const docsContentIdx = indexHtml.indexOf('src="docs_content.js"') !== -1 ? indexHtml.indexOf('src="docs_content.js"') : indexHtml.indexOf('src="docs_content.min.js"');
  const compilerIdx = indexHtml.indexOf('src="compiler.js"') !== -1 ? indexHtml.indexOf('src="compiler.js"') : indexHtml.indexOf('src="compiler.min.js"');
  const appIdx = indexHtml.indexOf('src="app.js"') !== -1 ? indexHtml.indexOf('src="app.js"') : indexHtml.indexOf('src="app.min.js"');

  const loaded = markedIdx !== -1 && dataIdx !== -1 && docsContentIdx !== -1 && compilerIdx !== -1 && appIdx !== -1;
  const orderCorrect = markedIdx < dataIdx && dataIdx < docsContentIdx && docsContentIdx < compilerIdx && compilerIdx < appIdx;

  if (loaded && orderCorrect) {
    report('HTML Script Loading Order', true, 'Scripts loaded in correct sequence: marked -> data -> docs_content -> compiler -> app.');
  } else {
    report('HTML Script Loading Order', false, `Script tags missing or loaded in incorrect order (marked: ${markedIdx}, data: ${dataIdx}, docs: ${docsContentIdx}, compiler: ${compilerIdx}, app: ${appIdx})`);
  }
} catch (error) {
  report('HTML Script Loading Order', false, error.message);
}

// 3. Variable Cleanliness Check
try {
  const appJs = fs.readFileSync(`${projectDir}/src/core/app.js`, 'utf8');
  const bannedPatterns = [
    { name: 'previousTopicId', regex: /\bpreviousTopicId\b/ },
    { name: 'previousScrollTop', regex: /\bpreviousScrollTop\b/ },
    { name: 'updateReturnBannerVisibility', regex: /\bupdateReturnBannerVisibility\b/ },
    { name: 'returnBanner', regex: /\breturnBanner\b/ },
    { name: 'returnTopicName', regex: /\breturnTopicName\b/ }
  ];

  let clean = true;
  let found = [];
  bannedPatterns.forEach(pattern => {
    if (pattern.regex.test(appJs)) {
      clean = false;
      found.push(pattern.name);
    }
  });

  if (clean) {
    report('Variable Cleanup Checks', true, 'Purged all residual back-banner variables and event handlers successfully.');
  } else {
    report('Variable Cleanup Checks', false, `Found orphaned variables in app.js: ${found.join(', ')}`);
  }
} catch (error) {
  report('Variable Cleanup Checks', false, error.message);
}

// 4. CSS Variable and Full-Height Panel Check
try {
  const styleCss = fs.readFileSync(`${projectDir}/src/components/style.css`, 'utf8');
  
  const hasHeadingFont = styleCss.includes('--font-heading:') && styleCss.includes('Plus Jakarta Sans');
  const hasUiFont = styleCss.includes('--font-ui:') && styleCss.includes('Inter');
  const hasMonoFont = styleCss.includes('--font-mono:') && styleCss.includes('Fira Code');
  
  const hasStretchedPanel = styleCss.includes('.workspace-panel {') && styleCss.includes('flex: 1;');

  if (hasHeadingFont && hasUiFont && hasMonoFont && hasStretchedPanel) {
    report('CSS Typography & Layout Checks', true, 'Variables loaded for Plus Jakarta Sans, Inter, Fira Code, and full-height workspace flex bindings.');
  } else {
    report('CSS Typography & Layout Checks', false, `Missing features (HeadingFont: ${hasHeadingFont}, UiFont: ${hasUiFont}, MonoFont: ${hasMonoFont}, StretchPanel: ${hasStretchedPanel})`);
  }
} catch (error) {
  report('CSS Typography & Layout Checks', false, error.message);
}

// 5. No Emoji Check in docs_content.js
try {
  const docsContent = fs.readFileSync(`${projectDir}/src/core/docs_content.js`, 'utf8');
  
  // Regex for emojis and variation selectors
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F1E6}-\u{1F1FF}]|[\u{26a0}\u{27a1}\u{2192}\u{2699}\u{25b6}\u{263c}]/gu;
  
  const match = docsContent.match(emojiRegex);
  
  if (!match) {
    report('Documentation Emoji Filtering', true, 'No emojis found in any syllabus topics, student guide, or C syntax glossary.');
  } else {
    report('Documentation Emoji Filtering', false, `Found remaining emojis in docs_content.js: ${[...new Set(match)].join(', ')}`);
  }
} catch (error) {
  report('Documentation Emoji Filtering', false, error.message);
}

console.log('\n============================================================');
console.log(`SUMMARY: ${passedTests} passed, ${failedTests} failed.`);
console.log('============================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
