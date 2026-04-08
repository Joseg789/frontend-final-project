# 🛍️ MyShop — Frontend

Aplicación web de tienda de ropa online desarrollada con **React**, **Vite** y **React Router**. Incluye panel de administración, carrito de compras, autenticación con JWT, filtros avanzados de productos y checkout completo.

---

## 🚀 Tecnologías

| Tecnología      | Uso                              |
| --------------- | -------------------------------- |
| React 18        | Librería UI                      |
| Vite            | Bundler y servidor de desarrollo |
| React Router v6 | Navegación y rutas               |
| Axios           | Peticiones HTTP                  |
| Context API     | Estado global                    |
| Sonner          | Notificaciones toast             |
| Lucide React    | Iconos                           |
| Recharts        | Gráficos del dashboard           |
| CSS Modules     | Estilos encapsulados             |

---

## 📁 Estructura del proyecto

```
frontend/
├── src/
│   ├── api.js                        # Instancia de axios con interceptor JWT
│   ├── App.jsx                       # Página de todos los productos con filtros
│   ├── main.jsx                      # Punto de entrada
│   ├── components/
│   │   ├── Navbar.jsx                # Barra de navegación
│   │   ├── Footer.jsx                # Pie de página + newsletter
│   │   ├── Product.jsx               # Tarjeta de producto
│   │   ├── Gallery.jsx               # Galería de imágenes masonry
│   │   ├── Nosotros.jsx              # Página sobre nosotros
│   │   └── Logo.jsx                  # Logo de la tienda
│   ├── context/
│   │   ├── auth/
│   │   │   └── AuthContext.jsx       # Contexto de autenticación JWT
│   │   ├── cart/
│   │   │   └── CartContext.jsx       # Contexto del carrito
│   │   └── ProductsContext.jsx       # Contexto de productos con caché
│   ├── pages/
│   │   ├── Home.jsx                  # Página de inicio
│   │   ├── Login.jsx                 # Inicio de sesión
│   │   ├── Register.jsx              # Registro
│   │   ├── Profile.jsx               # Perfil de usuario + pedidos
│   │   ├── Cart.jsx                  # Carrito de compras
│   │   ├── GenderProducts.jsx        # Productos por género con filtros
│   │   ├── Checkout.jsx              # Proceso de compra
│   │   ├── CheckoutSuccess.jsx       # Confirmación de pedido
│   │   ├── Contact.jsx               # Formulario de contacto
│   │   ├── Shipping.jsx              # Política de envíos
│   │   └── Admin/
│   │       ├── AdminDashboard.jsx    # Dashboard principal
│   │       ├── AdminLayout.jsx       # Layout del panel admin
│   │       └── pages/
│   │           ├── Analytics.jsx     # Gráficos y métricas
│   │           ├── Orders.jsx        # Gestión de órdenes
│   │           ├── Users.jsx         # Gestión de usuarios
│   │           ├── Products.jsx      # Gestión de productos
│   │           ├── Reports.jsx       # Reportes con exportación CSV
│   │           ├── Notifications.jsx # Centro de notificaciones
│   │           ├── Settings.jsx      # Configuración del panel
│   │           └── Help.jsx          # Ayuda y FAQ
│   └── router/
│       ├── RouterApp.jsx             # Configuración de rutas
│       └── ProtectedRoute.jsx        # Rutas protegidas
├── public/
│   └── _redirects                    # Configuración para Netlify
├── .env                              # Variables de entorno
└── package.json
```

---

## ⚙️ Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/frontend-myshop.git
cd frontend-myshop

# 2. Instala las dependencias
npm install

# 3. Crea el archivo .env
cp .env.example .env

