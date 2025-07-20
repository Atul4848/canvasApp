export const TOOL = {
  RECT: "rect",
  CIRCLE: "circle",
  LINE: "line",
  PENCIL: "pencil",
};

export interface Shape {
  id: string;
  type: string;
  x: number;
  y: number;
  x2?: number;
  y2?: number;
  radius?: number;
  points?: { x: number; y: number }[];
  stroke: string;
  fill: string;
  width: number;
  dashed: boolean;
  selected: boolean;
}

export interface DrawingSettings {
  stroke: string;
  fill: string;
  width: number;
  dashed: boolean;
}
