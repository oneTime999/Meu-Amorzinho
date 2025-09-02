// Variáveis globais
let currentSection = 0;
const sections = document.querySelectorAll('.section');
const dots = document.querySelectorAll('.scroll-dot');
const scrollContainer = document.getElementById('scrollContainer');
const progressBar = document.getElementById('progressBar');

// Sistema de partículas de fundo
let backgroundParticles = [];
let animationFrame;

// Mensagens de amor expandidas
const loveMessages = [
  "Você é meu mundo inteiro! 🌍💖",
  "// Variáveis globais
let currentSection = 0;
const sections = document.querySelectorAll('.section');
const dots = document.querySelectorAll('.scroll-dot');
const scrollContainer = document.getElementById('scrollContainer');
const progressBar = document.getElementById('progressBar');

// Sistema de partículas de fundo
let backgroundParticles = [];
let animationFrame;
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
  for (let i = 0; i < 10; i++) {
    setTimeout(() => createBackgroundParticle(), i * 1000);
  }
  
  // Continuar criando partículas
  setInterval(createBackgroundParticle, 2000);
}

// Efeito parallax melhorado
function updateParallax() {
  const scrolled = scrollContainer.scrollTop;
  const rate = scrolled * -0.5;
  
  sections.forEach((section, index) => {
    if (!isReducedMotion) {
      const offset = (scrolled - (index * window.innerHeight)) * 0.3;
      section.style.transform = `translateY(${offset}px)`;
    }
  });
}

// Atualizar contadores com animação suave
function updateCounters() {
  const startDate = new Date("2025-06-10T00:00:00");
  const now = new Date();
  const diff = now - startDate;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());

  // Animação dos números com efeito de contagem
  animateCounterAdvanced('daysCounter', days, 'dia');
  animateCounterAdvanced('weeksCounter', weeks, 'semana');
  animateCounterAdvanced('monthsCounter', months, 'mês');
}

// Animação de contador avançada
function animateCounterAdvanced(elementId, targetValue, unit) {
  const element = document.getElementById(elementId);
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
    
    // Efeito de brilho quando chegar ao valor final
    if (progress >= 1) {
      element.style.animation = 'counterShimmer 0.5s ease-in-out';
      setTimeout(() => {
        element.style.animation = 'counterShimmer 3s ease-in-out infinite';
      }, 500);
    } else {
      requestAnimationFrame(updateCounter);
    }
  }
  
  updateCounter();
}

// Scroll suave para seção específica
function scrollToSection(index) {
  const targetSection = sections[index];
  
  // Efeito de vibração no botão clicado
  const dot = dots[index];
  if (!isReducedMotion) {
    dot.style.animation = 'none';
    dot.offsetHeight; // Trigger reflow
    dot.style.animation = 'pulse 0.3s ease-in-out';
  }
  
  targetSection.scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
  
  // Som de clique (se habilitado)
  playClickSound();
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
}

// Observador de scroll melhorado
const observerOptions = {
  root: scrollContainer,
  rootMargin: '-20% 0px -20% 0px',
  threshold: [0.3, 0.7]
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const sectionIndex = Array.from(sections).indexOf(entry.target);
    
    if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
      currentSection = sectionIndex;
      
      // Atualizar indicadores
      updateScrollIndicators();
      updateProgressBar();
      
      // Animações específicas por seção
      triggerSectionAnimations(entry.target, sectionIndex);
      
      // Efeitos de vibração no mobile
      if ('vibrate' in navigator && !isReducedMotion) {
        navigator.vibrate(50);
      }
    }
  });
}, observerOptions);

// Atualizar indicadores de scroll
function updateScrollIndicators() {
  dots.forEach((dot, index) => {
    const isActive = index === currentSection;
    dot.classList.toggle('active', isActive);
    
    if (isActive && !isReducedMotion) {
      dot.style.transform = 'scale(1.3)';
      setTimeout(() => {
        dot.style.transform = '';
      }, 300);
    }
  });
}

