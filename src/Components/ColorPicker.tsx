import React, { useState, useEffect } from 'react';

interface ColorPickerProps {
  color: string;
  onChange: (newColor: string) => void;
  onClose: () => void;
  position: { x: number; y: number };
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, onClose, position }) => {
  const [hex, setHex] = useState(color.startsWith('#') ? color.substring(1) : color);
  const [r, setR] = useState(0);
  const [g, setG] = useState(0);
  const [b, setB] = useState(0);

  useEffect(() => {
    const hexToRgb = (hex: string) => {
      const bigint = parseInt(hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return { r, g, b };
    };

    if (hex.length === 6) {
      const { r, g, b } = hexToRgb(hex);
      setR(r);
      setG(g);
      setB(b);
    }
  }, [hex]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    setHex(newHex);
    if (newHex.length === 6) {
      onChange(`#${newHex}`);
    }
  };

  const handleRgbChange = (component: 'r' | 'g' | 'b', value: string) => {
    let num = parseInt(value, 10);
    if (isNaN(num) || num < 0) num = 0;
    if (num > 255) num = 255;

    let newR = r, newG = g, newB = b;
    if (component === 'r') newR = num;
    else if (component === 'g') newG = num;
    else newB = num;

    setR(newR);
    setG(newG);
    setB(newB);

    const rgbToHex = (r: number, g: number, b: number) => {
      return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };
    const newHex = rgbToHex(newR, newG, newB);
    setHex(newHex);
    onChange(`#${newHex}`);
  };

  const predefinedColors = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#000000', '#FFFFFF',
    '#161515', '#F5A623', '#7ED321', '#4A90E2', '#BD10E0', '#9013FE', '#4A4A4A', '#D0021B'
  ];

  return (
    <div
      className="absolute bg-gray-700 p-4 rounded-lg shadow-xl z-50"
      style={{ left: position.x, top: position.y }}
    >
      <div className="w-full h-32 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 relative mb-4 rounded-md">
        <div
          className="w-6 h-6 rounded-full border-2 border-white absolute -translate-x-1/2 -translate-y-1/2"
          style={{ backgroundColor: color, left: '50%', top: '50%' }}
        ></div>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-white">Hex:</span>
        <input
          type="text"
          value={hex}
          onChange={handleHexChange}
          className="w-20 p-1 bg-gray-600 text-white rounded-md text-sm"
          maxLength={6}
        />
        <span className="text-white">R:</span>
        <input
          type="number"
          value={r}
          onChange={(e) => handleRgbChange('r', e.target.value)}
          className="w-12 p-1 bg-gray-600 text-white rounded-md text-sm"
          min="0" max="255"
        />
        <span className="text-white">G:</span>
        <input
          type="number"
          value={g}
          onChange={(e) => handleRgbChange('g', e.target.value)}
          className="w-12 p-1 bg-gray-600 text-white rounded-md text-sm"
          min="0" max="255"
        />
        <span className="text-white">B:</span>
        <input
          type="number"
          value={b}
          onChange={(e) => handleRgbChange('b', e.target.value)}
          className="w-12 p-1 bg-gray-600 text-white rounded-md text-sm"
          min="0" max="255"
        />
      </div>
      <div className="grid grid-cols-8 gap-2 mb-4">
        {predefinedColors.map((c) => (
          <div
            key={c}
            className="w-6 h-6 rounded-full cursor-pointer border border-gray-500"
            style={{ backgroundColor: c }}
            onClick={() => {
              onChange(c);
              setHex(c.substring(1));
            }}
          ></div>
        ))}
      </div>
      <button
        onClick={onClose}
        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Close
      </button>
    </div>
  );
};

export default ColorPicker;
