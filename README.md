# Bitts & Waves — Website

Static company website built with vanilla HTML, modular CSS, and ES modules.

## Project Structure

```
bitts-and-waves/
├── index.html              # Main HTML (markup only)
├── .env                    # EmailJS credentials (never commit this)
├── .gitignore
├── css/
│   ├── variables.css       # CSS variables, reset, animations, shared utils
│   ├── nav.css             # Navigation + mobile hamburger menu
│   ├── hero.css            # Hero section
│   ├── sections.css        # Services, Why Us, Approach, Tech, Industries
│   └── contact.css         # CTA form + footer
├── js/
│   ├── config.js           # Auto-generated credentials (from .env)
│   ├── main.js             # Entry point — imports all modules
│   ├── nav.js              # Mobile nav + scroll active state
│   ├── reveal.js           # Scroll reveal (IntersectionObserver)
│   └── email.js            # EmailJS contact form handler
└── scripts/
    └── build-config.js     # Reads .env → writes js/config.js
```

## Setup

### 1. Configure EmailJS credentials

Edit `.env` with your real keys:
```
EMAILJS_PUBLIC_KEY=your_actual_public_key
EMAILJS_SERVICE_ID=your_actual_service_id
EMAILJS_TEMPLATE_ID=your_actual_template_id
```

### 2. Inject credentials into config.js

```bash
node scripts/build-config.js
```

Run this every time you change `.env`.

### 3. Open in browser

Use the **Live Server** extension in VS Code:
- Right-click `index.html` → **Open with Live Server**

> ⚠️ Must use Live Server (or any local server) — not double-click open.
> ES modules (`type="module"`) require HTTP, not the `file://` protocol.

## Important Notes

- `.env` is in `.gitignore` — never commit real credentials
- `js/config.js` is auto-generated — do not edit manually
- The site uses ES modules, so a local server is required (Live Server works perfectly)
