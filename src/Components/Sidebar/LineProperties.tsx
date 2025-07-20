import React from 'react';
import { CanvasElement, ColorPickerType } from '../../Interfaces';
import ColorPropertyControl from './ColorPropertyControl';

interface LinePropertiesProps {
  selectedElement: CanvasElement;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onColorClick: (e: React.MouseEvent<HTMLDivElement>, colorType: ColorPickerType) => void;
}

const LineProperties: React.FC<LinePropertiesProps> = ({
  selectedElement,
  onUpdateElement,
  onColorClick,
}) => {
  const handlePropertyChange = (key: keyof CanvasElement, value: any) => {
    onUpdateElement(selectedElement.id, { [key]: value });
  };

  return (
    <>
      <ColorPropertyControl
        selectedElement={selectedElement}
        label="Line Color"
        colorKey="lineColor"
        onColorClick={onColorClick}
        colorPickerType="line"
      />

      <h2 className="text-xl font-semibold mb-4">Line Width</h2>
      <div className="mb-6">
        <input
          type="range"
          min="1"
          max="20"
          value={selectedElement.lineWidth || 1}
          onChange={(e) => handlePropertyChange('lineWidth', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm mt-1 block">{selectedElement.lineWidth || 1}px</span>
      </div>

      <h2 className="text-xl font-semibold mb-4">Line Style</h2>
      <div className="flex space-x-2 mb-6">
        <button
          className={`p-2 rounded-md ${selectedElement.lineStyle === 'solid' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500`}
          onClick={() => handlePropertyChange('lineStyle', 'solid')}
        >
          Solid
        </button>
        <button
          className={`p-2 rounded-md ${selectedElement.lineStyle === 'dashed' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500`}
          onClick={() => handlePropertyChange('lineStyle', 'dashed')}
        >
          Dashed
        </button>
      </div>
    </>
  );
};

export default LineProperties;
