/* =========================
   script.js (corrigido)
   ========================= */

/* Variáveis globais (serão atribuídas após DOMContentLoaded) */
let currentSection = 0;
let sections;
let dots;
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

/* Inicializar partículas de fundo (não bloqueante) */
function initBackgroundParticles() {
  if (isReducedMotion) return;
  const particleContainer = document.createElement('div');
  particleContainer.className = 'background-particles';
  document.body.appendChild(particleContainer);

  function createBackgroundParticle() {
    const particle = document.createElement('div');
    particle.className = 'background-particle';
    const size = Math.random() * 4 + 2;
    const x = Math.random() * window.innerWidth;
    const duration = Math.random() * 15 + 20;
    const delay = Math.random() * 5;

    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      background: rgba(255,255,255,${0.05 + Math.random()*0.25});
    `;

    particleContainer.appendChild(particle);

    setTimeout(() => {
      if (particle.parentNode) particle.parentNode.removeChild(particle);
    }, (duration + delay + 1) * 1000);
  }

  for (let i = 0; i < 8; i++) setTimeout(createBackgroundParticle, i * 800);
  setInterval(createBackgroundParticle, 3000);
}

/* Contadores (meses, semanas, dias) */
function updateCounters() {
  const startDate = new Date("2025-06-10T00:00:00");
  const now = new Date();
  const diff = now - startDate;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());

  animateCounter('daysCounter', days);
  animateCounter('weeksCounter', weeks);
  animateCounter('monthsCounter', months);
}

function animateCounter(elementId, targetValue) {
  const element = document.getElementById(elementId);
  if (!element) return;
  let start = 0;
  const duration = 2000;
  const startTime = Date.now();

  function updateCounter() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(targetValue * eased);
    element.textContent = currentValue;
    if (progress < 1) requestAnimationFrame(updateCounter);
  }
  updateCounter();
}

/* Sistema de som (opcional) */
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
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.08);
  } catch (e) { /* ignore */ }
}

/* Create observer (usa-se após definir 'sections') */
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.6 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const sectionIndex = Array.from(sections).indexOf(entry.target);
      currentSection = sectionIndex;

      // Atualiza dots
      dots.forEach((dot, index) => dot.classList.toggle('active', index === sectionIndex));

      // Atualiza progress bar
      if (progressBar) {
        const progress = ((sectionIndex + 1) / sections.length) * 100;
        progressBar.style.width = `${progress}%`;
      }

      // Aciona animações por seção (mantendo comportamento original)
      triggerSectionAnimations(entry.target, sectionIndex);

      // vibração mobile curta
      if ('vibrate' in navigator && !isReducedMotion) navigator.vibrate(50);
    }
  });
}, observerOptions);

/* Função que dispara as animações específicas de cada seção (idem original) */
function triggerSectionAnimations(section, sectionIndex) {
  switch(sectionIndex) {
    case 1: // Perfil
      const profileCard = section.querySelector('.profile-card');
      if (profileCard) profileCard.classList.add('visible');
      break;

    case 2: // Timeline
      const timeline = section.querySelector('.timeline');
      const timelineItems = section.querySelectorAll('.timeline-item');
      if (timeline) timeline.classList.add('visible');
      timelineItems.forEach((item, index) => {
        setTimeout(() => item.classList.add('visible'), parseInt(item.dataset.delay) || (index * 300));
      });
      break;

    case 3: // Contadores
      const container = section.querySelector('.counters-container');
      const counterItems = section.querySelectorAll('.counter-item');
      if (container) container.classList.add('visible');
      counterItems.forEach((item, index) => {
        setTimeout(() => item.classList.add('visible'), parseInt(item.dataset.delay) || (index * 200));
      });
      // Atualiza contadores depois das animações
      setTimeout(updateCounters, 800);
      break;

    case 4: // Mensagem final
      const finalContent = section.querySelector('.final-content');
      if (finalContent) finalContent.classList.add('visible');
      break;
  }
}

/* Mostrar popup de amor + partículas/confetti (idem original) */
function playLoveSound() {
  if (!audioEnabled || !audioContext || isReducedMotion) return;
  try {
    const melody = [523.25, 587.33, 659.25];
    melody.forEach((frequency, index) => {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.16);
      }, index * 140);
    });
  } catch (e) { /* ignore */ }
}

function createHeartParticles() {
  if (isReducedMotion) return;
  const hearts = ['💖', '💕', '💞', '💓', '💗', '❤️', '💜', '💙'];
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      const particle = document.createElement('div');
      const heart = hearts[Math.floor(Math.random() * hearts.length)];
      const startX = Math.random() * window.innerWidth;
      const size = Math.random() * 25 + 20;
      const duration = Math.random() * 2 + 3;
      particle.style.cssText = `
        position: fixed;
        left: ${startX}px;
        top: ${window.innerHeight + 20}px;
        font-size: ${size}px;
        z-index: 2000;
        pointer-events: none;
        user-select: none;
        animation: heartFloat${i} ${duration}s ease-out forwards;
      `;
      particle.textContent = heart;

      const keyframeName = `heartFloat${i}`;
      const style = document.createElement('style');
      style.textContent = `
        @keyframes ${keyframeName} {
          0% { transform: translateY(0) rotate(0deg) scale(0); opacity: 0; }
          10% { opacity: 1; transform: translateY(-50px) rotate(0deg) scale(1); }
          90% { opacity: 1; transform: translateY(-${window.innerHeight + 100}px) rotate(${Math.random()*360}deg) scale(1); }
          100% { transform: translateY(-${window.innerHeight + 150}px) rotate(${Math.random()*360}deg) scale(0); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
      document.body.appendChild(particle);

      setTimeout(() => {
        if (document.body.contains(particle)) document.body.removeChild(particle);
        if (document.head.contains(style)) document.head.removeChild(style);
      }, (duration + 1) * 1000);
    }, i * 100);
  }
}

