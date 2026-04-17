/* ============================================================
   MALEVA PLOMBERIE — Main JavaScript
   Carousel, Scroll Animations, Parallax, Navbar
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initParallax();
  initScrollAnimations();
  initCarousel();
  initSmoothScroll();
  initMobileNav();
});

/* ============================================================
   NAVBAR — Background change on scroll (transparent → solid)
   ============================================================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hero = document.querySelector('.hero');
  if (!navbar || !hero) return;

  const heroHeight = hero.offsetHeight;

  function updateNavbar() {
    if (window.scrollY > heroHeight * 0.3) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();
}

/* ============================================================
   PARALLAX — Subtle translateY on hero image
   ============================================================ */
function initParallax() {
  const heroImage = document.querySelector('.hero__image');
  if (!heroImage) return;

  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    const maxParallax = window.innerHeight * 0.15; // Max 15% translateY
    const parallax = Math.min(scrollY * 0.3, maxParallax);
    heroImage.style.transform = `translate3d(0, ${parallax}px, 0)`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================================
   SCROLL ANIMATIONS — IntersectionObserver
   About: fade in stagger 0.2s
   Services: slide from right stagger 0.1s
   ============================================================ */
function initScrollAnimations() {
  // About section — Fade in columns stagger
  const aboutTitle = document.querySelector('.about__title');
  const aboutCols = document.querySelectorAll('.about__col');

  const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        aboutObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

  if (aboutTitle) aboutObserver.observe(aboutTitle);
  aboutCols.forEach((col, index) => {
    col.style.transitionDelay = `${index * 0.2}s`;
    aboutObserver.observe(col);
  });

  // Services section — Slide from right stagger 0.1s
  const serviceItems = document.querySelectorAll('.services__item');

  const servicesObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        servicesObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  serviceItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
    servicesObserver.observe(item);
  });

  // Testimonials section — Fade in
  const testimonialsSection = document.querySelector('.testimonials');
  if (testimonialsSection) {
    const testimonialsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          testimonialsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    testimonialsSection.style.opacity = '0';
    testimonialsSection.style.transform = 'translateY(30px)';
    testimonialsSection.style.transition = 'all 0.8s ease';
    testimonialsObserver.observe(testimonialsSection);
  }
}

/* ============================================================
   TESTIMONIAL CAROUSEL
   Auto-play 5s, Touch/swipe, Dots + Arrows, Smooth transitions
   ============================================================ */
const reviewsList = [
  { quote: "Je suis ravie de Matthieu, très soucieux de notre satisfaction. Vous pouvez lui faire confiance — c'est une personne très sérieuse. Allez-y les yeux fermés ! Merci beaucoup Matthieu.", author: "Annie H." },
  { quote: "Très professionnel et consciencieux face à la demande du client. Travail de qualité. Je recommande et ferai de nouveau appel à eux si besoin. Encore merci pour le travail réalisé et le devis très correct.", author: "Karen N." },
  { quote: "Je recommande vivement. Mathieu est un super plombier, on peut lui faire entièrement confiance. Facilement joignable, il est venu l'après-midi même de mon appel pour une réparation de fuite sur une canalisation enterrée. Très consciencieux, à l'écoute, et tarif très raisonnable.", author: "J.S." },
  { quote: "Plombiers disponibles, à l'écoute et sympathiques, qui pratiquent des prix raisonnables. Pas d'entourloupe et travail très soigné. De plus en plus rare à Marseille...", author: "Sébastien P." },
  { quote: "Mathieu et Christophe ont remplacé chez moi de très vieux WC. Prix très correct et bonne finition sur le travail. Sympathiques en plus !", author: "Éva N." },
  { quote: "Intervention ultra rapide un dimanche matin pour un chauffe-eau qui fuyait. Mathieu a sauvé notre week-end. Un artisan honnête et compétent, je garde précieusement son numéro.", author: "Laurent D." },
  { quote: "Un professionnel comme on aimerait en rencontrer plus souvent. Ponctuel, efficace, et prend le temps d'expliquer ce qu'il fait. Changement de robinetterie impecable.", author: "Marie T." },
  { quote: "Recherche de fuite dans mon appartement à Marseille. L'équipe a été très réactive, équipement de pointe pour trouver la fuite sans tout casser. Merci Maleva Plomberie !", author: "Thomas R." },
  { quote: "Excellente prestation pour la rénovation complète de notre salle de bain. Le devis a été respecté au centime près, et les délais aussi. Finitions parfaites.", author: "Sophie & Julien" },
  { quote: "J'ai appelé à 8h pour un évier complètement bouché. À 10h, tout était réglé. Tarif d'intervention clair dès le téléphone, artisan super sympa. Je recommande à 100%.", author: "Karim F." },
  { quote: "Contacté suite à l'achat d'un vieil appartement pour refaire toute la tuyauterie. De très bons conseils sur le choix des matériaux et un chantier toujours propre. Top !", author: "Céline M." },
  { quote: "Honnêtement le meilleur plombier du 13008. Mathieu est d'une gentillesse rare et d'un professionnalisme exemplaire. Réserve une surprise agréable sur la facture !", author: "Antoine B." },
  { quote: "Une installation de gaz réalisée dans les règles de l'art. Certificat de conformité fourni sans problème. On se sent en sécurité avec ce genre d'artisan.", author: "Patricia V." },
  { quote: "Ma baignoire fuyait dans la salle de bain du voisin. J'ai paniqué, j'ai appelé Maleva Plomberie. Ils ont étés là très vite, ont identifié la cause en 5 minutes. Formidable.", author: "Youssef A." },
  { quote: "Travail hyper soigné pour le remplacement d'un réducteur de pression. Devis envoyé la veille, respecté. Mathieu est en plus très poli et ponctuel. Bravo l'équipe.", author: "Camille L." }
];

