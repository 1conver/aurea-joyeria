/**
 * ÁUREA Atelier - Sistema de Iconografía Vectorial Minimalista
 * 100% SVG nativo, libre de emojis, con trazos finos de 1.2px a 1.5px.
 */

const ICONS = {
  // Bolsa de compras / Carrito
  bag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-bag"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  
  // Búsqueda
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  
  // Cerrar / Cancelar
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-close"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  
  // Flechas y chevrons
  chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-chevron"><path d="m6 9 6 6 6-6"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-chevron"><path d="m9 18 6-6-6-6"/></svg>`,
  arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-arrow"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  
  // Filtros
  filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-filter"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
  
  // Seguridad y Garantía
  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-shield"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  certificate: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-cert"><circle cx="12" cy="8" r="6"/><path d="M15.4 13.5 17 22l-5-3-5 3 1.6-8.5"/></svg>`,
  
  // Envío / Camión
  shipping: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-shipping"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5.28a2 2 0 0 0-.59-1.42L18.7 7.59A2 2 0 0 0 17.28 7H14v11h1"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>`,
  
  // Medidas / Regla
  ruler: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-ruler"><path d="m21.73 18.27-16-16a2 2 0 0 0-2.83 2.83l16 16a2 2 0 0 0 2.83-2.83Z"/><path d="m7.5 10.5 2-2"/><path d="m10.5 13.5 2-2"/><path d="m13.5 16.5 2-2"/></svg>`,
  
  // Check / Aprobado
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" class="icon icon-check"><polyline points="20 6 9 17 4 12"/></svg>`,
  
  // Menos y Más
  minus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-minus"><path d="M5 12h14"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
  
  // Tarjeta de crédito
  creditCard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-card"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`,
  
  // Transferencia bancaria
  bank: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-bank"><path d="m2 9 10-5 10 5"/><path d="M6 10v7"/><path d="M10 10v7"/><path d="M14 10v7"/><path d="M18 10v7"/><path d="M2 19h20"/></svg>`,
  
  // Vista Rápida / Ojo
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-eye"><path d="2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,

  // Logos de medios de pago vectorizados elegantes
  badgeVisa: `<svg viewBox="0 0 48 32" fill="none" class="badge-brand"><rect width="48" height="32" rx="4" fill="#1A1918"/><path d="M19.2 21h-2.7l1.7-10.5h2.7L19.2 21Zm7.9-10.2c-.5-.2-1.3-.4-2.3-.4-2.5 0-4.3 1.3-4.3 3.3 0 1.4 1.3 2.2 2.2 2.7.9.4 1.3.7 1.3 1.1 0 .6-.7.9-1.4.9-.9 0-1.4-.1-2.2-.5l-.3-.1-.3 2c.6.3 1.6.5 2.7.5 2.6 0 4.4-1.3 4.4-3.3 0-1.1-.7-2-2.3-2.7-.9-.5-1.5-.8-1.5-1.3 0-.4.5-.8 1.5-.8.8 0 1.5.2 1.9.4l.3.1.4-2.2Zm7.6 6.8.9-2.5.5 2.5h-1.4Zm2.7 3.4-2.2-10.5h-2.1c-.6 0-1.2.2-1.4.7l-4 9.8h2.8l.6-1.5h3.4l.3 1.5h2.6Zm-16.1-10.5-2.6 7.2-.3-1.4c-.5-1.7-2.1-3.6-3.8-4.5l2.5 9.2h2.8l4.2-10.5h-2.8Z" fill="#F9F6F0"/></svg>`,
  
  badgeMastercard: `<svg viewBox="0 0 48 32" fill="none" class="badge-brand"><rect width="48" height="32" rx="4" fill="#1A1918"/><circle cx="20" cy="16" r="7" fill="#C5A880" fill-opacity="0.85"/><circle cx="28" cy="16" r="7" fill="#D9C3A5" fill-opacity="0.85"/></svg>`,
  
  badgeAmex: `<svg viewBox="0 0 48 32" fill="none" class="badge-brand"><rect width="48" height="32" rx="4" fill="#1A1918"/><text x="24" y="19" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="700" fill="#E8E1D5" text-anchor="middle" letter-spacing="1">AMEX</text></svg>`,
  
  // Medios de pago y badges
  badgeMercadoPago: `<svg viewBox="0 0 48 32" fill="none" class="badge-brand"><rect width="48" height="32" rx="4" fill="#1A1918"/><path d="M16 17.5c.8-1.8 2.5-3 4.5-3 1.4 0 2.6.6 3.5 1.5.9-.9 2.1-1.5 3.5-1.5 2 0 3.7 1.2 4.5 3" stroke="#C5A880" stroke-width="1.8" stroke-linecap="round"/><circle cx="20" cy="17" r="1.5" fill="#F9F6F0"/><circle cx="28" cy="17" r="1.5" fill="#F9F6F0"/></svg>`,

  // Iconos de Joyería & Boutique (100% Vectoriales, Cero Emojis)
  diamond: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-diamond"><path d="M6 3h12l4 6-10 12L2 9z"/><path d="M11 3 8 9l4 12 4-12-3-6"/><path d="M2 9h20"/></svg>`,

  sparkle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" class="icon icon-sparkle"><path d="m12 3-1.9 6.1L4 11l6.1 1.9L12 19l1.9-6.1L20 11l-6.1-1.9z"/></svg>`,

  gift: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-gift"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.5 4.5 0 0 1 12 7.5a4.5 4.5 0 0 1 4.5-4.5 2.5 2.5 0 0 1 0 5"/></svg>`,

  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,

  tag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tag"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>`
};

function getIcon(name) {
  return ICONS[name] || "";
}

function initIcons(container = document) {
  const iconHolders = container.querySelectorAll('[data-icon]');
  iconHolders.forEach(holder => {
    const iconName = holder.getAttribute('data-icon');
    if (ICONS[iconName]) {
      holder.innerHTML = ICONS[iconName];
    }
  });
}

window.ICONS = ICONS;
window.getIcon = getIcon;
window.initIcons = initIcons;
