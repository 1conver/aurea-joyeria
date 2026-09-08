# ÁUREA Atelier — Joyería Minimalista & Pasarela Argentina

Sitio web e-commerce de joyería contemporánea de alta gama con estilo minimalista y editorial, catálogo curado de piezas en Oro 18K y Plata 925, y backend integrado preparado para el ecosistema de pagos de Argentina.

## Características

- **Diseño Editorial & Minimalista**:
  - Paleta cromática: Alabastro cálido, Marfil, Oro cepillado mate y Carbón Obsidiana.
  - Tipografías: *Cormorant Garamond* (alta orfebrería) y *Plus Jakarta Sans* (claridad geométrica).
  - **100% libre de emojis**: Uso exclusivo de iconografía vectorial SVG minimalista de trazo fino (1.2px).
- **Catálogo & Experiencia de Compra**:
  - Catálogo interactivo con filtrado por categorías (Anillos, Collares, Aros, Pulseras, Alta Joyería) y por metal (Oro 18K, Plata 925, Oro Blanco).
  - Fotografía en alta resolución con cambio dinámico de vista en hover.
  - Modal de vista rápida (*Quick View*) con tabla de especificaciones técnicas de orfebrería y selector de talles / medidas.
  - Bolsa de compras lateral (*Slide-out Drawer*) persistente con `localStorage`.
- **Backend & Pagos en Argentina (ARS $)**:
  - **Mercado Pago**: Generación de preferencia de checkout (`/api/checkout/preference`) con soporte de cuotas y modo sandbox interactivo.
  - **Tarjetas Directas (Visa, Mastercard, American Express)**: Procesamiento directo (`/api/checkout/process-card`) con selector de 1, 3 o 6 cuotas y desglose financiero.
  - **Transferencia Bancaria**: Generación de orden con 15% de descuento inmediato (`/api/checkout/bank-transfer`), datos de CBU, Alias ("AUREA.JOYAS.ARG"), CUIT e instrucciones de depósito.
  - Formulario adaptado a los requisitos fiscales argentinos: DNI / CUIL y selector de Provincias de la República Argentina.

---

## Cómo Ejecutar el Proyecto

El backend está construido con Python 3 y `aiohttp`, por lo que se ejecuta de forma directa sin requerir configuraciones complejas:

```powershell
# 1. Ingresar a la carpeta del proyecto
cd C:\Users\Aco\.gemini\antigravity-ide\scratch\aurea-joyeria

# 2. Iniciar el servidor
python server.py
```

Abrí tu navegador en:
👉 **`http://localhost:3000`**

---

## Configuración de Mercado Pago (Opcional)

Por defecto, la tienda funciona en modo **Sandbox Simulator**, lo que te permite probar compras completas de forma inmediata sin necesidad de ingresar claves bancarias reales.

Para conectar tu cuenta real o de prueba de Mercado Pago:
1. Copiá `.env.example` como `.env`:
   ```powershell
   Copy-Item .env.example .env
   ```
2. Completá tu `MERCADOPAGO_ACCESS_TOKEN` obtenido del portal de desarrolladores de Mercado Pago.