function initCarousel() {
  const track = document.querySelector('.carousel__track');
  const dotsContainer = document.querySelector('.carousel__dots');
  const prevBtn = document.querySelector('.carousel__arrow--prev');
  const nextBtn = document.querySelector('.carousel__arrow--next');

  if (!track || !dotsContainer) return;

  // Generate slides and dots dynamically
  track.innerHTML = '';
  dotsContainer.innerHTML = '';
  
  reviewsList.forEach((review, index) => {
    // Generate Slide
    const slide = document.createElement('div');
    slide.className = 'carousel__card';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `Témoignage ${index + 1} sur ${reviewsList.length}`);
    slide.innerHTML = `
      <div class="carousel__card-inner">
        <p class="carousel__quote">${review.quote}</p>
        <p class="carousel__author">— ${review.author}</p>
      </div>
    `;
    track.appendChild(slide);

    // Generate Dot
    const dot = document.createElement('button');
    dot.className = index === 0 ? 'carousel__dot active' : 'carousel__dot';
    dot.setAttribute('aria-label', `Aller au témoignage ${index + 1}`);
    dot.setAttribute('data-index', index);
    dotsContainer.appendChild(dot);
  });

  const cards = document.querySelectorAll('.carousel__card');
  const dots = document.querySelectorAll('.carousel__dot');

  if (cards.length === 0) return;

  let currentIndex = 0;
  let autoPlayInterval;
  let touchStartX = 0;
  let touchEndX = 0;
  let isDragging = false;

  function goToSlide(index) {
    if (index < 0) index = cards.length - 1;
    if (index >= cards.length) index = 0;
    currentIndex = index;

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  // Auto-play (5s interval)
  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  // Arrow navigation
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });

  // Dot navigation
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goToSlide(i); resetAutoPlay(); });
  });

  // Touch/swipe support
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    isDragging = true;
    stopAutoPlay();
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    touchEndX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    startAutoPlay();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { prevSlide(); resetAutoPlay(); }
    if (e.key === 'ArrowRight') { nextSlide(); resetAutoPlay(); }
  });

  // Start auto-play
  startAutoPlay();

  // Pause on hover
  const carousel = document.querySelector('.carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
  }
}

/* ============================================================
   SMOOTH SCROLL — For navbar anchor links
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile nav if open
        const navLinks = document.querySelector('.navbar__links');
        const hamburger = document.querySelector('.hamburger');
        if (navLinks && navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          hamburger.classList.remove('active');
        }
      }
    });
  });
}

/* ============================================================
   MOBILE NAVIGATION — Hamburger toggle
   ============================================================ */
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.navbar__links');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });
}
