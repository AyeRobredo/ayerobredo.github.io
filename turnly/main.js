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

  function mountRows() {
    var target = $("[data-rows]");
    if (!target || target.children.length > 0 || !data.projects) return;
    target.innerHTML = data.projects.map(function (p) {
      return '<div class="row reveal">' +
        '<div class="row-head"><span class="row-num">' + escHTML(p.n) + '</span><h3 class="row-title">' + escHTML(p.title) + '</h3></div>' +
        '<p class="row-desc">' + escHTML(p.desc) + '</p>' +
        '</div>';
    }).join("");
    $$(".row", target).forEach(function (row) {
      row.addEventListener("click", function () { row.classList.toggle("is-open"); });
    });
  }

  function mountStats() {
    var target = $("[data-stats]");
    if (!target || target.children.length > 0 || !data.stats) return;
    target.innerHTML = data.stats.map(function (s) {
      return '<div class="reveal"><div class="stat-value" data-count-to="' + s.value + '" data-suffix="' + escHTML(s.suffix) + '">0' + escHTML(s.suffix) + '</div><p class="stat-label">' + escHTML(s.label) + '</p></div>';
    }).join("");
  }

  function mountPricing() {
    var target = $("[data-pricing]");
    if (!target || target.children.length > 0 || !data.pricing) return;
    target.innerHTML = data.pricing.map(function (p) {
      return '<div class="price-card reveal">' +
        '<div class="price-name">' + escHTML(p.name) + '</div>' +
        '<div class="price-value">' + escHTML(p.price) + '</div>' +
        '<p class="price-desc">' + escHTML(p.desc) + '</p>' +
        '<div class="price-features">' + p.features.map(function (f) { return '<span>' + escHTML(f) + '</span>'; }).join("") + '</div>' +
        '</div>';
    }).join("");
  }

  function initCountUp() {
    var els = $$("[data-count-to]");
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        var el = entry.target;
        var target = parseFloat(el.dataset.countTo);
        var suffix = el.dataset.suffix || "";
        if (reduced) { el.textContent = target + suffix; return; }
        var start = 0;
        var duration = 1200;
        var startTime = null;
        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var value = Math.round(start + (target - start) * progress);
          el.textContent = value + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
    setTimeout(function () {
      els.forEach(function (el) {
        if (el.textContent.indexOf("0") === 0 && el.getBoundingClientRect().top < window.innerHeight) {
          el.textContent = el.dataset.countTo + (el.dataset.suffix || "");
        }
      });
    }, 6000);
  }

  function initReveals() {
    var els = $$(".reveal");
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
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
    var raf = null;
    hero.addEventListener("mousemove", function (e) {
      var rect = hero.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        document.documentElement.style.setProperty("--mx", x + "%");
        document.documentElement.style.setProperty("--my", y + "%");
        raf = null;
      });
    });
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
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 24, behavior: reduced ? "auto" : "smooth" });
    });
  }

  function initYear() {
    var el = $("[data-year]");
    if (el) el.textContent = data.year || new Date().getFullYear();
  }

  function initContactLink() {
    var el = $("[data-email]");
    if (el && data.contact) { el.textContent = data.contact.email; el.setAttribute("href", "mailto:" + data.contact.email); }
  }

  function boot() {
    safe(mountRows, "mountRows");
    safe(mountStats, "mountStats");
    safe(mountPricing, "mountPricing");
    safe(initYear, "initYear");
    safe(initContactLink, "initContactLink");
    safe(initSmoothAnchors, "initSmoothAnchors");
    safe(initReveals, "initReveals");
    safe(initCountUp, "initCountUp");
    safe(initMouseGradient, "initMouseGradient");
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
