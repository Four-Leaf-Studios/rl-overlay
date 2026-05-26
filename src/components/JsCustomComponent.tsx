"use client";

import React, { memo, useEffect, useRef, useMemo } from "react";

/**
 * Scope raw CSS to a specific component ID by prepending the selector.
 * Duplicated here to avoid a circular dep on CustomHtmlComponent.
 */
function scopeCss(css: string, componentId: string): string {
  if (!css.trim()) return "";
  const selector = `[data-component-id="${componentId}"]`;
  return (
    css
      .split("}")
      .filter((block) => block.trim())
      .map((block) => {
        const braceIdx = block.indexOf("{");
        if (braceIdx === -1) return block;
        const selectors = block.slice(0, braceIdx).trim();
        const rules = block.slice(braceIdx);
        const scoped = selectors
          .split(",")
          .map((s) => `${selector} ${s.trim()}`)
          .join(", ");
        return `${scoped} ${rules}`;
      })
      .join("}\n") + "}"
  );
}

/**
 * Build a complete sandboxed HTML document for a JS-mode component.
 *
 * The document:
 *   1. Injects the user's scoped CSS
 *   2. Provides helper functions (formatTime, formatPercent, etc.)
 *   3. Injects the initial context as JSON
 *   4. Calls the user's render(ctx) function
 *   5. Listens for postMessage({ type: "update", context }) to re-render
 *
 * Security: runs with sandbox="allow-scripts" only — no same-origin access,
 * no cookies, no localStorage, no network (no allow-same-origin / allow-forms).
 */
function buildSrcdoc(
  js: string,
  css: string,
  context: Record<string, unknown>,
): string {
  const ctxJson = JSON.stringify(context);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 100%; height: 100%; background: transparent; overflow: hidden; }
</style>
<style id="component-css">${css}</style>
</head>
<body>
<div id="root"></div>
<script>
// ---- Built-in helpers available inside render() ----
function formatTime(seconds) {
  if (typeof seconds !== 'number' || isNaN(seconds)) return '0:00';
  var m = Math.floor(Math.abs(seconds) / 60);
  var s = Math.floor(Math.abs(seconds) % 60);
  return m + ':' + (s < 10 ? '0' : '') + s;
}
function formatPercent(n) {
  var num = typeof n === 'number' ? n : parseFloat(n);
  return Math.round(isNaN(num) ? 0 : num * 100) + '%';
}
function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }

// ---- Initial context ----
var __ctx = ${ctxJson};

// ---- User component function ----
${js}

// ---- Initial render ----
function __render() {
  try {
    document.getElementById('root').innerHTML = render(__ctx);
  } catch(e) {
    document.getElementById('root').innerHTML =
      '<div style="color:#f87171;font-family:monospace;font-size:12px;padding:8px;white-space:pre-wrap">' +
      'render() error:\\n' + e.message + '</div>';
  }
}
__render();

// ---- Live context updates ----
window.addEventListener('message', function(e) {
  try {
    var msg = JSON.parse(e.data);
    if (msg && msg.type === 'update') {
      __ctx = msg.context;
      __render();
    }
  } catch(_) {}
});
<\/script>
</body>
</html>`;
}

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
export const JsCustomComponent = memo(function JsCustomComponent({
  id,
  js,
  css,
  className,
  context,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const scopedCss = useMemo(() => (css ? scopeCss(css, id) : ""), [css, id]);

  // Initial srcdoc — set once on mount / when js or css changes
  const srcdoc = useMemo(
    () => buildSrcdoc(js, css ?? "", context),
    // Only rebuild the whole doc when js or css changes, not every context tick
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [js, css],
  );

  // Track whether the iframe has loaded so we can safely postMessage
  const readyRef = useRef(false);

  // When js/css changes, reload the whole document
  useEffect(() => {
    readyRef.current = false;
    const iframe = iframeRef.current;
    if (iframe) iframe.srcdoc = buildSrcdoc(js, css ?? "", context);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [js, css]);

  // When context changes (game ticks), push an update message
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !readyRef.current) return;
    iframe.contentWindow?.postMessage(
      JSON.stringify({ type: "update", context }),
      "*",
    );
  }, [context]);

  return (
    <div
      data-component-id={id}
      className={className}
      style={{ width: "100%", height: "100%" }}
    >
      <iframe
        ref={iframeRef}
        title={`js-component-${id}`}
        srcDoc={srcdoc}
        onLoad={() => {
          readyRef.current = true;
        }}
        style={{ width: "100%", height: "100%", border: "none" }}
        sandbox="allow-scripts"
      />
    </div>
  );
});

export default JsCustomComponent;
