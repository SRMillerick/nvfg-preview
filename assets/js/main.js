/* ============================================================================
   NAPA VALLEY FLY GUIDES — site behaviour
   Vanilla JS. No dependencies. Progressive enhancement only.
   ========================================================================== */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- header */
  const header = $('.site-header');
  if (header) {
    const onScroll = () => {
      const solid = window.scrollY > 64;
      header.classList.toggle('is-stuck', solid);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------- drawer */
  const burger = $('.burger');
  const drawer = $('#nav-drawer');
  if (burger && drawer) {
    const setOpen = (open) => {
      burger.setAttribute('aria-expanded', String(open));
      drawer.classList.toggle('is-open', open);
      drawer.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('nav-open', open);
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    burger.addEventListener('click', () => setOpen(burger.getAttribute('aria-expanded') !== 'true'));
    $$('a', drawer).forEach(a => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) { setOpen(false); burger.focus(); }
    });
    // reset when resizing back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 980 && drawer.classList.contains('is-open')) setOpen(false);
    });
  }

  /* --------------------------------------------------------------- reveals */
  const reveals = $$('.reveal');
  if (reveals.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      reveals.forEach(el => el.classList.add('is-in'));
    } else {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      reveals.forEach(el => io.observe(el));
    }
  }

  /* ------------------------------------------------------------- accordion */
  $$('.faq__q').forEach(btn => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      // close siblings for a tidy single-open accordion
      const group = btn.closest('.faq');
      if (group) {
        $$('.faq__q[aria-expanded="true"]', group).forEach(other => {
          if (other !== btn) {
            other.setAttribute('aria-expanded', 'false');
            const p = document.getElementById(other.getAttribute('aria-controls'));
            if (p) p.style.height = '0px';
          }
        });
      }
      btn.setAttribute('aria-expanded', String(!isOpen));
      panel.style.height = isOpen ? '0px' : panel.scrollHeight + 'px';
    });
  });
  // keep open panels sized correctly on resize
  window.addEventListener('resize', () => {
    $$('.faq__q[aria-expanded="true"]').forEach(btn => {
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (panel) panel.style.height = panel.scrollHeight + 'px';
    });
  });

  /* ----------------------------------------------------------------- films */
  // Click-to-load: keeps the page light and avoids third-party cookies up front.
  $$('[data-video]').forEach(el => {
    const activate = () => {
      const id = el.getAttribute('data-video');
      if (!id || el.dataset.loaded) return;
      el.dataset.loaded = '1';
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + id +
                   '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
      iframe.title = el.getAttribute('data-video-title') || 'Video';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.loading = 'lazy';
      el.appendChild(iframe);
    };
    el.addEventListener('click', activate);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
    });
  });

  /* -------------------------------------------------------------- lightbox */
  const figures = $$('.masonry figure');
  if (figures.length) {
    const box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Photo viewer');
    box.innerHTML =
      '<button class="lightbox__close" aria-label="Close photo viewer">' +
        '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
      '</button>' +
      '<button class="lightbox__nav lightbox__nav--prev" aria-label="Previous photo">' +
        '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 19l-7-7 7-7"/></svg>' +
      '</button>' +
      '<button class="lightbox__nav lightbox__nav--next" aria-label="Next photo">' +
        '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 5l7 7-7 7"/></svg>' +
      '</button>' +
      '<img alt="">' +
      '<p class="lightbox__cap"></p>';
    document.body.appendChild(box);

    const imgEl  = $('img', box);
    const capEl  = $('.lightbox__cap', box);
    const items  = figures.map(f => {
      const img = $('img', f);
      return { src: img.getAttribute('data-full') || img.src, alt: img.alt, cap: ($('figcaption', f) || {}).textContent || '' };
    });
    let index = 0;
    let lastFocus = null;

    const show = (i) => {
      index = (i + items.length) % items.length;
      const item = items[index];
      imgEl.src = item.src;
      imgEl.alt = item.alt || '';
      capEl.textContent = item.cap ? item.cap + '  ·  ' + (index + 1) + ' / ' + items.length
                                   : (index + 1) + ' / ' + items.length;
    };
    const open = (i) => {
      lastFocus = document.activeElement;
      show(i);
      box.classList.add('is-open');
      document.body.classList.add('nav-open');
      $('.lightbox__close', box).focus();
    };
    const close = () => {
      box.classList.remove('is-open');
      document.body.classList.remove('nav-open');
      if (lastFocus) lastFocus.focus();
    };

    figures.forEach((fig, i) => {
      fig.setAttribute('tabindex', '0');
      fig.setAttribute('role', 'button');
      fig.setAttribute('aria-label', 'View photo ' + (i + 1) + ' of ' + figures.length);
      fig.addEventListener('click', () => open(i));
      fig.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });

    $('.lightbox__close', box).addEventListener('click', close);
    $('.lightbox__nav--prev', box).addEventListener('click', (e) => { e.stopPropagation(); show(index - 1); });
    $('.lightbox__nav--next', box).addEventListener('click', (e) => { e.stopPropagation(); show(index + 1); });
    box.addEventListener('click', (e) => { if (e.target === box) close(); });
    document.addEventListener('keydown', (e) => {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });

    // swipe support
    let startX = null;
    box.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 55) show(index + (dx < 0 ? 1 : -1));
      startX = null;
    });
  }

  /* ------------------------------------------------------------ inline form */
  const form = $('form[data-demo-form]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = $('[data-form-status]', form);
      if (!note) return;
      note.textContent = 'This is a design preview — the form is not connected yet. Reach Richard directly at 707-294-4738.';
      note.style.color = 'var(--brass-2)';
    });
  }

  /* ------------------------------------------------------------ footer year */
  $$('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });
})();
