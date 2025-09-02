/* =========================
   script.js - completo
   ========================= */

/* Globals (will init on DOMContentLoaded) */
let currentSection = 0;
let sections = [];
let dots = [];
let scrollContainer;
let progressBar;

let audioContext;
let audioEnabled = false;
const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const loveMessages = [
  "Você é meu mundo inteiro! 🌍💖",
  "Cada momento com você é mágico! ✨💕",
  "Você é meu sonho realizado! 🌟💖",
  "Te amo infinitamente! ♾️💕",
  "Você é minha felicidade! 😊💖",
  "Nosso amor é eterno! 💞✨",
  "Você ilumina meus dias! ☀️💕",
  "Meu coração bate só por você! 💓💖",
  "Você é minha alma gêmea! 👫💕",
  "Te amo mais a cada dia! 📈💖"
];

/* ------- Background particles ------- */
function initBackgroundParticles() {
  if (isReducedMotion) return;
  const container = document.createElement('div');
  container.className = 'background-particles';
  document.body.appendChild(container);

  function create() {
    const p = document.createElement('div');
    p.className = 'background-particle';
    const size = Math.random() * 6 + 3;
    const x = Math.random() * window.innerWidth;
    const duration = Math.random() * 12 + 18;
    const delay = Math.random() * 3;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${x}px`;
    p.style.background = `rgba(255,255,255,${0.06 + Math.random()*0.3})`;
    p.style.animationDuration = `${duration}s`;
    p.style.animationDelay = `${delay}s`;
    container.appendChild(p);

    setTimeout(() => {
      if (p.parentNode) p.parentNode.removeChild(p);
    }, (duration + delay + 1) * 1000);
  }

  for (let i=0;i<8;i++) setTimeout(create, i*350);
  setInterval(create, 3000);
}

/* ------- Audio ------- */
function initAudio() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioEnabled = true;
  } catch (e) {
    audioEnabled = false;
  }
}
function playClickSound() {
  if (!audioEnabled || isReducedMotion) return;
  try {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioContext.currentTime);
    gain.gain.setValueAtTime(0.06, audioContext.currentTime);
    osc.connect(gain); gain.connect(audioContext.destination);
    osc.start(); osc.stop(audioContext.currentTime + 0.08);
  } catch(e){ /* ignore */ }
}

/* ------- Counters ------- */
function updateCounters() {
  const startDate = new Date("2025-06-10T00:00:00");
  const now = new Date();
  const diff = now - startDate;
  const days = Math.max(0, Math.floor(diff / (1000*60*60*24)));
  const weeks = Math.floor(days/7);
  const months = (now.getFullYear() - startDate.getFullYear())*12 + (now.getMonth() - startDate.getMonth());

  animateCounter('daysCounter', days);
  animateCounter('weeksCounter', weeks);
  animateCounter('monthsCounter', months);
}
function animateCounter(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  const duration = 1200;
  const start = Date.now();
  function step(){
    const t = Math.min(1, (Date.now()-start)/duration);
    const eased = 1 - Math.pow(1-t,3);
    el.textContent = Math.floor(target * eased);
    if (t < 1) requestAnimationFrame(step);
  }
  step();
}

/* ------- Scrolling / navigation ------- */
function scrollToSection(index) {
  const s = sections[index];
  if (!s) return;
  // small pop animation on dot
  const d = dots[index];
  if (d && !isReducedMotion) {
    d.style.transform = 'scale(1.35)';
    setTimeout(()=> d.style.transform = '', 260);
  }
  s.scrollIntoView({ behavior: 'smooth', block: 'start' });
  playClickSound();
}

/* ------- Intersection Observer ------- */
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.6 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = Array.from(sections).indexOf(entry.target);
      currentSection = idx;
      dots.forEach((dot,i) => dot.classList.toggle('active', i===idx));
      if (progressBar) {
        const progress = ((idx + 1) / sections.length) * 100;
        progressBar.style.width = `${progress}%`;
      }
      triggerSectionAnimations(entry.target, idx);
      if ('vibrate' in navigator && !isReducedMotion) navigator.vibrate(30);
    }
  });
}, observerOptions);

/* ------- Section animations ------- */
function triggerSectionAnimations(section, idx) {
  switch(idx) {
    case 1: {
      const card = section.querySelector('.profile-card');
      if (card) card.classList.add('visible');
      break;
    }
    case 2: {
      const timeline = section.querySelector('.timeline');
      if (timeline) timeline.classList.add('visible');
      const items = section.querySelectorAll('.timeline-item');
      items.forEach((it, i) => setTimeout(()=> it.classList.add('visible'), parseInt(it.dataset.delay||i*220)));
      break;
    }
    case 3: {
      const container = section.querySelector('.counters-container');
      if (container) container.classList.add('visible');
      const items = section.querySelectorAll('.counter-item');
      items.forEach((it, i) => setTimeout(()=> it.classList.add('visible'), parseInt(it.dataset.delay||i*200)));
      setTimeout(updateCounters, 700);
      break;
    }
    case 4: {
      const final = section.querySelector('.final-content');
      if (final) final.classList.add('visible');
      break;
    }
  }
}

/* ------- Love popup & effects ------- */
function showLoveMessage() {
  const msg = loveMessages[Math.floor(Math.random()*loveMessages.length)];
  const popup = document.createElement('div');
  popup.className = 'love-popup';
  popup.innerHTML = `<div style="font-size:2rem;margin-bottom:8px">💖</div><div>${msg}</div>`;
  document.body.appendChild(popup);
  setTimeout(()=> popup.classList.add('show'), 80);

  if ('vibrate' in navigator && !isReducedMotion) navigator.vibrate([100,50,100]);
  playLoveSound();
  createHeartParticles();
  createConfetti();

  setTimeout(()=> {
    popup.classList.remove('show');
    setTimeout(()=> { if (popup.parentNode) popup.parentNode.removeChild(popup); }, 300);
  }, 3200);
}
function playLoveSound() {
  if (!audioEnabled || !audioContext || isReducedMotion) return;
  try {
    const melody = [523.25, 659.25, 783.99]; // short triad
    melody.forEach((f, i) => {
      setTimeout(()=> {
        const o = audioContext.createOscillator();
        const g = audioContext.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(f, audioContext.currentTime);
        g.gain.setValueAtTime(0.06, audioContext.currentTime);
        o.connect(g); g.connect(audioContext.destination);
        o.start(); o.stop(audioContext.currentTime + 0.18);
      }, i * 140);
    });
  } catch(e){ /* ignore */ }
}
function createHeartParticles() {
  if (isReducedMotion) return;
  const hearts = ['💖','💕','💞','💓','💗','❤️'];
  for (let i=0;i<12;i++){
    setTimeout(()=>{
      const p = document.createElement('div');
      const h = hearts[Math.floor(Math.random()*hearts.length)];
      const startX = Math.random()*window.innerWidth;
      const size = Math.random()*28 + 18;
      const dur = Math.random()*2 + 2.6;
      p.style.cssText = `position:fixed;left:${startX}px;top:${window.innerHeight + 20}px;font-size:${size}px;z-index:2000;pointer-events:none;user-select:none;animation:heartFloat${i} ${dur}s ease-out forwards;`;
      p.textContent = h;
      const k = document.createElement('style');
      k.textContent = `@keyframes heartFloat${i}{
        0%{transform:translateY(0) scale(0); opacity:0}
        10%{opacity:1; transform:translateY(-40px) scale(1)}
        100%{transform:translateY(-${window.innerHeight + 150}px) scale(0.9); opacity:0}
      }`;
      document.head.appendChild(k);
      document.body.appendChild(p);
      setTimeout(()=>{ if(p.parentNode) p.parentNode.removeChild(p); if(k.parentNode) k.parentNode.removeChild(k); }, (dur+0.4)*1000);
    }, i*80);
  }
}
function createConfetti() {
  if (isReducedMotion) return;
  const colors = ['#ff6b9d','#c471ed','#667eea','#f093fb','#fecfef'];
  for (let i=0;i<26;i++){
    setTimeout(()=>{
      const c = document.createElement('div');
      const size = Math.random()*8 + 4;
      const startX = Math.random()*window.innerWidth;
      const dur = Math.random()*2 + 1.6;
      c.style.cssText = `position:fixed;left:${startX}px;top:-20px;width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random()*colors.length)]};z-index:1500;pointer-events:none;border-radius:${Math.random()>0.5?'50%':'0'};animation:confettiFall ${dur}s linear forwards;`;
      document.body.appendChild(c);
      setTimeout(()=>{ if(c.parentNode) c.parentNode.removeChild(c); }, (dur+0.4)*1000);
    }, i*40);
  }
}

/* ------- Parallax & tilt ------- */
function handleParallax() {
  const layerBack = document.querySelector('.layer-back');
  const layerMid = document.querySelector('.layer-mid');
  const layerFront = document.querySelector('.layer-front');
  if (!layerBack) return;
  scrollContainer.addEventListener('scroll', ()=> {
    const sc = scrollContainer.scrollTop;
    layerBack.style.transform = `translateY(${sc * 0.02}px)`;
    layerMid.style.transform = `translateY(${sc * 0.04}px)`;
    layerFront.style.transform = `translateY(${sc * 0.06}px)`;
  }, { passive: true });
}
function attachImageTilt() {
  const img = document.querySelector('.profile-image');
  if (!img || isReducedMotion) return;
  img.addEventListener('mousemove', e => {
    const r = img.getBoundingClientRect();
    const cx = r.left + r.width/2;
    const cy = r.top + r.height/2;
    const dx = (e.clientX - cx) / (r.width/2);
    const dy = (e.clientY - cy) / (r.height/2);
    img.style.transform = `perspective(800px) rotateX(${dy*6}deg) rotateY(${dx*8}deg) scale(1.03)`;
  });
  img.addEventListener('mouseleave', ()=> img.style.transform = '');
}

/* ------- Init & event bindings ------- */
document.addEventListener('DOMContentLoaded', () => {
  // grab elements
  sections = document.querySelectorAll('.section');
  dots = document.querySelectorAll('.scroll-dot');
  scrollContainer = document.getElementById('scrollContainer') || document.querySelector('.scroll-container');
  progressBar = document.getElementById('progressBar');

  // safe defaults
  if (!scrollContainer) scrollContainer = document.documentElement;

  // init systems
  initBackgroundParticles();
  initAudio();

  // observe sections
  sections.forEach(s => observer.observe(s));

  // bind dots
  dots.forEach(dot => {
    const idx = parseInt(dot.dataset.index || Array.from(dots).indexOf(dot));
    dot.addEventListener('click', ()=> scrollToSection(idx));
  });

  // love button
  const loveBtn = document.getElementById('loveBtn') || document.querySelector('.love-button');
  if (loveBtn) {
    loveBtn.addEventListener('click', (ev) => {
      // ripple
      loveBtn.classList.remove('ripple-active');
      void loveBtn.offsetWidth;
      loveBtn.classList.add('ripple-active');
      setTimeout(()=> loveBtn.classList.remove('ripple-active'), 600);

      showLoveMessage();
    });
  }

  // keyboard navigation
  document.addEventListener('keydown', (e)=>{
    if (['ArrowUp','PageUp'].includes(e.key)) { e.preventDefault(); if (currentSection>0) scrollToSection(currentSection-1); }
    if (['ArrowDown','PageDown',' '].includes(e.key)) { e.preventDefault(); if (currentSection < sections.length-1) scrollToSection(currentSection+1); }
    if (e.key === 'Home') { e.preventDefault(); scrollToSection(0); }
    if (e.key === 'End') { e.preventDefault(); scrollToSection(sections.length-1); }
    if (e.key === 'Enter' && currentSection === sections.length-1) { e.preventDefault(); showLoveMessage(); }
  });

  // touch swipe (improved)
  let touchStartY = 0, touchEndY = 0, touchStartTime = 0, isScrolling = false;
  if (scrollContainer) {
    scrollContainer.addEventListener('touchstart', (e) => { touchStartY = e.changedTouches[0].screenY; touchStartTime = Date.now(); isScrolling = false; }, { passive: true });
    scrollContainer.addEventListener('touchmove', (e) => { isScrolling = true; }, { passive: true });
    scrollContainer.addEventListener('touchend', (e) => {
      if (isScrolling) return;
      touchEndY = e.changedTouches[0].screenY;
      const duration = Date.now() - touchStartTime;
      const dist = Math.abs(touchStartY - touchEndY);
      const threshold = 60;
      if (duration < 350 && dist > threshold) {
        if (touchStartY > touchEndY + threshold && currentSection < sections.length - 1) scrollToSection(currentSection + 1);
        else if (touchStartY < touchEndY - threshold && currentSection > 0) scrollToSection(currentSection - 1);
      }
    }, { passive: true });
  }

  // prevent double-tap zoom
  let lastTap = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTap <= 300) e.preventDefault();
    lastTap = now;
  }, { passive: false });

  // parallax + tilt
  handleParallax();
  attachImageTilt();

  // initial progress width
  if (progressBar) progressBar.style.width = `${(currentSection+1)/sections.length*20}%`;

  console.log('💖 Site inicializado');
});
                          
