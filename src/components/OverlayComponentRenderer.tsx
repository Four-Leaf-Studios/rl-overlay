import React, { memo, useMemo } from "react";
import type {
  OverlayComponentConfig,
  OverlayDataContext,
  ComponentRuntimeState,
  ComponentStateConfig,
} from "../types";
import { componentRegistry } from "../registry";
import { resolveBindingsDeep } from "../binding/bindingResolver";
import JsCustomComponent from "./JsCustomComponent";

type Props = {
  component: OverlayComponentConfig;
  context: OverlayDataContext;
  runtimeState?: ComponentRuntimeState;
};

/**
 * Compute absolute CSS position from component position config.
 * Prefers x/y over legacy top/left.
 */
function buildPositionStyle(
  pos: OverlayComponentConfig["position"],
): React.CSSProperties {
  if (!pos) return {};
  const top = pos.y !== undefined ? pos.y : (pos.top ?? 0);
  const left = pos.x !== undefined ? pos.x : (pos.left ?? 0);
  return {
    position: "absolute",
    top,
    left,
    width: pos.width ?? "auto",
    height: pos.height ?? "auto",
  };
}

export const OverlayComponentRenderer = memo(function OverlayComponentRenderer({
  component,
  context,
  runtimeState = {},
}: Props) {
  const { id, code_id, name, enabled, css, js, position, states } = component;

  // Skip disabled components
  if (enabled === false) return null;

  // Resolve active state config
  const activeStateName = runtimeState.activeState;
  const stateConfig: ComponentStateConfig | undefined = activeStateName
    ? states?.[activeStateName]
    : states?.["default"];

  // Determine visibility
  const visible =
    runtimeState.visible !== undefined
      ? runtimeState.visible
      : stateConfig?.visible !== undefined
        ? stateConfig.visible
        : true;
  if (!visible) return null;

  const ctxObj = context as unknown as Record<string, unknown>;

  // Merge props: component defaults → state patch → runtime patch
  const rawProps = {
    ...(component.props ?? {}),
    ...(stateConfig?.props ?? {}),
    ...(runtimeState.propsPatches ?? {}),
  };
  const resolvedProps = resolveBindingsDeep(rawProps, ctxObj) as Record<
    string,
    unknown
  >;

  // Merge styles: component defaults → state patch → runtime patch
  const rawStyles = {
    ...(component.styles ?? {}),
    ...(stateConfig?.styles ?? {}),
    ...(runtimeState.stylePatches ?? {}),
  };
  const resolvedStyles = resolveBindingsDeep(rawStyles, ctxObj) as Record<
    string,
    unknown
  >;

  const classNames = [
    stateConfig?.className,
    ...(runtimeState.classNames ?? []),
  ]
    .filter(Boolean)
    .join(" ");

  const positionStyle = buildPositionStyle(position);
  const combinedStyle: React.CSSProperties = {
    ...positionStyle,
    ...(resolvedStyles as React.CSSProperties),
  };

  // Custom component — sandboxed iframe with JavaScript render function
  if (js) {
    return (
      <div
        className={`overlay-slot ${classNames}`}
        data-component-id={id}
        data-component-name={name}
        style={combinedStyle}
      >
        <JsCustomComponent
          id={id}
          js={js}
          css={css}
          className={classNames}
          context={ctxObj}
        />
      </div>
    );
  }

  // Built-in / registry component
  const Comp = componentRegistry[code_id];
  if (!Comp) {
    return (
      <div
        className="overlay-slot"
        data-component-id={id}
        data-component-name={name}
        style={combinedStyle}
      >
        <div style={{ color: "red", fontSize: "14px" }}>
          Missing component: {code_id}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`overlay-slot ${classNames}`}
      data-component-id={id}
      data-component-name={name}
      style={combinedStyle}
    >
      {css && <style>{css}</style>}
      <Comp {...resolvedProps} />
    </div>
  );
});

export default OverlayComponentRenderer;
