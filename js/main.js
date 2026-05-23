/*
 * main.js — Interações da landing page
 */

(function () {
  'use strict';

  /* ── Navbar scroll ──────────────────────── */
  (function () {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    function updateNav() {
      if (window.scrollY > 50) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  })();

  /* ── Mobile hamburger menu ──────────────── */
  (function () {
    const btn = document.getElementById('hamburger');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', function () {
      const open = menu.classList.toggle('open');
      btn.classList.toggle('active', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    // Fecha ao clicar em link
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        btn.classList.remove('active');
      });
    });
  })();

  /* ── Smooth scroll para âncoras ─────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── Scroll reveal ──────────────────────── */
  (function () {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  })();

  /* ── Stats counter animation ────────────── */
  (function () {
    const statEls = document.querySelectorAll('.stat-counter');
    if (!statEls.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const text = el.textContent;
        const match = text.match(/[\d.]+/);
        if (!match) return;
        const end = parseFloat(match[0]);
        const isDecimal = match[0].includes('.');
        const suffix = text.replace(match[0], '');
        let start = 0;
        const duration = 1500;
        const startTime = performance.now();

        function tick(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = start + (end - start) * eased;
          el.textContent = (isDecimal ? value.toFixed(1) : Math.floor(value)) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    statEls.forEach(function (el) { observer.observe(el); });
  })();

  /* ── Contact form ───────────────────────── */
  (function () {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validação simples
      let valid = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        field.classList.remove('error');
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
      });
      if (!valid) return;

      const submitBtn = document.getElementById('form-submit');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');
      submitBtn.disabled = true;
      btnText.style.display = 'none';
      btnLoading.style.display = 'inline';

      // Abre WhatsApp imediatamente — sem delay artificial
      const stored = window.SiteContent ? window.SiteContent.get() : null;
      const number = (stored && stored.store && stored.store.whatsapp) ? stored.store.whatsapp : '5516999999999';
      const nome = form.nome ? form.nome.value : '';
      const interesse = form.interesse ? form.interesse.value : '';
      const mensagem = form.mensagem ? form.mensagem.value : '';
      const msg = encodeURIComponent(
        'Olá! Meu nome é ' + nome +
        (interesse ? '. Tenho interesse em: ' + interesse : '') +
        (mensagem ? '. Mensagem: ' + mensagem : '') +
        '. Pode me ajudar?'
      );
      window.open('https://wa.me/' + number + '?text=' + msg, '_blank');

      submitBtn.disabled = false;
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
      form.reset();

      const successEl = document.getElementById('form-success');
      if (successEl) {
        successEl.style.display = 'block';
        setTimeout(function () { successEl.style.display = 'none'; }, 6000);
      }
    });

    // Remove erro ao digitar
    form.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('input', function () { this.classList.remove('error'); });
    });
  })();

  /* ── Máscara de telefone ─────────────────── */
  (function () {
    const tel = document.getElementById('telefone');
    if (!tel) return;
    tel.addEventListener('input', function () {
      let v = this.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 10) {
        v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      } else if (v.length > 6) {
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      }
      this.value = v;
    });
  })();

  /* ── WhatsApp float pulse on scroll ─────── */
  (function () {
    const float = document.getElementById('whatsapp-float');
    if (!float) return;
    let shown = false;
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400 && !shown) {
        shown = true;
        float.style.opacity = '1';
        float.style.transform = 'scale(1)';
      }
    }, { passive: true });
    // Esconde inicialmente após o carregamento se não scrollou
    setTimeout(function () {
      if (!shown && window.scrollY <= 400) {
        float.style.opacity = '0.7';
      }
    }, 2000);
  })();

})();
