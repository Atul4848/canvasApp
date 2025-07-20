import { useState, useCallback, useEffect } from "react";
import { CanvasElement, DrawingTool } from "../Interfaces";

interface UseCanvasInteractionProps {
  currentTool: DrawingTool;
  elements: CanvasElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onAddElement: (element: CanvasElement) => void;
  zoom: number;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  drawingAreaRef: React.RefObject<HTMLDivElement | null>;
}

const useCanvasInteraction = ({
  currentTool,
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onAddElement,
  zoom,
  drawingAreaRef,
}: UseCanvasInteractionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState("");

  const [isDrawing, setIsDrawing] = useState(false);
  const [startCoords, setStartCoords] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [previewElement, setPreviewElement] = useState<CanvasElement | null>(
    null
  );

  const getCanvasCoords = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      if (!drawingAreaRef.current) return { x: 0, y: 0 };
      const rect = drawingAreaRef.current.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) / zoom,
        y: (e.clientY - rect.top) / zoom,
      };
    },
    [drawingAreaRef, zoom]
  );

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".canvas-element")) {
        return;
      }

      if (drawingAreaRef.current) {
        const drawingAreaRect = drawingAreaRef.current.getBoundingClientRect();
        const isClickInsideDrawingArea =
          e.clientX >= drawingAreaRect.left &&
          e.clientX <= drawingAreaRect.right &&
          e.clientY >= drawingAreaRect.top &&
          e.clientY <= drawingAreaRect.bottom;

        if (currentTool !== "select" && isClickInsideDrawingArea) {
          const { x, y } = getCanvasCoords(e);

          if (currentTool === "text") {
            const newTextElement: CanvasElement = {
              id: `text-${Date.now()}`,
              type: "text",
              x: x,
              y: y,
              width: 150,
              height: 30,
              content: "New Text",
              fontColor: "#161515",
              fontSize: 16,
              textAlign: "left",
              fontFamily: "sans-serif",
              lineHeight: 1.5,
              opacity: 1,
            };
            onAddElement(newTextElement);
            onSelectElement(newTextElement.id);
            return;
          }

          setStartCoords({ x, y });
          setIsDrawing(true);

          let initialPreview: CanvasElement;
          const commonProps = {
            id: `preview-${Date.now()}`, // Temporary ID
            x: x,
            y: y,
            width: 0,
            height: 0,
            opacity: 1,
          };

          if (currentTool === "rectangle") {
            initialPreview = {
              ...commonProps,
              type: "rectangle",
              backgroundColor: "#4A90E2",
              lineColor: "#000000",
              lineWidth: 1,
              lineStyle: "solid",
            };
          } else if (currentTool === "circle") {
            initialPreview = {
              ...commonProps,
              type: "circle",
              backgroundColor: "#7ED321",
              borderRadius: "50%",
              lineColor: "#000000",
              lineWidth: 1,
              lineStyle: "solid",
            };
          } else if (currentTool === "line") {
            initialPreview = {
              ...commonProps,
              type: "line",
              startX: x,
              startY: y,
              endX: x,
              endY: y,
              lineColor: "#000000",
              lineWidth: 2,
              lineStyle: "solid",
            };
          } else {
            initialPreview = { ...commonProps, type: "rectangle" }; 
          }
          setPreviewElement(initialPreview);
          onSelectElement(null);
        } else if (currentTool === "select") {
          onSelectElement(null);
        }
      } else if (currentTool === "select") {
        onSelectElement(null);
      }
    },
    [
      currentTool,
      getCanvasCoords,
      onSelectElement,
      drawingAreaRef,
      onAddElement,
    ]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDrawing && startCoords && previewElement) {
        const { x: currentX, y: currentY } = getCanvasCoords(e);

        let updatedPreview: Partial<CanvasElement> = {};

        if (
          currentTool === "rectangle" ||
          currentTool === "circle" ||
          currentTool === "text"
        ) {
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

          if (currentTool === "circle") {
            const minDim = Math.min(newWidth, newHeight);
            updatedPreview.width = minDim;
            updatedPreview.height = minDim;
          }
        } else if (currentTool === "line") {
          updatedPreview = {
            endX: currentX,
            endY: currentY,
          };
        }
        setPreviewElement((prev) =>
          prev ? { ...prev, ...updatedPreview } : null
        );
      } else if (isDragging && selectedElementId) {
        const selectedElement = elements.find(
          (el) => el.id === selectedElementId
        );
        if (!selectedElement) return;
        const { x: currentLogicalX, y: currentLogicalY } = getCanvasCoords(e);

        const newX = currentLogicalX - dragOffset.x;
        const newY = currentLogicalY - dragOffset.y;

        onUpdateElement(selectedElement.id, { x: newX, y: newY });
      } else if (isResizing && selectedElementId) {
        const selectedElement = elements.find(
          (el) => el.id === selectedElementId
        );
        if (!selectedElement) return;

        const { x: mouseX, y: mouseY } = getCanvasCoords(e);

        let newWidth = selectedElement.width;
        let newHeight = selectedElement.height;
        let newX = selectedElement.x;
        let newY = selectedElement.y;

        switch (resizeHandle) {
          case "top-left":
            newWidth = selectedElement.width + (selectedElement.x - mouseX);
            newHeight = selectedElement.height + (selectedElement.y - mouseY);
            newX = mouseX;
            newY = mouseY;
            break;
          case "top-center":
            newHeight = selectedElement.height + (selectedElement.y - mouseY);
            newY = mouseY;
            break;
          case "top-right":
            newWidth = mouseX - selectedElement.x;
            newHeight = selectedElement.height + (selectedElement.y - mouseY);
            newY = mouseY;
            break;
          case "middle-left":
            newWidth = selectedElement.width + (selectedElement.x - mouseX);
            newX = mouseX;
            break;
          case "middle-right":
            newWidth = mouseX - selectedElement.x;
            break;
          case "bottom-left":
            newWidth = selectedElement.width + (selectedElement.x - mouseX);
            newHeight = mouseY - selectedElement.y;
            newX = mouseX;
            break;
          case "bottom-center":
            newHeight = mouseY - selectedElement.y;
            break;
          case "bottom-right":
            newWidth = mouseX - selectedElement.x;
            newHeight = mouseY - selectedElement.y;
            break;
        }

        newWidth = Math.max(10, newWidth);
        newHeight = Math.max(10, newHeight);

        if (selectedElement.type === "circle") {
          const minDim = Math.min(newWidth, newHeight);
          newWidth = minDim;
          newHeight = minDim;
        } else if (selectedElement.type === "line") {
          if (
            selectedElement.startX !== undefined &&
            selectedElement.startY !== undefined &&
            selectedElement.endX !== undefined &&
            selectedElement.endY !== undefined
          ) {
            if (resizeHandle === "top-left") {
              onUpdateElement(selectedElement.id, {
                startX: mouseX,
                startY: mouseY,
              });
            } else if (resizeHandle === "bottom-right") {
              onUpdateElement(selectedElement.id, {
                endX: mouseX,
                endY: mouseY,
              });
            }
          }
          return;
        }

        onUpdateElement(selectedElement.id, {
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        });
      }
    },
    [isDrawing, startCoords, previewElement, currentTool, isDragging, selectedElementId, elements, dragOffset, onUpdateElement, isResizing, resizeHandle, getCanvasCoords]
  );

  const handleMouseUp = useCallback(() => {
    if (isDrawing && previewElement) {
      if (
        previewElement.type === "line" &&
        previewElement.startX !== undefined &&
        previewElement.startY !== undefined &&
        previewElement.endX !== undefined &&
        previewElement.endY !== undefined
      ) {
        const length = Math.sqrt(
          Math.pow(previewElement.endX - previewElement.startX, 2) +
            Math.pow(previewElement.endY - previewElement.startY, 2)
        );
        if (length > 5 / zoom) {
          onAddElement({ ...previewElement, id: `line-${Date.now()}` });
        }
      } else if (
        previewElement.width > 5 / zoom &&
        previewElement.height > 5 / zoom
      ) {
        onAddElement({
          ...previewElement,
          id: `${previewElement.type}-${Date.now()}`,
        });
      }
    }
    setIsDrawing(false);
    setStartCoords(null);
    setPreviewElement(null);
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle("");
  }, [isDrawing, previewElement, onAddElement, zoom]);

  const handleElementMouseDown = useCallback(
    (e: React.MouseEvent, element: CanvasElement) => {
      e.stopPropagation();
      onSelectElement(element.id);

      const target = e.target as HTMLElement;
      if (target.dataset.handle) {
        setIsResizing(true);
        setResizeHandle(target.dataset.handle);
      } else {
        setIsDragging(true);
        const { x: mouseLogicalX, y: mouseLogicalY } = getCanvasCoords(e);
        setDragOffset({
          x: mouseLogicalX - element.x,
          y: mouseLogicalY - element.y,
        });
      }
    },
    [onSelectElement, getCanvasCoords]
  );

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
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
