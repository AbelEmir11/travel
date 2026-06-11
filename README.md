# TRAVEL - Portal Web (React & Vite)

Este es el frontend de la plataforma **TRAVEL**, una aplicación de turismo premium. El desarrollo se centra en ofrecer una experiencia de usuario (UX) inmersiva, moderna y sumamente estética, utilizando tonos pastel (acentos celestes y periwinkle), tipografía pulida y micro-animaciones fluidas.

---

## 🎨 Características de Diseño e Interfaz

La aplicación se estructura en una sola página fluida (Single Page Application) controlada por un estado de vistas dinámico (`currentView`), lo que permite transiciones orgánicas mediante animaciones físicas en lugar de recargas bruscas.

### 1. Vista Pública & Cliente (Usuario Final)
*   **Catálogo interactivo:** Filtros por provincia de Argentina, rango de presupuesto máximo y tipo de experiencia (Solo estadía, viaje con aventura, todo incluido).
*   **Insignias de Descuento:** Visualización de etiquetas de descuento pulsantes y precios originales tachados junto a las tarifas recalculadas en tiempo real.
*   **Detalle Modal (Cajón Lateral):** Vista expandida del alojamiento con carrusel de fotos, itinerario de actividades exclusivas, servicios incluidos y formulario de reservas integrado.
*   **Mis Reservas:** Historial del cliente autenticado que detalla las fechas, huéspedes, costo final y estado de aprobación de sus viajes solicitados.

### 2. Vista Administrador Comercial (Gestión & Descuentos)
*   **Interruptor de Visibilidad:** Permite ocultar temporalmente destinos durante temporada baja o inactividad para que no se listen en el feed de los clientes.
*   **Set de Promociones:** Selección interactiva para aplicar ofertas instantáneas del `10%`, `25%` o `50% OFF` sobre la tarifa base de las habitaciones.

### 3. Vista Administrador General (Tablero de Control Financiero)
*   **KPI Cards:** Tarjetas analíticas con ingresos de la plataforma, tasa de conversión estimada y total de reservas.
*   **Indicador Comparativo:** Comparación porcentual automática de ingresos entre el mes actual y el mes anterior (Junio vs Mayo).
*   **Gráficos SVG Nativos:** 
    *   *Gráfico de Barras:* Facturación mensual acumulada durante el año 2026.
    *   *Gráfico de Donut:* Distribución de reservas según provincia.
    *   *Nota de Diseño:* Ambos gráficos están programados enteramente con etiquetas HTML `<svg>`, `<circle>` y `<rect>` interactivas mediante hojas de estilo CSS para garantizar máximo rendimiento e integración visual.
*   **Gestión de Permisos:** Tabla de personal del sistema con selectores en vivo para promover o degradar los roles de acceso de forma segura.

---

## 🚀 Tecnologías y Librerías

*   **React** (Biblioteca de componentes de interfaz)
*   **Vite** (Entorno de desarrollo y empaquetador ultrarrápido)
*   **Tailwind CSS** (Framework de estilos para desarrollo responsive y limpio)
*   **Framer Motion** (Librería de animaciones físicas y transiciones complejas)
*   **Phosphor Icons** (Paquete de iconografía vectorial premium)
*   **Axios** (Cliente de peticiones HTTP para llamadas al backend)

---

## ⚙️ Instalación y Ejecución

### 1. Prerrequisitos
Tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior recomendada).

### 2. Clonación e Instalación
Ubicado en la carpeta del frontend `/travel`, abrí tu terminal y ejecutá:
```bash
# Instalar todas las dependencias declaradas en el package.json
npm install
```

### 3. Configuración de API Endpoint
El archivo de conexión con la API de Flask se encuentra en [src/services/api.js](file:///C:/Users/alvar/.gemini/antigravity/scratch/travel/src/services/api.js). Asegurate de que la propiedad `baseURL` apunte al puerto correcto del servidor Flask (por defecto `http://localhost:5000/api`).

### 4. Servidor de Desarrollo
Iniciá la aplicación en modo desarrollo local:
```bash
npm run dev
```
La terminal te proporcionará la URL local (usualmente `http://localhost:5173/` o similar) para abrir la aplicación en tu navegador.

### 5. Compilación para Producción (Build)
Para compilar y minificar todo el código optimizado para su despliegue final:
```bash
npm run build
```
Las carpetas de salida optimizadas se guardarán en el directorio `/dist`.
