import React, { useRef } from 'react';
import { CanvasElement, DrawingTool } from '../../Interfaces'; 
import CanvasElementRenderer from './CanvasElementRender'; 
import useCanvasInteraction from '../../Hooks/useCanvasInteraction';

interface CanvasProps {
  elements: CanvasElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
  currentTool: DrawingTool;
  onAddElement: (element: CanvasElement) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  canvasWidth,
  canvasHeight,
  zoom,
  currentTool,
  onAddElement,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const drawingAreaRef = useRef<HTMLDivElement>(null);

  const {
    previewElement,
    handleCanvasMouseDown,
    handleElementMouseDown,
  } = useCanvasInteraction({
    currentTool,
    elements,
    selectedElementId,
    onSelectElement,
    onUpdateElement,
    onAddElement,
    zoom,
    canvasRef,
    drawingAreaRef,
  });

  return (
    <div
      ref={canvasRef}
      className={`flex-1 bg-gray-800 flex items-center justify-center relative overflow-hidden rounded-lg ${currentTool === 'select' ? 'cursor-default' : 'cursor-crosshair'}`}
      onMouseDown={handleCanvasMouseDown}
    >
      <div
        ref={drawingAreaRef}
        className="bg-white border border-gray-700 relative shadow-lg"
        style={{
          width: canvasWidth * zoom,
          height: canvasHeight * zoom,
          transformOrigin: 'center center',
          cursor: currentTool === 'select' ? 'default' : 'crosshair',
        }}
      >
        <span className="absolute top-2 left-2 text-gray-400 text-sm">
          {canvasWidth} x {canvasHeight} px
        </span>
        {[...elements, previewElement].filter(Boolean).map((element) => (
          <CanvasElementRenderer
            key={element!.id}
            element={element!}
            isSelected={selectedElementId === element!.id && !element!.id.startsWith('preview-')}
            zoom={zoom}
            onMouseDown={handleElementMouseDown}
          />
        ))}
      </div>
    </div>
  );
};

export default Canvas;
