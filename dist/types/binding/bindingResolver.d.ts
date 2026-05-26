/**
 * Binding resolver for overlay component props and styles.
 *
 * Resolves `{{path.to.value | filterName}}` expressions within component
 * prop and style objects. Supports filters: clock, round, floor, ceil,
 * percent, uppercase, lowercase, fallback.
 *
 * Does NOT use eval or Function — uses safe recursive property access.
 */
/**
 * Safely resolve a dotted path against a plain object context.
 * Supports numeric keys for array indices (e.g. "game.teams.0.name").
 */
export declare function resolvePath(path: string, context: Record<string, unknown>): unknown;
/**
 * Apply a named filter transform to a resolved value.
 */
export declare function applyFilter(value: unknown, filterName: string): unknown;
/**
 * Resolve all `{{...}}` bindings in a single string template.
 * Returns the original string if no bindings are found.
 */
export declare function resolveBinding(template: string, context: Record<string, unknown>): string;
/**
 * Recursively resolve bindings in any value (string, array, or object).
 */
export declare function resolveBindingsDeep(value: unknown, context: Record<string, unknown>): unknown;
