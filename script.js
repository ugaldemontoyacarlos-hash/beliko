(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');

  // ---- Theme toggle ----
  var themeBtn = document.querySelector('.theme-toggle');
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function isDark() {
    var t = root.dataset.theme;
    return t ? t === 'dark' : darkQuery.matches;
  }
  function syncThemeLabel() {
    themeBtn.setAttribute('aria-label', isDark() ? 'Switch to light theme' : 'Switch to dark theme');
  }
  themeBtn.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('beliko-theme', next); } catch (e) {}
    syncThemeLabel();
  });
  darkQuery.addEventListener('change', syncThemeLabel);
  syncThemeLabel();

  // ---- Mobile menu ----
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');

  function setMenu(open) {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    toggle.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  // ---- Header shadow + active nav link ----
  var header = document.querySelector('.site-header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (link) {
      var target = document.querySelector(link.getAttribute('href'));
      if (target) sectionObserver.observe(target);
    });
  }

  // ---- Reveal on scroll (staggered within each group) ----
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var siblings = Array.prototype.slice.call(entry.target.parentElement.children);
        entry.target.style.transitionDelay = (siblings.indexOf(entry.target) * 60) + 'ms';
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // ---- Pricing billing toggle ----
  var billingBtns = document.querySelectorAll('.billing-opt');
  var amounts = document.querySelectorAll('.amount');
  billingBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var period = btn.dataset.billing;
      billingBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      amounts.forEach(function (a) { a.textContent = '$' + a.dataset[period]; });
    });
  });

  // ---- Signup form ----
  var form = document.querySelector('.signup');
  var email = document.getElementById('email');
  var msg = document.getElementById('email-msg');
  var submitBtn = form.querySelector('button[type="submit"]');

  function showError(text) {
    email.setAttribute('aria-invalid', 'true');
    msg.className = 'form-msg error';
    msg.textContent = text;
  }
  email.addEventListener('input', function () {
    if (email.getAttribute('aria-invalid') === 'true' && email.validity.valid) {
      email.removeAttribute('aria-invalid');
      msg.textContent = '';
    }
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!email.value.trim()) return showError('Please enter your work email to get started.'), email.focus();
    if (!email.validity.valid) return showError('That email looks incomplete. Check it reads like name@company.com.'), email.focus();

    email.removeAttribute('aria-invalid');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    // Demo only: no backend is wired up yet.
    setTimeout(function () {
      msg.className = 'form-msg success';
      msg.textContent = "You're on the list! Check " + email.value.trim() + ' for your invite.';
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Get started';
    }, 700);
  });

  // ---- Footer year ----
  document.getElementById('year').textContent = new Date().getFullYear();
})();
