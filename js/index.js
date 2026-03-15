/* ══════════════════════════════════════════
   CONFIG
══════════════════════════════════════════ */
const API_BASE = "https://portfolio-cms-flask.onrender.com";
const API      = API_BASE + "/api";
const LEVELS   = { Beginner: 28, Intermediate: 58, Advanced: 80, Expert: 96 };
const EMOJIS   = ['🖥️','📊','🤖','💬','🛒','🗺️','🎮','🔒','📱','🌐','⚡','🧠'];

/* ══════════════════════════════════════════
   UTILS
══════════════════════════════════════════ */
async function apiFetch(path) {
  const r = await fetch(API + path);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

function fmt(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/* ══════════════════════════════════════════
   MARQUEE SETUP
══════════════════════════════════════════ */
function initMarquee() {
  const items = [
    'Python', 'Flask', 'React', 'SQL', 'Data Analytics',
    'Full Stack Dev', 'Supabase', 'Business Solutions',
    'Design — Develop — Deploy'
  ];
  const track = document.getElementById('mtrack');
  // quadruple for seamless loop
  [...items, ...items, ...items, ...items].forEach(s => {
    const d = document.createElement('div');
    d.className  = 'marquee-item';
    d.textContent = s;
    track.appendChild(d);
  });
}

/* ══════════════════════════════════════════
   GSAP — HERO ENTRANCE
══════════════════════════════════════════ */
function initHeroAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // set initial hidden states
  gsap.set('.hero-num',  { x: -20 });
  gsap.set('.stat-strip', { x: 30 });
  gsap.set(['.role-row', '.hero-bio', '.cta-row', '.scroll-ind'], { y: 20 });

  // entrance timeline
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .to('.badge',        { opacity: 1, duration: .7, delay: .3 })
    .to('.hero-num',     { opacity: 1, x: 0, duration: .5 },                   '-=.4')
    .to('.hl span',      { opacity: 1, y: '0%', duration: .85, stagger: .1, ease: 'power4.out' }, '-=.2')
    .to('.q-word',       { opacity: 1, y: 0, duration: .5, stagger: .15, ease: 'back.out(1.5)' }, '-=.2')
    .to('.q-sep',        { opacity: 1, duration: .3, stagger: .15 },            '-=.4')
    .to('.quote-row',    { opacity: 1, duration: .1 },                          '<')
    .to('.role-row',     { opacity: 1, y: 0, duration: .6 },                    '-=.2')
    .to('.hero-bio',     { opacity: 1, y: 0, duration: .6 },                    '-=.4')
    .to('.cta-row',      { opacity: 1, y: 0, duration: .6 },                    '-=.4')
    .to('.stat-strip',   { opacity: 1, x: 0, duration: .7, ease: 'power2.out' }, '-=.8')
    .to('.scroll-ind',   { opacity: 1, duration: .5 },                          '-=.3')
    .to('.marquee-wrap', { opacity: 1, duration: .5 },                          '-=.4');

  // mouse parallax on orb3
  const orb3 = document.querySelector('.orb3');
  document.addEventListener('mousemove', e => {
    gsap.to(orb3, {
      x: (e.clientX / window.innerWidth  - .5) * 30,
      y: (e.clientY / window.innerHeight - .5) * 30,
      duration: 1.2, ease: 'power2.out'
    });
  });
}

/* ══════════════════════════════════════════
   GSAP — SCROLL TRIGGERS (static sections)
══════════════════════════════════════════ */
function initScrollAnimations() {
  // helper — fade + slide up
  const revealUp = (selector, extra = {}) => {
    gsap.utils.toArray(selector).forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: .7, ease: 'power3.out', ...extra,
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        }
      );
    });
  };

  revealUp('.eyebrow');
  revealUp('.section-h');
  revealUp('.about-grid',   { delay: .1 });
  revealUp('.contact-left', { delay: .1 });
  revealUp('.contact-form', { delay: .2 });

  // education cards staggered
  gsap.utils.toArray('.edu-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: .6, delay: i * .1, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' }
      }
    );
  });
}

/* ══════════════════════════════════════════
   GSAP — SKILL CARDS (called after API load)
══════════════════════════════════════════ */
function animateSkillCards() {
  gsap.utils.toArray('.skill-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: .55,
        delay: (i % 4) * .07, ease: 'power3.out',
        scrollTrigger: {
          trigger: card, start: 'top 92%', toggleActions: 'play none none none',
          onEnter: () => {
            const fill = card.querySelector('.skill-fill');
            if (fill) fill.style.width = (fill.dataset.pct || 60) + '%';
          }
        }
      }
    );
  });
}

/* ══════════════════════════════════════════
   GSAP — PROJECT CARDS (called after API load)
══════════════════════════════════════════ */
function animateProjectCards() {
  gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: .65, delay: (i % 3) * .1, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });
}

