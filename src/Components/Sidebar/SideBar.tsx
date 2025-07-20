import React, { useState } from 'react';
import { CanvasElement, ColorPickerType } from '../../Interfaces';
import ColorPicker from '../ColorPicker';
import FrameProperties from './FrameProperties';
import BackgroundProperties from './BackgroundProperties';
import LineProperties from './LineProperties';
import TextProperties from './TextProperties';

interface SidebarProps {
  selectedElement: CanvasElement | null;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedElement, onUpdateElement }) => {
  const [showColorPicker, setShowColorPicker] = useState<ColorPickerType>(false);
  const [colorPickerPosition, setColorPickerPosition] = useState({ x: 0, y: 0 });
  const handleColorClick = (e: React.MouseEvent<HTMLDivElement>, colorType: ColorPickerType) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setColorPickerPosition({ x: rect.left, y: rect.bottom + 10 });
    setShowColorPicker(colorType);
  };

  return (
    <aside className="w-80 bg-gray-900 p-4 text-white rounded-lg shadow-md overflow-y-auto">
      {selectedElement ? (
        <>
          <FrameProperties selectedElement={selectedElement} onUpdateElement={onUpdateElement} />

          {(selectedElement.type === 'rectangle' || selectedElement.type === 'circle') && (
            <BackgroundProperties
              selectedElement={selectedElement}
              onUpdateElement={onUpdateElement}
              onColorClick={handleColorClick}
            />
          )}

          {(selectedElement.type === 'rectangle' || selectedElement.type === 'circle' || selectedElement.type === 'line') && (
            <LineProperties
              selectedElement={selectedElement}
              onUpdateElement={onUpdateElement}
              onColorClick={handleColorClick}
            />
          )}

          {selectedElement.type === 'text' && (
            <TextProperties
              selectedElement={selectedElement}
              onUpdateElement={onUpdateElement}
              onColorClick={handleColorClick}
            />
          )}

        </>
      ) : (
        <p className="text-gray-400">Select an element to edit its properties.</p>
      )}

      {showColorPicker && (
        <ColorPicker
          color={
            showColorPicker === 'background'
              ? selectedElement?.backgroundColor || '#FFFFFF'
              : showColorPicker === 'font'
              ? selectedElement?.fontColor || '#000000'
              : selectedElement?.lineColor || '#000000'
          }
          onChange={(newColor) => {
            if (selectedElement) {
              if (showColorPicker === 'background') {
                onUpdateElement(selectedElement.id, { backgroundColor: newColor });
              } else if (showColorPicker === 'font') {
                onUpdateElement(selectedElement.id, { fontColor: newColor });
              } else if (showColorPicker === 'line') {
                onUpdateElement(selectedElement.id, { lineColor: newColor });
              }
            }
          }}
          onClose={() => setShowColorPicker(false)}
          position={colorPickerPosition}
        />
      )}
    </aside>
  );
};

export default Sidebar;