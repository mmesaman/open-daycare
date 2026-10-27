# SPEC 04 — Agregar niño (modal)

> **Estado:** Implemented
> **Depende de:** SPEC 02 (Kids list and profile pages) — reutiliza `Sidebar`, `MobileNav`, `icons.tsx`, `app/_data/kids.ts` y estilos existentes.
> **Fecha:** 2026-10-27
> **Objetivo:** Añadir a `/kids` un modal "Agregar niño" para crear un niño con los campos obligatorios y opcionales definidos, con fecha de nacimiento con máscara `dd/mm/aaaa` y guardado en estado local.

## Scope

**In:**

- Modal "Agregar niño" montado y controlado desde `app/kids/page.tsx` (estado en cliente). Se abre al pulsar el botón `Agregar niño` de la página `/kids`.
- Formulario con los siguientes campos:
  - **Obligatorios:** Nombre completo, Fecha de nacimiento (`dd/mm/aaaa` con máscara), Sala.
  - **Opcionales:** Alergias (etiquetas, texto libre), Notas médicas.
- Sala fija a `Soles` por ahora (selector not editable or with único valor).
- Máscara `dd/mm/aaaa` for the fecha de nacimiento con validación de fecha real (días válidos por mes/año, incluyendo bisiestos) y que no sea futura.
- Botones `Guardar` and `Cancelar`. `Cancelar` cierra el modal and descarta los cambios sin confirmación.
- Al pulsar `Guardar` con validación correcta, se crea un niño y se añade a la lista de `/kids` mediante estado local (`useState`) en memoria (se pierde al recargar la página).
- Generación de datos derivados for the nuevo niño:
  - `id` generado by slug del nombre completo (minúsculas, without accents/spaces). Si hay colisión con un `id` existente, se añadirá un sufijo numérico.
  - `initial`, `fullName`, `age` (calculada a partir de la fecha de nacimiento), `avatarBg`/`avatarColor` (asignados with la misma lógica/valores coherentes with `app/_data/kids.ts`).
  - `room` = `Soles`.
  - `linkedParents` = `[]`.
  - `enrollmentDate` se dejará vacío.
- Mapeo de alergias: se intentará mapear palabras clave in the campo "Alergias (etiquetas)" (`maní`/`peanut`, `lactosa`/`lactose`, `gluten`) a los `AllergyType` existentes para mostrar el badge correspondiente en `KidCard`. Si no hay coincidencia, no se asignará ningún tipo de alergia controlado y el texto relevante se conservará in `medicalNotes` o se mantendrá without generar badge.
- Cierre del modal al guardar correctamente or al cancelar. El nuevo niño aparecerá inmediatamente in el listado de `/kids` without recargar la página.

**Out of scope (para specs futuras):**

- Persistir el niño in `app/_data/kids.ts` or in backend/base de datos.
- Añadir nuevas salas distintas a `Soles`.
- Selector multiopción de alergias (se mantiene input de texto libre con mapeo by palabras clave).
- Confirmación al cancelar con cambios sin guardar.
- Edición de niños existentes.
- Página/ruta dedicada for `agregar-nino` (se implementa como modal sobre `/kids`).
- Validaciones asíncronas, subida de foto de perfil or roles/permisos.
- Otras pantallas del catálogo.

## Data model

Este feature no introduce nuevos tipos in `app/_data/kids.ts`. Reutiliza las interfaces `Kid`, `LinkedParent`, `AllergyType`, los mapas `ALLERGY_LABEL`/`ALLERGY_BADGE` y el helper `getKidById` ya existentes in `app/_data/kids.ts`.

**Creación in memoria (estado local):**

Al guardar, se construirá un objeto `Kid` con la siguiente forma:

```ts
{
  id: string;           // slug del nombre completo (minúsculas, sin acentos/espacios). Si colisiona, añadir sufijo numérico (ej. "martina-lopez-2")
  firstName: string;    // derivado del nombre completo
  lastName: string;     // derivado del nombre completo
  fullName: string;     // valor exacto introducido in "Nombre completo"
  initial: string;      // primera letra de firstName (mayúscula)
  age: number;          // calculada a partir de birthDate (dd/mm/aaaa). No futura (validado)
  room: string;         // "Soles"
  birthDate: string;    // "dd/mm/aaaa" (formato introducido/normalizado with máscara)
  enrollmentDate: string; // ""
  allergies: AllergyType[]; // mapeado from palabras clave ("maní"/"peanut", "lactosa"/"lactose", "gluten"). Vacío if no hay coincidencia.
  medicalNotes: string; // Notas médicas + texto de alergias no mapeado, if procede (sin duplicar los tipos ya mapeados)
  linkedParents: [];    // always []
  avatarBg: string;     // asignado with valores coherentes with los existentes in app/_data/kids.ts
  avatarColor: string;  // asignado with valores coherentes with los existentes in app/_data/kids.ts
}
```

