import React, { useState } from 'react';
import { Check } from 'lucide-react';

const ColorPalette = ({ selectedColor, onColorSelect }) => {
  const [customColor, setCustomColor] = useState('#000000');

  // Predefined color palette
  const colors = [
    // Reds
    '#FF6B6B', '#FF4757', '#FF3838', '#FF6348', '#FF7675',
    
    // Oranges & Yellows
    '#FFA726', '#FFB74D', '#FFCC02', '#FFD93D', '#FFE066',
    
    // Greens
    '#6BCF7F', '#4ECDC4', '#26DE81', '#20BF6B', '#0FB9B1',
    
    // Blues
    '#3742FA', '#2F3542', '#40739E', '#487EB0', '#7bed9f',
    
    // Purples & Pinks
    '#5F27CD', '#8B5CF6', '#A855F7', '#C084FC', '#DDD6FE',
    '#FF6B9D', '#F8BBD9', '#F48FB1', '#F06292', '#EC407A',
    
    // Neutrals
    '#2C2C54', '#40407A', '#706FD3', '#95A5A6', '#BDC3C7',
    '#34495E', '#2C3E50', '#7F8C8D', '#95A5A6', '#ECF0F1',
    
    // Earth tones
    '#8B4513', '#A0522D', '#CD853F', '#DEB887', '#F4A460',
    
    // Special colors
    '#000000', '#FFFFFF', '#FFD700', '#C0C0C0', '#FF1493'
  ];

  const handleColorClick = (color) => {
    onColorSelect(color);
  };

  const handleCustomColorChange = (e) => {
    const color = e.target.value;
    setCustomColor(color);
    onColorSelect(color);
  };

  return (
    <div className="space-y-4">
      {/* Predefined Colors */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Basic Colors</h3>
        <div className="grid grid-cols-5 gap-2">
          {colors.map((color, index) => (
            <button
              key={index}
              className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 hover:shadow-md ${
                selectedColor === color
                  ? 'border-gray-800 shadow-lg scale-105'
                  : 'border-gray-300 hover:border-gray-400'
              } ${color === '#FFFFFF' ? 'shadow-inner' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorClick(color)}
              title={color}
            >
              {selectedColor === color && (
                <Check 
                  size={16} 
                  className={`mx-auto ${
                    color === '#FFFFFF' || color === '#FFD93D' || color === '#FFCC02' 
                      ? 'text-gray-800' 
                      : 'text-white'
                  }`} 
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color Picker */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Custom Color</h3>
        <div className="flex items-center space-x-3">
          <input
            type="color"
            value={customColor}
            onChange={handleCustomColorChange}
            className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
            title="Pick a custom color"
          />
          <div className="flex-1">
            <input
              type="text"
              value={customColor}
              onChange={(e) => {
                setCustomColor(e.target.value);
                if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                  onColorSelect(e.target.value);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
              placeholder="#000000"
              pattern="^#[0-9A-F]{6}$"
            />
          </div>
        </div>
      </div>

      {/* Current Color Display */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Current Color</h3>
        <div className="flex items-center space-x-3">
          <div
            className="w-16 h-16 rounded-lg border-2 border-gray-300 shadow-inner"
            style={{ backgroundColor: selectedColor }}
          />
          <div>
            <p className="text-sm font-mono text-gray-600">{selectedColor}</p>
            <p className="text-xs text-gray-500">Selected</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Select</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleColorClick('#FFFFFF')}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Eraser
          </button>
          <button
            onClick={() => handleColorClick('#000000')}
            className="px-3 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
          >
            Black
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorPalette;