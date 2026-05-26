import React from "react";
type Props = {
    id: string;
    /** The user's JavaScript — must contain a function `render(ctx) { return htmlString }` */
    js: string;
    css?: string;
    className?: string;
    context: Record<string, unknown>;
};
/**
 * Renders a user-authored JavaScript component inside a sandboxed iframe.
 *
 * The user writes a real JS function:
 * ```js
 * function render(ctx) {
 *   const { game, broadcast } = ctx;
 *   return `<div class="timer">${formatTime(game.time)}</div>`;
 * }
 * ```
 *
 * Context updates are pushed via postMessage so the component re-renders
 * without rebuilding the iframe.
 */
export declare const JsCustomComponent: React.NamedExoticComponent<Props>;
export default JsCustomComponent;