function createConfetti() {
  if (isReducedMotion) return;
  const colors = ['#ff6b9d', '#c471ed', '#667eea', '#f093fb', '#fecfef'];
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 8 + 4;
      const startX = Math.random() * window.innerWidth;
      const duration = Math.random() * 3 + 2;
      confetti.style.cssText = `
        position: fixed;
        left: ${startX}px;
        top: -20px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        z-index: 1500;
        pointer-events: none;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        animation: confettiFall${i} ${duration}s ease-in forwards;
      `;
      const keyframeName = `confettiFall${i}`;
      const style = document.createElement('style');
      style.textContent = `
        @keyframes ${keyframeName} {
          0% { transform: translateY(0) rotate(0deg); opacity:1 }
          100% { transform: translateY(${window.innerHeight + 100}px) rotate(${Math.random()*720}deg); opacity:0 }
        }
      `;
      document.head.appendChild(style);
      document.body.appendChild(confetti);
      setTimeout(() => {
        if (document.body.contains(confetti)) document.body.removeChild(confetti);
        if (document.head.contains(style)) document.head.removeChild(style);
      }, (duration + 1) * 1000);
    }, i * 50);
  }
}

function showLoveMessage() {
  const message = loveMessages[Math.floor(Math.random() * loveMessages.length)];
  const popup = document.createElement('div');
  popup.className = 'love-popup';
  popup.innerHTML = `<div style="font-size:2rem;margin-bottom:10px">💖</div><div>${message}</div>`;
  document.body.appendChild(popup);
  setTimeout(() => popup.classList.add('show'), 100);

  if ('vibrate' in navigator && !isReducedMotion) navigator.vibrate([100,50,100,50,200]);
  playLoveSound();
  createHeartParticles();
  createConfetti();

  setTimeout(() => {
    popup.classList.remove('show');
    setTimeout(() => { if (document.body.contains(popup)) document.body.removeChild(popup); }, 300);
  }, 3000);
}

