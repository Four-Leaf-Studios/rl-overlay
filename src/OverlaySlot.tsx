import React, { memo, type ReactNode } from "react";
import type { OverlayComponentConfig } from "./types";

type OverlaySlotProps = {
  component: OverlayComponentConfig;
  children: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export const OverlaySlot = ({
  component,
  children,
  ...rest
}: OverlaySlotProps) => {
  const { id, name, position } = component;

  // Prefer x/y (new format) over legacy top/left
  const top = position?.y !== undefined ? position.y : (position?.top ?? 0);
  const left = position?.x !== undefined ? position.x : (position?.left ?? 0);

  return (
    <div
      className="overlay-slot"
      data-component-id={id}
      data-component-name={name}
      style={{
        position: "absolute",
        top,
        left,
        width: position?.width ?? "auto",
        height: position?.height ?? "auto",
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

export default memo(OverlaySlot);
