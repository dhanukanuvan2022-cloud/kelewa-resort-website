(() => {
  'use strict';
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
    }));
  }

  const today = new Date();
  const toDateValue = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const checkin = document.querySelector('#checkin');
  const checkout = document.querySelector('#checkout');
  if (checkin && checkout) {
    const todayValue = toDateValue(today);
    checkin.min = todayValue;
    checkout.min = todayValue;
    checkin.addEventListener('change', () => {
      if (!checkin.value) return;
      const next = new Date(`${checkin.value}T12:00:00`);
      next.setDate(next.getDate() + 1);
      checkout.min = toDateValue(next);
      if (!checkout.value || checkout.value <= checkin.value) checkout.value = toDateValue(next);
    });
    checkout.addEventListener('change', () => {
      if (checkin.value && checkout.value && checkout.value <= checkin.value) {
        const next = new Date(`${checkin.value}T12:00:00`);
        next.setDate(next.getDate() + 1);
        checkout.value = toDateValue(next);
      }
    });
  }

  const form = document.querySelector('#booking-form');
  const error = document.querySelector('#form-error');
  if (form) form.addEventListener('submit', event => {
    event.preventDefault();
    if (error) error.textContent = '';
    if (!form.reportValidity()) return;
    const start = checkin.value;
    const end = checkout.value;
    if (!start || !end || end <= start) {
      if (error) error.textContent = 'Please choose a check-out date at least one day after check-in.';
      checkout.focus();
      return;
    }
    const name = document.querySelector('#guest-name').value.trim();
    if (!name) {
      document.querySelector('#guest-name').focus();
      return;
    }
    const message = document.querySelector('#guest-message').value.trim();
    const lines = [
      'Hello Kelewa Eco Resort! I would like to enquire about a stay.',
      '',
      `Name: ${name}`,
      `Check-in: ${start}`,
      `Check-out: ${end}`,
      `Guests: ${document.querySelector('#guests').value}`,
      `Room preference: ${document.querySelector('#room').value}`
    ];
    if (message) lines.push(`Message: ${message}`);
    lines.push('', 'Please let me know the availability and current rates. Thank you.');
    const whatsappUrl = `https://wa.me/94716868440?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  });

  const lightbox = document.querySelector('#lightbox');
  const lightboxImage = document.querySelector('#lightbox-image');
  const closeLightbox = document.querySelector('.lightbox-close');
  document.querySelectorAll('.gallery-item').forEach(item => item.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    const img = item.querySelector('img');
    lightboxImage.src = item.dataset.full || img.src;
    lightboxImage.alt = img.alt;
    if (typeof lightbox.showModal === 'function') lightbox.showModal();
  }));
  if (closeLightbox && lightbox) closeLightbox.addEventListener('click', () => lightbox.close());
  if (lightbox) lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('is-visible'));
})();
