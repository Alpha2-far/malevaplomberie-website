/* ============================================================
   MALEVA PLOMBERIE — Main JavaScript
   Carousel, Scroll Animations, Parallax, Navbar
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initParallax();
  initScrollAnimations();
  initMarquee();
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

function initMarquee() {
  const col1 = document.getElementById('marquee-col-1');
  const col2 = document.getElementById('marquee-col-2');
  const col3 = document.getElementById('marquee-col-3');

  if (!col1) return;

  // Distribute reviews into 3 groups
  const groupSize = Math.ceil(reviewsList.length / 3);
  const groups = [
    reviewsList.slice(0, groupSize),
    reviewsList.slice(groupSize, groupSize * 2),
    reviewsList.slice(groupSize * 2)
  ];

  const cols = [col1, col2, col3];

  cols.forEach((col, colIndex) => {
    if (!col) return;
    
    let htmlContent = '';
    
    groups[colIndex].forEach((review) => {
      htmlContent += `
        <div class="carousel__card">
          <div class="carousel__card-inner">
            <p class="carousel__quote">${review.quote}</p>
            <p class="carousel__author">— ${review.author}</p>
          </div>
        </div>
      `;
    });

    // Duplicate content once to create a seamless infinite scroll loop (CSS animation translates by -50%)
    col.innerHTML = htmlContent + htmlContent;
  });
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
