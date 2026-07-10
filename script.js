(function () {
  'use strict';

  /* ========================================
     1. DOM Ready
     ======================================== */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initAnimations();
    initAchievements();
    // removed undefined: initCarousel(), initFAQ(), initCounters()
    initContactForm();
  }

  /* ========================================
     2. Navbar — Transparent → Solid on Scroll
     ======================================== */
  function initNavbar() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    var scrollThreshold = 60;

    function onScroll() {
      if (window.scrollY > scrollThreshold) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ========================================
     3. Mobile Menu
     ======================================== */
  function initMobileMenu() {
    var toggle = document.getElementById('menu-toggle');
    var nav = document.getElementById('navbar-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    var links = nav.querySelectorAll('.nav-link');
    if (links && links.length) {
      links.forEach(function (link) {
        link.addEventListener('click', function () {
          nav.classList.remove('open');
          toggle.classList.remove('active');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }

    // Close on escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ========================================
     4. Smooth Scroll for Anchor Links
     ======================================== */
  function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');
    if (!anchors || !anchors.length) return;

    var navbar = document.getElementById('navbar');
    var navbarHeight = navbar ? navbar.offsetHeight : 0;

    anchors.forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (!href || href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.pageYOffset - (navbar ? navbar.offsetHeight : 0);
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ========================================
     5. Scroll Animations — IntersectionObserver
     ======================================== */
  function initAnimations() {
    var items = document.querySelectorAll('.anim-item');
    if (!items || !items.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything
      items.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
          setTimeout(function () {
            el.classList.add('in-view');
          }, delay);
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ========================================
     6. Achievements / Carousel
     ======================================== */
  function initAchievements() {
    var track = document.getElementById('achievementTrack');
    if (!track) return;

    var cards = track.querySelectorAll('.achievement-card');
    if (!cards || !cards.length) return;

    var dots = document.querySelectorAll('.achievement-dots span') || [];
    var prevBtn = document.querySelector('.achievement-arrow.prev');
    var nextBtn = document.querySelector('.achievement-arrow.next');

    var index = 0;
    var visibleCards = 2; // preserve original behaviour
    var gap = 30;
    var autoplayInterval = 5000;
    var resizeDebounceMs = 100;

    function update() {
      if (!cards || !cards.length || !track) return;
      var cardWidth = cards[0].offsetWidth || 0;
      track.style.transform = `translateX(calc(-${index * (cardWidth + gap)}px + 70px))`;

      if (dots && dots.length) {
        dots.forEach(function (dot) { dot.classList.remove('active'); });
        if (dots[index]) dots[index].classList.add('active');
      }
    }

    function nextHandler() {
      if (!cards) return;
      if (index < cards.length - visibleCards) {
        index++;
      } else {
        index = 0;
      }
      update();
    }

    function prevHandler() {
      if (!cards) return;
      if (index > 0) {
        index--;
      } else {
        index = Math.max(0, cards.length - visibleCards);
      }
      update();
    }

    if (nextBtn) nextBtn.addEventListener('click', nextHandler);
    if (prevBtn) prevBtn.addEventListener('click', prevHandler);

    var autoplayId = null;
    if (nextBtn) {
      autoplayId = setInterval(function () {
        nextHandler();
      }, autoplayInterval);
    }

    // debounce helper
    function debounce(fn, wait) {
      var t;
      return function () {
        var args = arguments;
        clearTimeout(t);
        t = setTimeout(function () { fn.apply(null, args); }, wait);
      };
    }

    var debouncedUpdate = debounce(function () { update(); }, resizeDebounceMs);
    window.addEventListener('resize', debouncedUpdate);

    // initial layout update
    // ensure layout has been calculated
    requestAnimationFrame(function () { update(); });
  }

  /* ========================================
     7. Contact Form
     ======================================== */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var submitBtn = document.getElementById('contact-submit');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!submitBtn) return;

      var name = document.getElementById('contact-name');
      var email = document.getElementById('contact-email');
      var company = document.getElementById('contact-company'); // optional
      var phone = document.getElementById('contact-phone');
      var message = document.getElementById('contact-message');

      var valid = true;

      // Validate only required fields (HTML marks them)
      var requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach(function (field) {
        if (!field) return;
        var val = (field.value || '').trim();
        if (!val) {
          field.classList.add('input-error');
          valid = false;
        } else {
          field.classList.remove('input-error');
        }
      });

      // Email format check
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.classList.add('input-error');
        valid = false;
      }

      if (!valid) return;

      // Preserve original UX: simulate loading and success state
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(function () {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        // Success state
        var originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="btn-text">✓ Message Sent!</span>';
        submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        submitBtn.style.boxShadow = '0 4px 20px rgba(34,197,94,0.35)';

        form.reset();

        setTimeout(function () {
          submitBtn.innerHTML = originalHTML;
          submitBtn.style.background = '';
          submitBtn.style.boxShadow = '';
        }, 3000);
      }, 1800);
    });

    // Clear error styling on input
    var fields = form.querySelectorAll('input, select, textarea');
    if (fields && fields.length) {
      fields.forEach(function (field) {
        field.addEventListener('input', function () {
          this.classList.remove('input-error');
        });
      });
    }
  }

})();