# 4. Inicia el servidor de desarrollo
npm run dev
```

---

## 🔐 Variables de entorno

Crea un archivo `.env` en la raíz con las siguientes variables:

```env
VITE_API_URL_BACKEND=https://tu-backend.onrender.com/api/products
VITE_API_URL_BACKEND2=https://tu-backend.onrender.com/api/
```

> ⚠️ Todas las variables deben empezar por `VITE_` para que Vite las exponga al cliente.

---

## 🔑 Autenticación

El sistema usa **JWT** almacenado en `sessionStorage` con clave única por pestaña. Esto permite tener múltiples sesiones abiertas simultáneamente sin conflictos.

```
Login → token JWT → sessionStorage → interceptor axios → Authorization header
```

### Flujo al recargar la página

```
Recarga → AuthContext monta → lee token de sessionStorage
        → GET /auth/me con el token
        → usuario válido → setUser(data)
        → token expirado → logout automático
```

### Roles disponibles

- `user` — acceso a tienda, carrito, checkout y perfil
- `admin` — acceso adicional al panel de administración

---

## 🛒 Carrito de compras

El carrito se gestiona con `CartContext` y persiste en `localStorage`:

```js
const {
  cartItems,
  cartTotal,
  totalItems,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = useCart();
```

| Función                   | Descripción                          |
| ------------------------- | ------------------------------------ |
| `addToCart(product)`      | Añade producto o incrementa cantidad |
| `removeFromCart(id)`      | Elimina producto del carrito         |
| `updateQuantity(id, qty)` | Actualiza cantidad                   |
| `clearCart()`             | Vacía el carrito                     |
| `cartTotal`               | Total en euros                       |
| `totalItems`              | Número total de unidades             |

---

## 🗂️ Contextos

### AuthContext

```js
const { user, token, login, logout, loading, authHeader } = useAuth();
```

| Propiedad      | Descripción                                                        |
| -------------- | ------------------------------------------------------------------ |
| `user`         | Usuario autenticado `{ email, role, id }`                          |
| `token`        | JWT en memoria                                                     |
| `login(data)`  | Guarda usuario y token                                             |
| `logout()`     | Limpia sesión y llama al backend                                   |
| `loading`      | `true` mientras verifica el token al montar                        |
| `authHeader()` | Helper que devuelve `{ headers: { Authorization: "Bearer ..." } }` |

### ProductsContext

```js
const { products, getProducts, updateProduct, deleteProduct } = useProducts();
```

Los productos se cachean en `localStorage` para evitar peticiones innecesarias a la API. El caché se invalida automáticamente al crear, editar o eliminar productos.

### CartContext

```js
const {
  cartItems,
  cartTotal,
  totalItems,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = useCart();
```

---

## 🛣️ Rutas

### Rutas públicas

| Ruta                   | Componente       | Descripción                     |
| ---------------------- | ---------------- | ------------------------------- |
| `/`                    | `Home`           | Página de inicio                |
| `/productos`           | `App`            | Todos los productos con filtros |
| `/hombre`              | `GenderProducts` | Productos de hombre             |
| `/mujer`               | `GenderProducts` | Productos de mujer              |
| `/categoria/:category` | `Category`       | Productos por categoría         |
| `/search/:query`       | `SearchResults`  | Resultados de búsqueda          |
| `/login`               | `Login`          | Inicio de sesión                |
| `/register`            | `Register`       | Registro                        |
| `/nosotros`            | `Nosotros`       | Sobre nosotros                  |
| `/contacto`            | `Contact`        | Formulario de contacto          |
| `/envios`              | `Shipping`       | Política de envíos              |

### Rutas protegidas (usuario)

| Ruta                | Componente        | Descripción        |
| ------------------- | ----------------- | ------------------ |
| `/cart`             | `Cart`            | Carrito de compras |
| `/checkout`         | `Checkout`        | Proceso de compra  |
| `/checkout/success` | `CheckoutSuccess` | Confirmación       |
| `/profile`          | `Profile`         | Perfil y pedidos   |

### Rutas protegidas (admin)

| Ruta                   | Componente       | Descripción             |
| ---------------------- | ---------------- | ----------------------- |
| `/admin`               | `AdminDashboard` | Dashboard principal     |
| `/admin/analytics`     | `Analytics`      | Métricas y gráficos     |
| `/admin/orders`        | `Orders`         | Gestión de órdenes      |
| `/admin/users`         | `Users`          | Gestión de usuarios     |
| `/admin/products`      | `Products`       | Gestión de productos    |
| `/admin/reports`       | `Reports`        | Reportes + exportar CSV |
| `/admin/notifications` | `Notifications`  | Notificaciones          |
| `/admin/settings`      | `Settings`       | Configuración           |
| `/admin/help`          | `Help`           | Ayuda y FAQ             |
| `/admin/crear`         | `ProductForm`    | Crear producto          |

---

## 🎛️ Panel de administración

El panel admin incluye:

- **Dashboard** — métricas en tiempo real, gráficos de ventas e ingresos
- **Productos** — CRUD completo con subida de imágenes a Cloudinary
- **Órdenes** — gestión y cambio de estado con notificación por email
- **Usuarios** — CRUD de usuarios
- **Analytics** — gráficos de ingresos, pedidos por mes y distribución por estado
- **Reportes** — métricas financieras y exportación a CSV
- **Notificaciones** — centro de alertas generado desde datos reales
- **Ajustes** — configuración de perfil, tienda y sistema
- **Ayuda** — FAQ interactivo, guías y estado del sistema

---

## 🔍 Filtros de productos

Disponibles en `/productos`, `/hombre` y `/mujer`:

- Filtro por **género**
- Filtro por **talla** (S, M, L, XL, XXL)
- Filtro por **categoría** (Camisetas, Pantalones, Zapatos, Accesorios, Chaquetas)
- Filtro por **rango de precio** (mín/máx)
- **Ordenación** por precio ascendente/descendente y nombre A-Z/Z-A
- **Chips** de filtros activos con eliminación individual

---

## 💳 Flujo de checkout

```
Carrito → /checkout → dirección + pago demo
        → POST /orders → orden guardada en MongoDB
        → email de confirmación al usuario
        → email de notificación a la tienda
        → /checkout/success
```

El envío es **gratuito** en pedidos superiores a 50€, y de 4,99€ en pedidos menores.

---

## 📧 Emails automáticos

| Evento                    | Email enviado                                                |
| ------------------------- | ------------------------------------------------------------ |
| Registro                  | Bienvenida al usuario                                        |
| Checkout                  | Confirmación de pedido al usuario + notificación a la tienda |
| Cambio de estado de orden | Notificación al usuario con el nuevo estado                  |
| Formulario de contacto    | Consulta a la tienda + confirmación al usuario               |
| Newsletter                | Cupón de descuento `SAVE10` (−10%)                           |

---

## 🧩 Componentes principales

### `<ProtectedRoute esAdmin={false}>`

Protege rutas requiriendo autenticación. Con `esAdmin={true}` requiere rol admin.

### `<Navbar />`

Detecta el rol del usuario automáticamente desde el contexto y muestra los links correspondientes (usuario o admin). Incluye buscador, icono de carrito con badge y dropdown de notificaciones.

### `<Newsletter />`

Componente de suscripción que envía el cupón `SAVE10` al email del usuario.

---

## 🚀 Despliegue en Netlify

### 1. Archivo `_redirects`

Crea `public/_redirects`:

```
/*    /index.html   200
```

### 2. Build

```bash
npm run build
```

### 3. Netlify

1. Ve a [netlify.com](https://netlify.com)
2. `Add new site` → `Import from Git` → conecta tu repositorio
3. Configura:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Añade las variables de entorno en `Site settings → Environment variables`:
   ```
   VITE_API_URL_BACKEND2=https://tu-backend.onrender.com/api/
   VITE_API_URL_BACKEND=https://tu-backend.onrender.com/api/products
   ```
5. Despliega

---

## 🧑‍💻 Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo en http://localhost:5173
npm run build    # Build de producción en /dist
npm run preview  # Preview del build de producción
```

---

## 👤 Autor

Desarrollado por **Jose Gregorio Sanchez** — Proyecto Final
