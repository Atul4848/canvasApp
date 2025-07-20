import React from 'react';
import { MousePointer2, Square, Circle, Type, Save, FolderOpen, Minus } from 'lucide-react';
import { DrawingTool } from '../Interfaces';

interface HeaderProps {
  currentTool: DrawingTool;
  onSelectTool: (tool: DrawingTool) => void;
  onSaveDrawing: () => void;
  onLoadDrawing: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentTool, onSelectTool, onSaveDrawing, onLoadDrawing }) => {
  const getToolClass = (tool: DrawingTool) =>
    `p-2 rounded-md ${currentTool === tool ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'} hover:bg-blue-500 transition-colors duration-200`;

  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white shadow-md rounded-lg">
      <div className="flex space-x-2">
        <button className={getToolClass('select')} onClick={() => onSelectTool('select')} title="Select Tool">
          <MousePointer2 className="w-6 h-6" />
        </button>
        <button className={getToolClass('rectangle')} onClick={() => onSelectTool('rectangle')} title="Draw Rectangle">
          <Square className="w-6 h-6" />
        </button>
        <button className={getToolClass('circle')} onClick={() => onSelectTool('circle')} title="Draw Circle">
          <Circle className="w-6 h-6" />
        </button>
        <button className={getToolClass('line')} onClick={() => onSelectTool('line')} title="Draw Line">
          <Minus className="w-6 h-6 rotate-45" />
        </button>
        <button className={getToolClass('text')} onClick={() => onSelectTool('text')} title="Add Text">
          <Type className="w-6 h-6" />
        </button>
      </div>
      <div className="flex space-x-2">
        <button className="p-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors duration-200" onClick={onSaveDrawing} title="Save Drawing">
          <Save className="w-6 h-6" />
        </button>
        <button className="p-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors duration-200" onClick={onLoadDrawing} title="Load Drawing">
          <FolderOpen className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
