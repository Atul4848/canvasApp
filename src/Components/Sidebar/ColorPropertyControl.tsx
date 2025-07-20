import React from 'react';
import { CanvasElement, ColorPickerType } from '../../Interfaces';

interface ColorPropertyControlProps {
  label: string;
  colorKey: keyof CanvasElement;
  selectedElement: CanvasElement;
  onColorClick: (e: React.MouseEvent<HTMLDivElement>, colorType: ColorPickerType) => void;
  colorPickerType: ColorPickerType;
}

const ColorPropertyControl: React.FC<ColorPropertyControlProps> = ({
  selectedElement,
  label,
  colorKey,
  onColorClick,
  colorPickerType,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">{label}</h2>
      <div className="flex items-center space-x-2">
        <div
          className="w-8 h-8 rounded-md cursor-pointer border border-gray-600"
          style={{ backgroundColor: (selectedElement[colorKey] as string) || '#FFFFFF' }}
          onClick={(e) => onColorClick(e, colorPickerType)}
        ></div>
        <input
          type="text"
          value={(selectedElement[colorKey] as string) || '#FFFFFF'}
          readOnly
          className="p-2 bg-gray-800 rounded-md text-sm flex-grow"
        />
      </div>
    </div>
  );
};

export default ColorPropertyControl;
