// src/hooks/useOverlayStyles.ts
import { useEffect } from "react";
import jsonToCss from "@rysh/json-to-css";
import type { Broadcast, Color } from "../types";

export type CSSJSON = {
  [selector: string]: {
    [prop: string]: string | number;
  };
};

/**
 * Hook that injects both team-color variables (from Broadcast)
 * and optional custom styles (string or JSON) into the document.
 */
export function useOverlayStyles(
  broadcast: Broadcast,
  styles?: string | CSSJSON,
) {
  useEffect(() => {
    if (!broadcast?.teams) return;

    const shade = (c: string, pct: number): string => {
      const hex = c.replace("#", "");
      const num = parseInt(hex, 16);
      const amt = Math.round(2.55 * pct);
      let R = (num >> 16) + amt;
      let G = ((num >> 8) & 0xff) + amt;
      let B = (num & 0xff) + amt;
      R = Math.min(255, Math.max(0, R));
      G = Math.min(255, Math.max(0, G));
      B = Math.min(255, Math.max(0, B));
      return (
        "#" +
        ((1 << 24) + (R << 16) + (G << 8) + B)
          .toString(16)
          .slice(1)
          .toUpperCase()
      );
    };

    const defaultBlue: Color = {
      id: "",
      name: "",
      primary_color: "#0052cc",
      secondary_color: "#ffffff",
      mutual_color: "#00a8ff",
      created_at: "",
      created_by: null,
    };
    const defaultOrange: Color = {
      id: "",
      name: "",
      primary_color: "#ff6600",
      secondary_color: "#ffffff",
      mutual_color: "#ffaa00",
      created_at: "",
      created_by: null,
    };

    const blueColor =
      broadcast.teams.find((t) => t.side === "blue")?.color ?? defaultBlue;
    const orangeColor =
      broadcast.teams.find((t) => t.side === "orange")?.color ?? defaultOrange;

    const teamJSON: CSSJSON = {
      ":root": {
        "--team-left-primary": blueColor.primary_color,
        "--team-left-primary-light": shade(blueColor.primary_color, 20),
        "--team-left-primary-dark": shade(blueColor.primary_color, -20),
        "--team-left-secondary": blueColor.secondary_color,
        "--team-left-mutual":
          blueColor.mutual_color ?? defaultBlue.mutual_color!,

        "--team-right-primary": orangeColor.primary_color,
        "--team-right-primary-light": shade(orangeColor.primary_color, 20),
        "--team-right-primary-dark": shade(orangeColor.primary_color, -20),
        "--team-right-secondary": orangeColor.secondary_color,
        "--team-right-mutual":
          orangeColor.mutual_color ?? defaultOrange.mutual_color!,
      },
    };

    // ==== CHANGE HERE: pass a second arg (root selector) ====
    let cssText: string;
    if (styles && typeof styles === "object") {
      const merged: CSSJSON = { ...teamJSON, ...styles };
      cssText = jsonToCss(merged, ""); // <- empty string scopes at top
    } else {
      cssText = jsonToCss(teamJSON, ""); // <- ditto
      if (typeof styles === "string") {
        cssText += "\n\n" + styles;
      }
    }

    const styleEl = document.createElement("style");
    styleEl.id = "overlay-styles";
    styleEl.textContent = cssText;
    document.getElementById("overlay-styles")?.remove();
    document.head.appendChild(styleEl);

    return () => {
      document.getElementById("overlay-styles")?.remove();
    };
  }, [broadcast, styles]);
}
