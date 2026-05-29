/* ═══════════════════════════════════════════
   FACENOVA — JavaScript
═══════════════════════════════════════════ */

const WEB3FORMS_KEY = '150549c6-3d43-4bcc-94e5-5056e12a41f4';
const SUPPORT_EMAIL = 'support@facenova.uk';

// ── Nav scroll effect ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Mobile menu ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));

// ── Smooth nav active state ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--text)' : '';
  });
});

// ── Code tabs ──
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const name = tab.dataset.tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + name).classList.add('active');
  });
});

// ── Copy buttons ──
const codeSnippets = {
  pubspec: `dependencies:\n  video_liveness: ^1.0.0`,
  init: `void main() async {\n  WidgetsFlutterBinding.ensureInitialized();\n  await VideoLiveness.initFaceRecognition();\n  runApp(MyApp());\n}`,
  launch: `await VideoLiveness.launch(\n  context: context,\n  onResult: (LivenessResult result) {\n    if (result.passed && result.livenessPct >= 70) {\n      // result.faceTemplate  → 512-byte embedding\n      // result.capturedFrame → JPEG of the face\n    }\n  },\n  onError: (error) => print(error),\n);`,
  compare: `final score = VideoLiveness.compareFaces(\n  enrolledTemplate,\n  liveTemplate,\n);\nif (score >= 0.65) {\n  print('Match confirmed');\n}`,
};
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(codeSnippets[btn.dataset.copy] || '').then(() => {
      const orig = btn.textContent;
      btn.textContent = 'Copied!';
      btn.style.cssText = 'background:var(--accent-2);border-color:var(--accent-2);color:white';
      setTimeout(() => { btn.textContent = orig; btn.style.cssText = ''; }, 2000);
    });
  });
});

// ════════════════════════════════
// MODAL SYSTEM
// ════════════════════════════════

const overlay = document.getElementById('modal-overlay');

function openModal(plan) {
  // Close any open modal first
  document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
  overlay.classList.add('open');
  document.getElementById('modal-' + plan).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on Escape key
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── Form subjects & notes per plan ──
const planConfig = {
  trial: {
    subject: name => `FaceNova Trial License Request — ${name}`,
    successNote: "✅ Trial request sent! You'll receive your 10-day license key within 24 hours.",
  },
  monthly: {
    subject: name => `FaceNova Monthly License Request — ${name}`,
    successNote: "✅ Monthly request sent! We'll reply within 24 hours with your license key and payment link.",
  },
  lifetime: {
    subject: name => `FaceNova Lifetime License Request — ${name}`,
    successNote: "✅ Lifetime request sent! We'll reply within 24 hours with a one-time payment link.",
  },
};

// ── Handle form submissions ──
document.querySelectorAll('.modal-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const plan    = form.dataset.plan;
    const config  = planConfig[plan];
    const data    = Object.fromEntries(new FormData(form));
    const btnText = form.querySelector('.modal-btn-text');
    const success = form.querySelector('.form-success');
    const btn     = form.querySelector('button[type="submit"]');

    // Disable & show loading
    btn.disabled = true;
    btnText.textContent = 'Sending…';

    // Build message body
    const bodyLines = [
      `Plan: ${plan.toUpperCase()}`,
      `────────────────────`,
      `Name:         ${data.name || '—'}`,
      `Email:        ${data.email || '—'}`,
      `Package Name: ${data.package || '—'}`,
    ];
    if (data.message) bodyLines.push(`\nMessage:\n${data.message}`);

    // Silent submit via Web3Forms
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: config.subject(data.name || 'Unknown'),
        from_name: data.name || 'FaceNova Website',
        email: data.email,
        message: bodyLines.join('\n'),
      }),
    })
    .then(res => res.json())
    .then(res => {
      btn.disabled = false;
      if (res.success) {
        btnText.textContent = '✓ Sent!';
        success.textContent = config.successNote;
        success.style.display = 'block';
        form.reset();
        setTimeout(closeModal, 4000);
      } else {
        btnText.textContent = 'Try Again';
        success.textContent = '❌ Something went wrong. Please email support@facenova.uk directly.';
        success.style.display = 'block';
        success.style.background = 'rgba(239,68,68,0.1)';
        success.style.color = '#f87171';
      }
    })
    .catch(() => {
      btn.disabled = false;
      btnText.textContent = 'Try Again';
      success.textContent = '❌ Network error. Please email support@facenova.uk directly.';
      success.style.display = 'block';
    });
  });
});

// ── Fade-up animation ──
const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1 }
);
document.querySelectorAll('.feature-card, .step, .use-case, .pricing-card, .flow-box').forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  observer.observe(el);
});
