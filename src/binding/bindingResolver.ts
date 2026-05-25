/**
 * Binding resolver for overlay component props/styles/HTML.
 * Supports syntax: {{path.to.value | filterName}}
 * Does NOT use eval or Function — uses safe recursive property access.
 */

const BINDING_REGEX = /\{\{([^}]+)\}\}/g;

/**
 * Safely resolve a dotted path against a plain object context.
 * Supports numeric keys for array indices (e.g. "game.teams.0.name").
 */
export function resolvePath(
  path: string,
  context: Record<string, unknown>,
): unknown {
  const parts = path.trim().split(".");
  let value: unknown = context;
  for (const part of parts) {
    if (value === null || value === undefined) return undefined;
    if (typeof value !== "object") return undefined;
    value = (value as Record<string, unknown>)[part];
  }
  return value;
}

/**
 * Apply a named filter transform to a resolved value.
 */
export function applyFilter(value: unknown, filterName: string): unknown {
  const name = filterName.trim();
  switch (name) {
    case "clock": {
      const seconds =
        typeof value === "number" ? value : parseFloat(String(value));
      if (isNaN(seconds)) return "0:00";
      const m = Math.floor(Math.abs(seconds) / 60);
      const s = Math.floor(Math.abs(seconds) % 60);
      return `${m}:${s.toString().padStart(2, "0")}`;
    }
    case "round":
      return Math.round(
        typeof value === "number" ? value : parseFloat(String(value)),
      );
    case "floor":
      return Math.floor(
        typeof value === "number" ? value : parseFloat(String(value)),
      );
    case "ceil":
      return Math.ceil(
        typeof value === "number" ? value : parseFloat(String(value)),
      );
    case "percent": {
      const n = typeof value === "number" ? value : parseFloat(String(value));
      return `${Math.round(n * 100)}%`;
    }
    case "uppercase":
      return String(value ?? "").toUpperCase();
    case "lowercase":
      return String(value ?? "").toLowerCase();
    case "fallback":
      return value ?? "";
    default:
      return value;
  }
}

/**
 * Resolve all `{{...}}` bindings in a single string template.
 * Returns the original string if no bindings are found.
 */
export function resolveBinding(
  template: string,
  context: Record<string, unknown>,
): string {
  if (!template.includes("{{")) return template;
  return template.replace(BINDING_REGEX, (_, inner: string) => {
    const pipeIdx = inner.indexOf("|");
    let path: string;
    let filterName: string | null = null;

    if (pipeIdx !== -1) {
      path = inner.slice(0, pipeIdx).trim();
      filterName = inner.slice(pipeIdx + 1).trim();
    } else {
      path = inner.trim();
    }

    const value = resolvePath(path, context);
    if (value === undefined || value === null) return "";
    const resolved =
      filterName !== null ? applyFilter(value, filterName) : value;
    return String(resolved);
  });
}

/**
 * Recursively resolve bindings in any value (string, array, or object).
 */
export function resolveBindingsDeep(
  value: unknown,
  context: Record<string, unknown>,
): unknown {
  if (typeof value === "string") {
    return resolveBinding(value, context);
  }
  if (Array.isArray(value)) {
    return value.map((v) => resolveBindingsDeep(v, context));
  }
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k,
        resolveBindingsDeep(v, context),
      ]),
    );
  }
  return value;
}
