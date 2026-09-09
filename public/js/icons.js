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

  // Logos de medios de pago vectorizados oficiales (Cápsulas Boutique Blancas con Borde Rosa Pastel)
  badgeVisa: `<svg viewBox="0 0 48 32" width="48" height="32" fill="none" class="badge-brand" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="32" rx="4" fill="#FFFFFF" stroke="#F4D3DC" stroke-width="1.2"/><g transform="translate(8.4, 0.4) scale(1.3)" fill="#1434CB"><path d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102z"/><path d="M10.235 8.262h2.085l-1.603 7.496H8.632z"/><path d="M17.145 13.311c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564"/><path d="M22.206 15.758H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815z"/></g></svg>`,
  
  badgeMastercard: `<svg viewBox="0 0 48 32" width="48" height="32" fill="none" class="badge-brand" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="32" rx="4" fill="#FFFFFF" stroke="#F4D3DC" stroke-width="1.2"/><circle cx="20" cy="16" r="7" fill="#EB001B" fill-opacity="0.88"/><circle cx="28" cy="16" r="7" fill="#F79E1B" fill-opacity="0.88"/></svg>`,
  
  badgeAmex: `<svg viewBox="0 0 48 32" width="48" height="32" fill="none" class="badge-brand" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="32" rx="4" fill="#FFFFFF" stroke="#F4D3DC" stroke-width="1.2"/><rect x="6" y="6.5" width="36" height="19" rx="2.5" fill="#006FCF"/><text x="24" y="19" font-family="'DM Sans', -apple-system, sans-serif" font-size="7.5" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">AMEX</text></svg>`,
  
  // Medios de pago y badges
  badgeMercadoPago: `<svg viewBox="0 0 48 32" width="48" height="32" fill="none" class="badge-brand" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="32" rx="4" fill="#FFFFFF" stroke="#F4D3DC" stroke-width="1.2"/><g transform="translate(24, 16) scale(0.60) translate(-24, -24)" stroke="#009EE3" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M40.9763,30.6458a5.2763,5.2763,0,0,1-2.1726-2.0337,54.6611,54.6611,0,0,1-8.7476,1.0169c-3.701,0-6.6869-.1757-5.4673-3.6243s4.4579-10.5561,5.5934-11.986,2.6859-3.239,3.4486-3.1542c.9463.1051,2.7152,1.2834,2.5166,2.0333-.1892.715-1.1287,2.2774-2.7471,1.1649"/><path d="M32.8639,14.8392a8.1339,8.1339,0,0,1,1.2926-1.6406"/><path d="M35.9393,13.4064c.5677-.1443,1.64.5818,1.035,1.3272a4.7779,4.7779,0,0,1-2.8178,1.3248c-.6248.0556-2.7967-.021-2.7967-.021-.9252,1.5981-.7149,4.0374-.7991,6.1822a9.3461,9.3461,0,0,1-.8831,3.6589c3.7009-1.7243,10.0093-3.028,13.8224-2.3972"/><path d="M7.0237,30.6458a5.2763,5.2763,0,0,0,2.1726-2.0337,54.6611,54.6611,0,0,0,8.7476,1.0169c3.701,0,6.6869-.1757,5.4673-3.6243s-4.4579-10.5561-5.5934-11.986-2.6859-3.239-3.4486-3.1542c-.9463.1051-2.7152,1.2834-2.5166,2.0333.1892.715,1.1287,2.2774,2.7471,1.1649"/><path d="M15.1361,14.8392a8.1339,8.1339,0,0,0-1.2926-1.6406"/><path d="M12.0607,13.4064c-.5677-.1443-1.6405.5818-1.035,1.3272a4.7779,4.7779,0,0,0,2.8178,1.3248c.6248.0556,2.7967-.021,2.7967-.021.9252,1.5981.7149,4.0374.7991,6.1822a9.3461,9.3461,0,0,0,.8831,3.6589C14.6215,24.1542,8.3131,22.8505,4.5,23.4813"/><path d="M32.1812,11.742a27.5655,27.5655,0,0,0-16.3641.0006"/><path d="M10.9168,13.9894C6.9758,16.46,4.5,20.03,4.5,24c0,7.4558,8.73,13.5,19.5,13.5S43.5,31.4558,43.5,24c0-3.9705-2.4759-7.5407-6.4172-10.0109"/></g></svg>`,

  // Iconos de Joyería & Boutique (100% Vectoriales, Cero Emojis)
  diamond: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-diamond"><path d="M6 3h12l4 6-10 12L2 9z"/><path d="M11 3 8 9l4 12 4-12-3-6"/><path d="M2 9h20"/></svg>`,

  sparkle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" class="icon icon-sparkle"><path d="m12 3-1.9 6.1L4 11l6.1 1.9L12 19l1.9-6.1L20 11l-6.1-1.9z"/></svg>`,

  gift: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-gift"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.5 4.5 0 0 1 12 7.5a4.5 4.5 0 0 1 4.5-4.5 2.5 2.5 0 0 1 0 5"/></svg>`,

  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,

  tag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tag"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>`,

  // Redes Sociales Minimalistas
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="icon icon-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`,

  whatsapp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="icon icon-whatsapp"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><path d="M9.5 9.5c.3-.3.8-.3 1.1 0l1.2 1.2c.3.3.3.8 0 1.1l-.6.6c.7 1.2 1.7 2.2 2.9 2.9l.6-.6c.3-.3.8-.3 1.1 0l1.2 1.2c.3.3.3.8 0 1.1-.6.6-1.5 1-2.4.9-2.5-.2-4.9-1.5-6.6-3.2-1.7-1.7-3-4.1-3.2-6.6-.1-.9.3-1.8.9-2.4z"/></svg>`,

  // Chat & Asesoría Virtual
  chat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="icon icon-chat"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="m13 7.5.8 1.8 1.8.8-1.8.8-.8 1.8-.8-1.8-1.8-.8 1.8-.8z"/></svg>`,

  send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" class="icon icon-send"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`
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
