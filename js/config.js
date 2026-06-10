// js/config.js
// ─────────────────────────────────────────────────────────────────────────────
// Loads environment variables from the .env file at build/serve time.
//
// HOW IT WORKS (static site — no Node backend):
//   Since browsers cannot read .env files directly, this project uses a
//   lightweight approach: the build script (scripts/build-config.js) reads
//   your .env and writes the values into this file as JS constants before
//   you open the site. Run it once after editing .env:
//
//     node scripts/build-config.js
//
// Never commit your real credentials to git. Add .env to .gitignore.
// ─────────────────────────────────────────────────────────────────────────────

const CONFIG = {
  emailjs: {
    publicKey:  'YOUR_PUBLIC_KEY',   // replaced by build-config.js
    serviceId:  'YOUR_SERVICE_ID',   // replaced by build-config.js
    templateId: 'YOUR_TEMPLATE_ID',  // replaced by build-config.js
  },
  recipient: 'RECIPIENT',
};

export default CONFIG;
