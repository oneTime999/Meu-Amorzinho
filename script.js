// Variáveis globais
let currentSection = 0;
const sections = document.querySelectorAll('.section');
const dots = document.querySelectorAll('.scroll-dot');
const scrollContainer = document.getElementById('scrollContainer');
const progressBar = document.getElementById('progressBar');

// Sistema de partículas de fundo
let backgroundParticles = [];
let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mensagens de amor expandidas
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

// Sistema de som (opcional)
let audioContext;
let audioEnabled = false;

// Inicializar sistema de partículas de fundo
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
    `;
    
    particleContainer.appendChild(particle);
    
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, (duration + delay) * 1000);
  }
  
  // Criar partículas iniciais
  for (let i = 0; i < 8; i++) {
    setTimeout(() => createBackgroundParticle(), i * 1000);
  }
  
  // Continuar criando partículas
  setInterval(createBackgroundParticle, 3000);
}

// Atualizar contadores com animação suave
function updateCounters() {
  const startDate = new Date("2025-06-10T00:00:00");
  const now = new Date();
  const diff = now - startDate;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());

  // Animação dos números
  animateCounter('daysCounter', days);
  animateCounter('weeksCounter', weeks);
  animateCounter('monthsCounter', months);
}

// Animar contador
function animateCounter(elementId, targetValue) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  let currentValue = 0;
  const increment = targetValue / 60;
  const duration = 2000;
  const startTime = Date.now();
  
  function updateCounter() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out cubic)
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    currentValue = Math.floor(targetValue * easedProgress);
    
    element.textContent = currentValue;
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }
  
  updateCounter();
}

// Scroll para seção específica
function scrollToSection(index) {
  const targetSection = sections[index];
  if (!targetSection) return;
  
  // Efeito de vibração no botão clicado
  const dot = dots[index];
  if (dot && !isReducedMotion) {
    dot.style.transform = 'scale(1.3)';
    setTimeout(() => {
      dot.style.transform = '';
    }, 300);
  }
  
  targetSection.scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
}

// Sistema de som simples
function initAudio() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioEnabled = true;
  } catch (e) {
    console.log('Audio not supported');
  }
}

function playClickSound() {
  if (!audioEnabled || !audioContext || isReducedMotion) return;
  
  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (e) {
    console.log('Sound playback failed');
  }
}

// Observador de scroll
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.6
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const sectionIndex = Array.from(sections).indexOf(entry.target);
      currentSection = sectionIndex;
      
      // Atualizar dots
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === sectionIndex);
      });
      
      // Atualizar progress bar
      const progress = ((sectionIndex + 1) / sections.length) * 100;
      progressBar.style.width = `${progress}%`;
      
      // Animações específicas por seção
      triggerSectionAnimations(entry.target, sectionIndex);
      
      // Efeitos de vibração no mobile
      if ('vibrate' in navigator && !isReducedMotion) {
        navigator.vibrate(50);
      }
    }
  });
}, observerOptions);

// Disparar animações específicas da seção
function triggerSectionAnimations(section, sectionIndex) {
  switch(sectionIndex) {
    case 1: // Perfil
      const profileCard = section.querySelector('.profile-card');
      if (profileCard) {
        profileCard.classList.add('visible');
      }
      break;
      
    case 2: // Timeline
      const timeline = section.querySelector('.timeline');
      const timelineItems = section.querySelectorAll('.timeline-item');
      
      if (timeline) {
        timeline.classList.add('visible');
      }
      
      timelineItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('visible');
        }, parseInt(item.dataset.delay) || (index * 300));
      });
      break;
      
    case 3: // Contadores
      const container = section.querySelector('.counters-container');
      const counterItems = section.querySelectorAll('.counter-item');
      
      if (container) {
        container.classList.add('visible');
      }
      
      counterItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('visible');
        }, parseInt(item.dataset.delay) || (index * 200));
      });
      
      // Atualizar contadores após as animações
      setTimeout(() => {
        updateCounters();
      }, 800);
      break;
      
    case 4: // Mensagem final
      const finalContent = section.querySelector('.final-content');
      if (finalContent) {
        finalContent.classList.add('visible');
      }
      break;
  }
}

// Mostrar mensagem de amor aprimorada
function showLoveMessage() {
  const message = loveMessages[Math.floor(Math.random() * loveMessages.length)];
  
  // Criar popup com efeitos melhorados
  const popup = document.createElement('div');
  popup.className = 'love-popup';
  popup.innerHTML = `
    <div style="font-size: 2rem; margin-bottom: 10px;">💖</div>
    <div>${message}</div>
  `;
  
  document.body.appendChild(popup);
  
  // Animação de entrada
  setTimeout(() => {
    popup.classList.add('show');
  }, 100);
  
  // Efeito de vibração
  if ('vibrate' in navigator) {
    navigator.vibrate([100, 50, 100, 50, 200]);
  }
  
  // Som de amor
  playLoveSound();
  
  // Animação de saída
  setTimeout(() => {
    popup.classList.remove('show');
    setTimeout(() => {
      if (document.body.contains(popup)) {
        document.body.removeChild(popup);
      }
    }, 300);
  }, 3000);
  
  // Criar efeitos de partículas
  createHeartParticles();
  createConfetti();
}

// Som de amor
function playLoveSound() {
  if (!audioEnabled || !audioContext || isReducedMotion) return;
  
  try {
    // Melodia simples e romântica
    const melody = [523.25, 587.33, 659.25, 698.46, 783.99]; // C5, D5, E5, F5, G5
    
    melody.forEach((frequency, index) => {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      }, index * 150);
    });
  } catch (e) {
    console.log('Love sound playback failed');
  }
}

// Criar partículas de coração melhoradas
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
      
      // Criar animação única para cada partícula
      const keyframeName = `heartFloat${i}`;
      const style = document.createElement('style');
      style.textContent = `
        @keyframes ${keyframeName} {
          0% {
            transform: translateY(0) rotate(0deg) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateY(-50px) rotate(0deg) scale(1);
          }
          90% {
            opacity: 1;
            transform: translateY(-${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg) scale(1);
          }
          100% {
            transform: translateY(-${window.innerHeight + 150}px) rotate(${Math.random() * 360}deg) scale(0);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
      
      document.body.appendChild(particle);
      
      setTimeout(() => {
        if (document.body.contains(particle)) {
          document.body.removeChild(particle);
        }
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      }, (duration + 1) * 1000);
    }, i * 100);
  }
}

