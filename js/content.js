/*
 * content.js — Carrega conteúdo editável do localStorage
 * O dono edita pelo admin.html e salva no localStorage.
 * Esta página lê e aplica automaticamente.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'botasrei_content';

  function getStoredContent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function getNestedValue(obj, path) {
    const keys = path.split('.');
    let result = obj;
    for (const k of keys) {
      if (result === null || result === undefined) return undefined;
      // suporte a índices de array: items.0.name
      result = result[k];
    }
    return result;
  }

  function applyContent(content) {
    if (!content) return;
    document.querySelectorAll('[data-content]').forEach(function (el) {
      const key = el.getAttribute('data-content');
      const value = getNestedValue(content, key);
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        el.textContent = String(value);
      }
    });

    // Atualiza WhatsApp links
    const whatsapp = getNestedValue(content, 'store.whatsapp');
    if (whatsapp) {
      const msg = encodeURIComponent('Olá! Vi o site da Botas Rei e quero saber mais sobre os produtos.');
      const url = 'https://wa.me/' + whatsapp + '?text=' + msg;
      const links = document.querySelectorAll('#hero-whatsapp, #contact-whatsapp, #whatsapp-float');
      links.forEach(function (link) {
        const product = link.getAttribute('data-product');
        if (product) {
          const productMsg = encodeURIComponent('Olá! Tenho interesse na Bota ' + product + '. Pode me ajudar?');
          link.href = 'https://wa.me/' + whatsapp + '?text=' + productMsg;
        } else {
          link.href = url;
        }
      });
    }

    // Atualiza título da página
    const storeName = getNestedValue(content, 'store.name');
    if (storeName) {
      document.title = storeName + ' — ' + (getNestedValue(content, 'store.tagline') || 'Botas Premium');
    }
  }

  function loadDefaultWhatsApp() {
    const defaultNumber = '5516991234567';
    const msg = encodeURIComponent('Olá! Vi o site da Botas Rei e quero saber mais sobre os produtos.');
    const url = 'https://wa.me/' + defaultNumber + '?text=' + msg;
    const links = document.querySelectorAll('#hero-whatsapp, #contact-whatsapp, #whatsapp-float');
    links.forEach(function (link) { link.href = url; });
  }

  const stored = getStoredContent();
  if (stored) {
    applyContent(stored);
  } else {
    loadDefaultWhatsApp();
    // Tenta carregar do content.json como fallback
    if (typeof fetch !== 'undefined') {
      fetch('data/content.json')
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (data) {
          if (data) applyContent(data);
        })
        .catch(function () { /* ignora erros de fetch */ });
    }
  }

  // Expõe para o admin
  window.SiteContent = {
    KEY: STORAGE_KEY,
    get: getStoredContent,
    getNestedValue: getNestedValue,
  };
})();
