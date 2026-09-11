/**
 * ÁUREA ATELIER - Frontend Application Logic
 * Joyería Minimalista & Pasarela de Pagos Argentina
 */

// Estado global de la aplicación
const AppState = {
  products: [],
  filteredProducts: [],
  categories: [],
  activeCategory: 'todos',
  activeMetal: 'todos',
  sortOrder: 'featured',
  searchQuery: '',
  cart: [],
  selectedProduct: null,
  selectedSize: null,
  activePaymentTab: 'mercadopago',
  appliedPromo: null
};

// Formateador de moneda para Argentina (ARS)
const formatARS = (amount) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(amount);
};

// --- INICIALIZACIÓN ---

document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  loadCartFromStorage();
  fetchStoreSettings();
  fetchCategories();
  fetchProducts();
  setupEventListeners();
  updateCartUI();
  initScrollAnimations();
  initAIChatAdvisor();
});

async function fetchStoreSettings() {
  try {
    const res = await fetch('/api/settings');
    const data = await res.json();
    if (data.success && data.settings) {
      const s = data.settings;
      // Actualizar Ticker Superior Continuo (Marquee estilo Brooki Bakehouse)
      const tickerEls = document.querySelectorAll('.ticker-content');
      if (tickerEls.length > 0 && s.ticker_text) {
        const parts = s.ticker_text.split('/');
        const sparkleIcon = (window.ICONS && window.ICONS.sparkle) ? window.ICONS.sparkle : '';
        const html = parts.map((p) => `
          <span>${p.trim()}</span>
          <span class="ticker-sep">${sparkleIcon}</span>
        `).join('');
        tickerEls.forEach(el => el.innerHTML = html);
      }

      // Actualizar Portada (Hero)
      const heroTag = document.querySelector('.hero-tag');
      const heroTitle = document.querySelector('.hero-title');
      const heroDesc = document.querySelector('.hero-desc');

      if (heroTag && s.hero_tag) heroTag.textContent = s.hero_tag;
      if (heroTitle && s.hero_title) heroTitle.innerHTML = s.hero_title.includes('<em>') ? s.hero_title : s.hero_title;
      if (heroDesc && s.hero_desc) heroDesc.textContent = s.hero_desc;
    }
  } catch (e) {
    console.warn('Configuración por defecto en uso');
  }
}

// Observador reutilizable para animaciones de deslizamiento al hacer scroll (Estilo Brooki Bakehouse)
let scrollObserver = null;

function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.fade-in-scroll').forEach(el => el.classList.add('is-visible'));
    return;
  }

  if (!scrollObserver) {
    scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          scrollObserver.unobserve(entry.target);
          setTimeout(() => {
            if (entry.target && entry.target.style) {
              entry.target.style.transitionDelay = '0s';
            }
          }, 1100);
        }
      });
    }, { threshold: 0.04, rootMargin: '0px 0px -40px 0px' });

    // Garantizar que todos los elementos al pie de página se revelen al llegar al final del scroll
    window.addEventListener('scroll', () => {
      const scrollPos = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollPos >= docHeight - 120) {
        document.querySelectorAll('.fade-in-scroll:not(.is-visible)').forEach(el => {
          el.classList.add('is-visible');
          if (scrollObserver) scrollObserver.unobserve(el);
        });
      }
    }, { passive: true });
  }

  document.querySelectorAll('.fade-in-scroll:not(.is-visible)').forEach(el => {
    scrollObserver.observe(el);
  });
}

// Inyectar iconos SVG en placeholders marcados con data-icon
function initIcons() {
  document.querySelectorAll('[data-icon]').forEach(el => {
    const iconName = el.getAttribute('data-icon');
    if (window.ICONS && window.ICONS[iconName]) {
      el.innerHTML = window.ICONS[iconName];
    }
  });
}

// --- PERSISTENCIA DE CARRITO ---

function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem('aurea_cart');
    if (stored) {
      AppState.cart = JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error cargando carrito:', e);
    AppState.cart = [];
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem('aurea_cart', JSON.stringify(AppState.cart));
  } catch (e) {
    console.error('Error guardando carrito:', e);
  }
}

// --- CARGA DE DATOS DESDE LA API ---

async function fetchProducts() {
  const gridEl = document.getElementById('products-grid');
  gridEl.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
      Cargando catálogo exclusivo de Áurea Atelier...
    </div>
  `;

  try {
    const url = new URL('/api/products', window.location.origin);
    if (AppState.activeCategory !== 'todos') url.searchParams.set('category', AppState.activeCategory);
    if (AppState.activeMetal !== 'todos') url.searchParams.set('metal', AppState.activeMetal);
    if (AppState.sortOrder !== 'featured') url.searchParams.set('sort', AppState.sortOrder);
    if (AppState.searchQuery) url.searchParams.set('q', AppState.searchQuery);

    const res = await fetch(url);
    const data = await res.json();

    if (data.success && Array.isArray(data.products)) {
      AppState.products = data.products;
      AppState.filteredProducts = data.products;
      renderProducts();
      updateCounter();
    }
  } catch (err) {
    console.warn('API error, cargando datos locales de contingencia:', err);
    // Contingencia local si el server está cargando
    renderProducts();
  }
}

async function fetchCategories() {
  try {
    const res = await fetch('/api/categories');
    const data = await res.json();
    if (data.success) {
      AppState.categories = data.categories;
      renderCategories();
    }
  } catch (err) {
    console.warn('No se pudieron obtener las categorías dinámicas');
  }
}

// --- RENDERIZADO DE LA INTERFAZ ---

function renderCategories() {
  const barEl = document.getElementById('category-filter-bar');
  if (!barEl) return;

  barEl.innerHTML = AppState.categories.map(cat => `
    <button class="cat-btn ${AppState.activeCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
      <span>${cat.label}</span>
      <span class="cat-count">(${cat.count})</span>
    </button>
  `).join('');

  barEl.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetCat = btn.getAttribute('data-category');
      selectNavCategory(targetCat);
    });
  });
}

function selectNavCategory(catId) {
  AppState.activeCategory = catId;
  renderCategories();
  fetchProducts();

  // Actualizar estado activo en la barra de navegación superior (Desktop)
  document.querySelectorAll('.nav-links .nav-item').forEach(item => {
    const fnStr = item.getAttribute('onclick') || '';
    if (fnStr.includes(`'${catId}'`)) {
      item.classList.add('active');
    } else if (catId === 'todos' && fnStr.includes("'todos'")) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Actualizar estado activo en la franja móvil de categorías (Mobile)
  document.querySelectorAll('.mobile-cat-strip .mobile-cat-pill').forEach(pill => {
    const fnStr = pill.getAttribute('onclick') || '';
    if (fnStr.includes(`'${catId}'`)) {
      pill.classList.add('active');
    } else if (catId === 'todos' && fnStr.includes("'todos'")) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });

  const catalogEl = document.getElementById('catalogo');
  if (catalogEl) {
    catalogEl.scrollIntoView({ behavior: 'smooth' });
  }
}

function updateCounter() {
  const countEl = document.getElementById('catalog-count');
  if (countEl) {
    const count = AppState.filteredProducts.length;
    countEl.textContent = `${count} ${count === 1 ? 'pieza' : 'piezas'}`;
  }
}

// Helper para asignar variantes cromáticas pastel según el tipo de insignia
function getBadgeStyleClass(badge) {
  if (!badge) return '';
  const lower = badge.toLowerCase();
  if (lower.includes('best') || lower.includes('vendido') || lower.includes('off') || lower.includes('descuento') || lower.includes('promo')) {
    return 'badge-rose';
  }
  if (lower.includes('joyería') || lower.includes('joyeria') || lower.includes('diamante') || lower.includes('nuevo') || lower.includes('exclusivo')) {
    return 'badge-blush';
  }
  return 'badge-beige';
}

function renderProducts() {
  const gridEl = document.getElementById('products-grid');
  if (!gridEl) return;

  if (AppState.filteredProducts.length === 0) {
    gridEl.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 5rem 1rem;">
        <p class="serif-font" style="font-size: 1.6rem; color: var(--text-primary); margin-bottom: 0.5rem;">No se encontraron piezas con esos criterios</p>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem;">Intentá seleccionando otra categoría o limpiando los filtros.</p>
        <button class="btn-luxury-outline" id="btn-reset-filters">Ver Todo el Catálogo</button>
      </div>
    `;
    const resetBtn = document.getElementById('btn-reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        AppState.activeCategory = 'todos';
        AppState.activeMetal = 'todos';
        AppState.searchQuery = '';
        renderCategories();
        fetchProducts();
      });
    }
    return;
  }

  gridEl.innerHTML = AppState.filteredProducts.map((product, idx) => {
    const cuota3 = Math.round(product.price / 3);
    const badgeClass = getBadgeStyleClass(product.badge);
    const isMobile = window.innerWidth < 768;
    const cols = isMobile ? 2 : 4;
    const staggerDelay = ((idx % cols) * 0.12).toFixed(2);
    return `
      <article class="product-card fade-in-scroll" style="transition-delay: ${staggerDelay}s;" data-product-id="${product.id}">
        <div class="product-media">
          ${product.badge ? `<span class="card-badge ${badgeClass}">${product.badge}</span>` : ''}
          <img src="${product.primary_image}" alt="${product.name}" class="product-img img-primary" loading="lazy">
          <img src="${product.secondary_image || product.primary_image}" alt="${product.name} en detalle" class="product-img img-secondary" loading="lazy">
          
          <div class="card-overlay-actions">
            <button class="btn-card-action btn-quick-view" data-id="${product.id}">
              ${window.ICONS.eye}
              <span>Vista Rápida</span>
            </button>
            <button class="btn-card-action btn-quick-add" data-id="${product.id}">
              ${window.ICONS.bag}
              <span>Añadir</span>
            </button>
          </div>
        </div>

        <div class="product-details">
          <span class="product-category-tag">${product.metal} · ${product.category_label}</span>
          <h3 class="product-title" data-id="${product.id}">${product.name}</h3>
          <div class="product-price">${formatARS(product.price)}</div>
          <div class="product-installments">3 cuotas sin interés de ${formatARS(cuota3)}</div>
        </div>
      </article>
    `;
  }).join('');

  // Eventos en tarjetas
  gridEl.querySelectorAll('.btn-quick-view, .product-title').forEach(el => {
    el.addEventListener('click', (e) => {
      const id = el.closest('[data-product-id]').getAttribute('data-product-id');
      const prod = AppState.products.find(p => p.id === id);
      if (prod) openQuickView(prod);
    });
  });

  gridEl.querySelectorAll('.btn-quick-add').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      el.classList.add('btn-pulse-active');
      setTimeout(() => el.classList.remove('btn-pulse-active'), 350);
      const id = el.getAttribute('data-id');
      const prod = AppState.products.find(p => p.id === id);
      if (prod) {
        const defaultSize = prod.sizes && prod.sizes.length > 0 ? prod.sizes[0] : 'Único';
        addToCart(prod, defaultSize, 1);
        showToast(`"${prod.name}" añadida a la bolsa`);
      }
    });
  });

  initScrollAnimations();
}

