// js/main.js — All JS in one non-module file (works with file:// and Live Server)
// EmailJS credentials — run: node scripts/build-config.js to inject from .env

var CONFIG = {
  emailjs: {
    publicKey:  'lnoUzW9vv457YI0ta',
    serviceId:  'service_wp4q0ac',
    templateId: 'template_0xtplos',
  },
  recipient: 'divyanshu.raj@bittsandwaves.com',
};

// ── SCROLL REVEAL ────────────────────────────────────────────────────────────
function initReveal() {
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function() {
            entry.target.classList.add('visible');
          }, i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    reveals.forEach(function(el) { observer.observe(el); });
  } else {
    // Fallback for old browsers
    reveals.forEach(function(el) { el.classList.add('visible'); });
  }
}

// ── NAV: HAMBURGER + SCROLL ACTIVE ──────────────────────────────────────────
function initNav() {
  var hamburger  = document.querySelector('.nav-hamburger');
  var mobileMenu = document.querySelector('.nav-mobile');
  var navLinks   = document.querySelectorAll('.nav-links a');
  var sections   = document.querySelectorAll('section[id]');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  window.addEventListener('scroll', function() {
    var current = '';
    sections.forEach(function(sec) {
      if (window.scrollY >= sec.offsetTop - 130) current = sec.getAttribute('id');
    });
    navLinks.forEach(function(a) {
      a.style.color = a.getAttribute('href') === ('#' + current) ? 'var(--teal)' : '';
    });
  }, { passive: true });
}

// ── EMAIL FORM ───────────────────────────────────────────────────────────────
function showStatus(msg, type) {
  var el = document.getElementById('bw-status');
  if (!el) return;
  el.textContent = msg;
  el.style.color = type === 'success' ? '#00B4D8' : '#E57373';
}

function resetBtn(btn) {
  btn.textContent = 'Send Message \u2192';
  btn.style.opacity = '1';
  btn.disabled = false;
}

function initEmail() {

  const phoneInput = document.getElementById("bw-phone");

  if (phoneInput && window.intlTelInput) {
      iti = window.intlTelInput(phoneInput, {
      initialCountry: "in",
      separateDialCode: true,
      autoPlaceholder: "aggressive",

      loadUtils: () =>
          import("https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.0/build/js/utils.js")
    });
  }

  if (typeof emailjs === 'undefined') {
    console.warn('EmailJS SDK not loaded.');
    return;
  }
  if (!CONFIG.emailjs.publicKey || CONFIG.emailjs.publicKey.indexOf('YOUR_') === 0) {
    console.warn('EmailJS credentials not configured. Run: node scripts/build-config.js');
    return;
  }

  emailjs.init({ publicKey: CONFIG.emailjs.publicKey });

  var btn = document.getElementById('bw-send');
  if (!btn) return;

  btn.addEventListener('click', function() {
    var name    = (document.getElementById('bw-name')    || {}).value || '';
    var email   = (document.getElementById('bw-email')   || {}).value || '';
    var phone   = iti ? iti.getNumber() : ((document.getElementById('bw-phone') || {}).value || '').trim();
    var company = (document.getElementById('bw-company') || {}).value || '';
    var message = (document.getElementById('bw-message') || {}).value || '';

    name = name.trim(); email = email.trim();
    company = company.trim(); message = message.trim();

    if (!name)    { showStatus('Please enter your name.', 'error'); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus('Please enter a valid email address.', 'error'); return;
    }
    if (iti && !iti.isValidNumber()) {
      showStatus('Please enter a valid phone number.', 'error'); return;
    }
    if (!message) { showStatus('Please tell us about your project.', 'error'); return; }

    btn.textContent = 'Sending\u2026';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    console.log("Sending EmailJS request");
    console.log({
      publicKey: CONFIG.emailjs.publicKey,
      serviceId: CONFIG.emailjs.serviceId,
      templateId: CONFIG.emailjs.templateId,
      phone,
      name,
      email
    });

    emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, {
      from_name:  name,
      from_email: email,
      phone:      phone,
      company:    company || 'Not specified',
      message:    message,
      to_email:   CONFIG.recipient,
    }).then(function() {
      showStatus('Message sent! We will be in touch soon.', 'success');
      ['bw-name','bw-email','bw-company','bw-message'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.value = '';
      });
      resetBtn(btn);
    }).catch(function(err) {
      console.error("FULL EMAILJS ERROR:", err);
      console.error("STATUS:", err?.status);
      console.error("TEXT:", err?.text);
      console.error('EmailJS error:', err);
      var errText = (err && (err.text || err.message)) ? (err.text || err.message) : JSON.stringify(err);
      showStatus('Error: ' + errText, 'error');
      resetBtn(btn);
    });
  });
}

// ── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  initReveal();
  initNav();
  initEmail();
});
