# RL Overlay – Copilot Instructions

This is a React component library for Rocket League broadcast overlays, published as `@four-leaf-studios/rl-overlay`.

## Architecture

- **Library entry:** `src/index.ts` re-exports all public components, hooks, types, and the registry.
- **Component registry:** `src/registry.ts` maps `code_id` strings to React components. The `Overlay` component resolves components from this registry at runtime.
- **Context:** `BroadcastContext` provides broadcast data (teams, scores, series info) to all child components.
- **Hooks:** Custom hooks in `src/hooks/` consume the `@four-leaf-studios/rl-socket-hook` package for live game state.
- **Styling:** CSS files in `src/css/` are theme presets. Components use className-based styling with left/right team modifiers.

## Conventions

### Adding a New Component

1. Create `src/MyComponent.tsx` with a named export and a default export.
2. Use the pattern: `export const MyComponent = ...` + `export default MyComponent;` (or `memo(MyComponent)`).
3. Add the component to `src/registry.ts` if it should be renderable via overlay configuration.
4. Re-export from `src/index.ts`.
5. Add a test in `tests/MyComponent.test.tsx`.

### Component Patterns

- Props types are defined inline in the component file (not in `types.d.ts` unless shared).
- Use `data-component-id="ComponentName"` on the root element for debugging/targeting.
- Team-specific styling uses a `modifier` variable: `const modifier = team === 0 ? "left" : "right";`
- Animations use `framer-motion` with `AnimatePresence` for enter/exit transitions.
- Components that depend on game state should return `null` when data is unavailable.
- Use `memo()` for components that receive primitive props or are rendered in lists.

### Hooks

- Hooks consume `useEventSelector` or `useEvent` from `@four-leaf-studios/rl-socket-hook`.
- Always handle the case where state is `null`/`undefined` (game not yet initialized).
- Export hooks as default exports; re-export from `src/hooks/index.ts`.

### Types

- Shared domain types (`Broadcast`, `Team`, `Player`, `OverlayObject`, etc.) live in `src/types.d.ts`.
- Component-specific prop types stay in their component file.

### Testing

- Tests live in `tests/` using Vitest + React Testing Library.
- Mock `@four-leaf-studios/rl-socket-hook` via `vi.mock()` in tests that render components using game state hooks.
- Mock `framer-motion` when testing structure/content (not animation behavior).
- Use `tests/fixtures.ts` for shared mock data (`mockBroadcast`, `mockOverlay`, `mockPlayerState`).
- Run tests: `npm test` (single run) or `npm run test:watch` (watch mode).

### CSS / Theming

- Each CSS theme file in `src/css/` is self-contained.
- Class names follow the pattern: `{element}_{descriptor}` with optional `{side}_{element}_{descriptor}` for team-specific styles.
- Team color CSS variables are injected by `useOverlayStyles` hook: `--team-left-primary`, `--team-right-primary`, etc.
- Components can use `--team-color` as an inline CSS variable for per-component team coloring.

### Build

- Rollup bundles to CJS + ESM in `dist/`.
- CSS is inlined (not extracted) — each component's CSS is injected via `<style>` tags at runtime.
- React and React DOM are peer dependencies (not bundled).

## Do NOT

- Add runtime dependencies without discussion — this is a lightweight overlay library.
- Put component-specific types in `types.d.ts` — only shared domain types belong there.
- Skip null checks on game state — the websocket data arrives asynchronously.
- Use inline styles for theming — use CSS classes and CSS variables instead.
- Forget to register new overlay components in `src/registry.ts`.
