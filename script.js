/* ============================================
   FUTURE MOBILE — Premium Corporate Website
   JavaScript — Vanilla Only
   ============================================ */

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
    initCarousel();
    initFAQ();
    initCounters();
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
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    var links = nav.querySelectorAll('.nav-link');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

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
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        var navbarHeight = document.getElementById('navbar').offsetHeight;
        var top = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ========================================
     5. Scroll Animations — IntersectionObserver
     ======================================== */
  function initAnimations() {
    var items = document.querySelectorAll('.anim-item');
    if (!items.length) return;

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
     6. Testimonials Carousel
     ======================================== */
  function initCarousel() {
    var track = document.getElementById('testimonials-track');
    var prevBtn = document.getElementById('carousel-prev');
    var nextBtn = document.getElementById('carousel-next');
    var dotsContainer = document.getElementById('carousel-dots');
    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    var cards = track.querySelectorAll('.testimonial-card');
    var total = cards.length;
    var current = 0;
    var autoplayTimer = null;
    var autoplayDelay = 6000;

    // Create dots
    for (var i = 0; i < total; i++) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      dot.setAttribute('data-index', i);
      dotsContainer.appendChild(dot);
    }

    var dots = dotsContainer.querySelectorAll('.carousel-dot');

    function goTo(index) {
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;
      current = index;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, di) {
        d.classList.toggle('active', di === current);
      });
    }

    prevBtn.addEventListener('click', function () {
      goTo(current - 1);
      resetAutoplay();
    });

    nextBtn.addEventListener('click', function () {
      goTo(current + 1);
      resetAutoplay();
    });

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goTo(parseInt(this.getAttribute('data-index'), 10));
        resetAutoplay();
      });
    });

    // Keyboard navigation
    track.parentElement.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { goTo(current - 1); resetAutoplay(); }
      if (e.key === 'ArrowRight') { goTo(current + 1); resetAutoplay(); }
    });

    // Touch / Swipe support
    var startX = 0;
    var diffX = 0;

    track.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      diffX = 0;
    }, { passive: true });

    track.addEventListener('touchmove', function (e) {
      diffX = e.touches[0].clientX - startX;
    }, { passive: true });

    track.addEventListener('touchend', function () {
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) goTo(current - 1);
        else goTo(current + 1);
        resetAutoplay();
      }
    });

    // Autoplay
    function startAutoplay() {
      autoplayTimer = setInterval(function () {
        goTo(current + 1);
      }, autoplayDelay);
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    startAutoplay();
  }

  /* ========================================
     7. FAQ Accordion
     ======================================== */
  function initFAQ() {
    var items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(function (item) {
      var btn = item.querySelector('.faq-question');
      var answer = item.querySelector('.faq-answer');
      if (!btn || !answer) return;

      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('active');

        // Close all others
        items.forEach(function (other) {
          if (other !== item) {
            other.classList.remove('active');
            var otherBtn = other.querySelector('.faq-question');
            var otherAnswer = other.querySelector('.faq-answer');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherAnswer) otherAnswer.style.maxHeight = '0';
          }
        });

        // Toggle current
        if (isOpen) {
          item.classList.remove('active');
          btn.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = '0';
        } else {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /* ========================================
     8. Animated Counters
     ======================================== */
  function initCounters() {
    var counters = document.querySelectorAll('.stat-value[data-count]');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (el) { finalizeCounter(el); });
      return;
    }

    var observed = false;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !observed) {
          observed = true;
          counters.forEach(function (el) { animateCounter(el); });
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    var section = document.getElementById('stats');
    if (section) observer.observe(section);
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffixText = el.getAttribute('data-suffix-text') || '';
    var duration = 2000;
    var start = 0;
    var startTime = null;

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = easeOutQuart(progress);
      var current = Math.floor(eased * target);

      el.textContent = prefix + formatNumber(current) + suffixText;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + formatNumber(target) + suffixText;
      }
    }

    requestAnimationFrame(step);
  }

  function finalizeCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffixText = el.getAttribute('data-suffix-text') || '';
    el.textContent = prefix + formatNumber(target) + suffixText;
  }

  function formatNumber(n) {
    return n.toLocaleString('en-US');
  }

  /* ========================================
     9. Contact Form
     ======================================== */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = document.getElementById('contact-submit');
      if (!submitBtn) return;

      // Basic validation
      var name = document.getElementById('contact-name');
      var email = document.getElementById('contact-email');
      var subject = document.getElementById('contact-subject');
      var message = document.getElementById('contact-message');

      var valid = true;
      [name, email, subject, message].forEach(function (field) {
        if (!field) return;
        if (!field.value.trim()) {
          field.style.borderColor = '#E63946';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.style.borderColor = '#E63946';
        valid = false;
      }

      if (!valid) return;

      // Simulate loading
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
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        this.style.borderColor = '';
      });
    });
  }

})();