/* ══════════════════════════════════════════
   GSAP — TIMELINE ITEMS (called after API load)
══════════════════════════════════════════ */
function animateTimeline() {
  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, x: -24 },
      { opacity: 1, x: 0, duration: .6, delay: i * .12, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });
}

/* ══════════════════════════════════════════
   NAVBAR SCROLL SHADOW
══════════════════════════════════════════ */
function initNavbar() {
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* ══════════════════════════════════════════
   API — PROFILE
══════════════════════════════════════════ */
async function loadProfile() {
  try {
    const p = await apiFetch('/profile');
    if (!p || !p.name) return;

    document.title = `${p.name} · Portfolio`;
    const first = p.name.split(' ')[0];

    document.getElementById('nav-logo').textContent    = `⬡ ${first}`;
    document.getElementById('footer-logo').textContent = `⬡ ${p.name}`;
    document.getElementById('hero-name').textContent   = p.name + '.';

    if (p.bio) document.getElementById('hero-bio').textContent = p.bio;

    document.getElementById('about-text').innerHTML =
      `<p>${(p.bio || '').replace(/\n/g, '</p><p>')}</p>`;

    if (p.resume_link) document.getElementById('resume-btn').href = p.resume_link;

    if (p.profile_image) {
      document.getElementById('about-img').innerHTML =
        `<img src="${p.profile_image}" alt="${p.name}">`;
    }

    // social links
    const links = [];
    if (p.github_url)   links.push({ href: p.github_url,        label: 'GitHub' });
    if (p.linkedin_url) links.push({ href: p.linkedin_url,      label: 'LinkedIn' });
    if (p.twitter_url)  links.push({ href: p.twitter_url,       label: 'Twitter' });
    if (p.email)        links.push({ href: `mailto:${p.email}`, label: p.email });
    document.getElementById('about-links').innerHTML =
      links.map(l => `<a class="social-link" href="${l.href}" target="_blank">↗ ${l.label}</a>`).join('');

    // contact details
    const cd = [];
    if (p.email)        cd.push(`<a class="contact-item" href="mailto:${p.email}">✉ ${p.email}</a>`);
    if (p.github_url)   cd.push(`<a class="contact-item" href="${p.github_url}" target="_blank">⬡ GitHub</a>`);
    if (p.linkedin_url) cd.push(`<a class="contact-item" href="${p.linkedin_url}" target="_blank">in LinkedIn</a>`);
    document.getElementById('contact-details').innerHTML = cd.join('');

  } catch {
    // fallback
    document.getElementById('hero-name').textContent  = 'Gowtham.';
    document.getElementById('about-text').innerHTML   =
      '<p>Full Stack Developer, Data Analyst &amp; Business Solution Specialist based in Coimbatore.</p>';
  }
}

/* ══════════════════════════════════════════
   API — SKILLS
══════════════════════════════════════════ */
async function loadSkills() {
  const grid = document.getElementById('skills-grid');
  try {
    const skills = await apiFetch('/skills');
    if (!skills.length) {
      grid.innerHTML = '<p style="color:var(--muted);font-size:12px">No skills added yet.</p>';
      return;
    }
    grid.innerHTML = skills.map(s => `
      <div class="skill-card">
        <div class="skill-top">
          <div class="skill-name">${s.skill_name}</div>
          ${s.category ? `<div class="skill-cat">${s.category}</div>` : ''}
        </div>
        <div class="skill-level-label">${s.skill_level}</div>
        <div class="skill-bar">
          <div class="skill-fill" data-pct="${LEVELS[s.skill_level] || 60}" style="width:0%"></div>
        </div>
      </div>`).join('');

    setTimeout(() => { animateSkillCards(); ScrollTrigger.refresh(); }, 100);
  } catch {
    grid.innerHTML = '<p style="color:var(--muted);font-size:12px">Could not load skills.</p>';
  }
}

/* ══════════════════════════════════════════
   API — EXPERIENCE
══════════════════════════════════════════ */
async function loadExperience() {
  const tl = document.getElementById('timeline');
  try {
    const jobs = await apiFetch('/experience');
    if (!jobs.length) {
      tl.innerHTML = '<p style="color:var(--muted);font-size:12px">No experience added yet.</p>';
      return;
    }
    tl.innerHTML = jobs.map(j => `
      <div class="timeline-item">
        <div class="tl-date">${fmt(j.start_date)} — ${j.end_date ? fmt(j.end_date) : 'Present'}</div>
        <div class="tl-role">${j.role}</div>
        <div class="tl-company">@ ${j.company_name}${j.location ? ` · ${j.location}` : ''}</div>
        <div class="tl-desc">${j.description || ''}</div>
      </div>`).join('');

    // update years of experience
    const earliest = jobs.map(j => new Date(j.start_date).getFullYear()).sort()[0];
    const yrs = new Date().getFullYear() - earliest;
    document.getElementById('exp-years').textContent = yrs + '+';
    document.getElementById('stat-exp').textContent  = yrs + '+';

    setTimeout(() => { animateTimeline(); ScrollTrigger.refresh(); }, 100);
  } catch {
    tl.innerHTML = '<p style="color:var(--muted);font-size:12px">Could not load experience.</p>';
  }
}

/* ══════════════════════════════════════════
   API — PROJECTS
══════════════════════════════════════════ */
async function loadProjects() {
  const grid = document.getElementById('projects-grid');
  try {
    const projects = await apiFetch('/project');
    if (!projects.length) {
      grid.innerHTML = '<p style="color:var(--muted);font-size:12px">No projects yet.</p>';
      return;
    }
    document.getElementById('stat-projects').textContent = projects.length + '+';

    grid.innerHTML = projects.map((p, i) => {
      const stacks = (p.tech_stack || '').split(',').filter(Boolean)
        .map(s => `<span class="stack-tag">${s.trim()}</span>`).join('');
      return `
      <div class="project-card">
        <div class="project-thumb">
          ${p.image ? `<img src="${p.image}" alt="${p.title}">` : EMOJIS[i % EMOJIS.length]}
          <div class="project-thumb-overlay"></div>
        </div>
        <div class="project-body">
          <div class="project-title">${p.title}</div>
          <div class="project-desc">${p.description || ''}</div>
          <div class="project-stack">${stacks}</div>
          <div class="project-links">
            ${p.github_link ? `<a href="${p.github_link}" target="_blank" class="proj-link">⬡ GitHub</a>` : ''}
            ${p.live_link   ? `<a href="${p.live_link}"   target="_blank" class="proj-link">↗ Live Demo</a>` : ''}
          </div>
        </div>
      </div>`;
    }).join('');

    setTimeout(() => { animateProjectCards(); ScrollTrigger.refresh(); }, 100);
  } catch {
    grid.innerHTML = '<p style="color:var(--muted);font-size:12px">Could not load projects.</p>';
  }
}

/* ══════════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════════ */
async function sendMessage() {
  const btn    = document.getElementById('send-btn');
  const status = document.getElementById('form-status');

  const body = {
    name:    document.getElementById('c-name').value.trim(),
    email:   document.getElementById('c-email').value.trim(),
    subject: document.getElementById('c-subject').value.trim(),
    message: document.getElementById('c-message').value.trim(),
  };

  if (Object.values(body).some(v => !v)) {
    status.textContent = 'Please fill in all fields.';
    status.className   = 'form-status error';
    return;
  }

  btn.textContent = 'Sending...';
  btn.disabled    = true;

  try {
    const r = await fetch(API + '/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error();
    status.textContent = "✓ Message sent! I'll get back to you within 24 hours.";
    status.className   = 'form-status success';
    ['c-name','c-email','c-subject','c-message'].forEach(id => {
      document.getElementById(id).value = '';
    });
  } catch {
    status.textContent = 'Something went wrong. Please try again or email me directly.';
    status.className   = 'form-status error';
  } finally {
    btn.textContent = 'Send Message →';
    btn.disabled    = false;
  }
}

/* ══════════════════════════════════════════
   ADMIN MODAL
══════════════════════════════════════════ */
function openModal() {
  document.getElementById('login-overlay').classList.add('open');
  document.getElementById('modal-err').style.display = 'none';
  document.getElementById('m-email').value = '';
  document.getElementById('m-pass').value  = '';
  setTimeout(() => document.getElementById('m-email').focus(), 120);
}

function closeModal() {
  document.getElementById('login-overlay').classList.remove('open');
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

async function doLogin() {
  const btn   = document.getElementById('login-btn');
  const errEl = document.getElementById('modal-err');
  const email = document.getElementById('m-email').value.trim();
  const pass  = document.getElementById('m-pass').value;

  errEl.style.display = 'none';

  if (!email || !pass) {
    errEl.textContent   = 'Please enter your email and password.';
    errEl.style.display = 'block';
    return;
  }

  btn.classList.add('loading');
  btn.disabled = true;

  try {
    const r = await fetch(API + '/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Login failed');

    btn.querySelector('.btn-lbl').textContent = 'Opening Admin…';
    setTimeout(() => {
      window.open(API_BASE + '/admin', '_blank');
      closeModal();
      btn.classList.remove('loading');
      btn.disabled = false;
      btn.querySelector('.btn-lbl').textContent = 'Sign In → Admin Panel';
    }, 500);

  } catch (e) {
    errEl.textContent   = e.message || 'Invalid credentials.';
    errEl.style.display = 'block';
    btn.classList.remove('loading');
    btn.disabled = false;
  }
}

/* ══════════════════════════════════════════
   INIT — runs on page load
══════════════════════════════════════════ */
document.getElementById('footer-year').textContent = new Date().getFullYear();

initMarquee();
initNavbar();
initHeroAnimations();
initScrollAnimations();

// load all API data in parallel
Promise.all([
  loadProfile(),
  loadSkills(),
  loadExperience(),
  loadProjects(),
]);