// --- VISTA RÁPIDA (MODAL) ---

function openQuickView(product) {
  AppState.selectedProduct = product;
  AppState.selectedSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Único';

  const modalOverlay = document.getElementById('quickview-modal-overlay');
  const modalContent = document.getElementById('quickview-modal-content');

  const cuota3 = Math.round(product.price / 3);
  const cuota6 = Math.round(product.price / 6);

  // Tabla de especificaciones
  let specsHtml = '';
  if (product.specs) {
    specsHtml = `
      <table class="modal-specs-table">
        <tbody>
          ${Object.entries(product.specs).map(([key, val]) => `
            <tr>
              <td>${key.replace('_', ' ')}</td>
              <td>${val}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  // Selector de talles
  let sizesHtml = '';
  if (product.sizes && product.sizes.length > 0) {
    sizesHtml = `
      <div style="margin-top: 0.5rem;">
        <div class="size-selector-label">
          <span>Seleccionar Medida / Talle:</span>
          <span class="size-guide-link">${window.ICONS.ruler} Guía Oficial de Talles</span>
        </div>
        <div class="size-options">
          ${product.sizes.map((sz, idx) => `
            <button class="size-btn ${idx === 0 ? 'active' : ''}" data-size="${sz}">${sz}</button>
          `).join('')}
        </div>
      </div>
    `;
  }

  modalContent.innerHTML = `
    <div class="product-modal-card">
      <button class="btn-close-modal" id="btn-close-quickview" aria-label="Cerrar modal">
        ${window.ICONS.close}
      </button>

      <div class="modal-media-col">
        <img src="${product.primary_image}" alt="${product.name}" class="modal-main-img" id="modal-image-view">
      </div>

      <div class="modal-details-col">
        <div>
          <span class="modal-tag">${product.metal} · ${product.category_label}</span>
          <h2 class="modal-title">${product.name}</h2>
        </div>

        <div>
          <div class="modal-price">${formatARS(product.price)}</div>
          <div class="modal-installments">3 cuotas sin interés de ${formatARS(cuota3)} o 6 de ${formatARS(cuota6)}</div>
        </div>

        <p class="modal-desc">${product.description}</p>

        ${sizesHtml}

        <div>
          <button class="btn-luxury" style="width: 100%; margin-top: 0.8rem;" id="btn-modal-add-cart">
            ${window.ICONS.bag}
            <span>Añadir a la Bolsa de Compras</span>
          </button>
        </div>

        <div style="margin-top: 0.5rem;">
          <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--gold-dark); font-weight: 600;">Detalles de Orfebrería</span>
          ${specsHtml}
        </div>
      </div>
    </div>
  `;

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Listeners de modal
  document.getElementById('btn-close-quickview').addEventListener('click', closeQuickView);

  modalContent.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modalContent.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.selectedSize = btn.getAttribute('data-size');
    });
  });

  document.getElementById('btn-modal-add-cart').addEventListener('click', () => {
    addToCart(product, AppState.selectedSize, 1);
    closeQuickView();
    openCartDrawer();
    showToast(`"${product.name}" añadida a la bolsa`);
  });
}

function closeQuickView() {
  const modalOverlay = document.getElementById('quickview-modal-overlay');
  if (modalOverlay) {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// --- BOLSA DE COMPRAS (DRAWER) ---

function addToCart(product, size = 'Único', quantity = 1) {
  const existingIdx = AppState.cart.findIndex(
    item => item.product.id === product.id && item.size === size
  );

  if (existingIdx > -1) {
    AppState.cart[existingIdx].quantity += quantity;
  } else {
    AppState.cart.push({
      product,
      size,
      quantity
    });
  }

  saveCartToStorage();
  updateCartUI();
}

function updateCartQuantity(index, delta) {
  if (AppState.cart[index]) {
    AppState.cart[index].quantity += delta;
    if (AppState.cart[index].quantity <= 0) {
      AppState.cart.splice(index, 1);
    }
    saveCartToStorage();
    updateCartUI();
  }
}

function removeCartItem(index) {
  AppState.cart.splice(index, 1);
  saveCartToStorage();
  updateCartUI();
}

function updateCartUI() {
  const countBadges = document.querySelectorAll('.cart-count-badge');
  const totalCount = AppState.cart.reduce((acc, item) => acc + item.quantity, 0);

  countBadges.forEach(b => {
    b.textContent = totalCount;
    b.style.display = totalCount > 0 ? 'flex' : 'none';
  });

  const bodyEl = document.getElementById('cart-items-body');
  const footerEl = document.getElementById('cart-drawer-footer');

  if (!bodyEl) return;

  if (AppState.cart.length === 0) {
    bodyEl.innerHTML = `
      <div class="cart-empty-state">
        <div style="color: var(--gold-primary); opacity: 0.6;">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.2">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </div>
        <h3 class="cart-empty-title">Tu bolsa de compras está vacía</h3>
        <p style="font-size: 0.85rem; line-height: 1.6;">Descubrí nuestras piezas de orfebrería y sumalas para adquirir con envío asegurado.</p>
        <button class="btn-luxury" id="btn-start-shopping" style="margin-top: 1rem;">Explorar Colección</button>
      </div>
    `;
    if (footerEl) footerEl.style.display = 'none';

    const startBtn = document.getElementById('btn-start-shopping');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        closeCartDrawer();
        const catalogSec = document.getElementById('catalogo');
        if (catalogSec) catalogSec.scrollIntoView({ behavior: 'smooth' });
      });
    }
    return;
  }

  if (footerEl) footerEl.style.display = 'flex';

  const subtotal = AppState.cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const cuota3 = Math.round(subtotal / 3);

  bodyEl.innerHTML = AppState.cart.map((item, idx) => `
    <div class="cart-item-row">
      <img src="${item.product.primary_image}" alt="${item.product.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h4 class="cart-item-name">${item.product.name}</h4>
        <span class="cart-item-size">Medida: ${item.size}</span>
        <div class="cart-item-price">${formatARS(item.product.price * item.quantity)}</div>
        <div class="qty-control">
          <button class="qty-btn" onclick="updateCartQuantity(${idx}, -1)">${window.ICONS.minus}</button>
          <span class="qty-num">${item.quantity}</span>
          <button class="qty-btn" onclick="updateCartQuantity(${idx}, 1)">${window.ICONS.plus}</button>
        </div>
      </div>
      <button class="btn-remove-item" onclick="removeCartItem(${idx})" title="Eliminar pieza">
        ${window.ICONS.close}
      </button>
    </div>
  `).join('');

  // Actualizar sumas en footer
  const subtotalEl = document.getElementById('cart-subtotal-val');
  const totalEl = document.getElementById('cart-total-val');
  const cuotasEl = document.getElementById('cart-cuotas-text');

  if (subtotalEl) subtotalEl.textContent = formatARS(subtotal);
  if (totalEl) totalEl.textContent = formatARS(subtotal);
  if (cuotasEl) cuotasEl.textContent = `Hasta 3 cuotas sin interés de ${formatARS(cuota3)} con Visa, Mastercard y Amex`;
}

