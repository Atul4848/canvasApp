import React from 'react';
import { CanvasElement } from '../../Interfaces';

interface CanvasElementRendererProps {
  element: CanvasElement;
  isSelected: boolean;
  zoom: number;
  onMouseDown: (e: React.MouseEvent, element: CanvasElement) => void;
}

const CanvasElementRenderer: React.FC<CanvasElementRendererProps> = ({ element, isSelected, zoom, onMouseDown }) => {
  const getResizeHandleStyle = (handle: string) => {
    const size = 8;
    const offset = -size / 2;

    let style: React.CSSProperties = {
      width: size,
      height: size,
      backgroundColor: 'red',
      position: 'absolute',
      borderRadius: '50%',
      border: '1px solid white',
      zIndex: 10,
    };

    switch (handle) {
      case 'top-left':
        style = { ...style, top: offset, left: offset, cursor: 'nwse-resize' };
        break;
      case 'top-center':
        style = { ...style, top: offset, left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' };
        break;
      case 'top-right':
        style = { ...style, top: offset, right: offset, cursor: 'nesw-resize' };
        break;
      case 'middle-left':
        style = { ...style, top: '50%', left: offset, transform: 'translateY(-50%)', cursor: 'ew-resize' };
        break;
      case 'middle-right':
        style = { ...style, top: '50%', right: offset, transform: 'translateY(-50%)', cursor: 'ew-resize' };
        break;
      case 'bottom-left':
        style = { ...style, bottom: offset, left: offset, cursor: 'nesw-resize' };
        break;
      case 'bottom-center':
        style = { ...style, bottom: offset, left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' };
        break;
      case 'bottom-right':
        style = { ...style, bottom: offset, right: offset, cursor: 'nwse-resize' };
        break;
    }
    return style;
  };

  if (element.type === 'line' && element.startX !== undefined && element.startY !== undefined && element.endX !== undefined && element.endY !== undefined) {
    const x1 = element.startX * zoom;
    const y1 = element.startY * zoom;
    const x2 = element.endX * zoom;
    const y2 = element.endY * zoom;

    return (
      <svg
        key={element.id}
        className={`absolute overflow-visible ${isSelected ? 'border-2 border-red-500' : ''} canvas-element`}
        style={{
          left: 0, top: 0, width: '100%', height: '100%',
          pointerEvents: 'auto',
        }}
        onMouseDown={(e) => onMouseDown(e, element)}
      >
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={element.lineColor || '#000000'}
          strokeWidth={element.lineWidth ? element.lineWidth * zoom : 2 * zoom}
          strokeDasharray={element.lineStyle === 'dashed' ? '5,5' : '0'}
          style={{
            opacity: element.opacity || 1,
            cursor: 'grab',
          }}
        />
        {isSelected && (
          <>
            <circle cx={x1} cy={y1} r={4} fill="red" stroke="white" strokeWidth="1" data-handle="top-left" />
            <circle cx={x2} cy={y2} r={4} fill="red" stroke="white" strokeWidth="1" data-handle="bottom-right" />
          </>
        )}
      </svg>
    );
  } else {
    return (
      <div
        key={element.id}
        className={`absolute canvas-element ${isSelected ? 'border-2 border-red-500' : ''} cursor-grab`}
        style={{
          left: element.x * zoom,
          top: element.y * zoom,
          width: element.width * zoom,
          height: element.height * zoom,
          backgroundColor: element.backgroundColor || 'transparent',
          display: element.type === 'text' ? 'flex' : 'block',
          alignItems: element.type === 'text' ? 'center' : 'stretch',
          justifyContent: element.type === 'text' ? (element.textAlign === 'center' ? 'center' : element.textAlign === 'right' ? 'flex-end' : 'flex-start') : 'stretch',
          padding: element.type === 'text' ? '4px' : '0',
          boxSizing: 'border-box',
          borderRadius: element.borderRadius || '0',
          opacity: element.opacity || 1,
          border: (element.type === 'rectangle' || element.type === 'circle') && element.lineColor && element.lineWidth ? `${element.lineWidth * zoom}px ${element.lineStyle || 'solid'} ${element.lineColor}` : 'none',
          borderStyle: element.lineStyle === 'dashed' ? 'dashed' : 'solid',
        }}
        onMouseDown={(e) => onMouseDown(e, element)}
      >
        {element.type === 'text' && (
          <div
            style={{
              color: element.fontColor || '#000000',
              fontFamily: element.fontFamily || 'sans-serif',
              fontWeight: element.fontWeight || 'normal',
              fontStyle: element.fontStyle || 'normal',
              textDecoration: element.textDecoration || 'none',
              fontSize: (element.fontSize || 16) * zoom,
              lineHeight: (element.lineHeight || 1.5) * zoom,
              textAlign: element.textAlign || 'left',
              width: '100%',
              wordBreak: 'break-word',
            }}
          >
            {element.content}
          </div>
        )}

        {isSelected && (
          <>
            <div className="resize-handle" data-handle="top-left" style={getResizeHandleStyle('top-left')}></div>
            <div className="resize-handle" data-handle="top-center" style={getResizeHandleStyle('top-center')}></div>
            <div className="resize-handle" data-handle="top-right" style={getResizeHandleStyle('top-right')}></div>
            <div className="resize-handle" data-handle="middle-left" style={getResizeHandleStyle('middle-left')}></div>
            <div className="resize-handle" data-handle="middle-right" style={getResizeHandleStyle('middle-right')}></div>
            <div className="resize-handle" data-handle="bottom-left" style={getResizeHandleStyle('bottom-left')}></div>
            <div className="resize-handle" data-handle="bottom-center" style={getResizeHandleStyle('bottom-center')}></div>
            <div className="resize-handle" data-handle="bottom-right" style={getResizeHandleStyle('bottom-right')}></div>
          </>
        )}
      </div>
    );
  }
};

export default CanvasElementRenderer;
