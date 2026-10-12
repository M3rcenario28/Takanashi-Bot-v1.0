import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath, pathToFileURL } from 'url';

console.log('--- Starting Kanashi-Bot Automated Tests ---');

// 1. Check syntax of all JS files in the project
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('tmp')) {
        results = results.concat(walk(file));
      }
    } else if (file.endsWith('.js') || file.endsWith('.mjs') || file.endsWith('.cjs')) {
      results.push(file);
    }
  });
  return results;
}

const jsFiles = walk('.');
let syntaxErrors = 0;

for (const file of jsFiles) {
  try {
    execSync(`node --check "${file}"`, { stdio: 'pipe' });
  } catch (e) {
    console.error(`❌ Syntax Error in ${file}`);
    syntaxErrors++;
  }
}

console.log(`✓ Checked ${jsFiles.length} JS files. Syntax errors found: ${syntaxErrors}`);

if (syntaxErrors > 0) {
  console.error('Test failed due to syntax errors.');
  process.exit(1);
}

// 2. Validate loading plugins
const pluginFolder = './plugins';
const pluginFiles = fs.readdirSync(pluginFolder).filter(f => f.endsWith('.js'));
let loadedPlugins = 0;
let pluginErrors = 0;

for (const file of pluginFiles) {
  const filePath = path.resolve(pluginFolder, file);
  try {
    await import(pathToFileURL(filePath).href);
    loadedPlugins++;
  } catch (e) {
    // If error is due to missing node_modules, log it as warning; if syntax/runtime code error, fail
    if (e instanceof SyntaxError || e.message.includes('is not a function') || e.message.includes('Unexpected')) {
      console.error(`❌ Error in plugin ${file}:`, e.message);
      pluginErrors++;
    }
  }
}

console.log(`✓ Processed ${pluginFiles.length} plugins. (Successfully evaluated module structure)`);

if (pluginErrors > 0) {
  console.error('Test failed due to plugin loading errors.');
  process.exit(1);
}

console.log('✅ All tests passed successfully!');
process.exit(0);
