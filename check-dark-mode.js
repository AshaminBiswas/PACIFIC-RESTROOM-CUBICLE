const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'app', 'pages');

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const missing = [];

  lines.forEach((line, i) => {
    // Check for bg-white or bg-gray-50/100/200 without dark:bg-
    if (/(bg-white|bg-gray-\d+)(?!\/[0-9]+)?(?!.*dark:bg-)/.test(line)) {
      // Exclude simple matches where dark:bg is on the same line or we don't care
      if (!line.includes('dark:bg-')) {
        missing.push({ line: i + 1, content: line.trim() });
      }
    }
  });

  if (missing.length > 0) {
    console.log(`\nFile: ${path.basename(filePath)}`);
    missing.forEach(m => console.log(`  Line ${m.line}: ${m.content}`));
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'admin') walkDir(fullPath); // Skip admin for now if you want
    } else if (fullPath.endsWith('.tsx')) {
      checkFile(fullPath);
    }
  }
}

walkDir(pagesDir);