function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('drawer-overlay');
  if (drawer && overlay) {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('drawer-overlay');
  if (drawer && overlay) {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// --- CHECKOUT FLOW (ARGENTINA) ---

function openCheckoutModal() {
  if (AppState.cart.length === 0) {
    showToast('Añadí al menos una pieza a la bolsa para pagar');
    return;
  }

  closeCartDrawer();
  const modalOverlay = document.getElementById('checkout-modal-overlay');
  const modalContent = document.getElementById('checkout-modal-content');

  const subtotal = AppState.cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const transferDiscount = subtotal * 0.15;
  const transferTotal = subtotal - transferDiscount;

  modalContent.innerHTML = `
    <div class="checkout-modal-card" id="checkout-card-container">
      <div class="checkout-header">
        <div>
          <h2 class="checkout-title">Finalizar Adquisición</h2>
          <span class="checkout-subtitle">Checkout Seguro · Envíos Asegurados a Toda la República Argentina</span>
        </div>
        <button class="btn-close-modal" id="btn-close-checkout">${window.ICONS.close}</button>
      </div>

      <div class="checkout-grid" id="checkout-main-grid">
        <!-- Columna Izquierda: Datos del Comprador & Envío -->
        <div>
          <h3 class="checkout-section-title">
            ${window.ICONS.shipping}
            <span>1. Datos de Entrega & Facturación</span>
          </h3>

          <form id="checkout-shipping-form" onsubmit="event.preventDefault()">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Nombre y Apellido</label>
                <input type="text" id="chk-name" class="form-input" placeholder="Ej. Camila Navarro" required value="Camila Navarro">
              </div>
              <div class="form-group">
                <label class="form-label">DNI / CUIL (Requerido p/ Facturación)</label>
                <input type="text" id="chk-dni" class="form-input" placeholder="Ej. 34.890.123" required value="34890123">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Correo Electrónico</label>
                <input type="email" id="chk-email" class="form-input" placeholder="nombre@ejemplo.com" required value="camila.navarro@gmail.com">
              </div>
              <div class="form-group">
                <label class="form-label">Teléfono / WhatsApp</label>
                <input type="tel" id="chk-phone" class="form-input" placeholder="Ej. +54 9 11 4050-9988" required value="+54 9 11 4050-9988">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Dirección de Entrega</label>
              <input type="text" id="chk-address" class="form-input" placeholder="Calle y Altura, Piso / Depto" required value="Av. Alvear 1850, Piso 6B">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Provincia</label>
                <select id="chk-province" class="form-select">
                  <option value="CABA" selected>Ciudad Autónoma de Buenos Aires</option>
                  <option value="Buenos Aires">Provincia de Buenos Aires</option>
                  <option value="Córdoba">Córdoba</option>
                  <option value="Santa Fe">Santa Fe</option>
                  <option value="Mendoza">Mendoza</option>
                  <option value="Salta">Salta</option>
                  <option value="Neuquén">Neuquén</option>
                  <option value="Tucumán">Tucumán</option>
                  <option value="Entre Ríos">Entre Ríos</option>
                  <option value="Otras Provincias">Otras Provincias (Andreani Asegurado)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Código Postal (CP)</label>
                <input type="text" id="chk-zip" class="form-input" placeholder="Ej. C1014AAD" required value="C1014AAD">
              </div>
            </div>
          </form>

          <!-- Resumen de items -->
          <div class="order-summary-box" style="margin-top: 1.5rem;">
            <div style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--gold-dark); font-weight: 600; margin-bottom: 0.8rem;">
              Piezas en tu pedido (${AppState.cart.length})
            </div>
            <div class="order-items-mini">
              ${AppState.cart.map(it => `
                <div class="order-item-mini-row">
                  <span>${it.quantity}x ${it.product.name} (${it.size})</span>
                  <span style="font-weight: 600;">${formatARS(it.product.price * it.quantity)}</span>
                </div>
              `).join('')}
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-top: 0.5rem;">
              <span>Envío Asegurado Andreani / Correo:</span>
              <span style="color: var(--status-success); font-weight: 600;">Bonificado (Gratis)</span>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Métodos de Pago Argentina -->
        <div>
          <h3 class="checkout-section-title">
            ${window.ICONS.creditCard}
            <span>2. Selección de Medio de Pago</span>
          </h3>

          <div class="payment-tabs">
            <button class="payment-tab-btn ${AppState.activePaymentTab === 'mercadopago' ? 'active' : ''}" data-tab="mercadopago">
              ${window.ICONS.badgeMercadoPago}
              <span>Mercado Pago</span>
            </button>
            <button class="payment-tab-btn ${AppState.activePaymentTab === 'card' ? 'active' : ''}" data-tab="card">
              ${window.ICONS.creditCard}
              <span>Tarjetas Directas</span>
            </button>
            <button class="payment-tab-btn ${AppState.activePaymentTab === 'transfer' ? 'active' : ''}" data-tab="transfer">
              ${window.ICONS.bank}
              <span>Transferencia</span>
              <span class="tab-badge-discount">15% OFF</span>
            </button>
          </div>

          <!-- PANEL 1: MERCADO PAGO -->
          <div class="payment-panel ${AppState.activePaymentTab === 'mercadopago' ? 'active' : ''}" id="panel-mercadopago">
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.2rem; line-height: 1.6;">
              Pagá a través de la pasarela líder de Argentina. Podés utilizar dinero en cuenta de Mercado Pago o tarjetas de débito/crédito con hasta 6 cuotas bancarias.
            </p>
            <div class="card-brands-row">
              ${window.ICONS.badgeVisa}
              ${window.ICONS.badgeMastercard}
              ${window.ICONS.badgeAmex}
              ${window.ICONS.badgeMercadoPago}
            </div>
            <div style="background-color: var(--bg-surface); padding: 1rem; border-radius: var(--radius-xs); border: 1px solid var(--border-light); margin-bottom: 1.2rem; font-size: 0.8rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
                <span>Total de la Orden:</span>
                <span style="font-weight: 700;">${formatARS(subtotal)}</span>
              </div>
              <div style="color: var(--status-success); font-size: 0.75rem;">
                3 cuotas sin interés de ${formatARS(Math.round(subtotal / 3))} o 6 cuotas de ${formatARS(Math.round(subtotal / 6))}
              </div>
            </div>
            <button class="btn-luxury" style="width: 100%;" id="btn-pay-mp">
              ${window.ICONS.lock}
              <span>Continuar con Mercado Pago</span>
            </button>
          </div>

          <!-- PANEL 2: TARJETAS DIRECTAS CON CUOTAS ARGENTINAS -->
          <div class="payment-panel ${AppState.activePaymentTab === 'card' ? 'active' : ''}" id="panel-card">
            <div class="card-brands-row">
              ${window.ICONS.badgeVisa}
              ${window.ICONS.badgeMastercard}
              ${window.ICONS.badgeAmex}
            </div>
            <form id="direct-card-form" onsubmit="event.preventDefault()">
              <div class="form-group">
                <label class="form-label">Número de Tarjeta</label>
                <input type="text" id="card-num" class="form-input" placeholder="4509 2300 1234 5678" maxlength="19" value="4509 2341 8762 9012">
              </div>
              <div class="form-group">
                <label class="form-label">Nombre del Titular (como figura en el plástico)</label>
                <input type="text" id="card-holder" class="form-input" placeholder="CAMILA NAVARRO" value="CAMILA NAVARRO">
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Vencimiento</label>
                  <input type="text" id="card-exp" class="form-input" placeholder="MM/AA" maxlength="5" value="08/29">
                </div>
                <div class="form-group">
                  <label class="form-label">Código CVV</label>
                  <input type="password" id="card-cvv" class="form-input" placeholder="123" maxlength="4" value="789">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Planes de Cuotas Disponibles en Argentina</label>
                <select id="card-installments" class="form-select">
                  <option value="1">1 cuota de ${formatARS(subtotal)} (Sin recargo)</option>
                  <option value="3" selected>3 cuotas SIN INTERÉS de ${formatARS(Math.round(subtotal / 3))}</option>
                  <option value="6">6 cuotas fijas de ${formatARS(Math.round(subtotal / 6))}</option>
                </select>
              </div>
              <button class="btn-luxury" style="width: 100%; margin-top: 0.5rem;" id="btn-pay-card">
                ${window.ICONS.lock}
                <span>Confirmar Pago de ${formatARS(subtotal)}</span>
              </button>
            </form>
          </div>

          <!-- PANEL 3: TRANSFERENCIA BANCARIA CON 15% OFF -->
          <div class="payment-panel ${AppState.activePaymentTab === 'transfer' ? 'active' : ''}" id="panel-transfer">
            <div style="background-color: var(--gold-tint); border: 1px solid var(--gold-light); padding: 0.9rem; border-radius: var(--radius-xs); margin-bottom: 1.2rem;">
              <div style="font-size: 0.8rem; font-weight: 600; color: var(--gold-dark); margin-bottom: 0.2rem;">
                Beneficio Exclusivo: 15% de Descuento Inmediato
              </div>
              <div style="font-size: 0.75rem; color: var(--text-secondary);">
                Subtotal regular: <s>${formatARS(subtotal)}</s><br>
                <strong style="color: var(--text-primary); font-size: 0.9rem;">Total Bonificado: ${formatARS(transferTotal)}</strong>
              </div>
            </div>
            <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.2rem;">
              Al confirmar, te brindamos los datos de CBU/Alias de nuestra cuenta bancaria en Santander / Galicia y reservamos tus joyas por 24 hs.
            </p>
            <button class="btn-luxury" style="width: 100%;" id="btn-pay-transfer">
              ${window.ICONS.check}
              <span>Generar Orden con 15% OFF (${formatARS(transferTotal)})</span>
            </button>
          </div>

          <!-- Garantías al pie -->
          <div class="trust-badges-bar">
            <div class="trust-badge-item">
              ${window.ICONS.shield}
              <span>Certificado 18K / 925</span>
            </div>
            <div class="trust-badge-item">
              ${window.ICONS.lock}
              <span>Cifrado SSL 256-bit</span>
            </div>
            <div class="trust-badge-item">
              ${window.ICONS.shipping}
              <span>Envío Asegurado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Listeners de Checkout
  document.getElementById('btn-close-checkout').addEventListener('click', closeCheckoutModal);

  // Tabs de pago
  modalContent.querySelectorAll('.payment-tab-btn').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      const tabId = tabBtn.getAttribute('data-tab');
      AppState.activePaymentTab = tabId;

      modalContent.querySelectorAll('.payment-tab-btn').forEach(b => b.classList.remove('active'));
      tabBtn.classList.add('active');

      modalContent.querySelectorAll('.payment-panel').forEach(p => p.classList.remove('active'));
      const activePanel = document.getElementById(`panel-${tabId}`);
      if (activePanel) activePanel.classList.add('active');
    });
  });

  // Botón Mercado Pago
  document.getElementById('btn-pay-mp').addEventListener('click', handleMercadoPagoCheckout);

  // Botón Tarjeta Directa
  document.getElementById('btn-pay-card').addEventListener('click', handleDirectCardCheckout);

  // Botón Transferencia
  document.getElementById('btn-pay-transfer').addEventListener('click', handleTransferCheckout);
}

function closeCheckoutModal() {
  const modalOverlay = document.getElementById('checkout-modal-overlay');
  if (modalOverlay) {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// --- PROCESAMIENTO DE PAGOS CON EL BACKEND ---

async function handleMercadoPagoCheckout() {
  const btn = document.getElementById('btn-pay-mp');
  btn.disabled = true;
  btn.innerHTML = `<span>Conectando con Mercado Pago...</span>`;

  const payload = {
    items: AppState.cart.map(it => ({
      id: it.product.id,
      title: `${it.product.name} (${it.size})`,
      unit_price: it.product.price,
      quantity: it.quantity
    })),
    payer: {
      name: document.getElementById('chk-name').value,
      email: document.getElementById('chk-email').value,
      dni: document.getElementById('chk-dni').value,
      address: document.getElementById('chk-address').value,
      province: document.getElementById('chk-province').value
    }
  };

  try {
    const res = await fetch('/api/checkout/preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();

    if (result.success) {
      // Mostrar confirmación interactiva
      renderPaymentSuccess({
        type: 'mercadopago',
        order_id: result.order_id,
        preference_id: result.preference_id,
        mode: result.mode,
        message: result.message || 'Preferencia de Mercado Pago lista.',
        total: payload.items.reduce((a, b) => a + (b.unit_price * b.quantity), 0)
      });
      clearCart();
    } else {
      showToast('Error al conectar con Mercado Pago: ' + (result.error || 'intente nuevamente'));
      btn.disabled = false;
      btn.innerHTML = `<span>Continuar con Mercado Pago</span>`;
    }
  } catch (e) {
    console.error(e);
    showToast('Error de conexión con el servidor de pagos');
    btn.disabled = false;
  }
}

async function handleDirectCardCheckout() {
  const btn = document.getElementById('btn-pay-card');
  const cardNum = document.getElementById('card-num').value;
  const cardHolder = document.getElementById('card-holder').value;
  const cardCvv = document.getElementById('card-cvv').value;
  const installments = document.getElementById('card-installments').value;
  const subtotal = AppState.cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  if (!cardNum || !cardHolder || !cardCvv) {
    showToast('Por favor completá los datos de la tarjeta');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = `<span>Verificando con la red bancaria...</span>`;

  try {
    const res = await fetch('/api/checkout/process-card', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        card_number: cardNum,
        cardholder: cardHolder,
        cvv: cardCvv,
        installments: parseInt(installments),
        total_amount: subtotal,
        dni: document.getElementById('chk-dni').value
      })
    });
    const result = await res.json();

    if (result.success) {
      renderPaymentSuccess({
        type: 'card',
        order_id: result.order_id,
        brand: result.brand,
        last_four: result.last_four,
        auth_code: result.auth_code,
        installments: result.installments,
        installment_amount: result.installment_amount,
        total_paid: result.total_paid,
        date: result.date
      });
      clearCart();
    } else {
      showToast(result.error || 'Tarjeta rechazada');
      btn.disabled = false;
      btn.innerHTML = `<span>Confirmar Pago</span>`;
    }
  } catch (e) {
    showToast('Error procesando el pago con tarjeta');
    btn.disabled = false;
  }
}

async function handleTransferCheckout() {
  const btn = document.getElementById('btn-pay-transfer');
  const subtotal = AppState.cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  btn.disabled = true;
  btn.innerHTML = `<span>Generando orden con bonificación...</span>`;

  try {
    const res = await fetch('/api/checkout/bank-transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        total_amount: subtotal,
        customer_name: document.getElementById('chk-name').value,
        email: document.getElementById('chk-email').value
      })
    });
    const result = await res.json();

    if (result.success) {
      renderPaymentSuccess({
        type: 'transfer',
        order_id: result.order_id,
        original_amount: result.original_amount,
        final_amount: result.final_amount,
        bank_details: result.bank_details,
        instructions: result.instructions
      });
      clearCart();
    }
  } catch (e) {
    showToast('Error generando la orden de transferencia');
    btn.disabled = false;
  }
}

// Pantalla de confirmación de pago
function renderPaymentSuccess(data) {
  const container = document.getElementById('checkout-card-container');
  if (!container) return;

  let detailsHtml = '';

  if (data.type === 'mercadopago') {
    detailsHtml = `
      <div style="background-color: var(--bg-main); border: 1px solid var(--border-light); padding: 1.5rem; border-radius: var(--radius-xs); width: 100%; max-width: 480px; text-align: left; font-size: 0.85rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.6rem;">
          <span style="color: var(--text-muted);">Plataforma de Cobro:</span>
          <strong>Mercado Pago Argentina</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.6rem;">
          <span style="color: var(--text-muted);">Preferencia Generada:</span>
          <code style="background: var(--bg-surface); padding: 0.2rem 0.4rem; border-radius: 2px;">${data.preference_id}</code>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.6rem;">
          <span style="color: var(--text-muted);">Monto Total:</span>
          <strong>${formatARS(data.total)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-muted);">Financiación:</span>
          <span style="color: var(--status-success); font-weight: 600;">Hasta 6 Cuotas Bancarias</span>
        </div>
      </div>
    `;
  } else if (data.type === 'card') {
    detailsHtml = `
      <div style="background-color: var(--bg-main); border: 1px solid var(--border-light); padding: 1.5rem; border-radius: var(--radius-xs); width: 100%; max-width: 480px; text-align: left; font-size: 0.85rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.6rem;">
          <span style="color: var(--text-muted);">Medio de Pago:</span>
          <strong>${data.brand} (Terminada en ${data.last_four})</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.6rem;">
          <span style="color: var(--text-muted);">Plan de Financiación:</span>
          <strong style="color: var(--status-success);">${data.installments} cuota${data.installments > 1 ? 's' : ''} de ${formatARS(data.installment_amount)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.6rem;">
          <span style="color: var(--text-muted);">Código de Autorización:</span>
          <code>${data.auth_code}</code>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-muted);">Fecha y Hora:</span>
          <span>${data.date}</span>
        </div>
      </div>
    `;
  } else if (data.type === 'transfer') {
    detailsHtml = `
      <div class="bank-transfer-box">
        <div style="font-weight: 700; font-size: 0.9rem; color: var(--gold-dark); margin-bottom: 0.8rem; text-align: center;">
          Datos Bancarios para Transferir (${formatARS(data.final_amount)})
        </div>
        <div class="bank-transfer-row">
          <span>Banco:</span>
          <strong>${data.bank_details.banco}</strong>
        </div>
        <div class="bank-transfer-row">
          <span>Titular:</span>
          <strong>${data.bank_details.titular}</strong>
        </div>
        <div class="bank-transfer-row">
          <span>CUIT:</span>
          <strong>${data.bank_details.cuit}</strong>
        </div>
        <div class="bank-transfer-row">
          <span>Alias CBU:</span>
          <strong id="copy-alias-val" style="color: var(--gold-dark); cursor: pointer;" title="Hacé clic para copiar">${data.bank_details.alias}</strong>
          <span class="btn-copy" onclick="copyToClipboard('${data.bank_details.alias}', 'Alias CBU copiado al portapapeles')">Copiar</span>
        </div>
        <div class="bank-transfer-row">
          <span>CBU Numérico:</span>
          <span style="font-family: monospace;">${data.bank_details.cbu}</span>
          <span class="btn-copy" onclick="copyToClipboard('${data.bank_details.cbu}', 'CBU copiado')">Copiar</span>
        </div>
      </div>
      <p style="font-size: 0.8rem; color: var(--text-secondary); max-width: 480px; line-height: 1.6;">
        ${data.instructions}
      </p>
    `;
  }

  container.innerHTML = `
    <div class="order-confirmation-box">
      <div class="confirmation-icon">
        ${window.ICONS.check}
      </div>

      <span style="font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold-dark); font-weight: 600;">
        Operación Confirmada
      </span>

      <h2 class="serif-font" style="font-size: 2.4rem; color: var(--text-primary); margin: -0.5rem 0 0.5rem;">
        ¡Gracias por elegir ÁUREA Atelier!
      </h2>

      <p style="font-size: 0.9rem; color: var(--text-secondary); max-width: 520px; line-height: 1.6;">
        Tu orden ha sido registrada con el código oficial <strong style="color: var(--text-primary);">${data.order_id}</strong>.
        Te enviamos los detalles y el número de seguimiento asegurado por Andreani a tu casilla de correo.
      </p>

      ${detailsHtml}

      <div style="display: flex; gap: 1rem; margin-top: 1rem;">
        <button class="btn-luxury" onclick="closeCheckoutModal()">
          <span>Volver a la Tienda</span>
        </button>
      </div>
    </div>
  `;
}

function clearCart() {
  AppState.cart = [];
  saveCartToStorage();
  updateCartUI();
}

function copyToClipboard(text, successMsg = 'Copiado al portapapeles') {
  navigator.clipboard.writeText(text).then(() => {
    showToast(successMsg);
  }).catch(() => {
    showToast('Seleccioná el texto para copiarlo');
  });
}

// --- NOTIFICACIONES TOAST ---

function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span>${window.ICONS.check}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// --- LISTENERS GLOBALES ---

function setupEventListeners() {
  // Botones de abrir carrito
  document.querySelectorAll('.btn-open-cart').forEach(btn => {
    btn.addEventListener('click', openCartDrawer);
  });

  // Cerrar carrito
  const btnCloseCart = document.getElementById('btn-close-cart');
  if (btnCloseCart) btnCloseCart.addEventListener('click', closeCartDrawer);

  const drawerOverlay = document.getElementById('drawer-overlay');
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeCartDrawer);

  // Botón proceder al Checkout en el drawer
  const btnCheckout = document.getElementById('btn-proceed-checkout');
  if (btnCheckout) btnCheckout.addEventListener('click', openCheckoutModal);

  // Filtro por metal
  const metalSelect = document.getElementById('metal-filter');
  if (metalSelect) {
    metalSelect.addEventListener('change', (e) => {
      AppState.activeMetal = e.target.value;
      fetchProducts();
    });
  }

  // Ordenamiento
  const sortSelect = document.getElementById('sort-order');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      AppState.sortOrder = e.target.value;
      fetchProducts();
    });
  }

  // Búsqueda en Cabecera (Soporte Desktop y Móvil Sincronizado)
  const searchInputDesktop = document.getElementById('header-search-input');
  const searchInputMobile = document.getElementById('header-search-input-mobile');

  function bindSearchInput(inputEl, otherInputEl) {
    if (!inputEl) return;
    let timeout = null;
    inputEl.addEventListener('input', (e) => {
      clearTimeout(timeout);
      const val = e.target.value;
      if (otherInputEl && otherInputEl.value !== val) {
        otherInputEl.value = val;
      }
      timeout = setTimeout(() => {
        AppState.searchQuery = val;
        fetchProducts();
      }, 350);
    });
  }

  bindSearchInput(searchInputDesktop, searchInputMobile);
  bindSearchInput(searchInputMobile, searchInputDesktop);

  // Cerrar modal al cliquear en overlay exterior
  const quickviewOverlay = document.getElementById('quickview-modal-overlay');
  if (quickviewOverlay) {
    quickviewOverlay.addEventListener('click', (e) => {
      if (e.target === quickviewOverlay) closeQuickView();
    });
  }

  const checkoutOverlay = document.getElementById('checkout-modal-overlay');
  if (checkoutOverlay) {
    checkoutOverlay.addEventListener('click', (e) => {
      if (e.target === checkoutOverlay) closeCheckoutModal();
    });
  }

  // Tecla Escape cierra modales y chat
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuickView();
      closeCheckoutModal();
      closeCartDrawer();
      const chatWidget = document.getElementById('ai-chat-widget');
      if (chatWidget && chatWidget.classList.contains('is-open')) {
        chatWidget.classList.remove('is-open');
      }
    }
  });

  // Suscripción al newsletter
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('newsletter-email');
      if (input && input.value) {
        showToast('Gracias por suscribirte al atelier');
        input.value = '';
      }
    });
  }
}

// --- ASESORA VIRTUAL DE JOYERÍA CON IA (ÁUREA CONCIERGE) ---

function initAIChatAdvisor() {
  const widgetEl = document.getElementById('ai-chat-widget');
  const triggerBtn = document.getElementById('ai-chat-trigger');
  const hintPill = document.getElementById('ai-chat-hint-pill');
  const closeBtn = document.getElementById('ai-chat-close');
  const resetBtn = document.getElementById('ai-chat-reset');
  const soundToggleBtn = document.getElementById('ai-chat-sound-toggle');
  const micBtn = document.getElementById('ai-chat-mic');
  const formEl = document.getElementById('ai-chat-form');
  const inputEl = document.getElementById('ai-chat-input');
  const messagesEl = document.getElementById('ai-chat-messages');

  // Historial de conversación para contexto de IA multi-turno
  const chatHistory = [];
  let isSoundEnabled = localStorage.getItem('aurea_chat_sound') !== 'muted';

  if (!widgetEl || !triggerBtn || !formEl) return;

  // Actualizar estado visual del botón de sonido
  function updateSoundIcon() {
    if (soundToggleBtn) {
      soundToggleBtn.innerHTML = isSoundEnabled ? (window.getIcon ? window.getIcon('volumeUp') : '') : (window.getIcon ? window.getIcon('volumeMute') : '');
      soundToggleBtn.classList.toggle('is-muted', !isSoundEnabled);
      soundToggleBtn.setAttribute('title', isSoundEnabled ? 'Silenciar notificaciones del chat' : 'Activar sonido del chat');
    }
  }
  updateSoundIcon();

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      localStorage.setItem('aurea_chat_sound', isSoundEnabled ? 'active' : 'muted');
      updateSoundIcon();
      showToast(isSoundEnabled ? 'Sonido del chat activado' : 'Sonido del chat silenciado');
      if (isSoundEnabled) playChatChime();
    });
  }

  // Micro-chime de audio sutil tipo boutique con Web Audio API
  function playChatChime() {
    if (!isSoundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1318.51, ctx.currentTime); // E6
      osc.frequency.exponentialRampToValueAtTime(1661.22, ctx.currentTime + 0.12); // G#6
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.32);
    } catch (e) {
      // AudioContext bloqueado o no disponible
    }
  }

  // Dictado por voz (Web Speech API)
  if (micBtn) {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      const recognition = new SpeechRec();
      recognition.lang = 'es-AR';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        micBtn.classList.add('is-recording');
        micBtn.setAttribute('title', 'Escuchando tu pregunta... (hablá ahora)');
        showToast('Escuchando... dictá tu consulta sobre joyas');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          inputEl.value = transcript;
          handleUserMessage(transcript);
        }
      };

      recognition.onerror = () => {
        micBtn.classList.remove('is-recording');
        micBtn.setAttribute('title', 'Dictar por voz');
      };

      recognition.onend = () => {
        micBtn.classList.remove('is-recording');
        micBtn.setAttribute('title', 'Dictar por voz');
      };

      micBtn.addEventListener('click', () => {
        try {
          if (micBtn.classList.contains('is-recording')) {
            recognition.stop();
          } else {
            recognition.start();
          }
        } catch (err) {
          micBtn.classList.remove('is-recording');
        }
      });
    } else {
      micBtn.style.display = 'none';
    }
  }

  function toggleChat(forceOpen = null) {
    const shouldOpen = forceOpen !== null ? forceOpen : !widgetEl.classList.contains('is-open');
    if (shouldOpen) {
      widgetEl.classList.add('is-open');
      const windowEl = document.getElementById('ai-chat-window');
      if (windowEl) windowEl.setAttribute('aria-hidden', 'false');
      setTimeout(() => inputEl && inputEl.focus(), 250);
      scrollChatToBottom();
    } else {
      widgetEl.classList.remove('is-open');
      const windowEl = document.getElementById('ai-chat-window');
      if (windowEl) windowEl.setAttribute('aria-hidden', 'true');
    }
  }

  triggerBtn.addEventListener('click', () => toggleChat());
  if (hintPill) hintPill.addEventListener('click', () => toggleChat(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggleChat(false));

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      messagesEl.innerHTML = `
        <div class="chat-msg bot-msg">
          <div class="msg-bubble">
            ¡Hola de nuevo! Conversación reiniciada. ¿En qué pieza o inquietud de joyería puedo orientarte hoy?
          </div>
          <span class="msg-time">Ahora</span>
        </div>
        <div class="ai-quick-prompts" id="ai-quick-prompts">
          <button type="button" class="quick-prompt-btn" data-query="¿Cómo puedo saber mi talle de anillo?">
            <span data-icon="ruler"></span>
            <span>¿Cómo mido mi talle?</span>
          </button>
          <button type="button" class="quick-prompt-btn" data-query="¿Qué diferencia hay entre oro amarillo 18k y oro blanco?">
            <span data-icon="diamond"></span>
            <span>Oro 18K vs Oro Blanco</span>
          </button>
          <button type="button" class="quick-prompt-btn" data-query="Quiero un anillo de compromiso o regalo especial">
            <span data-icon="gift"></span>
            <span>Anillo de Compromiso</span>
          </button>
          <button type="button" class="quick-prompt-btn" data-query="¿Cómo son los diamantes cultivados en laboratorio?">
            <span data-icon="sparkle"></span>
            <span>Diamantes Lab-Grown</span>
          </button>
          <button type="button" class="quick-prompt-btn" data-query="¿Cómo funcionan las 3 y 6 cuotas y medios de pago?">
            <span data-icon="creditCard"></span>
            <span>Cuotas y Mercado Pago</span>
          </button>
          <button type="button" class="quick-prompt-btn" data-query="¿Cómo funcionan los envíos a todo el país?">
            <span data-icon="shipping"></span>
            <span>Envíos Andreani</span>
          </button>
        </div>
      `;
      chatHistory.length = 0;
      if (window.initIcons) window.initIcons(messagesEl);
      scrollChatToBottom();
      showToast('Conversación reiniciada');
    });
  }

  // Delegación de eventos para las preguntas rápidas (Chips)
  messagesEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.quick-prompt-btn');
    if (btn) {
      const query = btn.getAttribute('data-query');
      if (query) {
        handleUserMessage(query);
      }
    }
  });

  // Envío del formulario de texto
  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    handleUserMessage(text);
  });

  function scrollChatToBottom() {
    if (messagesEl) {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  }

  function appendUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg user-msg';
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    msgDiv.innerHTML = `
      <div class="msg-bubble">${escapeHTML(text)}</div>
      <span class="msg-time">${nowStr}</span>
    `;
    messagesEl.appendChild(msgDiv);
    scrollChatToBottom();
  }

  // Formateador de Markdown a HTML elegante
  function formatMarkdown(text) {
    if (!text) return '';
    let html = text;
    // Negrita **texto** o __texto__
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    // Cursiva *texto* o _texto_
    html = html.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
    // Código `código`
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Viñetas: líneas que empiezan con • o - o *
    html = html.replace(/(?:^|\n)[-•*]\s+(.+)/g, '\n<li>$1</li>');
    // Agrupar <li> consecutivos en <ul>
    html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul class="chat-intro-list">$1</ul>');
    // Reemplazar saltos de línea dobles y simples
    html = html.replace(/\n\n+/g, '<br><br>');
    html = html.replace(/\n/g, '<br>');
    return html;
  }

  function appendBotMessage(content, matchedProducts = [], suggestions = []) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg bot-msg';
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Tarjetas interactivas de producto con Doble Acción (Ver / Comprar)
    let prodsHtml = '';
    if (matchedProducts && matchedProducts.length > 0) {
      prodsHtml = matchedProducts.slice(0, 3).map(prod => {
        const cuota3 = Math.round(prod.price / 3);
        const metalText = prod.metal ? `<div class="ai-prod-metal-tag">${escapeHTML(prod.metal)}</div>` : '';
        return `
          <div class="ai-prod-recommendation" data-id="${prod.id}">
            <img src="${prod.primary_image}" alt="${escapeHTML(prod.name)}" class="ai-prod-thumb" data-view-id="${prod.id}" title="Ver imagen ampliada">
            <div class="ai-prod-details" data-view-id="${prod.id}">
              <div class="ai-prod-title">${escapeHTML(prod.name)}</div>
              ${metalText}
              <div class="ai-prod-price">${formatARS(prod.price)} <span style="font-size: 0.68rem; font-weight: normal; color: var(--text-muted);">· 3x ${formatARS(cuota3)}</span></div>
            </div>
            <div class="ai-prod-actions">
              <button type="button" class="ai-prod-view-btn" data-view-id="${prod.id}">
                Ver
              </button>
              <button type="button" class="ai-prod-buy-btn" data-add-id="${prod.id}" title="Agregar a la bolsa de compras">
                + Bolsa
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    // 2. Chips dinámicos contextuales
    let chipsHtml = '';
    if (suggestions && suggestions.length > 0) {
      chipsHtml = `
        <div class="ai-quick-prompts">
          ${suggestions.map(sug => `
            <button type="button" class="quick-prompt-btn" data-query="${escapeHTML(sug)}">
              <span data-icon="sparkle"></span>
              <span>${escapeHTML(sug)}</span>
            </button>
          `).join('')}
        </div>
      `;
    }

    const formattedContent = formatMarkdown(content);

    msgDiv.innerHTML = `
      <div class="msg-bubble">
        ${formattedContent}
        ${prodsHtml}
        ${chipsHtml}
      </div>
      <span class="msg-time">${nowStr}</span>
    `;

    messagesEl.appendChild(msgDiv);
    if (window.initIcons) window.initIcons(msgDiv);
    scrollChatToBottom();
    playChatChime();

    // Eventos: Abrir QuickView
    msgDiv.querySelectorAll('[data-view-id]').forEach(el => {
      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const id = el.getAttribute('data-view-id');
        const prod = (AppState.products || []).find(p => p.id === id);
        if (prod) openQuickView(prod);
      });
    });

    // Eventos: Agregar a la bolsa directamente desde el chat
    msgDiv.querySelectorAll('[data-add-id]').forEach(btn => {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const id = btn.getAttribute('data-add-id');
        const prod = (AppState.products || []).find(p => p.id === id);
        if (prod) {
          addToCart(prod.id, 1, prod.sizes && prod.sizes.length ? prod.sizes[0] : null);
          btn.textContent = '¡Agregada!';
          btn.style.background = '#3E9E68';
          setTimeout(() => {
            btn.textContent = '+ Bolsa';
            btn.style.background = '';
          }, 2000);
        }
      });
    });
  }

  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-msg bot-msg';
    typingDiv.id = 'ai-typing-indicator';
    typingDiv.innerHTML = `
      <div class="ai-typing-indicator">
        <span class="ai-typing-dot"></span>
        <span class="ai-typing-dot"></span>
        <span class="ai-typing-dot"></span>
      </div>
    `;
    messagesEl.appendChild(typingDiv);
    scrollChatToBottom();
  }

  function removeTypingIndicator() {
    const el = document.getElementById('ai-typing-indicator');
    if (el) el.remove();
  }

  async function handleUserMessage(query) {
    appendUserMessage(query);
    showTypingIndicator();

    chatHistory.push({ role: 'user', text: query });

    let botReply = '';
    let matchedProducts = [];
    let suggestions = [];

    try {
      // 1. Intentar llamar al backend con el historial completo
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, history: chatHistory })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.reply) {
          botReply = data.reply;
          matchedProducts = data.products || [];
          suggestions = data.suggestions || [];
        }
      }
    } catch (err) {
      console.warn('Backend chat no disponible, recurriendo al motor de joyería del cliente:', err);
    }

    // 2. Si no hubo respuesta del backend, recurrir al motor experto del cliente
    if (!botReply) {
      await new Promise(r => setTimeout(r, 400));
      const localResponse = generateAIResponse(query);
      botReply = localResponse.text;
      matchedProducts = localResponse.products || [];
      suggestions = localResponse.suggestions || [];
    }

    removeTypingIndicator();
    appendBotMessage(botReply, matchedProducts, suggestions);
    chatHistory.push({ role: 'assistant', text: botReply });
  }

  function escapeHTML(str) {
    if (!str) return '';
    const p = document.createElement('p');
    p.textContent = str;
    return p.innerHTML;
  }
}