/* Swipe touch e navegação por teclado (mantive igual ao original) */
function enableTouchAndKeys() {
  // touch swipe
  let touchStartY = 0, touchEndY = 0, touchStartTime = 0, isScrolling = false;
  if (scrollContainer) {
    scrollContainer.addEventListener('touchstart', (e) => {
      touchStartY = e.changedTouches[0].screenY;
      touchStartTime = Date.now();
      isScrolling = false;
    }, { passive: true });

    scrollContainer.addEventListener('touchmove', (e) => { isScrolling = true; }, { passive: true });

    scrollContainer.addEventListener('touchend', (e) => {
      if (isScrolling) return;
      touchEndY = e.changedTouches[0].screenY;
      const touchDuration = Date.now() - touchStartTime;
      const swipeDistance = Math.abs(touchStartY - touchEndY);
      const swipeThreshold = 50;
      if (touchDuration < 300 && swipeDistance > swipeThreshold) {
        if (touchStartY > touchEndY + swipeThreshold) {
          if (currentSection < sections.length - 1) scrollToSection(currentSection + 1);
        } else if (touchStartY < touchEndY - swipeThreshold) {
          if (currentSection > 0) scrollToSection(currentSection - 1);
        }
      }
    }, { passive: false });
  }

  // keyboard navigation
  document.addEventListener('keydown', (e) => {
    switch(e.key) {
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        if (currentSection > 0) scrollToSection(currentSection - 1);
        break;
      case 'ArrowDown':
      case 'PageDown':
      case ' ':
        e.preventDefault();
        if (currentSection < sections.length - 1) scrollToSection(currentSection + 1);
        break;
      case 'Home':
        e.preventDefault();
        scrollToSection(0);
        break;
      case 'End':
        e.preventDefault();
        scrollToSection(sections.length - 1);
        break;
      case 'Enter':
        if (currentSection === sections.length - 1) {
          e.preventDefault();
          showLoveMessage();
        }
        break;
    }
  });

  // evitar zoom duplo
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) event.preventDefault();
    lastTouchEnd = now;
  }, { passive: false });

  // prevenir zoom com gesto
  document.addEventListener('touchstart', function (event) {
    if (event.touches.length > 1) event.preventDefault();
  }, { passive: false });
}

/* Scroll suave para seção */
function scrollToSection(index) {
  const targetSection = sections[index];
  if (!targetSection) return;
  // efeito de vibração do dot clicado
  const dot = dots[index];
  if (dot && !isReducedMotion) {
    dot.style.transform = 'scale(1.3)';
    setTimeout(() => dot.style.transform = '', 300);
  }
  targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* Parallax simples (mantido se existir .layer-* na página) */
function initParallax() {
  const layerBack = document.querySelector('.layer-back');
  const layerMid = document.querySelector('.layer-mid');
  const layerFront = document.querySelector('.layer-front');
  if (!scrollContainer || (!layerBack && !layerMid && !layerFront)) return;
  scrollContainer.addEventListener('scroll', () => {
    const sc = scrollContainer.scrollTop || document.documentElement.scrollTop || window.scrollY;
    if (layerBack) layerBack.style.transform = `translateY(${sc * 0.02}px)`;
    if (layerMid) layerMid.style.transform = `translateY(${sc * 0.04}px)`;
    if (layerFront) layerFront.style.transform = `translateY(${sc * 0.06}px)`;
  }, { passive: true });
}

/* Tilt suave na imagem de perfil */
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

/* Inicialização principal (garante que todas as querySelectors existam) */
document.addEventListener('DOMContentLoaded', () => {
  sections = document.querySelectorAll('.section');
  dots = document.querySelectorAll('.scroll-dot');
  scrollContainer = document.getElementById('scrollContainer') || document.querySelector('.scroll-container');
  progressBar = document.getElementById('progressBar');

  // prevenção: se algo faltar, não trava
  if (!sections || sections.length === 0) sections = document.querySelectorAll('section');

  // inicializações
  initBackgroundParticles();
  initAudio();

  // observar seções (garante animações ao descer)
  sections.forEach(section => observer.observe(section));

  // ligar dots
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => scrollToSection(i));
  });

  // botao de amor
  const loveBtn = document.querySelector('.love-button');
  if (loveBtn) {
    loveBtn.addEventListener('click', () => {
      // ripple simples (se houver)
      loveBtn.classList.remove('ripple-active');
      void loveBtn.offsetWidth;
      loveBtn.classList.add('ripple-active');
      setTimeout(() => loveBtn.classList.remove('ripple-active'), 600);

      showLoveMessage();
    });
  }

  // ativar touch/teclado/parallax/tilt
  enableTouchAndKeys();
  initParallax();
  attachImageTilt();

  // set initial progress
  if (progressBar) progressBar.style.width = '20%';

  console.log('✅ Scripts inicializados (animações de scroll restauradas).');
});
