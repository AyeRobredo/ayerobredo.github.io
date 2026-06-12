/*!
* Ayelén Robredo — Portfolio
* Vanilla JS, sin dependencias externas (IIFE pattern)
*/
(function () {
  "use strict";

  function safe(fn, name) {
    try {
      fn();
    } catch (e) {
      console.warn("[" + name + "]", e);
    }
  }

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------
   * Navigation: scroll state, mobile toggle, active link
   * ------------------------------------------------------------- */
  function initNav() {
    var nav = document.querySelector("[data-nav]");
    var toggle = document.querySelector("[data-nav-toggle]");
    var links = document.querySelector("[data-nav-links]");
    if (!nav) return;

    var onScroll = function () {
      if (window.scrollY > 40) {
        nav.classList.add("is-scrolled");
      } else {
        nav.classList.remove("is-scrolled");
      }
    };
    onScroll();
    document.addEventListener("scroll", onScroll, { passive: true });

    if (toggle && links) {
      toggle.addEventListener("click", function () {
        var isOpen = links.classList.toggle("is-open");
        toggle.classList.toggle("is-active", isOpen);
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });

      links.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          links.classList.remove("is-open");
          toggle.classList.remove("is-active");
        });
      });
    }
  }

  /* ---------------------------------------------------------------
   * Smooth scroll for in-page anchors (native, with nav offset)
   * ------------------------------------------------------------- */
  function initSmoothScroll() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id.length < 2) return;

      var target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      var navOffset = 84;
      var top = target.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({
        top: Math.max(top, 0),
        behavior: reduced ? "auto" : "smooth",
      });
    });
  }

  /* ---------------------------------------------------------------
   * Highlight active nav link based on scroll position
   * ------------------------------------------------------------- */
  function initActiveLinks() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".js-nav-link[href^='#']"));
    var sections = links
      .map(function (a) {
        var id = a.getAttribute("href");
        var el = document.querySelector(id);
        return el ? { link: a, el: el } : null;
      })
      .filter(Boolean);

    if (!sections.length) return;

    var onScroll = function () {
      var scrollPos = window.scrollY + 120;
      var current = sections[0];
      sections.forEach(function (s) {
        if (s.el.offsetTop <= scrollPos) current = s;
      });
      links.forEach(function (a) {
        a.classList.toggle("is-active", a === current.link);
      });
    };

    onScroll();
    document.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------
   * Reveal-on-scroll
   * ------------------------------------------------------------- */
  function initReveals() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -2% 0px" }
    );

    items.forEach(function (el) { io.observe(el); });

    // Safety net: reveal anything still hidden after 6s
    setTimeout(function () {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("is-visible");
        }
      });
    }, 6000);
  }

  /* ---------------------------------------------------------------
   * Mouse-reactive hero mesh gradient
   * ------------------------------------------------------------- */
  function initMesh() {
    var mesh = document.querySelector("[data-mesh]");
    if (!mesh || matchMedia("(hover: none)").matches) return;

    var hero = mesh.closest(".hero");
    hero.addEventListener("mousemove", function (e) {
      var rect = hero.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      mesh.style.setProperty("--mx", x + "%");
      mesh.style.setProperty("--my", y + "%");
      mesh.style.transform = "translate3d(" + (x - 50) * 0.06 + "px, " + (y - 50) * 0.06 + "px, 0)";
    });
  }

  /* ---------------------------------------------------------------
   * Scroll-to-top button
   * ------------------------------------------------------------- */
  function initScrollTop() {
    var btn = document.querySelector("[data-scroll-top]");
    if (!btn) return;

    var onScroll = function () {
      btn.classList.toggle("is-visible", window.scrollY > 400);
    };
    onScroll();
    document.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------
   * Contact form (Formspree via fetch, inline status)
   * ------------------------------------------------------------- */
  function initContactForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;

    var status = form.querySelector("[data-form-status]");
    var button = form.querySelector("#sendMessageButton");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      var formData = new FormData(form);
      button.setAttribute("disabled", "true");
      if (status) {
        status.textContent = "Enviando...";
        status.className = "form-status";
      }

      fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            if (status) {
              status.textContent = "¡Gracias! Tu mensaje fue enviado, te responderé a la brevedad.";
              status.className = "form-status success";
            }
            form.reset();
          } else {
            throw new Error("bad response");
          }
        })
        .catch(function () {
          if (status) {
            status.textContent = "Hubo un problema al enviar el mensaje. Probá de nuevo o escribime por email.";
            status.className = "form-status error";
          }
        })
        .finally(function () {
          button.removeAttribute("disabled");
        });
    });
  }

  /* ---------------------------------------------------------------
   * Footer year
   * ------------------------------------------------------------- */
  function initYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }

  function boot() {
    safe(initNav, "initNav");
    safe(initSmoothScroll, "initSmoothScroll");
    safe(initActiveLinks, "initActiveLinks");
    safe(initReveals, "initReveals");
    safe(initMesh, "initMesh");
    safe(initScrollTop, "initScrollTop");
    safe(initContactForm, "initContactForm");
    safe(initYear, "initYear");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
