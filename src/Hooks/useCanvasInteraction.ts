import { useState, useCallback, useEffect } from 'react';
import { CanvasElement, DrawingTool } from '../Interfaces';

interface UseCanvasInteractionProps {
  currentTool: DrawingTool;
  elements: CanvasElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onAddElement: (element: CanvasElement) => void;
  zoom: number;
  canvasRef: React.RefObject<HTMLDivElement | null>; // Outer container ref
  drawingAreaRef: React.RefObject<HTMLDivElement | null>; // Inner drawing area ref
}

const useCanvasInteraction = ({
  currentTool,
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onAddElement,
  zoom,
  canvasRef,
  drawingAreaRef, // Destructure the new ref
}: UseCanvasInteractionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState('');

  const [isDrawing, setIsDrawing] = useState(false);
  const [startCoords, setStartCoords] = useState<{ x: number; y: number } | null>(null);
  const [previewElement, setPreviewElement] = useState<CanvasElement | null>(null);

  const getCanvasCoords = useCallback((e: MouseEvent | React.MouseEvent) => {
    // Use drawingAreaRef for coordinate calculation
    if (!drawingAreaRef.current) return { x: 0, y: 0 };
    const rect = drawingAreaRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom,
    };
  }, [drawingAreaRef, zoom]); // Depend on drawingAreaRef

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    console.log('handleCanvasMouseDown triggered');
    const target = e.target as HTMLElement;
    if (target.closest('.canvas-element')) {
      console.log('Clicked on existing element, returning.');
      return; // Let element's own handler manage this (drag/resize/select existing)
    }

    // Check if the click is within the drawing area (the white canvas)
    if (drawingAreaRef.current) {
      const drawingAreaRect = drawingAreaRef.current.getBoundingClientRect();
      const isClickInsideDrawingArea =
        e.clientX >= drawingAreaRect.left &&
        e.clientX <= drawingAreaRect.right &&
        e.clientY >= drawingAreaRect.top &&
        e.clientY <= drawingAreaRect.bottom;

      console.log('isClickInsideDrawingArea:', isClickInsideDrawingArea);
      console.log('currentTool:', currentTool);

      if (currentTool !== 'select' && isClickInsideDrawingArea) {
        console.log('Initiating new drawing/text creation.');
        const { x, y } = getCanvasCoords(e);

        if (currentTool === 'text') {
            console.log('Creating new text element.');
            // For text, create immediately on click without requiring a drag
            const newTextElement: CanvasElement = {
                id: `text-${Date.now()}`,
                type: 'text',
                x: x,
                y: y,
                width: 150, // Default width for text box
                height: 30,  // Default height for text box
                content: 'New Text',
                fontColor: '#161515',
                fontSize: 16,
                textAlign: 'left',
                fontFamily: 'sans-serif',
                lineHeight: 1.5,
                opacity: 1,
            };
            onAddElement(newTextElement);
            onSelectElement(newTextElement.id); // Select it immediately
            return; // Exit after adding text
        }

        // Existing logic for shapes and lines (requires dragging)
        setStartCoords({ x, y });
        setIsDrawing(true);
        console.log('Starting drag-to-draw for shape/line.');

        let initialPreview: CanvasElement;
        const commonProps = {
          id: `preview-${Date.now()}`, // Temporary ID
          x: x,
          y: y,
          width: 0,
          height: 0,
          opacity: 1,
        };

        if (currentTool === 'rectangle') {
          initialPreview = { ...commonProps, type: 'rectangle', backgroundColor: '#4A90E2', lineColor: '#000000', lineWidth: 1, lineStyle: 'solid' };
        } else if (currentTool === 'circle') {
          initialPreview = { ...commonProps, type: 'circle', backgroundColor: '#7ED321', borderRadius: '50%', lineColor: '#000000', lineWidth: 1, lineStyle: 'solid' };
        } else if (currentTool === 'line') {
          initialPreview = { ...commonProps, type: 'line', startX: x, startY: y, endX: x, endY: y, lineColor: '#000000', lineWidth: 2, lineStyle: 'solid' };
        } else {
          initialPreview = { ...commonProps, type: 'rectangle' }; // Fallback
        }
        setPreviewElement(initialPreview);
        onSelectElement(null); // Deselect any existing element when starting to draw
      } else if (currentTool === 'select') {
        console.log('Select tool active, deselecting element.');
        onSelectElement(null);
      }
    } else if (currentTool === 'select') {
        console.log('drawingAreaRef not ready, select tool active, deselecting.');
        onSelectElement(null);
    }
  }, [currentTool, getCanvasCoords, onSelectElement, drawingAreaRef, onAddElement]); // Added onAddElement to dependencies

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDrawing && startCoords && previewElement) {
      const { x: currentX, y: currentY } = getCanvasCoords(e);

      let updatedPreview: Partial<CanvasElement> = {};

      if (currentTool === 'rectangle' || currentTool === 'circle' || currentTool === 'text') {
        const newX = Math.min(startCoords.x, currentX);
        const newY = Math.min(startCoords.y, currentY);
        const newWidth = Math.abs(currentX - startCoords.x);
        const newHeight = Math.abs(currentY - startCoords.y);

        updatedPreview = {
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        };

        if (currentTool === 'circle') {
          const minDim = Math.min(newWidth, newHeight);
          updatedPreview.width = minDim;
          updatedPreview.height = minDim;
        }
      } else if (currentTool === 'line') {
        updatedPreview = {
          endX: currentX,
          endY: currentY,
        };
      }
      setPreviewElement((prev) => (prev ? { ...prev, ...updatedPreview } : null));
    } else if (isDragging && selectedElementId) {
      const selectedElement = elements.find(el => el.id === selectedElementId);
      if (!selectedElement) return;

      if (!drawingAreaRef.current) { // Explicit null check added
        return; // Cannot perform drag if drawing area ref is not available
      }

      // Get current mouse position in logical canvas coordinates
      const { x: currentLogicalX, y: currentLogicalY } = getCanvasCoords(e);

      // Calculate new position by subtracting the initial logical offset
      let newX = currentLogicalX - dragOffset.x;
      let newY = currentLogicalY - dragOffset.y;

      // Get canvas dimensions from drawingAreaRef (logical, unscaled)
      const canvasWidth = drawingAreaRef.current.offsetWidth / zoom; // Now guaranteed non-null
      const canvasHeight = drawingAreaRef.current.offsetHeight / zoom; // Now guaranteed non-null

      // Apply boundary checks for dragging
      // Ensure element's left edge is not less than 0
      newX = Math.max(0, newX);
      // Ensure element's top edge is not less than 0
      newY = Math.max(0, newY);
      // Ensure element's right edge is not greater than canvas width
      newX = Math.min(canvasWidth - selectedElement.width, newX);
      // Ensure element's bottom edge is not greater than canvas height
      newY = Math.min(canvasHeight - selectedElement.height, newY);

      // For lines, apply boundary checks to start/end points
      if (selectedElement.type === 'line' && selectedElement.startX !== undefined && selectedElement.startY !== undefined &&
          selectedElement.endX !== undefined && selectedElement.endY !== undefined) {
          // Calculate the current length and angle to maintain it
          const dx = selectedElement.endX - selectedElement.startX;
          const dy = selectedElement.endY - selectedElement.startY;

          let newStartX = currentLogicalX - dragOffset.x;
          let newStartY = currentLogicalY - dragOffset.y;
          let newEndX = newStartX + dx;
          let newEndY = newStartY + dy;

          // Clamp startX
          newStartX = Math.max(0, newStartX);
          newStartX = Math.min(canvasWidth, newStartX);
          // Clamp startY
          newStartY = Math.max(0, newStartY);
          newStartY = Math.min(canvasHeight, newStartY);

          // Clamp endX
          newEndX = Math.max(0, newEndX);
          newEndX = Math.min(canvasWidth, newEndX);
          // Clamp endY
          newEndY = Math.max(0, newEndY);
          newEndY = Math.min(canvasHeight, newEndY);

          onUpdateElement(selectedElement.id, {
              startX: newStartX,
              startY: newStartY,
              endX: newEndX,
              endY: newEndY,
          });
      } else {
          onUpdateElement(selectedElement.id, { x: newX, y: newY });
      }

    } else if (isResizing && selectedElementId) {
      const selectedElement = elements.find(el => el.id === selectedElementId);
      if (!selectedElement) return;

      if (!drawingAreaRef.current) { // Explicit null check added
        return; // Cannot perform resize if drawing area ref is not available
      }

      // Get mouse position relative to the drawing area's logical coordinates
      const { x: mouseX, y: mouseY } = getCanvasCoords(e);

      let newWidth = selectedElement.width;
      let newHeight = selectedElement.height;
      let newX = selectedElement.x;
      let newY = selectedElement.y;

      // Get canvas dimensions for boundary checks during resizing
      const canvasWidth = drawingAreaRef.current.offsetWidth / zoom; // Now guaranteed non-null
      const canvasHeight = drawingAreaRef.current.offsetHeight / zoom; // Now guaranteed non-null

      switch (resizeHandle) {
        case 'top-left':
          newWidth = selectedElement.width + (selectedElement.x - mouseX);
          newHeight = selectedElement.height + (selectedElement.y - mouseY);
          newX = mouseX;
          newY = mouseY;
          break;
        case 'top-center':
          newHeight = selectedElement.height + (selectedElement.y - mouseY);
          newY = mouseY;
          break;
        case 'top-right':
          newWidth = mouseX - selectedElement.x;
          newHeight = selectedElement.height + (selectedElement.y - mouseY);
          newY = mouseY;
          break;
        case 'middle-left':
          newWidth = selectedElement.width + (selectedElement.x - mouseX);
          newX = mouseX;
          break;
        case 'middle-right':
          newWidth = mouseX - selectedElement.x;
          break;
        case 'bottom-left':
          newWidth = selectedElement.width + (selectedElement.x - mouseX);
          newHeight = mouseY - selectedElement.y;
          newX = mouseX;
          break;
        case 'bottom-center':
          newHeight = mouseY - selectedElement.y;
          break;
        case 'bottom-right':
          newWidth = mouseX - selectedElement.x;
          newHeight = mouseY - selectedElement.y;
          break;
      }

      // Ensure minimum dimensions
      newWidth = Math.max(10, newWidth);
      newHeight = Math.max(10, newHeight);

      // Clamp newX and newY to canvas boundaries during resize
      newX = Math.max(0, Math.min(canvasWidth - newWidth, newX));
      newY = Math.max(0, Math.min(canvasHeight - newHeight, newY));

      if (selectedElement.type === 'circle') {
        const minDim = Math.min(newWidth, newHeight);
        newWidth = minDim;
        newHeight = minDim;
      } else if (selectedElement.type === 'line') {
        // For lines, resize handles directly adjust start/end points
        if (selectedElement.startX !== undefined && selectedElement.startY !== undefined &&
            selectedElement.endX !== undefined && selectedElement.endY !== undefined) {
          if (resizeHandle === 'top-left') {
            onUpdateElement(selectedElement.id, { startX: mouseX, startY: mouseY });
          } else if (resizeHandle === 'bottom-right') {
            onUpdateElement(selectedElement.id, { endX: mouseX, endY: mouseY });
          }
        }
        return; // Line resizing handles differently, so return here
      }

      onUpdateElement(selectedElement.id, {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      });
    }
  }, [isDrawing, startCoords, previewElement, currentTool, isDragging, selectedElementId, elements, dragOffset, zoom, onUpdateElement, isResizing, resizeHandle, getCanvasCoords, drawingAreaRef]); // Added drawingAreaRef to dependencies

  const handleMouseUp = useCallback(() => {
    if (isDrawing && previewElement) {
      if (!drawingAreaRef.current) { // Explicit null check added
        setIsDrawing(false); // Cannot finalize drawing if ref is not available
        setStartCoords(null);
        setPreviewElement(null);
        return;
      }

      if (previewElement.type === 'line' && previewElement.startX !== undefined && previewElement.startY !== undefined && previewElement.endX !== undefined && previewElement.endY !== undefined) {
        // Only add line if it has a discernible length
        const length = Math.sqrt(Math.pow(previewElement.endX - previewElement.startX, 2) + Math.pow(previewElement.endY - previewElement.startY, 2));
        if (length > 5 / zoom) { // Use unscaled threshold
          onAddElement({ ...previewElement, id: `line-${Date.now()}` });
        }
      } else if (previewElement.width > 5 / zoom && previewElement.height > 5 / zoom) { // Use unscaled threshold
        onAddElement({ ...previewElement, id: `${previewElement.type}-${Date.now()}` });
      }
    }
    setIsDrawing(false);
    setStartCoords(null);
    setPreviewElement(null);
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle('');
  }, [isDrawing, previewElement, onAddElement, zoom, drawingAreaRef]); // Added drawingAreaRef to dependencies for the null check

  const handleElementMouseDown = useCallback((e: React.MouseEvent, element: CanvasElement) => {
    e.stopPropagation(); // Prevent canvas background click handler from firing
    onSelectElement(element.id);

    const target = e.target as HTMLElement;
    if (target.dataset.handle) {
      setIsResizing(true);
      setResizeHandle(target.dataset.handle);
    } else {
      setIsDragging(true);
      // Calculate drag offset based on element's logical position and mouse's logical position
      const { x: mouseLogicalX, y: mouseLogicalY } = getCanvasCoords(e);
      setDragOffset({
        x: mouseLogicalX - element.x,
        y: mouseLogicalY - element.y,
      });
    }
  }, [onSelectElement, getCanvasCoords]); // Depend on getCanvasCoords

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return {
    isDrawing,
    previewElement,
    handleCanvasMouseDown,
    handleElementMouseDown,
  };
};

export default useCanvasInteraction;
