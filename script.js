/* ═══════════════════════════════════════════
   FACENOVA — JavaScript
═══════════════════════════════════════════ */

const WEB3FORMS_KEY  = '150549c6-3d43-4bcc-94e5-5056e12a41f4';
const SUPPORT_EMAIL  = 'support@facenova.uk';

/* ════════════════════════════════
   THEME TOGGLE
════════════════════════════════ */
const html         = document.documentElement;
const themeToggle  = document.getElementById('theme-toggle');

// Restore saved theme (default: light)
const savedTheme = localStorage.getItem('fn-theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('fn-theme', next);
});

/* ════════════════════════════════
   NAV SCROLL EFFECT
════════════════════════════════ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

/* ════════════════════════════════
   MOBILE MENU
════════════════════════════════ */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));

/* ════════════════════════════════
   NAV ACTIVE LINK
════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 130) current = s.id; });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--text)' : '';
  });
});

/* ════════════════════════════════
   CODE TABS
════════════════════════════════ */
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const name = tab.dataset.tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + name).classList.add('active');
  });
});

/* ════════════════════════════════
   COPY BUTTONS
════════════════════════════════ */
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
      btn.style.cssText = 'background:var(--green);border-color:var(--green);color:white';
      setTimeout(() => { btn.textContent = orig; btn.style.cssText = ''; }, 2000);
    });
  });
});

/* ════════════════════════════════
   PUB.DEV LIVE STATS
════════════════════════════════ */
(async () => {
  const pdLikes = document.getElementById('pd-likes');
  const pdPoints = document.getElementById('pd-points');
  const pdPop   = document.getElementById('pd-pop');
  if (!pdLikes) return;

  // Show loading shimmer
  [pdLikes, pdPoints, pdPop].forEach(el => el.classList.add('loading'));

  try {
    const res  = await fetch('https://pub.dev/api/packages/flutter_face_nova/score', {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error('fetch failed');
    const data = await res.json();

    pdLikes.textContent  = data.likeCount  ?? '—';
    pdPoints.textContent = data.grantedPoints != null
      ? `${data.grantedPoints}/${data.maxPoints ?? 140}`
      : '—';
    pdPop.textContent    = data.popularityScore != null
      ? `${Math.round(data.popularityScore * 100)}%`
      : '—';
  } catch {
    pdLikes.textContent  = '—';
    pdPoints.textContent = '—';
    pdPop.textContent    = '—';
  } finally {
    [pdLikes, pdPoints, pdPop].forEach(el => el.classList.remove('loading'));
  }
})();

/* ════════════════════════════════
   SCANNER BAR ANIMATION
   Triggers once when scanner enters view
════════════════════════════════ */
let scannerAnimated = false;

function animateScanner() {
  if (scannerAnimated) return;
  scannerAnimated = true;
  document.querySelectorAll('.result-fill').forEach(el => {
    el.classList.add('animated');
  });
}

// Trigger on load (scanner is in hero, visible immediately)
setTimeout(animateScanner, 700);

/* ════════════════════════════════
   FADE-UP ANIMATION (scroll reveal)
════════════════════════════════ */
const fadeObserver = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      fadeObserver.unobserve(e.target);
    }
  }),
  { threshold: 0.08 }
);

document.querySelectorAll('.feature-card, .step, .use-case, .pricing-card, .flow-box, .att-card, .bfeat-item, .solutions-stats, .driver-mock, .att-bottom, .solution-card, .bus-student, .kyc-badge, .dfl-item, .demo-browser-frame').forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = `${(i % 6) * 65}ms`;
  fadeObserver.observe(el);
});

/* ════════════════════════════════
   MODAL SYSTEM
════════════════════════════════ */
const overlay = document.getElementById('modal-overlay');

function openModal(plan) {
  document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
  overlay.classList.add('open');
  document.getElementById('modal-' + plan).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function openLegalModal(type) {
  document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
  overlay.classList.add('open');
  document.getElementById('modal-' + type).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ════════════════════════════════
   FORM SUBMISSIONS
════════════════════════════════ */
const planConfig = {
  trial: {
    subject: name => `FaceNova Trial License Request — ${name}`,
    successNote: "✅ Trial request sent! You'll receive your 10-day license key within 24 hours.",
  },
  monthly: {
    subject: name => `FaceNova Monthly License Request — ${name}`,
    successNote: "✅ Monthly request sent! We'll reply within 24 hours with your license key and payment link.",
  },
  'lifetime-single': {
    subject: name => `FaceNova Lifetime License (1 App) Request — ${name}`,
    successNote: "✅ Sent! We'll reply within 24 hours with your license key and a $10 payment link.",
  },
  lifetime: {
    subject: name => `FaceNova Lifetime License (1 App) Request — ${name}`,
    successNote: "✅ Sent! We'll reply within 24 hours with your license key and a $10 payment link.",
  },
  'lifetime-bundle': {
    subject: name => `FaceNova Lifetime Bundle (10 Apps) Request — ${name}`,
    successNote: "✅ Bundle request sent! We'll reply within 24 hours with your license keys and a $49 payment link.",
  },
};

document.querySelectorAll('.modal-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const plan    = form.dataset.plan;
    const config  = planConfig[plan];
    const data    = Object.fromEntries(new FormData(form));
    const btnText = form.querySelector('.modal-btn-text');
    const success = form.querySelector('.form-success');
    const btn     = form.querySelector('button[type="submit"]');

    btn.disabled = true;
    btnText.textContent = 'Sending…';

    const bodyLines = [
      `Plan: ${plan.toUpperCase()}`,
      `────────────────────`,
      `Name:         ${data.name || '—'}`,
      `Email:        ${data.email || '—'}`,
      `Package Name: ${data.package || '—'}`,
    ];
    if (data.message) bodyLines.push(`\nMessage:\n${data.message}`);

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
        success.textContent = `❌ Something went wrong. Please email ${SUPPORT_EMAIL} directly.`;
        success.style.display = 'block';
        success.style.background = 'rgba(239,68,68,0.08)';
        success.style.color = '#f87171';
        success.style.borderColor = 'rgba(239,68,68,0.2)';
      }
    })
    .catch(() => {
      btn.disabled = false;
      btnText.textContent = 'Try Again';
      success.textContent = `❌ Network error. Please email ${SUPPORT_EMAIL} directly.`;
      success.style.display = 'block';
    });
  });
});
