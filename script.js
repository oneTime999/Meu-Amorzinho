// Variáveis globais
let currentSection = 0;
let sections;
let dots;
let scrollContainer;
let progressBar;

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

let audioContext;
let audioEnabled = false;
let backgroundParticles = [];
let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  console.log('💖 Inicializando site da Ana...');

  sections = document.querySelectorAll('.section');
  dots = document.querySelectorAll('.scroll-dot');
  scrollContainer = document.getElementById('scrollContainer');
  progressBar = document.getElementById('progressBar');

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
