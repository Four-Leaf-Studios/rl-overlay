export type Team = {
  id: "0" | "1";
  broadcast_id: string | null;
  session_id: string | null;
  organization_id: string | null;
  color_id: string | null;
  name: string;
  series_score: number;
  logo: string | null;
  side: "blue" | "orange";
  created_at: string;
  created_by: string | null;
} & {
  players?: Player[];
  organization?: Organization;
  color?: Color;
};

export type Player = {
  id: string;
  user_id: string | null;
  team_id: string | null;
  name: string;
  picture: string | null;
  created_at: string;
  created_by: string | null;
};

export type Organization = {
  id: string;
  name: string;
  logo: string | null;
  created_at: string;
  created_by: string | null;
};

export type Color = {
  id: string;
  name: string;
  primary_color: string;
  secondary_color: string;
  mutual_color: string | null;
  created_at: string;
  created_by: string | null;
};

export type Broadcast = {
  id: string;
  name: string;
  status: "active" | "inactive";
  overlay_id: string | null;
  featured: boolean;
  top_info_text: string | null;
  series_number: number;
  created_at: string;
  created_by: string | null;
  teams: Team[];
  overlay?: Overlay;
};

// ---------- Legacy position type (backward-compatible) ----------
export type Position = {
  top?: number;
  left?: number;
  width?: number | string;
  height?: number | string;
};

// ---------- Rich position type (supports x/y and legacy top/left) ----------
export type OverlayPosition = {
  x?: number;
  y?: number;
  top?: number;
  left?: number;
  width?: number | string;
  height?: number | string;
  anchor?: string;
};

// ---------- Legacy component type (backward-compatible) ----------
export type OverlayComponentData = {
  id: string;
  name: string;
  css: string;
  code_id: string;
  position?: Position;
};

// ---------- Component state definition ----------
export type ComponentStateConfig = {
  visible?: boolean;
  props?: Record<string, unknown>;
  styles?: Record<string, unknown>;
  className?: string;
  animation?: string;
};

// ---------- Rich component config (superset of OverlayComponentData) ----------
export type OverlayComponentConfig = {
  id: string;
  overlay_id?: string;
  template_id?: string | null;
  code_id: string;
  name?: string;
  enabled?: boolean;
  css?: string;
  html?: string | null;
  position?: OverlayPosition | null;
  props?: Record<string, unknown>;
  styles?: Record<string, unknown>;
  states?: Record<string, ComponentStateConfig>;
  data_bindings?: Record<string, unknown>;
  animations?: Record<string, unknown>;
  sort_order?: number;
};

// ---------- Canvas / overlay config ----------
export type OverlayCanvasConfig = {
  width: number;
  height: number;
  background?: string;
};

export type OverlayAsset = {
  id: string;
  name: string;
  storage_path: string;
  asset_type: "image" | "font" | "video" | "audio" | "other";
  metadata?: Record<string, unknown>;
};

// ---------- Rule engine types ----------
export type RuleOperator =
  | "equals"
  | "notEquals"
  | "greaterThan"
  | "lessThan"
  | "greaterThanOrEqual"
  | "lessThanOrEqual"
  | "exists"
  | "notExists"
  | "contains";

export type RuleCondition = {
  path: string;
  operator: RuleOperator;
  value?: unknown;
};

export type RuleTrigger =
  | { type: "event"; event: string }
  | { type: "data"; path: string; operator: RuleOperator; value?: unknown };

export type RuleAction =
  | { type: "show"; componentId: string; durationMs?: number; delayMs?: number }
  | { type: "hide"; componentId: string; delayMs?: number }
  | { type: "setState"; componentId: string; state: string; delayMs?: number }
  | {
      type: "setStyle";
      componentId: string;
      style: Record<string, unknown>;
      delayMs?: number;
    }
  | {
      type: "setProp";
      componentId: string;
      prop: string;
      value: unknown;
      delayMs?: number;
    }
  | {
      type: "addClass";
      componentId: string;
      className: string;
      delayMs?: number;
    }
  | {
      type: "removeClass";
      componentId: string;
      className: string;
      delayMs?: number;
    }
  | {
      type: "animate";
      componentId: string;
      animation: string;
      delayMs?: number;
    };

export type OverlayRule = {
  id?: string;
  overlay_id?: string;
  component_id?: string | null;
  name?: string;
  enabled?: boolean;
  trigger: RuleTrigger;
  conditions?: RuleCondition[];
  actions: RuleAction[];
  sort_order?: number;
};

// ---------- Runtime component state (driven by rule engine) ----------
export type ComponentRuntimeState = {
  visible?: boolean;
  activeState?: string;
  propsPatches?: Record<string, unknown>;
  stylePatches?: Record<string, unknown>;
  classNames?: string[];
  animation?: string;
};

// ---------- Normalized SOS data context ----------
export type OverlayDataContext = {
  game: {
    arena?: string;
    hasGame: boolean;
    hasTarget?: boolean;
    hasWinner?: boolean;
    isOT?: boolean;
    isReplay?: boolean;
    target?: string;
    time?: number;
    winner?: string;
    ball?: {
      location?: { X: number; Y: number; Z: number };
      speed?: number;
      team?: number;
    };
    teams: {
      0?: {
        color_primary?: string;
        color_secondary?: string;
        name?: string;
        score?: number;
      };
      1?: {
        color_primary?: string;
        color_secondary?: string;
        name?: string;
        score?: number;
      };
    };
  };
  players: Record<string, unknown>;
  event: {
    last: { name: string; payload: unknown; receivedAt: number } | null;
    goalScored?: unknown;
    ballHit?: unknown;
    statfeed?: unknown;
    matchEnded?: unknown;
  };
  broadcast?: unknown;
};

// ---------- Richer overlay config (superset of old OverlayObject) ----------
export type OverlayRuntimeConfig = {
  id?: string | null;
  name?: string;
  css?: string;
  globalCss?: string;
  canvas?: OverlayCanvasConfig;
  theme?: Record<string, unknown>;
  components?: OverlayComponentConfig[];
  rules?: OverlayRule[];
  assets?: OverlayAsset[];
};

/**
 * OverlayObject is the type passed to the Overlay component.
 * It supports both the legacy shape `{ components: OverlayComponentData[] }`
 * and the richer OverlayRuntimeConfig shape.
 */
export type OverlayObject = OverlayRuntimeConfig;
