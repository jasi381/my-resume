/**
 * Netflix-Style Android Developer Portfolio - Interactive JavaScript
 * Features: Navigation, Animations, Scroll Effects, Form Handling
 */

class NetflixPortfolioApp {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.navMenu = document.getElementById('nav-menu');
    this.mobileMenu = document.getElementById('mobile-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('section');

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupScrollAnimations();
    this.setupCounterAnimations();
    this.setupFormHandling();
    this.setupSmoothScrolling();
    this.setupNetflixEffects();
  }

  setupEventListeners() {
    // Mobile menu toggle
    this.mobileMenu.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Close mobile menu when clicking on nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
      this.handleNavbarScroll();
      this.updateActiveNavLink();
    });

    // Window resize handler
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Document click to close mobile menu
    document.addEventListener('click', (e) => {
      if (!this.navMenu.contains(e.target) && !this.mobileMenu.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    this.mobileMenu.classList.toggle('active');
    this.navMenu.classList.toggle('active');

    // Prevent body scroll when menu is open
    if (this.navMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu() {
    this.mobileMenu.classList.remove('active');
    this.navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  handleNavbarScroll() {
    if (window.scrollY > 50) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  }

  updateActiveNavLink() {
    const currentSection = this.getCurrentSection();

    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  getCurrentSection() {
    let currentSection = 'hero';

    this.sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        currentSection = section.id;
      }
    });

    return currentSection;
  }

  setupSmoothScrolling() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar

          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });

    // Smooth scroll for hero buttons
    const heroButtons = document.querySelectorAll('.hero-buttons a');
    heroButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const href = button.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          const targetSection = document.querySelector(href);

          if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;

            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  setupScrollAnimations() {
    // Create intersection observer for scroll animations with better performance
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Clean up will-change after animation
          setTimeout(() => {
            entry.target.style.willChange = 'auto';
          }, 600);
          // Stop observing after animation
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Add animation classes and observe elements with reduced elements
    const animatedElements = [
      { selector: '.section-header', class: 'fade-in' },
      { selector: '.about-description', class: 'slide-in-left' },
      { selector: '.about-highlights', class: 'slide-in-right' },
      { selector: '.project-card', class: 'fade-in' },
      { selector: '.contact-form-container', class: 'slide-in-right' }
    ];

    animatedElements.forEach(({ selector, class: animationClass }) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element, index) => {
        element.classList.add(animationClass);
        element.style.transitionDelay = `${Math.min(index * 0.1, 0.5)}s`; // Cap delay
        observer.observe(element);
      });
    });
  }

  setupCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const text = counter.textContent;

          // Extract number from text (handles formats like "50+", "5+", "1M+")
          const match = text.match(/(\d+\.?\d*)/);
          if (match) {
            const target = parseFloat(match[1]);
            const suffix = text.replace(match[1], '');
            this.animateCounter(counter, target, suffix);
          }

          counterObserver.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
  }

  animateCounter(element, target, suffix = '') {
    let current = 0;
    const increment = target / 60; // 60 frames for 1 second at 60fps
    const duration = 1500; // 1.5 seconds
    const step = duration / 60;

    const timer = setInterval(() => {
      current += increment;

      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      // Format number for display
      let displayValue = Math.floor(current);

      // Handle decimal places for values less than 10
      if (target < 10 && target % 1 !== 0) {
        displayValue = current.toFixed(1);
      }

      element.textContent = displayValue + suffix;
    }, step);
  }

  setupFormHandling() {
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmission(contactForm);
      });
    }
  }

  handleFormSubmission(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
      this.showFormFeedback('success', 'Message sent successfully! I\'ll get back to you soon.');
      form.reset();

      // Reset button
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }, 2000);
  }

  showFormFeedback(type, message) {
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = `form-feedback ${type}`;
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      font-family: 'Inter', sans-serif;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
      ${type === 'success' ? 'background: #E50914; border: 1px solid #FF1E2D;' : 'background: #DC2626; border: 1px solid #EF4444;'}
    `;
    feedback.textContent = message;

    document.body.appendChild(feedback);

    // Animate in
    setTimeout(() => {
      feedback.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
      feedback.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(feedback)) {
          document.body.removeChild(feedback);
        }
      }, 300);
    }, 5000);
  }

  setupNetflixEffects() {
    // Netflix-style project card hover effects
    this.setupProjectCardEffects();

    // Netflix-style skill badge effects
    this.setupSkillBadgeEffects();

    // Add subtle parallax to hero section
    this.setupParallaxEffects();
  }

  setupProjectCardEffects() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        // Add Netflix-style scale effect
        card.style.zIndex = '10';
      });

      card.addEventListener('mouseleave', () => {
        card.style.zIndex = '1';
      });
    });
  }

  setupSkillBadgeEffects() {
    const skillBadges = document.querySelectorAll('.skill-badge');

    skillBadges.forEach(badge => {
      // Add random delay for staggered hover effects
      badge.style.transitionDelay = `${Math.random() * 0.1}s`;
    });
  }

  setupParallaxEffects() {
    let ticking = false;
    let isAnimating = true;

    const handleScroll = utils.throttle(() => {
      if (!ticking && isAnimating) {
        requestAnimationFrame(() => {
          this.updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    }, 16); // ~60fps

    // Stop animations when not visible
    document.addEventListener('visibilitychange', () => {
      isAnimating = !document.hidden;
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  updateParallax() {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero');
    const phoneElement = document.querySelector('.phone-mockup');

    // Apply subtle parallax to hero background with will-change optimization
    if (heroSection && scrolled < window.innerHeight) {
      const rate = scrolled * -0.2; // Reduced for better performance
      heroSection.style.transform = `translate3d(0, ${rate}px, 0)`;
      heroSection.style.willChange = 'transform';
    } else if (heroSection) {
      heroSection.style.willChange = 'auto';
    }

    // Enhanced floating animation for phone with reduced calculations
    if (phoneElement && scrolled < window.innerHeight) {
      const time = performance.now() * 0.001;
      const floatOffset = Math.sin(time) * 3; // Reduced amplitude
      phoneElement.style.transform = `translate3d(0, ${floatOffset}px, 0)`;
      phoneElement.style.willChange = 'transform';
    } else if (phoneElement) {
      phoneElement.style.willChange = 'auto';
    }
  }

  handleResize() {
    // Close mobile menu on resize to larger screens
    if (window.innerWidth > 768) {
      this.closeMobileMenu();
    }
  }
}

// Utility functions
const utils = {
  // Debounce function for performance optimization
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function for scroll events
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Check if element is in viewport
  isInViewport: (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // Netflix-style ease function
  easeOutCubic: (t) => {
    return 1 - Math.pow(1 - t, 3);
  }
};

// Enhanced Netflix-style animations
class NetflixAnimations {
  constructor() {
    this.ticking = false;
    this.init();
  }

  init() {
    // Setup enhanced scroll animations
    this.setupAdvancedScrollEffects();

    // Setup Netflix-style loading animations
    this.setupLoadingAnimations();

    // Setup interactive background effects
    this.setupBackgroundEffects();
  }

  setupAdvancedScrollEffects() {
    const observerOptions = {
      threshold: [0, 0.25, 0.5, 0.75, 1],
      rootMargin: '-10% 0px -10% 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const element = entry.target;
        const ratio = entry.intersectionRatio;

        // Netflix-style fade and scale effect
        if (element.classList.contains('netflix-scale')) {
          const scale = 0.8 + (ratio * 0.2);
          const opacity = ratio;
          element.style.transform = `scale(${scale})`;
          element.style.opacity = opacity;
        }
      });
    }, observerOptions);

    // Apply to project cards and other elements
    document.querySelectorAll('.project-card, .skill-badge').forEach(el => {
      el.classList.add('netflix-scale');
      scrollObserver.observe(el);
    });
  }

  setupLoadingAnimations() {
    // Staggered loading animation for elements
    const elements = document.querySelectorAll('.hero-text > *, .nav-logo, .hero-visual');

    elements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';

      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, index * 150);
    });
  }

  setupBackgroundEffects() {
    // Subtle background animation for hero section
    const hero = document.querySelector('.hero');
    let time = 0;

    const animateBackground = () => {
      time += 0.005;
      const opacity1 = 0.15 + Math.sin(time) * 0.05;
      const opacity2 = 0.1 + Math.cos(time * 0.7) * 0.03;

      hero.style.background = `
        linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(20, 20, 20, 0.5) 50%, rgba(0, 0, 0, 0.8) 100%),
        radial-gradient(circle at 20% 80%, rgba(229, 9, 20, ${opacity1}) 0%, transparent 60%),
        radial-gradient(circle at 80% 20%, rgba(229, 9, 20, ${opacity2}) 0%, transparent 60%),
        #000000
      `;

      requestAnimationFrame(animateBackground);
    };

    animateBackground();
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize main portfolio app
  new NetflixPortfolioApp();

  // Initialize advanced animations
  new NetflixAnimations();

  // Add loading animation completion
  document.body.classList.add('loaded');

  // Console welcome message with Netflix styling
  console.log(`
    🎬 Netflix-Style Android Portfolio
    =================================
    Built with cinematic design and modern web technologies

    ✨ Features:
    - Netflix-inspired UI/UX
    - Smooth animations and transitions
    - Responsive design
    - Interactive elements
    - Performance optimized

    🚀 Ready for deployment!
  `);

  // Add subtle cursor effects
  setupCursorEffects();
});

// Netflix-style cursor effects
function setupCursorEffects() {
  const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-badge');

  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      document.body.style.cursor = 'pointer';
    });

    element.addEventListener('mouseleave', () => {
      document.body.style.cursor = 'default';
    });
  });
}

// Performance monitoring (optional)
if ('performance' in window) {
  window.addEventListener('load', () => {
    const loadTime = performance.now();
    if (loadTime < 3000) {
      console.log('🚀 Fast load time:', Math.round(loadTime) + 'ms');
    }
  });
}

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('📱 PWA ready: Service Worker registered');
      })
      .catch((registrationError) => {
        console.log('Service Worker registration failed:', registrationError);
      });
  });
}