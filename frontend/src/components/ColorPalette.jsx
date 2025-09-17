import React from 'react';
import { Palette } from 'lucide-react';

// Enhanced color palette with more variety
const COLOR_PALETTE = [
  // Primary colors
  '#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00', '#00FF80',
  '#00FFFF', '#0080FF', '#0000FF', '#8000FF', '#FF00FF', '#FF0080',
  
  // Secondary/muted colors
  '#800000', '#804000', '#808000', '#408000', '#008000', '#008040',
  '#008080', '#004080', '#000080', '#400080', '#800080', '#800040',
  
  // Pastels
  '#FFB6C1', '#FFE4B5', '#FFFFE0', '#98FB98', '#87CEEB', '#DDA0DD',
  '#F0E68C', '#FFA07A', '#20B2AA', '#87CEFA', '#778899', '#B0C4DE',
  
  // Dark tones
  '#2F4F4F', '#696969', '#708090', '#778899', '#A9A9A9', '#C0C0C0',
  '#D3D3D3', '#DCDCDC', '#F5F5F5', '#FFFFFF', '#000000', '#1C1C1C'
];

const ColorPalette = ({ 
  selectedColors = [], 
  onColorSelect, 
  maxColors = 10,
  className = '' 
}) => {
  
  const handleColorSelect = (color) => {
    if (selectedColors.includes(color)) {
      // Remove color if already selected
      onColorSelect(selectedColors.filter(c => c !== color));
    } else if (selectedColors.length < maxColors) {
      // Add color if under limit
      onColorSelect([...selectedColors, color]);
    } else {
      // Replace last color if at limit
      onColorSelect([...selectedColors.slice(0, -1), color]);
    }
  };

  const clearSelectedColors = () => {
    onColorSelect([]);
  };

  return (
    <div className={`color-palette-container ${className}`}>
      <div className="palette-header">
        <h3>
          <Palette size={18} />
          Color Palette
        </h3>
        <span className="color-count">
          {selectedColors.length}/{maxColors} selected
        </span>
      </div>

      {/* Selected Colors Display */}
      {selectedColors.length > 0 && (
        <div className="selected-colors">
          <div className="selected-colors-header">
            <span>Selected Colors:</span>
            <button 
              onClick={clearSelectedColors}
              className="clear-colors-btn"
              title="Clear all selected colors"
            >
              Clear All
            </button>
          </div>
          <div className="selected-colors-grid">
            {selectedColors.map((color, index) => (
              <div
                key={`selected-${color}-${index}`}
                className="selected-color-item"
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
                title={`Remove ${color}`}
              >
                <span className="color-label">{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Color Grid */}
      <div className="color-grid">
        {COLOR_PALETTE.map((color, index) => (
          <div
            key={`palette-${color}-${index}`}
            className={`color-swatch ${selectedColors.includes(color) ? 'selected' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => handleColorSelect(color)}
            title={color}
          >
            {selectedColors.includes(color) && (
              <span className="selection-indicator">
                {selectedColors.indexOf(color) + 1}
              </span>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .color-palette-container {
          background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.05));
          border: 1px solid rgba(247, 239, 230, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
        }

        .palette-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .palette-header h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #f7efe6;
        }

        .color-count {
          font-size: 0.9rem;
          color: rgba(247, 239, 230, 0.7);
          background: rgba(255, 214, 138, 0.1);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 214, 138, 0.3);
        }

        .selected-colors {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: rgba(255, 214, 138, 0.05);
          border: 1px solid rgba(255, 214, 138, 0.2);
          border-radius: 8px;
        }

        .selected-colors-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
          color: #f7efe6;
        }

        .clear-colors-btn {
          background: transparent;
          border: 1px solid rgba(239, 68, 68, 0.6);
          color: #f87171;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s;
        }

        .clear-colors-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.8);
        }

        .selected-colors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
          gap: 0.5rem;
          max-width: 100%;
        }

        .selected-color-item {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 214, 138, 0.8);
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          position: relative;
        }

        .selected-color-item:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(255, 214, 138, 0.4);
        }

        .color-label {
          color: white;
          font-size: 0.8rem;
          font-weight: bold;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
          background: rgba(0,0,0,0.3);
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .color-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 0.5rem;
        }

        .color-swatch {
          width: 100%;
          height: 2.5rem;
          border: 2px solid rgba(247, 239, 230, 0.3);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .color-swatch:hover {
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(255, 214, 138, 0.4);
          border-color: rgba(255, 214, 138, 0.6);
        }

        .color-swatch.selected {
          border-color: #ffd68a;
          border-width: 3px;
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(255, 214, 138, 0.6);
        }

        .selection-indicator {
          color: white;
          font-size: 0.8rem;
          font-weight: bold;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
          background: rgba(0,0,0,0.5);
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .color-grid {
            grid-template-columns: repeat(6, 1fr);
          }
          
          .selected-colors-grid {
            grid-template-columns: repeat(5, 1fr);
          }

          .color-swatch {
            height: 2rem;
          }

          .selected-color-item {
            width: 35px;
            height: 35px;
          }
        }

        @media (max-width: 480px) {
          .color-grid {
            grid-template-columns: repeat(4, 1fr);
          }
          
          .selected-colors-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .palette-header {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default ColorPalette;
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