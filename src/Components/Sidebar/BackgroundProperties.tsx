import React from 'react';
import { CanvasElement, ColorPickerType } from '../../Interfaces';
import ColorPropertyControl from './ColorPropertyControl';

interface BackgroundPropertiesProps {
  selectedElement: CanvasElement;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onColorClick: (e: React.MouseEvent<HTMLDivElement>, colorType: ColorPickerType) => void;
}

const BackgroundProperties: React.FC<BackgroundPropertiesProps> = ({
  selectedElement,
  onColorClick,
}) => {
  return (
    <ColorPropertyControl
      selectedElement={selectedElement}
      label="Background Color"
      colorKey="backgroundColor"
      onColorClick={onColorClick}
      colorPickerType="background"
    />
  );
};

export default BackgroundProperties;