// Patrones de detección para temas ajenos a la joyería (Guardrail Estricto)
const OFF_TOPIC_REGEX = /\b(python|javascript|typescript|react|html|css|php|java|c\+\+|sql|codigo|código|programar|programacion|programación|script|bug|api|backend|frontend|futbol|fútbol|messi|maradona|river|boca|partido|mundial|champions|gol|deporte|tenis|nba|politica|política|presidente|elecciones|gobierno|milei|cristina|macri|receta|cocinar|torta|brownie|pasta|asado|horno|matematica|matemática|ecuacion|ecuación|raiz cuadrada|derivada|calcular|cuanto es|clima|pronostico|pronóstico|temperatura|va a llover|chiste|broma|cuento|pelicula|película|serie|netflix|spotify|cancion|canción)\b/i;

const JEWELRY_REGEX = /\b(joya|joyas|joyería|joyeria|anillo|anillos|alianza|alianzas|solitario|collar|collares|gargantilla|aros|arito|aritos|argolla|pulsera|pulseras|brazalete|oro|plata|platino|rodio|quilate|quilates|18k|925|diamante|diamantes|gema|gemas|piedra|piedras|brillante|zafiro|esmeralda|rubi|rubí|perla|talle|talles|talla|medida|medir|milimetro|milímetro|mm|dedo|compra|comprar|precio|costo|valor|cuota|cuotas|tarjeta|mercado pago|mercadopago|transferencia|descuento|banco|envio|envios|envíos|andreani|entrega|demora|despacho|retiro|taller|atelier|alvear|aurea|áurea|regalo|regalos|aniversario|compromiso|casamiento|boda|novia|novio|limpieza|limpiar|cuidado|mantenimiento|garantia|garantía|certificado|presupuesto|barato|accesible|exclusivo)\b/i;

