(function () {
  "use strict";

  var data = window.__BRAND__ || {};
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };
  var escHTML = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "] failed:", e); }
  }

  var ICONS = {
    code: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
    layers: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
    compass: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>',
    mail: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z" opacity="0"></path><path d="M22 6c0-1.1-.9-2-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V6Z"></path><polyline points="22 6 12 13 2 6"></polyline></svg>',
    whatsapp: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.7.44 3.32 1.28 4.76L2 22l5.5-1.36a9.9 9.9 0 0 0 4.54 1.13h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 17.9c-1.44 0-2.85-.38-4.08-1.1l-.29-.17-2.9.72.77-2.83-.19-.29a8 8 0 0 1-1.22-4.32c0-4.42 3.6-8.02 8.03-8.02 2.14 0 4.15.84 5.66 2.35a7.95 7.95 0 0 1 2.35 5.67c0 4.43-3.6 8.03-8.03 8.03Zm4.4-6.02c-.24-.12-1.43-.7-1.65-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.29.18-.53.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.35-1.67-.14-.24-.02-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z"></path></svg>',
    link: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>'
  };

  function mountServices() {
    var target = $("[data-services]");
    if (!target || target.children.length > 0 || !data.services) return;
    target.innerHTML = data.services.map(function (s) {
      return '<article class="glass-card reveal">' +
        '<div class="card-icon">' + (ICONS[s.icon] || "") + '</div>' +
        '<h3 class="card-title">' + escHTML(s.title) + '</h3>' +
        '<p class="card-desc">' + escHTML(s.desc) + '</p>' +
        '</article>';
    }).join("");
  }

  function mountProcess() {
    var target = $("[data-process]");
    if (!target || target.children.length > 0 || !data.process) return;
    target.innerHTML = data.process.map(function (p) {
      return '<div class="process-item reveal">' +
        '<div class="process-num">' + escHTML(p.n) + '</div>' +
        '<h3 class="process-title">' + escHTML(p.title) + '</h3>' +
        '<p class="process-desc">' + escHTML(p.desc) + '</p>' +
        '</div>';
    }).join("");
  }

  function mountContact() {
    var target = $("[data-contact-links]");
    if (!target || target.children.length > 0 || !data.contact) return;
    var c = data.contact;
    var items = [];
    items.push('<a class="contact-link" href="mailto:' + escHTML(c.email) + '"><span class="ico">' + ICONS.mail + '</span>' + escHTML(c.email) + '</a>');
    if (c.whatsapp) {
      items.push('<a class="contact-link" href="https://wa.me/' + escHTML(c.whatsapp) + '" target="_blank" rel="noopener"><span class="ico">' + ICONS.whatsapp + '</span>WhatsApp</a>');
    }
    if (c.portfolio) {
      items.push('<a class="contact-link" href="' + escHTML(c.portfolio) + '" target="_blank" rel="noopener"><span class="ico">' + ICONS.link + '</span>Ver portfolio</a>');
    }
    target.innerHTML = items.join("");
  }

  function initNavScroll() {
    var nav = $(".nav");
    if (!nav) return;
    var onScroll = function () {
      if (window.scrollY > 12) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initSmoothAnchors() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var navOffset = 76;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - navOffset,
        behavior: reduced ? "auto" : "smooth"
      });
    });
  }

  function initReveals() {
    var els = $$(".reveal");
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -2% 0px" });
    els.forEach(function (el) { io.observe(el); });

    setTimeout(function () {
      $$(".reveal:not(.is-visible)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-visible");
      });
    }, 6000);
  }

  function initMouseGradient() {
    if (!fineHover) return;
    var hero = $(".hero");
    if (!hero) return;
    var raf = null, mx = 50, my = 30;
    document.documentElement.style.setProperty("--mx", mx + "%");
    document.documentElement.style.setProperty("--my", my + "%");
    hero.addEventListener("mousemove", function (e) {
      var rect = hero.getBoundingClientRect();
      mx = ((e.clientX - rect.left) / rect.width) * 100;
      my = ((e.clientY - rect.top) / rect.height) * 100;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        document.documentElement.style.setProperty("--mx", mx + "%");
        document.documentElement.style.setProperty("--my", my + "%");
        raf = null;
      });
    });
  }

  function initMagnetic() {
    if (!fineHover) return;
    $$(".btn-primary, .btn-glass").forEach(function (btn) {
      if (btn.dataset.magneticBound) return;
      btn.dataset.magneticBound = "1";
      var strength = 0.25;
      btn.addEventListener("mousemove", function (e) {
        var rect = btn.getBoundingClientRect();
        var x = (e.clientX - rect.left - rect.width / 2) * strength;
        var y = (e.clientY - rect.top - rect.height / 2) * strength;
        btn.style.transform = "translate(" + x + "px," + y + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
      });
    });
  }

  function initYear() {
    var el = $("[data-year]");
    if (el) el.textContent = data.year || new Date().getFullYear();
  }

  function initContactForm() {
    var form = $("#contact-form");
    if (!form) return;
    var status = $(".form-status", form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var name = $("#f-name", form).value.trim();
      var email = $("#f-email", form).value.trim();
      var message = $("#f-message", form).value.trim();
      var to = (data.contact && data.contact.email) || "";
      var subject = "Proyecto — " + name;
      var body = message + "\n\n— " + name + " (" + email + ")";
      var mailto = "mailto:" + encodeURIComponent(to) +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      window.location.href = mailto;
      if (status) status.textContent = "Abriendo tu cliente de correo…";
    });
  }

  function boot() {
    safe(mountServices, "mountServices");
    safe(mountProcess, "mountProcess");
    safe(mountContact, "mountContact");
    safe(initYear, "initYear");
    safe(initNavScroll, "initNavScroll");
    safe(initSmoothAnchors, "initSmoothAnchors");
    safe(initReveals, "initReveals");
    safe(initMouseGradient, "initMouseGradient");
    safe(initMagnetic, "initMagnetic");
    safe(initContactForm, "initContactForm");
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