// Atualizar barra de progresso
function updateProgressBar() {
  const progress = ((currentSection + 1) / sections.length) * 100;
  progressBar.style.width = `${progress}%`;
}

// Disparar animações específicas da seção
function triggerSectionAnimations(section, sectionIndex) {
  switch(sectionIndex) {
    case 1: // Perfil
      const profileCard = section.querySelector('.profile-card');
      profileCard.classList.add('visible');
      
      // Efeito adicional na imagem
      setTimeout(() => {
        const profileImage = section.querySelector('.profile-image');
        if (!isReducedMotion) {
          profileImage.style.animation = 'pulse 0.6s ease-in-out';
        }
      }, 800);
      break;
      
    case 2: // Timeline
      const timeline = section.querySelector('.timeline');
      const timelineItems = section.querySelectorAll('.timeline-item');
      
      timeline.classList.add('visible');
      
      timelineItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('visible');
          
          // Som de notificação para cada item (se habilitado)
          if (audioEnabled && !isReducedMotion) {
            setTimeout(() => playNotificationSound(index), 200);
          }
        }, parseInt(item.dataset.delay) || (index * 300));
      });
      break;
      
    case 3: // Contadores
      const container = section.querySelector('.counters-container');
      const counterItems = section.querySelectorAll('.counter-item');
      
      container.classList.add('visible');
      
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
      finalContent.classList.add('visible');
      
      // Efeito especial no botão após aparecer
      setTimeout(() => {
        const loveButton = section.querySelector('.love-button');
        if (!isReducedMotion) {
          loveButton.style.animation = 'pulse 1s ease-in-out 2';
        }
      }, 1000);
      break;
  }
}

// Som de notificação
function playNotificationSound(index) {
  if (!audioEnabled || !audioContext) return;
  
  const frequencies = [523.25, 587.33, 659.25]; // C5, D5, E5
  const frequency = frequencies[index % frequencies.length];
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.2);
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
}

