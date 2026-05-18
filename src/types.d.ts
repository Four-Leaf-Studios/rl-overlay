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

// Each overlay component
export type Position = {
  top?: number;
  left?: number;
  width?: number | string;
  height?: number | string;
};

export type OverlayComponentData = {
  id: string;
  name: string;
  css: string;
  code_id: string;
  position?: Position;
};

export type OverlayObject = {
  components: OverlayComponentData[];
};
