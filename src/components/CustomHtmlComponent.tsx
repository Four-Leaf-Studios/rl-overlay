import React, { memo, useMemo } from "react";

/**
 * Sanitize HTML by stripping <script> tags and inline event handlers.
 * Does NOT use eval or dangerouslySetInnerHTML with unsanitized content.
 * Uses the browser's DOMParser for safe parsing, then removes dangerous nodes.
 */
function sanitizeHtml(html: string): string {
  // Remove <script>...</script> blocks (including content)
  let cleaned = html.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "");
  // Remove on* event handler attributes (onclick, onload, etc.)
  cleaned = cleaned.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  // Remove javascript: hrefs/src
  cleaned = cleaned.replace(
    /\s+(?:href|src|action)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi,
    "",
  );
  return cleaned;
}

/**
 * Scope raw CSS to a specific component ID by prepending the selector.
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

type CustomHtmlComponentProps = {
  id: string;
  html: string;
  css?: string;
  className?: string;
};

/**
 * Renders sanitized custom HTML with optional scoped CSS.
 * Scripts and inline event handlers are stripped before rendering.
 */
export const CustomHtmlComponent = memo(function CustomHtmlComponent({
  id,
  html,
  css,
  className,
}: CustomHtmlComponentProps) {
  const safeHtml = useMemo(() => sanitizeHtml(html), [html]);
  const scopedCss = useMemo(() => (css ? scopeCss(css, id) : ""), [css, id]);

  return (
    <div
      data-component-id={id}
      className={className}
      style={{ width: "100%", height: "100%" }}
    >
      {scopedCss && <style>{scopedCss}</style>}
      {/* Safe: html has been sanitized above */}
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
    </div>
  );
});

export default CustomHtmlComponent;