function extractBudgetJS(query) {
  const q = query.toLowerCase().replace(/\./g, '').replace(/,/g, '');
  const matchMil = q.match(/(\d+)\s*(mil|k)/);
  if (matchMil) return parseInt(matchMil[1], 10) * 1000;
  const matchNum = q.match(/\$?\s*(\d{4,7})/);
  if (matchNum) return parseInt(matchNum[1], 10);
  return null;
}

function generateAIResponse(rawQuery) {
  const query = rawQuery.toLowerCase().trim();
  const products = AppState.products || [];
  const budget = extractBudgetJS(query);

  // GUARDRAIL ESTRICTO: Rechazar de inmediato cualquier consulta ajena a la joyería
  const hasJewelry = JEWELRY_REGEX.test(query);
  const isOffTopic = OFF_TOPIC_REGEX.test(query);

  if (isOffTopic && !hasJewelry) {
    return {
      text: `Disculpas, como asesora de **ÁUREA Atelier** estoy capacitada única y exclusivamente para orientarte sobre nuestras piezas de joyería fina, metales nobles, gemología, talles y compras en el atelier.\n\n¿En qué pieza o inquietud de joyería puedo ayudarte hoy?`,
      products: [],
      suggestions: ["¿Cómo elijo mi talle de anillo?", "Ver joyas en Oro 18K", "Promociones y Cuotas"]
    };
  }

  // 1. Presupuesto explícito del cliente
  if (budget) {
    const budgetProds = products.filter(p => p.price <= budget).sort((a, b) => b.price - a.price);
    return {
      text: `Para tu presupuesto de hasta **${formatARS(budget)}**, seleccioné las mejores creaciones forjadas en metales nobles con garantía perpetua:\n\nRecordá que podés abonar en **3 y 6 cuotas fijas sin interés** con tarjetas bancarias o acceder a un **15% de descuento directo** por transferencia bancaria.`,
      products: (budgetProds.length > 0 ? budgetProds : products).slice(0, 3),
      suggestions: ["Calcular cuotas sin interés", "¿Tienen envío gratis?", "Ver más opciones"]
    };
  }

  // 2. Talles de anillo y medidas (Tabla métrica argentina)
  if (query.includes('talle') || query.includes('talla') || query.includes('medir') || query.includes('medida') || query.includes('dedo') || query.includes('anillo')) {
    const ringProds = products.filter(p => p.category === 'anillos' || p.name.toLowerCase().includes('anillo') || p.name.toLowerCase().includes('solitario'));
    return {
      text: `Para conocer tu talle de anillo exacto en Argentina, el método más seguro es medir en milímetros el **diámetro interno** de un anillo que te calce perfecto (sin contar los bordes metálicos):\n\n• **16.5 mm** = Talle 12 / 13\n• **17.2 mm** = Talle 14 / 15 *(el estándar más frecuente)*\n• **18.0 mm** = Talle 17 / 18\n• **19.0 mm** = Talle 20 / 21\n\n**Garantía Áurea:** Todas nuestras creaciones incluyen el **primer ajuste de talle 100% bonificado** con retiro y entrega asegurada a domicilio en todo el país.`,
      products: ringProds.slice(0, 3),
      suggestions: ["Ver anillos en stock", "¿Cuánto demora el ajuste?", "Consultar por WhatsApp"]
    };
  }

  // 3. Metales (Oro 18k macizo, Oro Blanco, Plata 925)
  if (query.includes('oro') || query.includes('plata') || query.includes('metal') || query.includes('quilate') || query.includes('18k') || query.includes('925') || query.includes('blanco')) {
    const metalProds = products.filter(p => query.includes('blanco') ? (p.metal && p.metal.toLowerCase().includes('blanco')) : (p.metal && p.metal.toLowerCase().includes('oro')));
    return {
      text: `En **ÁUREA Atelier** forjamos piezas exclusivamente en metales nobles macizos de primera ley:\n\n• **Oro 18K Amarillo Macizo (750‰):** Nobleza perpetua sin enchapados que se desprendan.\n• **Oro Blanco 18K:** Fina aleación con paladio y baño de rodio electrolítico que aporta un tono níveo y duradero.\n• **Plata 925 de Ley:** Forjada y pulida a mano con acabado espejo de alta orfebrería.\n\nCada creación se entrega con su **Certificado de Autenticidad** y garantía perpetua de mantenimiento.`,
      products: (metalProds.length > 0 ? metalProds : products).slice(0, 3),
      suggestions: ["Diferencia entre Oro Blanco y Amarillo", "¿Tienen garantía perpetua?", "Pulido anual sin costo"]
    };
  }

  // 4. Diamantes cultivados & Gemas éticas
  if (query.includes('diamante') || query.includes('gema') || query.includes('piedra') || query.includes('brillante') || query.includes('cultivado') || query.includes('vvs')) {
    const diamondProds = products.filter(p => p.category === 'diamantes' || p.name.toLowerCase().includes('diamante') || p.name.toLowerCase().includes('étoile'));
    return {
      text: `Nuestros diamantes son **cultivados en laboratorio con huella de carbono neutra**. Tienen exactamente la misma composición atómica (100% carbono cristalizado), brillo y dureza 10 Mohs que un diamante de yacimiento.\n\nGarantizamos pureza **VVS1/VVS2** y escala incolora excepcional **F-G**, promoviendo un lujo contemporáneo, ético y de máxima pureza certificada.`,
      products: diamondProds.slice(0, 3),
      suggestions: ["¿Tienen certificación oficial?", "Ver Alta Joyería Diamantes", "Packaging de gala"]
    };
  }

  // 5. Medios de pago y cuotas
  if (query.includes('pago') || query.includes('cuota') || query.includes('tarjeta') || query.includes('mercado pago') || query.includes('mercadopago') || query.includes('interes') || query.includes('transferencia') || query.includes('banco') || query.includes('descuento')) {
    return {
      text: `Contamos con los siguientes beneficios de pago en Argentina:\n\n• **3 y 6 Cuotas Fijas Sin Interés** con tarjetas de crédito bancarias Visa, Mastercard y American Express procesadas por **Mercado Pago**.\n• **15% de Descuento Inmediato** abonando mediante Transferencia Bancaria directa (Alias: \`AUREA.JOYAS.ARG\`).\n• Facturación fiscal tipo A o B y pagos protegidos con encriptación bancaria de 256 bits.`,
      products: products.slice(0, 2),
      suggestions: ["¿Cómo accedo al 15% OFF?", "¿Cuánto demora el envío?", "Ver catálogo completo"]
    };
  }

  // 6. Envíos y entregas
  if (query.includes('envio') || query.includes('envíos') || query.includes('andreani') || query.includes('tiempo') || query.includes('demora') || query.includes('llega') || query.includes('costo') || query.includes('domicilio')) {
    return {
      text: `Brindamos **Envío Gratis Asegurado** a toda la República Argentina a través de **Andreani**:\n\n• **CABA y Gran Buenos Aires:** 24 a 48 hs hábiles.\n• **Resto del país:** 3 a 5 días hábiles a domicilio o sucursal Andreani con seguimiento satelital.\n• **Packaging de Gala:** Cada alhaja viaja en un cofre rígido forrado en lino, lazo de satén, estuche de viaje y certificado foliado.`,
      products: [],
      suggestions: ["¿El envío tiene seguro total?", "¿Cómo viene el packaging?", "Ver joyas disponibles"]
    };
  }

  // 7. Cuidado y limpieza
  if (query.includes('limpieza') || query.includes('limpiar') || query.includes('cuidado') || query.includes('mantener') || query.includes('mantenimiento')) {
    return {
      text: `Para preservar el resplandor de tus joyas con rigor de orfebre:\n\n• Lavá la pieza con agua tibia y unas gotas de jabón neutro, empleando un cepillo de cerdas ultrasuaves.\n• Secá suavemente con un paño de microfibra.\n• Evitá la exposición a cloro, piscinas y fragancias directas.\n\n*Beneficio Áurea:* Recordá que disponés de **mantenimiento y pulido anual bonificado de por vida** en nuestro atelier central.`,
      products: [],
      suggestions: ["¿Cómo solicito el pulido anual?", "Ver joyas en Oro 18K", "Hablar con un orfebre"]
    };
  }

  // 8. Regalos, ocasiones especiales o aniversarios
  if (query.includes('regalo') || query.includes('aniversario') || query.includes('novia') || query.includes('compromiso') || query.includes('cumple') || query.includes('recomendar') || query.includes('especial')) {
    const featuredProds = products.filter(p => p.badge && (p.badge.toLowerCase().includes('exclusivo') || p.badge.toLowerCase().includes('alta joyería') || p.badge.toLowerCase().includes('más vendido')));
    return {
      text: `Para agasajar en un hito trascendental, te recomiendo nuestras creaciones de silueta atemporal:\n\nNuestros solitarios con diamantes cultivados y gargantillas finas se entregan listas para regalar con presentación de gala y cambio garantizado de talle sin costo.`,
      products: (featuredProds.length > 0 ? featuredProds : products).slice(0, 3),
      suggestions: ["Anillos de compromiso", "¿Cómo viene el packaging?", "Consultar por WhatsApp"]
    };
  }

  // 9. Búsqueda por categorías específicas (aros, collares, pulseras, etc.)
  if (query.includes('aro') || query.includes('collar') || query.includes('pulsera') || query.includes('gargantilla') || query.includes('solitario')) {
    let catKey = 'todos';
    if (query.includes('aro')) catKey = 'aros';
    else if (query.includes('collar') || query.includes('gargantilla')) catKey = 'collares';
    else if (query.includes('pulsera')) catKey = 'pulseras';

    const matched = products.filter(p => p.category === catKey || p.name.toLowerCase().includes(query));
    if (matched.length > 0) {
      return {
        text: `Aquí tenés algunas de nuestras creaciones más destacadas de esa colección. Podés pulsar en **"Ver"** para inspeccionar detalles o en **"+ Bolsa"** para adquirirla directamente:`,
        products: matched.slice(0, 3),
        suggestions: ["Ver todas las piezas", "Calcular cuotas sin interés", "¿Tienen envío gratis?"]
      };
    }
  }

  // 10. Respuesta por defecto
  return {
    text: `Como asesora de **ÁUREA Atelier**, puedo orientarte sobre:\n\n• **Talles y medidas** exactas para anillos en milímetros.\n• Diferencias entre **Oro 18K Macizo, Oro Blanco y Plata 925**.\n• Diamantes cultivados éticos y gemas de autor.\n• Financiación en **hasta 6 cuotas fijas sin interés** y 15% OFF por transferencia.\n• Envíos gratis asegurados a todo el país.\n\n*¿Sobre qué pieza o detalle te gustaría profundizar?*`,
    products: products.slice(0, 2),
    suggestions: ["¿Cómo mido mi talle de anillo?", "Ver joyas en Oro 18K", "Beneficios de pago"]
  };
}

// Exponer funciones necesarias al scope global
window.updateCartQuantity = updateCartQuantity;
window.removeCartItem = removeCartItem;
window.copyToClipboard = copyToClipboard;
window.closeCheckoutModal = closeCheckoutModal;
window.selectNavCategory = selectNavCategory;
window.initAIChatAdvisor = initAIChatAdvisor;
