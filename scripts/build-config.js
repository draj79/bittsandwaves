// scripts/build-config.js
// Run after editing .env:  node scripts/build-config.js
const fs   = require('fs');
const path = require('path');

const envPath    = path.resolve(__dirname, '../.env');
const mainJsPath = path.resolve(__dirname, '../js/main.js');

if (!fs.existsSync(envPath)) {
  console.error('❌  .env file not found at project root.'); process.exit(1);
}

const env = {};
fs.readFileSync(envPath, 'utf8')
  .split('\n')
  .filter(l => l.trim() && !l.startsWith('#'))
  .forEach(l => {
    const [k, ...v] = l.split('=');
    env[k.trim()] = v.join('=').trim();
  });

const required = ['EMAILJS_PUBLIC_KEY', 'EMAILJS_SERVICE_ID', 'EMAILJS_TEMPLATE_ID'];
const missing  = required.filter(k => !env[k] || env[k].startsWith('YOUR_'));
if (missing.length) console.warn('⚠️  Still placeholder in .env:', missing.join(', '));

let js = fs.readFileSync(mainJsPath, 'utf8');
js = js
  .replace(/'YOUR_PUBLIC_KEY'/,  `'${env.EMAILJS_PUBLIC_KEY  || 'YOUR_PUBLIC_KEY'}'`)
  .replace(/'YOUR_SERVICE_ID'/,  `'${env.EMAILJS_SERVICE_ID  || 'YOUR_SERVICE_ID'}'`)
  .replace(/'YOUR_TEMPLATE_ID'/, `'${env.EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID'}'`)
  .replace(/'RECIPIENT'/, `'${env.RECIPIENT || 'divyanshu.raj@bittsandwaves.com'}'`);

fs.writeFileSync(mainJsPath, js, 'utf8');
console.log('✅  js/main.js updated with credentials from .env');
