/*
 * admin.js — Painel de gestão de conteúdo
 * Senha armazenada como SHA-256 no localStorage.
 * Na primeira vez sem senha cadastrada, qualquer senha é aceita e gravada.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'botasrei_content';
  const SESSION_KEY = 'botasrei_admin_session';
  const PASS_KEY    = 'botasrei_admin_hash';

  async function sha256(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
  }

  async function checkPassword(input) {
    const stored = localStorage.getItem(PASS_KEY);
    const hash = await sha256(input);
    if (!stored) {
      // primeira execução — grava a senha digitada como hash
      localStorage.setItem(PASS_KEY, hash);
      return true;
    }
    return hash === stored;
  }

  /* ── Carregar defaults do content.json ── */
  let defaults = {};

  fetch('data/content.json')
    .then(function (r) { return r.ok ? r.json() : {}; })
    .then(function (data) { defaults = data; })
    .catch(function () { defaults = {}; });

  /* ── Sessão ──────────────────────────── */
  function isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  }
  function login() { sessionStorage.setItem(SESSION_KEY, '1'); }
  function logout() { sessionStorage.removeItem(SESSION_KEY); }

  /* ── Storage ─────────────────────────── */
  function getSaved() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
  function save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  /* ── Helpers ─────────────────────────── */
  function val(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }
  function setVal(id, value) {
    const el = document.getElementById(id);
    if (el && value !== undefined && value !== null) el.value = value;
  }
  function getDefault(path) {
    const keys = path.split('.');
    let result = defaults;
    for (const k of keys) {
      if (!result) return '';
      result = result[k];
    }
    return result || '';
  }

  /* ── Montar objeto de conteúdo ─────────── */
  function buildContent() {
    return {
      store: {
        name:      val('f-store-name')      || getDefault('store.name'),
        tagline:   val('f-store-tagline')   || getDefault('store.tagline'),
        phone:     val('f-store-phone')     || getDefault('store.phone'),
        email:     val('f-store-email')     || getDefault('store.email'),
        address:   val('f-store-address')   || getDefault('store.address'),
        whatsapp:  val('f-store-whatsapp')  || getDefault('store.whatsapp'),
        instagram: val('f-store-instagram') || getDefault('store.instagram'),
      },
      hero: {
        badge:         val('f-hero-badge')        || getDefault('hero.badge'),
        title:         val('f-hero-title')         || getDefault('hero.title'),
        subtitle:      val('f-hero-subtitle')      || getDefault('hero.subtitle'),
        cta_primary:   val('f-hero-cta-primary')  || getDefault('hero.cta_primary'),
        cta_secondary: val('f-hero-cta-secondary') || getDefault('hero.cta_secondary'),
        trust_1:       val('f-hero-trust1')        || getDefault('hero.trust_1'),
        trust_2:       val('f-hero-trust2')        || getDefault('hero.trust_2'),
        trust_3:       val('f-hero-trust3')        || getDefault('hero.trust_3'),
      },
      stats: {
        clientes:   val('f-stats-clientes')   || getDefault('stats.clientes'),
        anos:       val('f-stats-anos')       || getDefault('stats.anos'),
        cidades:    val('f-stats-cidades')    || getDefault('stats.cidades'),
        modelos:    val('f-stats-modelos')    || getDefault('stats.modelos'),
        avaliacao:  val('f-stats-avaliacao')  || getDefault('stats.avaliacao'),
      },
      collections: {
        title:    val('f-col-title')    || getDefault('collections.title'),
        subtitle: val('f-col-subtitle') || getDefault('collections.subtitle'),
        items: [
          {
            id: 1,
            name:        val('f-p1-name')  || getDefault('collections.items.0.name'),
            description: val('f-p1-desc')  || getDefault('collections.items.0.description'),
            price:       val('f-p1-price') || getDefault('collections.items.0.price'),
            badge:       val('f-p1-badge') || getDefault('collections.items.0.badge'),
            cta:         val('f-p1-cta')   || getDefault('collections.items.0.cta'),
            image: 'images/boot-classic.png',
          },
          {
            id: 2,
            name:        val('f-p2-name')  || getDefault('collections.items.1.name'),
            description: val('f-p2-desc')  || getDefault('collections.items.1.description'),
            price:       val('f-p2-price') || getDefault('collections.items.1.price'),
            badge:       val('f-p2-badge') || getDefault('collections.items.1.badge'),
            cta:         val('f-p2-cta')   || getDefault('collections.items.1.cta'),
            image: 'images/boot-western.png',
          },
          {
            id: 3,
            name:        val('f-p3-name')  || getDefault('collections.items.2.name'),
            description: val('f-p3-desc')  || getDefault('collections.items.2.description'),
            price:       val('f-p3-price') || getDefault('collections.items.2.price'),
            badge:       val('f-p3-badge') || getDefault('collections.items.2.badge'),
            cta:         val('f-p3-cta')   || getDefault('collections.items.2.cta'),
            image: 'images/boot-executive.png',
          },
        ],
      },
      services: {
        title:    val('f-svc-title')    || getDefault('services.title'),
        subtitle: val('f-svc-subtitle') || getDefault('services.subtitle'),
        items: [
          { icon: val('f-s1-icon') || getDefault('services.items.0.icon'), title: val('f-s1-title') || getDefault('services.items.0.title'), description: val('f-s1-desc') || getDefault('services.items.0.description') },
          { icon: val('f-s2-icon') || getDefault('services.items.1.icon'), title: val('f-s2-title') || getDefault('services.items.1.title'), description: val('f-s2-desc') || getDefault('services.items.1.description') },
          { icon: val('f-s3-icon') || getDefault('services.items.2.icon'), title: val('f-s3-title') || getDefault('services.items.2.title'), description: val('f-s3-desc') || getDefault('services.items.2.description') },
          { icon: val('f-s4-icon') || getDefault('services.items.3.icon'), title: val('f-s4-title') || getDefault('services.items.3.title'), description: val('f-s4-desc') || getDefault('services.items.3.description') },
        ],
      },
      testimonials: {
        title:    val('f-test-title')    || getDefault('testimonials.title'),
        subtitle: val('f-test-subtitle') || getDefault('testimonials.subtitle'),
        items: [
          { name: val('f-t1-name') || getDefault('testimonials.items.0.name'), role: val('f-t1-role') || getDefault('testimonials.items.0.role'), text: val('f-t1-text') || getDefault('testimonials.items.0.text'), avatar: val('f-t1-avatar') || getDefault('testimonials.items.0.avatar'), rating: 5 },
          { name: val('f-t2-name') || getDefault('testimonials.items.1.name'), role: val('f-t2-role') || getDefault('testimonials.items.1.role'), text: val('f-t2-text') || getDefault('testimonials.items.1.text'), avatar: val('f-t2-avatar') || getDefault('testimonials.items.1.avatar'), rating: 5 },
          { name: val('f-t3-name') || getDefault('testimonials.items.2.name'), role: val('f-t3-role') || getDefault('testimonials.items.2.role'), text: val('f-t3-text') || getDefault('testimonials.items.2.text'), avatar: val('f-t3-avatar') || getDefault('testimonials.items.2.avatar'), rating: 5 },
        ],
      },
      contact: {
        title:           val('f-contact-title')   || getDefault('contact.title'),
        subtitle:        val('f-contact-subtitle') || getDefault('contact.subtitle'),
        success_message: val('f-contact-success') || getDefault('contact.success_message'),
      },
      footer: {
        description: val('f-footer-desc') || getDefault('footer.description'),
        copyright:   val('f-footer-copy') || getDefault('footer.copyright'),
      },
    };
  }

  /* ── Popular formulário com dados salvos ── */
  function populateForms(data) {
    if (!data) return;
    const s = data.store || {};
    setVal('f-store-name',      s.name);
    setVal('f-store-tagline',   s.tagline);
    setVal('f-store-phone',     s.phone);
    setVal('f-store-whatsapp',  s.whatsapp);
    setVal('f-store-email',     s.email);
    setVal('f-store-instagram', s.instagram);
    setVal('f-store-address',   s.address);

    const h = data.hero || {};
    setVal('f-hero-badge',         h.badge);
    setVal('f-hero-title',         h.title);
    setVal('f-hero-subtitle',      h.subtitle);
    setVal('f-hero-cta-primary',   h.cta_primary);
    setVal('f-hero-cta-secondary', h.cta_secondary);
    setVal('f-hero-trust1',        h.trust_1);
    setVal('f-hero-trust2',        h.trust_2);
    setVal('f-hero-trust3',        h.trust_3);

    const st = data.stats || {};
    setVal('f-stats-clientes',  st.clientes);
    setVal('f-stats-anos',      st.anos);
    setVal('f-stats-cidades',   st.cidades);
    setVal('f-stats-modelos',   st.modelos);
    setVal('f-stats-avaliacao', st.avaliacao);

    const c = data.collections || {};
    setVal('f-col-title',    c.title);
    setVal('f-col-subtitle', c.subtitle);
    if (c.items) {
      setVal('f-p1-name',  c.items[0] && c.items[0].name);
      setVal('f-p1-price', c.items[0] && c.items[0].price);
      setVal('f-p1-badge', c.items[0] && c.items[0].badge);
      setVal('f-p1-cta',   c.items[0] && c.items[0].cta);
      setVal('f-p1-desc',  c.items[0] && c.items[0].description);
      setVal('f-p2-name',  c.items[1] && c.items[1].name);
      setVal('f-p2-price', c.items[1] && c.items[1].price);
      setVal('f-p2-badge', c.items[1] && c.items[1].badge);
      setVal('f-p2-cta',   c.items[1] && c.items[1].cta);
      setVal('f-p2-desc',  c.items[1] && c.items[1].description);
      setVal('f-p3-name',  c.items[2] && c.items[2].name);
      setVal('f-p3-price', c.items[2] && c.items[2].price);
      setVal('f-p3-badge', c.items[2] && c.items[2].badge);
      setVal('f-p3-cta',   c.items[2] && c.items[2].cta);
      setVal('f-p3-desc',  c.items[2] && c.items[2].description);
    }

    const sv = data.services || {};
    setVal('f-svc-title',    sv.title);
    setVal('f-svc-subtitle', sv.subtitle);
    if (sv.items) {
      setVal('f-s1-icon', sv.items[0] && sv.items[0].icon); setVal('f-s1-title', sv.items[0] && sv.items[0].title); setVal('f-s1-desc', sv.items[0] && sv.items[0].description);
      setVal('f-s2-icon', sv.items[1] && sv.items[1].icon); setVal('f-s2-title', sv.items[1] && sv.items[1].title); setVal('f-s2-desc', sv.items[1] && sv.items[1].description);
      setVal('f-s3-icon', sv.items[2] && sv.items[2].icon); setVal('f-s3-title', sv.items[2] && sv.items[2].title); setVal('f-s3-desc', sv.items[2] && sv.items[2].description);
      setVal('f-s4-icon', sv.items[3] && sv.items[3].icon); setVal('f-s4-title', sv.items[3] && sv.items[3].title); setVal('f-s4-desc', sv.items[3] && sv.items[3].description);
    }

    const t = data.testimonials || {};
    setVal('f-test-title',    t.title);
    setVal('f-test-subtitle', t.subtitle);
    if (t.items) {
      setVal('f-t1-name', t.items[0] && t.items[0].name); setVal('f-t1-role', t.items[0] && t.items[0].role); setVal('f-t1-text', t.items[0] && t.items[0].text); setVal('f-t1-avatar', t.items[0] && t.items[0].avatar);
      setVal('f-t2-name', t.items[1] && t.items[1].name); setVal('f-t2-role', t.items[1] && t.items[1].role); setVal('f-t2-text', t.items[1] && t.items[1].text); setVal('f-t2-avatar', t.items[1] && t.items[1].avatar);
      setVal('f-t3-name', t.items[2] && t.items[2].name); setVal('f-t3-role', t.items[2] && t.items[2].role); setVal('f-t3-text', t.items[2] && t.items[2].text); setVal('f-t3-avatar', t.items[2] && t.items[2].avatar);
    }

    const ct = data.contact || {};
    setVal('f-contact-title',   ct.title);
    setVal('f-contact-subtitle', ct.subtitle);
    setVal('f-contact-success', ct.success_message);

    const f = data.footer || {};
    setVal('f-footer-desc', f.description);
    setVal('f-footer-copy', f.copyright);
  }

  /* ── Inicializar ─────────────────────────── */
  function init() {
    if (isLoggedIn()) {
      showPanel();
    } else {
      showLogin();
    }
  }

  function showLogin() {
    document.getElementById('admin-login').classList.remove('hidden');
    document.getElementById('admin-panel').style.display = 'none';
    const passField = document.getElementById('login-pass');
    if (passField) passField.focus();
  }

  function showPanel() {
    document.getElementById('admin-login').classList.add('hidden');
    document.getElementById('admin-panel').style.display = 'flex';

    const saved = getSaved();
    if (saved) {
      populateForms(saved);
    } else {
      fetch('data/content.json')
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (data) { if (data) populateForms(data); })
        .catch(function () {});
    }
  }

  /* ── Eventos de login ────────────────────── */
  function attemptLogin() {
    const passField = document.getElementById('login-pass');
    const errorEl = document.getElementById('login-error');
    if (!passField || !errorEl) return;
    const inputVal = passField.value;
    passField.value = '';
    checkPassword(inputVal).then(function (ok) {
      if (ok) {
        login();
        errorEl.style.display = 'none';
        showPanel();
      } else {
        errorEl.style.display = 'block';
        passField.focus();
      }
    });
  }

  document.getElementById('btn-login').addEventListener('click', attemptLogin);
  document.getElementById('login-pass').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') attemptLogin();
  });

  document.getElementById('btn-logout').addEventListener('click', function () {
    logout();
    showLogin();
  });

  /* ── Navegação do painel ─────────────────── */
  const sectionTitles = {
    loja:         'Dados da Loja',
    hero:         'Seção Hero (Topo)',
    stats:        'Estatísticas',
    produtos:     'Produtos / Coleções',
    diferenciais: 'Diferenciais',
    depoimentos:  'Depoimentos',
    contato:      'Contato e Rodapé',
  };

  document.querySelectorAll('.admin-nav-item').forEach(function (item) {
    item.addEventListener('click', function () {
      const sectionId = this.getAttribute('data-section');

      // Atualiza nav
      document.querySelectorAll('.admin-nav-item').forEach(function (el) { el.classList.remove('active'); });
      this.classList.add('active');

      // Atualiza seções
      document.querySelectorAll('.editor-section').forEach(function (el) { el.classList.remove('active'); });
      const target = document.getElementById('section-' + sectionId);
      if (target) target.classList.add('active');

      // Atualiza título
      const titleEl = document.getElementById('admin-section-title');
      if (titleEl) titleEl.textContent = sectionTitles[sectionId] || sectionId;
    });
  });

  /* ── Salvar ──────────────────────────────── */
  document.getElementById('btn-save').addEventListener('click', function () {
    const content = buildContent();
    save(content);

    const indicator = document.getElementById('save-indicator');
    if (indicator) {
      indicator.style.display = 'inline';
      setTimeout(function () { indicator.style.display = 'none'; }, 3000);
    }

    // Flash no botão
    const btn = this;
    btn.textContent = '✅ Salvo!';
    setTimeout(function () { btn.textContent = '💾 Salvar Alterações'; }, 2000);
  });

  /* ── Atalho Ctrl+S ───────────────────────── */
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      document.getElementById('btn-save').click();
    }
  });

  /* ── Start ───────────────────────────────── */
  init();
})();
