# SPEC 01 — Home con feed de la sala

> **Status:** Draft
> **Depends on:** —
> **Date:** 2026-10-26
> **Objective:** Reemplazar la home de `create-next-app` por la pantalla `references/pantallas/feed.dc.html`, replicando su estilo de forma exacta con datos mock.

## Por qué existe este spec

El HTML de `references/pantallas/` es la referencia visual, no código a portar. Hay que pasarlo a React + Tailwind sin reinterpretar medidas, colores ni tipografías, porque la fidelidad visual es el único criterio de aceptación del pedido.

## Scope

**In:**

- Ruta `/` (`app/page.tsx`) con el layout completo del mockup: sidebar fija de 248px y columna de feed centrada de 760px.
- Sidebar: logo `OpenDayCare` / `Sala Soles`, botón "Nueva publicación", navegación (Feed activo, Niños, Avisos, Mi cuenta) y bloque de usuario `Caro Giménez`.
- Encabezado: kicker `GUARDERÍA · SALA SOLES`, saludo `Buenas, Caro`, subtítulo `12 niños · martes 17 jun`.
- Composer visual "Compartí un momento…".
- Separador `PUBLICADO HOY` y los 3 posts del mockup: logro, actividad con placeholder de foto, anuncio general.
- Tipografías Fredoka (títulos, nombres, iniciales) y Nunito (texto), cargadas con `next/font/google`.
- Paleta y sombras tomadas literalmente del mockup.
- Adaptación responsive simple: desde 1024px idéntico al mockup; por debajo el sidebar se oculta y el contenido ocupa el ancho con padding reducido.
- Datos mock en un módulo tipado separado de la página.

**Out of scope (para specs futuros):**

- Autenticación, sesión, roles y cualquier ruta de login.
- Base de datos, API routes, server actions y persistencia.
- Likes, comentarios, edición, creación de publicaciones y cualquier interacción con estado o navegación real.
- Resto de las pantallas de `references/pantallas/` (niños, avisos, mi cuenta, crear/detalle publicación, familia, login).
- Tema oscuro, internacionalización, tests automatizados y despliegue.

## Data model

No hay persistencia. Nuevo archivo `app/_data/feed.ts` con los tipos y los datos de ejemplo:

```ts
export type TipoPublicacion = "logro" | "actividad" | "anuncio";

export interface AutorPublicacion {
  nombre: string;          // "Mateo" | "Anuncio general"
  inicial?: string;        // "M"; ausente en anuncios
  fondo: string;           // "#A9D9E8" | "#CCD8F4"
  texto: string;           // "#1F7A93" | "#4E72C8"
  icono?: "megafono";      // solo anuncios
}

export interface Publicacion {
  id: string;              // "mateo-logro", "mateo-actividad", "anuncio-parque"
  tipo: TipoPublicacion;
  autor: AutorPublicacion;
  hora: string;            // "14:20" — se muestra junto a " · publicado por vos"
  para: string;            // "familia de Mateo" | "toda la sala"
  texto: string;
  likes: number;
  comentarios: number;
  foto?: { descripcion: string }; // "Foto · pintando con témperas"
}

export const publicaciones: Publicacion[];
```

Los tres valores de `tipo` se mapean a los estilos del badge del mockup:

- `logro`: fondo `#CFEBD8`, punto y texto `#3E9B6C`, etiqueta `LOGRO`.
- `actividad`: fondo `#C7E7F1`, punto y texto `#2E89A6`, etiqueta `ACTIVIDAD`.
- `anuncio`: fondo `#CCD8F4`, punto y texto `#4E72C8`, etiqueta `ANUNCIO`.

## Implementation plan

1. Crear `app/_data/feed.ts` con los tipos y los 3 posts copiados del mockup, incluidos los textos y contadores (`3/1`, `5/2`, `8/0`). Verificación: `npx tsc --noEmit`.
2. Reescribir `app/globals.css`: quitar el bloque `@media (prefers-color-scheme: dark)` y el `font-family: Arial` del `body`; declarar tokens en `@theme` para los colores del mockup (`#F6ECDF`, `#FFFDF9`, `#ECE0D0`, `#3F362E`, `#4A4038`, `#94887B`, `#A89A8B`, `#D9583C`, `#E0654A`, `#C5503A`), fuentes y el scrollbar webkit (`10px`, thumb `#E4D6C4`). Verificación: `npm run dev` sigue renderizando.
3. Cambiar `app/layout.tsx`: reemplazar Geist por `Fredoka` y `Nunito` de `next/font/google` con variables `--font-fredoka` y `--font-nunito`; `lang="es"`, metadata `OpenDayCare — Sala Soles`, `body` con fondo crema y `font-sans` = Nunito. Verificación: la home muestra ambas tipografías.
4. Crear `app/_components/icons.tsx` con los SVG del mockup como componentes (`SunIcon`, `PlusIcon`, `HomeIcon`, `ChildrenIcon`, `BellIcon`, `UserIcon`, `LogoutIcon`, `CameraIcon`, `HeartIcon`, `CommentIcon`, `ImagePlaceholderIcon`, `MegaphoneIcon`), usando `strokeWidth`, `fill` y tamaños del original. Verificación: renderizan sin warnings de React.
5. Crear `app/_components/sidebar.tsx` con la estructura y medidas del `<aside>`: 248px, `sticky top-0 h-screen`, logo, CTA coral con gradiente, navegación con Feed activo (`#FBE3D8` / `#D9583C`) y bloque inferior de usuario. Verificación: se ve igual al mockup en desktop.
6. Crear `app/_components/feed-post-card.tsx` que reciba una `Publicacion` y reproduzca avatar o icono, badge por tipo, `Para:`, texto, placeholder de foto opcional y barra de acciones (like en coral, comentarios, "Editar"). Verificación: los 3 tipos se distinguen por color.
7. Reescribir `app/page.tsx`: `<div class="flex min-h-screen bg-crema">`, sidebar, `<main>` con scroll, encabezado, composer, separador y `publicaciones.map(...)`. Verificación: `/` reproduce el mockup completo.
8. Ajustar responsive: ocultar sidebar con `lg:` y reducir padding del contenedor por debajo de 1024px, sin alterar el layout desktop. Verificación: 1440px y 390px sin scroll horizontal.
9. Verificación visual con Playwright MCP en 1440×900 y 390×844; guardar capturas en `.playwright-mcp/` y comparar contra `references/screenshots/feed.png`. Verificación: `npm run lint`, `npx tsc --noEmit` y `npm run build` pasan.

