import React, { memo, type ReactNode } from "react";
import type { OverlayComponentData } from "./types";

type OverlaySlotProps = {
  component: OverlayComponentData;
  children: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>; // ✅ allow div props

export const OverlaySlot = ({
  component,
  children,
  ...rest
}: OverlaySlotProps) => {
  const { id, name, position } = component;

  return (
    <div
      className="overlay-slot"
      data-component-id={id}
      data-component-name={name}
      style={{
        position: "absolute",
        top: position?.top ?? 0,
        left: position?.left ?? 0,
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
