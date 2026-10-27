# SPEC 03 — Pantallas de Login y Activar cuenta

> **Estado:** Implemented
> **Depende de:** SPEC 01 (Home Feed estático)
> **Fecha:** 2026-10-27
> **Objetivo:** Implementar las pantallas de inicio de sesión (`/login`) y activación de cuenta (`/activar-cuenta`) como calco visual de `references/pantallas/login.dc.html` y `references/pantallas/activar-cuenta.dc.html`, sin selector de rol en login y con navegación funcional entre ambas.

## Scope

**In:**

- Página `/login` en `app/login/page.tsx` replicando visualmente `references/pantallas/login.dc.html`, sin el selector "Personal"/"Familia". Solo campos email/contraseña, botón "Iniciar sesión", link "¿Olvidaste tu contraseña?" (placeholder visual) y link a activar cuenta.
- Página `/activar-cuenta` en `app/activar-cuenta/page.tsx` replicando visualmente `references/pantallas/activar-cuenta.dc.html` con datos mock estáticos (Mateo · Sala Soles, código `7K4P9`, email `lucia.fernandez@gmail.com`).
- Panel lateral decorativo en login (gradiente coral, logo OpenDayCare, copy promocional y ubicación) idéntico al template.
- Fuentes Fredoka (headings) + Nunito (cuerpo) coherentes con el resto del proyecto (`next/font/google`).
- Paleta cálida existente (`#FBF4EC`, `#F2937A`, `#D9583C`, etc.).
- Navegación funcional con `next/link`: desde login a `/activar-cuenta` y desde activar-cuenta a `/login`. Botón "Iniciar sesión" navega a `/` (`app/page.tsx` existente).
- Componentes reutilizables si aplica en `components/shared/` o propios en `components/auth/` siguiendo la convención del proyecto.

**Out of scope (para specs futuras):**

- Autenticación real, validación de formularios, gestión de sesiones o cookies.
- Lógica de activación de cuenta (verificación de código, envío de formulario, estados de error/éxito).
- Funcionalidad de "¿Olvidaste tu contraseña?" (queda como placeholder visual sin acción).
- Persistencia, base de datos o llamadas a API.
- Otras pantallas del catálogo.
- Protección de rutas o redirecciones condicionales por rol (el rol se elimina completamente de login).

## Data model

Esta feature **no introduce nuevas estructuras de datos persistentes**. Reutiliza el estilo y tokens existentes en el proyecto.

Únicamente se usan valores mock estáticos embebidos en los componentes/páginas:

```ts
// Valores mock para activar-cuenta/page.tsx
const mockActivation = {
  childName: "Mateo",
  room: "Sala Soles",
  inviteCode: "7K4P9",
  email: "lucia.fernandez@gmail.com",
  avatarInitial: "M",
  avatarBg: "#A9D9E8",
  avatarColor: "#1F7A93",
} as const;
```

Convenciones:
- Los textos de UI van en español (coherente con el proyecto).
- Los colores siguen los tokens ya definidos en `app/globals.css` (`#FBF4EC`, `#F2937A`, `#D9583C`, `#EADFD0`, `#94887B`, etc.).
- No se añade estado compartido, contexto ni lógica de formularios. Los inputs pueden mostrarse con valores pre-rellenados únicamente con fines visuales.

## Implementation plan

1. **Preparar estructura de rutas.** Crear los directorios `app/login/` y `app/activar-cuenta/`. Verificar que no exista conflicto con rutas actuales.
   *Prueba:* Los directorios existen y están listos para recibir las páginas.

2. **Crear página de Login.** Implementar `app/login/page.tsx` como calco visual de `references/pantallas/login.dc.html`. Eliminar completamente el selector "Personal"/"Familia" y su lógica. Mantener panel lateral decorativo (gradiente coral, logo OpenDayCare, copy promocional y ubicación), formulario con email y contraseña, link "¿Olvidaste tu contraseña?" como placeholder visual, botón "Iniciar sesión" con `next/link` hacia `/` y link "Activá tu cuenta" con `next/link` hacia `/activar-cuenta`. Usar `next/font/google` para Fredoka y Nunito, coherente con el resto del proyecto.
   *Prueba:* Navegar a `/login` y verificar que no aparece el selector de rol, que el layout a dos columnas coincide visualmente con el template y que los links/apuntes de navegación están presentes.

3. **Crear página de Activar cuenta.** Implementar `app/activar-cuenta/page.tsx` como calco visual de `references/pantallas/activar-cuenta.dc.html`. Renderizar con datos mock estáticos (tarjeta con inicial `M`, `Mateo · Sala Soles`, código `7K4P9`, email `lucia.fernandez@gmail.com`). Incluir checkbox de autorización (solo visual), botón "Activar mi cuenta" con `next/link` hacia `/` y link "Iniciar sesión" con `next/link` hacia `/login`. 
   *Prueba:* Navegar a `/activar-cuenta` y verificar que los datos mock se muestran correctamente y que la navegación hacia `/login` funciona.

4. **Ajustes de estilos/globales si aplica.** Verificar que los colores y fuentes usadas encajan con lo ya definido en `app/globals.css`. Solo añadir estilos locales si es estrictamente necesario. No modificar `tailwind.config.ts` (no existe) ni añadir dark mode.
   *Prueba:* Revisar contraste/colores frente a `references/screenshots/` y asegurar consistencia con el resto de la app.