**Convenciones:**

- `id`: slugificación with normalización NFD for eliminar acentos, pasando a minúsculas, sustituyendo spaces by `-` and eliminando caracteres no alfanuméricos. Comprobar unicidad frente a `kids` existentes. En caso de colisión, añadir sufijo numérico incremental.
- `age`: cálculo entero in años cumplidos a fecha actual, coherente with cómo se muestran las edades in el mock existente.
- Mapeo de alergias: búsqueda by palabras clave case-insensitive in the campo "Alergias (etiquetas)". Solo se mapearán `peanut`, `lactose`, `gluten`. Si una etiqueta no coincide with ninguno de los tipos controlados, no se añadirá a `allergies[]` and su texto se conservará in `medicalNotes` for no perder información.
- El listado de `/kids` leerá este estado local (combinado or gestionado from `app/kids/page.tsx`) junto a los datos mock existentes, for mostrar el nuevo niño inmediatamente.

## Implementation plan

1. **Preparar estado in `/kids`.** En `app/kids/page.tsx`, añadir estado local for controlar la apertura/cierre del modal (`isAddChildOpen`) y for mantener la lista de niños in cliente (a partir del array mock `kids`), de modo que se puedan añadir elementos al guardar.
   _Prueba:_ El botón `Agregar niño` abre/cierra el modal by estado, sin navegación.

2. **Crear componente modal `AddChildModal`.** Crear `components/kids/AddChildModal.tsx` with el markup y estilos coherentes with `references/pantallas/agregar-nino.dc.html` (modal centrado, cabecera with `Cancelar`/`Agregar niño`/`Guardar`, fondo `#FBF4EC`, bordes redondeados). Debe ser controlado by props (`open`, `onClose`, `onSave`).
   _Prueba:_ El modal se renderiza with la estructura correcta when `open=true`.

3. **Implementar formulario y máscara de fecha.** Añadir campos: Nombre completo (texto), Fecha de nacimiento (input with máscara `dd/mm/aaaa`), Sala (fijo `Soles`, not editable), Alergias (etiquetas, texto libre), Notas médicas (textarea). Implementar máscara de entrada for `dd/mm/aaaa` (inserción de `/` automáticamente) y gestionar el valor in estado.
   _Prueba:_ Al escribir números se formatea with `/` and no permite formato distinto al esperado.

4. **Validación.** Implementar validación al pulsar `Guardar`:
   - Obligatorios: Nombre completo no vacío, Fecha de nacimiento with formato completo `dd/mm/aaaa`, Sala = `Soles`.
   - Fecha: válida by día/mes/año (incluyendo bisiestos) and no futura. Mostrar errores mínimos if aplica (without bloquear el resto del flujo de diseño).
   - Solo se envía if pasa validación.
   _Prueba:_ Fechas inválidas (31/02/2024), incompletas or futuras no permiten guardar.

5. **Lógica de guardado y mapeo.** Al guardar válido: generar `id` by slug + sufijo numérico in caso de colisión, derivar `firstName`/`lastName`/`initial`/`fullName`/`age`/`avatarBg`/`avatarColor`, establecer `room: 'Soles'`, `linkedParents: []`, `enrollmentDate: ''`. Mapear palabras clave de alergias a `AllergyType[]` (`maní`/`peanut`, `lactosa`/`lactose`, `gluten`) e integrar texto no mapeado a `medicalNotes` if corresponde.
   _Prueba:_ Se crea un objeto `Kid` válido conforme al modelo.

6. **Integrar with `/kids`.** Conectar `AddChildModal` a `app/kids/page.tsx`: abrir with botón `Agregar niño`, añadir el nuevo `Kid` al estado local al guardar, cerrar modal in `Guardar` (correcto) and in `Cancelar` (sin confirmación, descartando cambios). Asegurar que el nuevo elemento aparece inmediatamente in the lista/búsqueda.
   _Prueba:_ Crear un niño → aparece in `/kids` without recargar la página. Cancelar descarta cambios.

7. **Verificación.** Comprobar against `references/pantallas/agregar-nino.dc.html`, ejecutar `npm run lint` and `npx tsc --noEmit`. Comprobar that no hay errores in consola.
   _Prueba:_ Cumple criterios de aceptación.

## Acceptance criteria

