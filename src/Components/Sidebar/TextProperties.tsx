import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, Italic, Underline } from 'lucide-react';
import { CanvasElement, ColorPickerType } from '../../Interfaces';
import ColorPropertyControl from './ColorPropertyControl';

interface TextPropertiesProps {
  selectedElement: CanvasElement;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onColorClick: (e: React.MouseEvent<HTMLDivElement>, colorType: ColorPickerType) => void;
}

const TextProperties: React.FC<TextPropertiesProps> = ({
  selectedElement,
  onUpdateElement,
  onColorClick,
}) => {

  const handlePropertyChange = (key: keyof CanvasElement, value: any) => {
    onUpdateElement(selectedElement.id, { [key]: value });
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Text</h2>
      <div className="mb-6">
        <label className="block text-sm mb-1">Add text</label>
        <textarea
          value={selectedElement.content || ''}
          onChange={(e) => handlePropertyChange('content', e.target.value)}
          className="w-full p-2 bg-gray-800 rounded-md text-sm h-24 resize-none"
        ></textarea>
      </div>

      <h2 className="text-xl font-semibold mb-4">Text Align</h2>
      <div className="flex space-x-2 mb-6">
        <button
          className={`p-2 rounded-md ${selectedElement.textAlign === 'left' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500`}
          onClick={() => handlePropertyChange('textAlign', 'left')}
        >
          <AlignLeft className="w-5 h-5" />
        </button>
        <button
          className={`p-2 rounded-md ${selectedElement.textAlign === 'center' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500`}
          onClick={() => handlePropertyChange('textAlign', 'center')}
        >
          <AlignCenter className="w-5 h-5" />
        </button>
        <button
          className={`p-2 rounded-md ${selectedElement.textAlign === 'right' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500`}
          onClick={() => handlePropertyChange('textAlign', 'right')}
        >
          <AlignRight className="w-5 h-5" />
        </button>
        <button
          className={`p-2 rounded-md ${selectedElement.textAlign === 'justify' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500`}
          onClick={() => handlePropertyChange('textAlign', 'justify')}
        >
          <AlignJustify className="w-5 h-5" />
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Font Family</h2>
      <div className="mb-6">
        <select
          value={selectedElement.fontFamily || 'sans-serif'}
          onChange={(e) => handlePropertyChange('fontFamily', e.target.value)}
          className="w-full p-2 bg-gray-800 rounded-md text-sm"
        >
          <option value="sans-serif">Sans-serif</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
          <option value="cursive">Cursive</option>
          <option value="fantasy">Fantasy</option>
        </select>
      </div>

      <ColorPropertyControl
        selectedElement={selectedElement}
        label="Font Color"
        colorKey="fontColor"
        onColorClick={onColorClick}
        colorPickerType="font"
      />

      <h2 className="text-xl font-semibold mb-4">Font Style</h2>
      <div className="flex space-x-2 mb-6">
        <button
          className={`p-2 rounded-md ${selectedElement.fontWeight === 'bold' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500`}
          onClick={() => handlePropertyChange('fontWeight', selectedElement.fontWeight === 'bold' ? 'normal' : 'bold')}
        >
          <Bold className="w-5 h-5" />
        </button>
        <button
          className={`p-2 rounded-md ${selectedElement.fontStyle === 'italic' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500`}
          onClick={() => handlePropertyChange('fontStyle', selectedElement.fontStyle === 'italic' ? 'normal' : 'italic')}
        >
          <Italic className="w-5 h-5" />
        </button>
        <button
          className={`p-2 rounded-md ${selectedElement.textDecoration === 'underline' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500`}
          onClick={() => handlePropertyChange('textDecoration', selectedElement.textDecoration === 'underline' ? 'none' : 'underline')}
        >
          <Underline className="w-5 h-5" />
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Font Size</h2>
      <div className="mb-6">
        <input
          type="range"
          min="10"
          max="100"
          value={selectedElement.fontSize || 16}
          onChange={(e) => handlePropertyChange('fontSize', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm mt-1 block">{selectedElement.fontSize || 16}px</span>
      </div>

      <h2 className="text-xl font-semibold mb-4">Line Height</h2>
      <div className="mb-6">
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={selectedElement.lineHeight || 1.5}
          onChange={(e) => handlePropertyChange('lineHeight', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm mt-1 block">{selectedElement.lineHeight || 1.5}</span>
      </div>

      <h2 className="text-xl font-semibold mb-4">Opacity</h2>
      <div className="mb-6">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={selectedElement.opacity || 1}
          onChange={(e) => handlePropertyChange('opacity', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm mt-1 block">{(selectedElement.opacity || 1) * 100}%</span>
      </div>
    </>
  );
};

export default TextProperties;
