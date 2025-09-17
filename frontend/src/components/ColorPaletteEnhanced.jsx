import React, { useState } from 'react';
import { Palette, Plus, Minus } from 'lucide-react';

// Extended color palette with 48 vibrant colors
const COLOR_PALETTE = [
  // Reds and Pinks
  '#FF0000', '#FF4444', '#FF6B6B', '#FF8A80', '#E91E63', '#F06292',
  '#AD1457', '#C2185B', '#FF1744', '#FF5722', '#FF6F00', '#FF8F00',
  
  // Oranges and Yellows
  '#FF9800', '#FFB74D', '#FFC107', '#FFEB3B', '#FFFF00', '#F9A825',
  '#F57F17', '#FF6F00', '#FFD54F', '#FFF176', '#FFEE58', '#FFFF8D',
  
  // Greens
  '#4CAF50', '#66BB6A', '#81C784', '#A5D6A7', '#00E676', '#00C853',
  '#2E7D32', '#388E3C', '#43A047', '#4CAF50', '#66BB6A', '#8BC34A',
  
  // Blues and Cyans
  '#2196F3', '#42A5F5', '#64B5F6', '#90CAF9', '#03DAC6', '#00BCD4',
  '#0097A7', '#00ACC1', '#00BCD4', '#26C6DA', '#4DD0E1', '#80DEEA',
  
  // Purples and Indigos
  '#9C27B0', '#AB47BC', '#BA68C8', '#CE93D8', '#673AB7', '#7986CB',
  '#3F51B5', '#5C6BC0', '#7986CB', '#9FA8DA', '#C5CAE9', '#E1BEE7'
];

const ColorPaletteEnhanced = ({ selectedColors = [], onColorSelect, maxColors = 5 }) => {
  const [showAllColors, setShowAllColors] = useState(false);

  const handleColorClick = (color) => {
    if (selectedColors.includes(color)) {
      // Remove color if already selected
      const newColors = selectedColors.filter(c => c !== color);
      onColorSelect(newColors);
    } else if (selectedColors.length < maxColors) {
      // Add color if under limit
      const newColors = [...selectedColors, color];
      onColorSelect(newColors);
    }
  };

  const removeColor = (colorToRemove) => {
    const newColors = selectedColors.filter(c => c !== colorToRemove);
    onColorSelect(newColors);
  };

  const visibleColors = showAllColors ? COLOR_PALETTE : COLOR_PALETTE.slice(0, 24);

  return (
    <div className="color-palette-enhanced">
      {/* Selected Colors Display */}
      <div className="selected-colors-section">
        <h3 className="section-title">
          <Palette size={18} />
          Selected Colors ({selectedColors.length}/{maxColors})
        </h3>
        <div className="selected-colors-display">
          {selectedColors.map((color, index) => (
            <div key={`selected-${color}`} className="selected-color-item">
              <div 
                className="selected-color-swatch"
                style={{ backgroundColor: color }}
                title={`Color ${index + 1}: ${color}`}
              >
                <span className="color-number">{index + 1}</span>
                <button 
                  className="remove-color-btn"
                  onClick={() => removeColor(color)}
                  title="Remove color"
                >
                  <Minus size={12} />
                </button>
              </div>
            </div>
          ))}
          {/* Empty slots */}
          {Array.from({ length: maxColors - selectedColors.length }).map((_, index) => (
            <div key={`empty-${index}`} className="empty-color-slot">
              <Plus size={16} />
            </div>
          ))}
        </div>
      </div>

      {/* Color Palette Grid */}
      <div className="color-palette-section">
        <div className="palette-header">
          <h3 className="section-title">Color Palette</h3>
          <button 
            className="toggle-colors-btn"
            onClick={() => setShowAllColors(!showAllColors)}
          >
            {showAllColors ? 'Show Less' : 'Show More'}
          </button>
        </div>
        
        <div className="color-grid">
          {visibleColors.map((color) => (
            <button
              key={color}
              className={`color-swatch ${selectedColors.includes(color) ? 'selected' : ''} ${selectedColors.length >= maxColors && !selectedColors.includes(color) ? 'disabled' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorClick(color)}
              disabled={selectedColors.length >= maxColors && !selectedColors.includes(color)}
              title={color}
            >
              {selectedColors.includes(color) && (
                <span className="selection-indicator">
                  {selectedColors.indexOf(color) + 1}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .color-palette-enhanced {
          background: rgba(12, 12, 12, 0.8);
          border: 1px solid rgba(247, 239, 230, 0.1);
          border-radius: 16px;
          padding: 20px;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #f7efea;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .selected-colors-section {
          margin-bottom: 24px;
        }

        .selected-colors-display {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .selected-color-item {
          position: relative;
        }

        .selected-color-swatch {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          border: 2px solid rgba(247, 239, 230, 0.3);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .color-number {
          color: white;
          font-weight: bold;
          font-size: 14px;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        }

        .remove-color-btn {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(255, 0, 0, 0.8);
          border: none;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .remove-color-btn:hover {
          background: rgba(255, 0, 0, 1);
          transform: scale(1.1);
        }

        .empty-color-slot {
          width: 50px;
          height: 50px;
          border: 2px dashed rgba(247, 239, 230, 0.3);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(247, 239, 230, 0.5);
        }

        .palette-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .toggle-colors-btn {
          background: rgba(255, 214, 138, 0.2);
          border: 1px solid rgba(255, 214, 138, 0.3);
          color: #ffd68a;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .toggle-colors-btn:hover {
          background: rgba(255, 214, 138, 0.3);
          border-color: rgba(255, 214, 138, 0.5);
        }

        .color-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
          gap: 8px;
          max-height: 200px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(247, 239, 230, 0.3) transparent;
        }

        .color-grid::-webkit-scrollbar {
          width: 6px;
        }

        .color-grid::-webkit-scrollbar-track {
          background: rgba(247, 239, 230, 0.1);
          border-radius: 3px;
        }

        .color-grid::-webkit-scrollbar-thumb {
          background: rgba(247, 239, 230, 0.3);
          border-radius: 3px;
        }

        .color-swatch {
          width: 40px;
          height: 40px;
          border: 2px solid transparent;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .color-swatch:hover {
          transform: scale(1.05);
          border-color: rgba(247, 239, 230, 0.5);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .color-swatch.selected {
          border-color: #ffd68a;
          box-shadow: 0 4px 16px rgba(255, 214, 138, 0.4);
          transform: scale(1.05);
        }

        .color-swatch.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .color-swatch.disabled:hover {
          transform: none;
          border-color: transparent;
          box-shadow: none;
        }

        .selection-indicator {
          color: white;
          font-weight: bold;
          font-size: 12px;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .color-palette-enhanced {
            padding: 16px;
          }

          .selected-colors-display {
            gap: 8px;
          }

          .selected-color-swatch {
            width: 45px;
            height: 45px;
          }

          .empty-color-slot {
            width: 45px;
            height: 45px;
          }

          .color-grid {
            grid-template-columns: repeat(auto-fill, minmax(35px, 1fr));
            gap: 6px;
          }

          .color-swatch {
            width: 35px;
            height: 35px;
          }
        }
      `}</style>
    </div>
  );
};

export default ColorPaletteEnhanced;