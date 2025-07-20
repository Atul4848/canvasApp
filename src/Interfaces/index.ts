export interface CanvasElement {
  id: string;
  type: 'text' | 'rectangle' | 'circle' | 'line';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  fontFamily?: string;
  fontColor?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  fontSize?: number;
  lineHeight?: number;
  opacity?: number;
  backgroundColor?: string;
  borderRadius?: string;
  lineColor?: string;
  lineWidth?: number;
  lineStyle?: 'solid' | 'dashed';
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
}

export type DrawingTool = 'select' | 'rectangle' | 'circle' | 'line' | 'text';
export type ColorPickerType = 'background' | 'font' | 'line' | false;