## Acceptance criteria

- [ ] `/` ya no muestra el contenido de `create-next-app` (logo de Next, textos en inglés ni botones "Deploy Now"/"Documentation").
- [ ] El sidebar mide 248px, fondo `#FFFDF9`, borde derecho `#ECE0D0` y permanece fijo al hacer scroll del feed.
- [ ] "Feed" aparece activo con fondo `#FBE3D8` y texto `#D9583C`; los demás ítems usan `#6E6359`.
- [ ] El botón "Nueva publicación" usa el gradiente `#F4977E → #EE8164`.
- [ ] El bloque de usuario muestra `Caro Giménez` y `Maestra · Soles`.
- [ ] El encabezado muestra el kicker, `Buenas, Caro` y `12 niños · martes 17 jun`.
- [ ] Se listan exactamente 3 posts en el orden logro → actividad (con foto) → anuncio.
- [ ] Los badges muestran `LOGRO`, `ACTIVIDAD` y `ANUNCIO` con los colores del mockup.
- [ ] Los contadores de like/comentarios son `3/1`, `5/2` y `8/0`.
- [ ] Ningún elemento clickeable navega, cambia estado ni dispara errores; los likes no incrementan.
- [ ] Se usan Fredoka en títulos, nombres e iniciales y Nunito en el resto; no queda Geist ni Arial.
- [ ] El fondo global es `#F6ECDF` también con `prefers-color-scheme: dark`.
- [ ] A 1024px o más el layout coincide con `references/screenshots/feed.png`; por debajo no hay scroll horizontal y el sidebar no se muestra.
- [ ] `npm run lint`, `npx tsc --noEmit` y `npm run build` terminan sin errores.
- [ ] La consola del navegador no muestra errores ni warnings de hidratación.

## Decisions

- **Sí:** solo visual estático. El pedido es de fidelidad de estilo; interacciones y navegación necesitan datos y rutas que no existen.
- **Sí:** datos mock tipados en `app/_data/feed.ts`. La página queda como mapeo puro y el archivo se reemplaza luego por una fuente real.
- **Sí:** `next/font/google` con variables. Evita layout shift y el warning de `next/no-page-custom-font`; el resultado visual es el mismo que el `<link>` del mockup.
- **Sí:** Tailwind con valores arbitrarios (`bg-[#F6ECDF]`, sombras exactas). Mantiene el patrón del repo y permite copiar los valores del mockup sin tokens inventados.
- **Sí:** responsive desde `lg` (1024px). El mockup es desktop; ocultar el sidebar es la adaptación más barata que no altera el diseño pedido.
- **Sí:** eliminar el modo oscuro de `globals.css`. El mockup no tiene variante oscura y el media query actual rompería la paleta.
- **No:** CSS Modules o estilos inline copiados. Duplicarían el patrón de estilos y complicarían el mantenimiento.
- **No:** `postcss.config`. Tailwind 4 ya entra por la regla Turbopack de `next.config.ts`.
- **No:** borrar los assets de `public/` que queden sin uso. Limpieza fuera de alcance.
- **No:** tests automatizados ni snapshot visual con umbral de píxeles. La verificación es captura manual comparada con `references/screenshots/feed.png`.

## Risks

| Risk | Mitigation |
| --- | --- |
| `next/font/google` descarga las fuentes en build; sin red el build falla | Si ocurre, usar `display: "swap"` y documentar que el build requiere red; no reemplazar por `<link>` sin aprobación. |
| El `100vh` del sidebar y el `min-h-screen` del contenedor difieren por la barra de scroll del `<main>` | Usar `h-screen` en el sidebar y `h-screen overflow-y-auto` en el `<main>`, como el mockup, y verificar en 1440×900. |
| El scrollbar custom solo aplica en navegadores WebKit | Aceptado: es decorativo y no afecta el layout del feed. |
| Diferencias subpixel por conversión de estilos inline a Tailwind | Comparar captura contra `references/screenshots/feed.png` y ajustar valores arbitrarios, no introducir CSS global nuevo. |

## What is **not** in this spec

- Autenticación, base de datos o API.
- Resto de las pantallas de `references/pantallas/`.
- Interacciones reales (likes, comentarios, edición, crear publicación).
- Tema oscuro, i18n y tests automatizados.

Cada uno, si llega, va en su propio spec.
