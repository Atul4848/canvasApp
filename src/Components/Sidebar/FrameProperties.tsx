import React from 'react';
import { CanvasElement } from '../../Interfaces';

interface FramePropertiesProps {
  selectedElement: CanvasElement;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
}

const FrameProperties: React.FC<FramePropertiesProps> = ({ selectedElement, onUpdateElement }) => {
  const handlePropertyChange = (key: keyof CanvasElement, value: any) => {
    onUpdateElement(selectedElement.id, { [key]: value });
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Frame</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm mb-1">X</label>
          <input
            type="number"
            value={selectedElement.x}
            onChange={(e) => handlePropertyChange('x', parseFloat(e.target.value))}
            className="w-full p-2 bg-gray-800 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Y</label>
          <input
            type="number"
            value={selectedElement.y}
            onChange={(e) => handlePropertyChange('y', parseFloat(e.target.value))}
            className="w-full p-2 bg-gray-800 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">W</label>
          <input
            type="number"
            value={selectedElement.width}
            onChange={(e) => handlePropertyChange('width', parseFloat(e.target.value))}
            className="w-full p-2 bg-gray-800 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">H</label>
          <input
            type="number"
            value={selectedElement.height}
            onChange={(e) => handlePropertyChange('height', parseFloat(e.target.value))}
            className="w-full p-2 bg-gray-800 rounded-md text-sm"
          />
        </div>
      </div>
    </>
  );
};

export default FrameProperties;