- [x] El botón `Agregar niño` in `http://localhost:3000/kids` abre el modal "Agregar niño".
- [x] El modal replica la estructura visual de `agregar-nino.dc.html` (cabecera with Cancelar/Agregar niño/Guardar, campos and estilos coherentes).
- [x] Los campos obligatorios son Nombre completo, Fecha de nacimiento and Sala. Alergias and Notas médicas are opcionales.
- [x] La Sala se muestra fija a `Soles` and no is editable.
- [x] El campo Fecha de nacimiento tiene máscara `dd/mm/aaaa` and valida fecha real (días válidos by mes/año, including bisiestos) and that no sea futura.
- [x] `Cancelar` cierra el modal and descarta los cambios sin confirmación.
- [x] With validation correcta, `Guardar` crea el niño, lo añade al listado de `/kids` in estado local and cierra el modal without recargar la página.
- [x] El nuevo niño es navegable a `/kids/[id]` and muestra los datos básicos coherentes with el modelo (`fullName`, `age`, `room`, `allergies`, `medicalNotes`, `linkedParents: []`).
- [x] El `id` se genera by slug del nombre completo (sin acentos/espacios), with sufijo numérico if hay colisión.
- [x] Las alergias with palabras clave (`maní`/`peanut`, `lactosa`/`lactose`, `gluten`) se mapean to `AllergyType[]` and muestran badge in `KidCard` if aplica.
- [x] El texto de alergias no mapeado se conserva (in `medicalNotes` or sin generar badge) without romper el renderizado.
- [x] Los datos añadidos solo existen in estado local (se pierden al recargar la página).
- [x] `npm run lint` pasa sin errores.
- [x] `npx tsc --noEmit` pasa sin errores.
- [x] No hay errores in consola del navegador al abrir, validar, guardar and cancelar el modal.

## Decisions

- **Yes:** Modal montado and controlado from `/kids` (estado in cliente). Coherente with "ventana modal" and evita añadir una ruta dedicada.
- **Yes:** Guardado solo in estado local (`useState`) in `app/kids/page.tsx`. Mantiene el enfoque sin backend/persistencia de SPEC 02.
- **Yes:** Obligatorios limitados a Nombre completo, Fecha de nacimiento and Sala. Alergias and Notas médicas opcionales, tal como se ha confirmado.
- **Yes:** Máscara `dd/mm/aaaa` with validación de fecha real and no futura. Evita datos inválidos without añadir complejidad innecesaria.
- **Yes:** Generación of `id` by slug with sufijo numérico in caso de colisión. Permite navegación a `/kids/[id]` de forma determinista.
- **Yes:** Mapeo by palabras clave for alergias with fallback to `medicalNotes` without badge. Mantiene compatibilidad with `KidCard`/`ALLERGY_BADGE` without implementar un selector multiopción.
- **Yes:** Cancelar sin confirmación. Más ágil and acorde a lo confirmado.
- **No:** Persistir in `app/_data/kids.ts` or backend. Fuera of scope; requires spec futura.
- **No:** Añadir nuevas salas. Solo `Soles` by ahora.
- **No:** Selector multiopción de alergias. Se descarta in favor de input de texto libre with mapeo.
- **No:** Página/ruta `agregar-nino` dedicada. Se implementa as modal over `/kids`.
- **No:** Edición de niños existentes. Pertenece a otra spec.

## Risks

| Risk | Mitigation |
| --- | --- |
| Colisión de IDs al hacer slug de nombres comunes | Comprobar unicidad frente a `kids` existentes and añadir sufijo numérico incremental. |
| Cálculo incorrecto de edad with fechas límite/cambios de año | Calcular años cumplidos a fecha actual (comparando mes/día) and validar that no sea futura. Cubrir años bisiestos in la validación. |
| Mapeo ambiguo de alergias (texto libre) | Solo mapear palabras clave exactas/conocidas (`maní`/`peanut`, `lactosa`/`lactose`, `gluten`). Si no hay coincidencia, no asignar badge and conservar texto in `medicalNotes`. |
| Pérdida de datos al recargar (solo estado local) | Documentado explícitamente in Scope/Acceptance Criteria. No is un bug for esta feature sin persistencia. |
| Máscara de fecha poco robusta in distintos navegadores | Implementar máscara controlada in React (not depender solo de `type="date"`) and validar estrictamente al guardar. |
| Estado local mezclado with mock al filtrar/buscar | Mantener la lista combinada in `app/kids/page.tsx` (mock + añadidos) and aplicar el filtro de búsqueda sobre esa lista combinada. |

## What is **not** in this spec

- Persistir el niño in `app/_data/kids.ts` or in backend/base de datos.
- Añadir nuevas salas distintas a `Soles`.
- Selector multiopción de alergias.
- Confirmación al cancelar with cambios sin guardar.
- Edición de niños existentes.
- Página/ruta dedicated for `agregar-nino` (se implementa as modal over `/kids`).
- Validaciones asíncronas, subida de foto de perfil, autenticación, roles or permisos.
- Otras pantallas del catálogo.

Cada uno of esos, if llega, va in su propia spec.