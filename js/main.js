/**
 * main.js — Arquivo JavaScript Unificado da UNA Tecnologia
 * ============================================================
 * NOTA TÉCNICA:
 *   Este arquivo combina todos os módulos em um único arquivo
 *   para compatibilidade com abertura direta via file:// no
 *   navegador (sem servidor HTTP).
 *
 *   Se você usar um servidor web (Apache, Nginx, Node.js),
 *   pode separar nos arquivos menu.js e form-validation.js
 *   e usar import/export ES6 normalmente.
 *
 * ESTRUTURA:
 *   ① Módulo: Menu (hambúrguer, scroll spy, header sticky)
 *   ② Módulo: Scroll Reveal (animações de entrada)
 *   ③ Módulo: Lightbox (visualizador de imagens)
 *   ④ Módulo: Carrossel da Galeria
 * ============================================================
 */

// ────────────────────────────────────────────────────────────
// PONTO DE ENTRADA — Aguarda o HTML estar completamente carregado
// ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initScrollReveal();
  initLightbox();
  initGalleryCarousel();
});

// ════════════════════════════════════════════════════════════
// ① MÓDULO: MENU DE NAVEGAÇÃO
// Hambúrguer mobile, cabeçalho sticky, scroll spy
// ════════════════════════════════════════════════════════════
const initMenu = () => {
  const header        = document.getElementById('site-header');
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const mobilePanel   = document.getElementById('nav-mobile-panel');
  const mobileLinks   = document.querySelectorAll('.nav-mobile-link');
  const desktopLinks  = document.querySelectorAll('.nav-menu-link');

  if (!header || !menuToggleBtn || !mobilePanel) return;

  // ── Toggle do menu mobile ──────────────────────────────────
  /**
   * Abre ou fecha o menu mobile.
   * @param {boolean} [forceClose=false] - Força o fechamento.
   */
  const toggleMobileMenu = (forceClose = false) => {
    const isOpen = header.classList.contains('menu-is-open');

    if (forceClose || isOpen) {
      header.classList.remove('menu-is-open');
      mobilePanel.classList.remove('is-open');
      mobilePanel.setAttribute('aria-hidden', 'true');
      menuToggleBtn.setAttribute('aria-expanded', 'false');
      menuToggleBtn.setAttribute('aria-label', 'Abrir menu de navegação');
      document.body.style.overflow = '';
    } else {
      header.classList.add('menu-is-open');
      mobilePanel.classList.add('is-open');
      mobilePanel.setAttribute('aria-hidden', 'false');
      menuToggleBtn.setAttribute('aria-expanded', 'true');
      menuToggleBtn.setAttribute('aria-label', 'Fechar menu de navegação');
      document.body.style.overflow = 'hidden';
    }
  };

  // Clique no botão hambúrguer
  menuToggleBtn.addEventListener('click', () => toggleMobileMenu());

  // Clique em link do menu mobile fecha o painel
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(true));
  });

  // Clique fora do painel mobile fecha o menu
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target) && !mobilePanel.contains(event.target)) {
      toggleMobileMenu(true);
    }
  });

  // Tecla ESC fecha o menu
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') toggleMobileMenu(true);
  });

  // ── Cabeçalho sticky (encolhe ao rolar) ─────────────────
  /**
   * Adiciona/remove a classe is-scrolled conforme o scroll.
   */
  const handleHeaderScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  handleHeaderScroll(); // Executa na carga inicial
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  // ── Menu Spy (destaca o item ativo) ─────────────────────
  /**
   * Usa IntersectionObserver para destacar o link do menu
   * correspondente à seção atualmente visível na tela.
   */
  const sections = document.querySelectorAll('section[id]');
  if (!sections.length) return;

  const onSectionVisible = (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const href = `#${entry.target.id}`;

      // Remove destaque de todos
      [...desktopLinks, ...mobileLinks].forEach(link => {
        link.classList.remove('is-active');
      });

      // Adiciona destaque ao correspondente
      document.querySelector(`.nav-menu-link[href="${href}"]`)?.classList.add('is-active');
      document.querySelector(`.nav-mobile-link[href="${href}"]`)?.classList.add('is-active');
    });
  };

  const sectionObserver = new IntersectionObserver(onSectionVisible, {
    threshold: 0.3,
    rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '72')}px 0px 0px 0px`
  });

  sections.forEach(section => sectionObserver.observe(section));
};

// ════════════════════════════════════════════════════════════
// ② MÓDULO: SCROLL REVEAL (Animações de entrada ao rolar)
// ════════════════════════════════════════════════════════════
const initScrollReveal = () => {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
};

// ════════════════════════════════════════════════════════════
// ④ MÓDULO: LIGHTBOX (Visualizador de imagem em tela cheia)
// ════════════════════════════════════════════════════════════
const initLightbox = () => {
  const lightbox      = document.getElementById('lightbox-overlay');
  const lightboxImage = document.getElementById('lightbox-image');
  const closeBtn      = document.getElementById('lightbox-close-btn');

  if (!lightbox || !lightboxImage) return;

  // Abre o lightbox com a imagem passada
  const openLightbox = (src, alt) => {
    lightboxImage.src = src;
    lightboxImage.alt = alt || 'Imagem';
    lightbox.classList.add('is-active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  };

  // Fecha o lightbox
  const closeLightbox = () => {
    lightbox.classList.remove('is-active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImage.src = ''; }, 300);
  };

  // Adiciona clique em todos os triggers [data-lightbox]
  document.querySelectorAll('[data-lightbox]').forEach(trigger => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openLightbox(trigger.dataset.lightbox, trigger.dataset.lightboxAlt || trigger.querySelector('img')?.alt);
    });
  });

  // Fecha com o botão X
  closeBtn?.addEventListener('click', closeLightbox);

  // Fecha clicando no overlay
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  // Fecha com ESC
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-active')) closeLightbox();
  });
};

// ════════════════════════════════════════════════════════════
// ⑤ MÓDULO: CARROSSEL DA GALERIA
// Carrossel infinito com suporte a swipe e autoplay
// ════════════════════════════════════════════════════════════
const initGalleryCarousel = () => {
  const carousel   = document.getElementById('gallery-carousel');
  const track      = document.getElementById('gallery-track');
  const slides     = document.querySelectorAll('.gallery-slide');
  const prevBtn    = document.getElementById('gallery-prev-btn');
  const nextBtn    = document.getElementById('gallery-next-btn');
  const pagination = document.getElementById('gallery-pagination');

  if (!carousel || !track || !slides.length) return;

  // Retorna quantos slides exibir com base na largura da tela
  const getSlidesVisible = () => {
    if (window.innerWidth < 480) return 1;
    if (window.innerWidth < 768) return 2;
    return 3;
  };

  let currentIndex = 0;
  let autoPlayTimer = null;
  const AUTOPLAY_DELAY = 5000;

  // Calcula o índice máximo possível
  const getMaxIndex = () => Math.max(0, slides.length - getSlidesVisible());

  // Move o carrossel para o índice dado
  const goToSlide = (index) => {
    const maxIndex = getMaxIndex();
    currentIndex = Math.max(0, Math.min(index, maxIndex));

    // Calcula o offset em pixels
    const slideEl = slides[0];
    const slideWidth = slideEl.getBoundingClientRect().width;
    const gap = 16; // var(--space-md)
    const offset = currentIndex * (slideWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    updateDots();
  };

  // Atualiza as bolinhas de paginação
  const updateDots = () => {
    pagination?.querySelectorAll('.gallery-dot').forEach((dot, i) => {
      dot.classList.toggle('is-active', i === currentIndex);
      dot.setAttribute('aria-pressed', i === currentIndex ? 'true' : 'false');
    });
  };

  // Vai para o próximo slide (circular)
  const goToNext = () => {
    const maxIndex = getMaxIndex();
    goToSlide(currentIndex >= maxIndex ? 0 : currentIndex + 1);
  };

  // Vai para o slide anterior (circular)
  const goToPrev = () => {
    const maxIndex = getMaxIndex();
    goToSlide(currentIndex <= 0 ? maxIndex : currentIndex - 1);
  };

  // Cria as bolinhas de paginação dinamicamente
  if (pagination) {
    const maxIndex = getMaxIndex();
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('button');
      dot.className = 'gallery-dot';
      dot.setAttribute('aria-label', `Ir para o slide ${i + 1}`);
      dot.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => { goToSlide(i); resetAutoPlay(); });
      pagination.appendChild(dot);
    }
    updateDots();
  }

  // Botões de navegação
  prevBtn?.addEventListener('click', () => { goToPrev(); resetAutoPlay(); });
  nextBtn?.addEventListener('click', () => { goToNext(); resetAutoPlay(); });

  // Suporte a swipe (mobile)
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dist = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dist) > 50) {
      if (dist > 0) goToNext(); else goToPrev();
    }
  }, { passive: true });

  // Autoplay
  const startAutoPlay = () => { autoPlayTimer = setInterval(goToNext, AUTOPLAY_DELAY); };
  const resetAutoPlay = () => { clearInterval(autoPlayTimer); startAutoPlay(); };

  carousel.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
  carousel.addEventListener('mouseleave', () => startAutoPlay());

  startAutoPlay();

  // Recalcula ao redimensionar
  window.addEventListener('resize', () => goToSlide(currentIndex), { passive: true });
};
