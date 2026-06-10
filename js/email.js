// js/email.js — EmailJS contact form handler

import CONFIG from './config.js';

let iti;

function showStatus(msg, type) {
  const el = document.getElementById('bw-status');
  if (!el) return;
  el.textContent = msg;
  el.style.color = type === 'success' ? '#00B4D8' : '#E57373';
}

function resetBtn(btn) {
  btn.textContent = 'Send Message →';
  btn.style.opacity = '1';
  btn.disabled = false;
}

export function initEmail() {

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

  // Bail early if EmailJS not loaded or keys not set
  if (typeof emailjs === 'undefined') {
    console.error('EmailJS SDK not loaded.');
    return;
  }
  if (!CONFIG.emailjs.publicKey || CONFIG.emailjs.publicKey.startsWith('YOUR_')) {
    console.warn('EmailJS credentials not configured. Run: node scripts/build-config.js');
    return;
  }

  emailjs.init({ publicKey: CONFIG.emailjs.publicKey });

  const btn = document.getElementById('bw-send');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const name        = document.getElementById('bw-name')?.value.trim();
    const email       = document.getElementById('bw-email')?.value.trim();
    // const countryCode = document.getElementById('bw-country-code').value;
    const phone       = iti.getNumber();
    const company     = document.getElementById('bw-company')?.value.trim();
    const message     = document.getElementById('bw-message')?.value.trim();

    // Validation
    if (!name)    { showStatus('Please enter your name.', 'error'); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus('Please enter a valid email address.', 'error'); return;
    }
    if (!message) { showStatus('Please tell us about your project.', 'error'); return; }
    if (!phone) { showStatus('Please provide your contact number.', 'error'); return; }

    btn.textContent = 'Sending…';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    try {
      await emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, {
        from_name:  name,
        from_email: email,
        phone:      phone,
        company:    company || 'Not specified',
        message,
        to_email:   CONFIG.recipient,
      });
      showStatus('Message sent! We will be in touch soon.', 'success');
      ['bw-name','bw-email','bw-phone','bw-company','bw-message'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
    } catch (err) {
      console.error('EmailJS error:', err);
      const errText = err?.text || err?.message || JSON.stringify(err) || 'Unknown error';
      showStatus('Error: ' + errText, 'error');
    } finally {
      resetBtn(btn);
    }
  });
}