// Criar confetti
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
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
      
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        if (document.body.contains(confetti)) {
          document.body.removeChild(confetti);
        }
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      }, (duration + 1) * 1000);
    }, i * 50);
  }
}

// Gestos touch aprimorados
let touchStartY = 0;
let touchEndY = 0;
let touchStartTime = 0;
let isScrolling = false;

if (scrollContainer) {
  scrollContainer.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
    touchStartTime = Date.now();
    isScrolling = false;
  }, { passive: true });

  scrollContainer.addEventListener('touchmove', (e) => {
    isScrolling = true;
  }, { passive: true });

  scrollContainer.addEventListener('touchend', (e) => {
    if (isScrolling) return;
    
    touchEndY = e.changedTouches[0].screenY;
    const touchDuration = Date.now() - touchStartTime;
    const swipeDistance = Math.abs(touchStartY - touchEndY);
    const swipeThreshold = 50;
    
    // Só processar swipes rápidos e com distância suficiente
    if (touchDuration < 300 && swipeDistance > swipeThreshold) {
      if (touchStartY > touchEndY + swipeThreshold) {
        // Swipe up
        if (currentSection < sections.length - 1) {
          scrollToSection(currentSection + 1);
        }
      } else if (touchStartY < touchEndY - swipeThreshold) {
        // Swipe down
        if (currentSection > 0) {
          scrollToSection(currentSection - 1);
        }
      }
    }
  }, { passive: false });
}

// Navegação por teclado
document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'ArrowUp':
    case 'PageUp':
      e.preventDefault();
      if (currentSection > 0) {
        scrollToSection(currentSection - 1);
      }
      break;
    case 'ArrowDown':
    case 'PageDown':
    case ' ':
      e.preventDefault();
      if (currentSection < sections.length - 1) {
        scrollToSection(currentSection + 1);
      }
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

// Prevenção de zoom duplo
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, { passive: false });

// Prevenção de zoom com gestos
document.addEventListener('touchstart', function (event) {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}, { passive: false });

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  console.log('💖 Inicializando site da Ana...');
  
  // Inicializar sistemas
  initBackgroundParticles();
  initAudio();
  
  // Observar todas as seções
  sections.forEach(section => {
    observer.observe(section);
  });
  
  // Configuração inicial
  if (progressBar) {
    progressBar.style.width = '20%';
  }
  
  console.log('✅ Site inicializado com sucesso!');
});