// Criar partículas de coração melhoradas
function createHeartParticles() {
  if (isReducedMotion) return;
  
  const hearts = ['💖', '💕', '💞', '💓', '💗', '❤️', '💜', '💙'];
  
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const particle = document.createElement('div');
      const heart = hearts[Math.floor(Math.random() * hearts.length)];
      const startX = Math.random() * window.innerWidth;
      const endX = startX + (Math.random() - 0.5) * 200;
      const size = Math.random() * 25 + 20;
      const duration = Math.random() * 2 + 3;
      const delay = Math.random() * 0.5;
      
      particle.style.cssText = `
        position: fixed;
        left: ${startX}px;
        top: ${window.innerHeight + 20}px;
        font-size: ${size}px;
        z-index: 2000;
        pointer-events: none;
        user-select: none;
        animation: heartFloat ${duration}s ease-out forwards;
        animation-delay: ${delay}s;
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
      particle.style.animation = `${keyframeName} ${duration}s ease-out forwards`;
      particle.style.animationDelay = `${delay}s`;
      
      document.body.appendChild(particle);
      
      setTimeout(() => {
        if (document.body.contains(particle)) {
          document.body.removeChild(particle);
        }
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      }, (duration + delay + 0.5) * 1000);
    }, i * 100);
  }
}

// Criar confetti
function createConfetti() {
  if (isReducedMotion) return;
  
  const colors = ['#ff6b9d', '#c471ed', '#667eea', '#f093fb', '#fecfef'];
  
  for (let i = 0; i < 50; i++) {
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
        animation: confettiFall ${duration}s ease-in forwards;
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
      confetti.style.animation = `${keyframeName} ${duration}s ease-in forwards`;
      
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        if (document.body.contains(confetti)) {
          document.body.removeChild(confetti);
        }
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      }, (duration + 0.5) * 1000);
    }, i * 50);
  }
}

// Gestos touch aprimorados
let touchStartY = 0;
let touchEndY = 0;
let touchStartTime = 0;
let isScrolling = false;

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
    e.preventDefault();
    
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
document.addEventListener('gesturestart', function (e) {
  e.preventDefault();
}, { passive: false });

document.addEventListener('gesturechange', function (e) {
  e.preventDefault();
}, { passive: false });

document.addEventListener('gestureend', function (e) {
  e.preventDefault();
}, { passive: false });

// Listener para mudanças de orientação
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    updateProgressBar();
  }, 500);
});

// Listener para mudanças de tamanho da janela
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    updateProgressBar();
  }, 250);
});

// Inicialização aprimorada
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar sistemas
  initBackgroundParticles();
  initAudio();
  
  // Observar todas as seções
  sections.forEach(section => {
    observer.observe(section);
  });
  
  // Adicionar listeners para parallax (se motion permitido)
  if (!isReducedMotion) {
    scrollContainer.addEventListener('scroll', updateParallax, { passive: true });
  }
  
  // Configuração inicial
  updateProgressBar();
  
  // Easter egg: Konami Code
  let konamiCode = [];
  const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];
  
  document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
      konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
      // Easter egg ativado!
      showSpecialLoveMessage();
      konamiCode = [];
    }
  });
  
  // Carregar preferências do usuário
  loadUserPreferences();
});

// Easter egg especial
function showSpecialLoveMessage() {
  const specialPopup = document.createElement('div');
  specialPopup.className = 'love-popup';
  specialPopup.innerHTML = `
    <div style="font-size: 3rem; margin-bottom: 15px;">🎉💖🎉</div>
    <div style="font-size: 1.6rem; font-weight: bold;">CÓDIGO ESPECIAL ATIVADO!</div>
    <div style="font-size: 1.2rem; margin-top: 10px;">Você descobriu o Easter Egg!</div>
    <div style="font-size: 1rem; margin-top: 15px; opacity: 0.8;">Ana, você é incrível! 💕</div>
  `;
  
  document.body.appendChild(specialPopup);
  
  setTimeout(() => {
    specialPopup.classList.add('show');
  }, 100);
  
  // Efeito especial extra
  createSpecialEffect();
  
  if ('vibrate' in navigator) {
    navigator.vibrate([200, 100, 200, 100, 200, 100, 400]);
  }
  
  setTimeout(() => {
    specialPopup.classList.remove('show');
    setTimeout(() => {
      if (document.body.contains(specialPopup)) {
        document.body.removeChild(specialPopup);
      }
    }, 300);
  }, 4000);
}

// Efeito especial do Easter egg
function createSpecialEffect() {
  if (isReducedMotion) return;
  
  // Chuva de corações e estrelas
  const specialSymbols = ['⭐', '✨', '💫', '🌟', '💖', '💕', '💞', '💓', '💗', '❤️'];
  
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      const symbol = document.createElement('div');
      const char = specialSymbols[Math.floor(Math.random() * specialSymbols.length)];
      const size = Math.random() * 30 + 20;
      const x = Math.random() * window.innerWidth;
      const duration = Math.random() * 4 + 3;
      
      symbol.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: -50px;
        font-size: ${size}px;
        z-index: 3000;
        pointer-events: none;
        animation: specialFall ${duration}s ease-in forwards;
      `;
      symbol.textContent = char;
      
      const keyframeName = `specialFall${i}`;
      const style = document.createElement('style');
      style.textContent = `
        @keyframes ${keyframeName} {
          0% {
            transform: translateY(0) rotate(0deg) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: scale(1);
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg) scale(0);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
      symbol.style.animation = `${keyframeName} ${duration}s ease-in forwards`;
      
      document.body.appendChild(symbol);
      
      setTimeout(() => {
        if (document.body.contains(symbol)) {
          document.body.removeChild(symbol);
        }
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      }, (duration + 1) * 1000);
    }, i * 30);
  }
}

// Carregar preferências do usuário
function loadUserPreferences() {
  // Verificar se o usuário prefere movimento reduzido
  if (isReducedMotion) {
    document.body.classList.add('reduced-motion');
  }
  
  // Verificar se é um dispositivo de baixa potência
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.body.classList.add('low-power');
  }
  
  // Detectar se é mobile
  if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    document.body.classList.add('mobile-device');
  }
}(sections).indexOf(entry.target);
      currentSection = sectionIndex;
      
      // Atualizar dots
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === sectionIndex);
      });
      
      // Atualizar progress bar
      const progress = ((sectionIndex + 1) / sections.length) * 100;
      progressBar.style.width = `${progress}%`;
      
      // Animações específicas por seção
      if (sectionIndex === 1) {
        entry.target.querySelector('.profile-card').classList.add('visible');
      } else if (sectionIndex === 2) {
        const timeline = entry.target.querySelector('.timeline');
        const timelineItems = entry.target.querySelectorAll('.timeline-item');
        
        timeline.classList.add('visible');
        timelineItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('visible');
          }, parseInt(item.dataset.delay) || 0);
        });
      } else if (sectionIndex === 3) {
        const container = entry.target.querySelector('.counters-container');
        const counterItems = entry.target.querySelectorAll('.counter-item');
        
        container.classList.add('visible');
        counterItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('visible');
          }, parseInt(item.dataset.delay) || 0);
        });
        
        // Atualizar contadores
        setTimeout(() => {
          updateCounters();
        }, 600);
      } else if (sectionIndex === 4) {
        entry.target.querySelector('.final-content').classList.add('visible');
      }
    }
  });
}, observerOptions);

// Observar todas as seções
sections.forEach(section => {
  observer.observe(section);
});

// Mostrar mensagem de amor
function showLoveMessage() {
  const message = loveMessages[Math.floor(Math.random() * loveMessages.length)];
  
  // Criar popup
  const popup = document.createElement('div');
  popup.className = 'love-popup';
  popup.textContent = message;
  
  document.body.appendChild(popup);
  
  // Mostrar popup
  setTimeout(() => {
    popup.classList.add('show');
  }, 100);
  
  // Remover popup
  setTimeout(() => {
    popup.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 300);
  }, 2500);
  
  // Criar partículas
  createHeartParticles();
}

// Criar partículas de coração
function createHeartParticles() {
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        left: ${Math.random() * window.innerWidth}px;
        top: ${window.innerHeight + 20}px;
        font-size: ${Math.random() * 20 + 15}px;
        z-index: 1000;
        pointer-events: none;
        animation: floatUp 3s ease-out forwards;
      `;
      particle.textContent = ['💖', '💕', '💞', '💓', '💗'][Math.floor(Math.random() * 5)];
      
      // Adicionar animação
      const style = document.createElement('style');
      style.textContent = `
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-${window.innerHeight + 100}px) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
      
      document.body.appendChild(particle);
      
      setTimeout(() => {
        document.body.removeChild(particle);
        document.head.removeChild(style);
      }, 3000);
    }, i * 200);
  }
}

// Touch gestures para navegação
let touchStartY = 0;
let touchEndY = 0;

scrollContainer.addEventListener('touchstart', (e) => {
  touchStartY = e.changedTouches[0].screenY;
});

scrollContainer.addEventListener('touchend', (e) => {
  touchEndY = e.changedTouches[0].screenY;
  const swipeThreshold = 50;
  
  if (Math.abs(touchStartY - touchEndY) > swipeThreshold) {
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
});

// Prevenir zoom
document.addEventListener('touchstart', function (event) {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Atualizar contadores iniciais
  setTimeout(() => {
    if (currentSection === 3) {
      updateCounters();
    }
  }, 1000);
});