5. **Verificación final.** Comprobar navegación completa entre `/login` ↔ `/activar-cuenta` y desde login hacia `/` con `next/link`. Ejecutar `npm run lint` y `npx tsc --noEmit`.
   *Prueba:* `npm run lint` sin errores, `npx tsc --noEmit` sin errores, navegación funcional entre las rutas y sin errores en consola.

## Acceptance criteria

- [ ] Existe la ruta `/login` en `app/login/page.tsx` y se renderiza sin el scaffold por defecto.
- [ ] En `/login` **no** aparece el selector "Personal" o "Familia". Solo se muestran email, contraseña, botón "Iniciar sesión", link "¿Olvidaste tu contraseña?" y link "Activá tu cuenta".
- [ ] El panel lateral de `/login` replica visualmente el gradiente coral, logo `OpenDayCare`, copy promocional y ubicación del template `references/pantallas/login.dc.html`.
- [ ] El botón "Iniciar sesión" en `/login` navega a `/` mediante `next/link`.
- [ ] El link "Activá tu cuenta" en `/login` navega a `/activar-cuenta` mediante `next/link`.
- [ ] Existe la ruta `/activar-cuenta` en `app/activar-cuenta/page.tsx` y replica visualmente `references/pantallas/activar-cuenta.dc.html`.
- [ ] En `/activar-cuenta` se muestran los datos mock estáticos: tarjeta con inicial `M`, `Mateo · Sala Soles`, código de invitación `7K4P9`, email `lucia.fernandez@gmail.com` y el checkbox de autorización (solo visual).
- [ ] El link "Iniciar sesión" en `/activar-cuenta` navega a `/login` mediante `next/link`.
- [ ] Se usan las fuentes `Fredoka` (headings/avatares) y `Nunito` (cuerpo) vía `next/font/google`, coherentes con el resto del proyecto.
- [ ] Se respeta la paleta cálida existente del proyecto (`#FBF4EC`, `#F2937A`, `#D9583C`, `#EADFD0`, `#94887B`, etc.).
- [ ] No hay lógica de autenticación, validación de formularios, activación de cuenta o llamadas a API.
- [ ] "¿Olvidaste tu contraseña?" queda como placeholder visual sin navegación ni acción.
- [ ] `npm run lint` pasa sin errores.
- [ ] `npx tsc --noEmit` pasa sin errores.
- [ ] No hay errores en la consola del navegador al cargar `/login` y `/activar-cuenta`.

## Decisions

- **Sí:** Crear rutas limpias `app/login/page.tsx` y `app/activar-cuenta/page.tsx`. Es idiomático con App Router y separa estas pantallas del resto de la app.
- **No:** Reutilizar `app/page.tsx` para login. `app/page.tsx` ya es el home/feed según SPEC 01 y tiene un propósito distinto.
- **Sí:** Eliminar completamente el selector "Personal"/"Familia" del login, tal como pidió el usuario. Simplifica la UI y elimina lógica innecesaria para este alcance.
- **No:** Mantener el selector de rol oculto o inhabilitado. Eliminarlo por completo evita código muerto y reduce la posibilidad de confusión.
- **Sí:** Redirigir "Iniciar sesión" hacia `/` (home/feed existente). Coherente con la decisión de no usar roles y aprovecha la pantalla ya implementada en SPEC 01.
- **Sí:** Navegación funcional entre `/login` y `/activar-cuenta` con `next/link`. Necesaria para conectar ambas pantallas.
- **Sí:** Datos mock estáticos embebidos en la página de activar-cuenta. Igual enfoque que SPEC 01 (sin persistencia/base de datos).
- **No:** Añadir validación, lógica de activación o gestión de sesiones. Fuera de scope.
- **Sí:** Usar `next/font/google` para Fredoka y Nunito. Coherente con las convenciones del proyecto.
- **No:** Crear componentes complejos si no son necesarios. Si se reutiliza algo, irá a `components/auth/` o `components/shared/` siguiendo las convenciones existentes.

## Risks

| Riesgo | Mitigación |
| --- | --- |
| El calco pixel-perfect puede requerir valores arbitrarios de Tailwind (`[...]`) para acercarse al template `.dc.html`. | Aceptar el trade-off. Reutilizar los tokens ya definidos en `app/globals.css` cuando sea posible. |
| Diferencias sutiles entre `next/font` (Fredoka/Nunito) y el `<link>` de Google Fonts del template. | Verificar pesos cargados (Fredoka 400/500/600/700, Nunito 400-800) y comparar visualmente. |
| El botón "Activar mi cuenta" podría dar la impresión de ser funcional aunque solo sea visual. | Mantenerlo como elemento visual o con navegación mínima; no implementar lógica de activación (fuera de scope). |

## What is **not** in this spec

- Autenticación real, validación de formularios, gestión de sesiones o cookies.
- Lógica de activación de cuenta (verificación de código de invitación, envío, estados de error/éxito).
- Funcionalidad de "¿Olvidaste tu contraseña?" (queda como placeholder visual).
- Persistencia, base de datos o llamadas a API.
- Protección de rutas o redirecciones condicionales por rol.
- Selector de rol "Personal"/"Familia" (eliminado intencionalmente).
- Otras pantallas del catálogo distintas a login y activar-cuenta.

Cada uno de esos, si llega, va en su propia spec.