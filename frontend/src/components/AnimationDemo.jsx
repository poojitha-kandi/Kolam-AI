import React, { useState } from 'react';
import KolamAnimation from './KolamAnimation';

const AnimationDemo = () => {
  const [currentPattern, setCurrentPattern] = useState('lissajous');
  const [currentSpeed, setCurrentSpeed] = useState(1);
  const [gridSize, setGridSize] = useState(3);

  const patterns = [
    { value: 'lissajous', name: 'Lissajous Curves', description: 'Mathematical curves creating flowing patterns' },
    { value: 'spiral', name: 'Spiral Pattern', description: 'Expanding spiral with golden ratio aesthetics' },
    { value: 'interwoven', name: 'Interwoven Loops', description: 'Traditional interlocking loop patterns' }
  ];

  const speeds = [
    { value: 0.5, name: 'Slow Motion', icon: '🐌' },
    { value: 1, name: 'Normal', icon: '⚡' },
    { value: 1.5, name: 'Fast', icon: '🚀' },
    { value: 2, name: 'Very Fast', icon: '💨' }
  ];

  return (
    <div className="animation-demo">
      <div className="demo-header">
        <h3>🎨 Interactive Kolam Animation Demo</h3>
        <p>Customize and explore different AI drawing patterns</p>
      </div>

      <div className="demo-content">
        {/* Main Animation Display */}
        <div className="demo-animation">
          <KolamAnimation 
            width={400}
            height={400}
            speed={currentSpeed}
            gridSize={gridSize}
            pattern={currentPattern}
            autoPlay={true}
            key={`${currentPattern}-${currentSpeed}-${gridSize}`} // Force re-render on changes
            className="demo-kolam"
          />
        </div>

        {/* Controls Panel */}
        <div className="demo-controls">
          {/* Pattern Selection */}
          <div className="control-section">
            <h4>🔮 Pattern Style</h4>
            <div className="pattern-grid">
              {patterns.map(pattern => (
                <button
                  key={pattern.value}
                  onClick={() => setCurrentPattern(pattern.value)}
                  className={`pattern-button ${currentPattern === pattern.value ? 'active' : ''}`}
                >
                  <div className="pattern-name">{pattern.name}</div>
                  <div className="pattern-desc">{pattern.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Speed Control */}
          <div className="control-section">
            <h4>⚡ Animation Speed</h4>
            <div className="speed-controls">
              {speeds.map(speed => (
                <button
                  key={speed.value}
                  onClick={() => setCurrentSpeed(speed.value)}
                  className={`speed-button ${currentSpeed === speed.value ? 'active' : ''}`}
                >
                  <span className="speed-icon">{speed.icon}</span>
                  <span className="speed-name">{speed.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grid Size Control */}
          <div className="control-section">
            <h4>📐 Grid Complexity</h4>
            <div className="grid-controls">
              {[2, 3, 4, 5].map(size => (
                <button
                  key={size}
                  onClick={() => setGridSize(size)}
                  className={`grid-button ${gridSize === size ? 'active' : ''}`}
                >
                  <span className="grid-size">{size}×{size}</span>
                  <span className="grid-dots">{size * size} dots</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Animation Info */}
        <div className="demo-info">
          <div className="info-card">
            <h5>🧠 AI Insights</h5>
            <div className="info-stats">
              <div className="stat">
                <span className="stat-label">Current Pattern:</span>
                <span className="stat-value">{patterns.find(p => p.value === currentPattern)?.name}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Drawing Speed:</span>
                <span className="stat-value">{currentSpeed}x Normal</span>
              </div>
              <div className="stat">
                <span className="stat-label">Grid Complexity:</span>
                <span className="stat-value">{gridSize}×{gridSize} ({gridSize * gridSize} intersection points)</span>
              </div>
              <div className="stat">
                <span className="stat-label">Animation Type:</span>
                <span className="stat-value">Real-time Canvas Rendering</span>
              </div>
            </div>
          </div>

          <div className="info-card">
            <h5>✨ Technical Features</h5>
            <ul className="feature-list">
              <li>🎯 Mathematical curve generation</li>
              <li>🌟 Real-time particle effects</li>
              <li>🎨 Smooth gradient animations</li>
              <li>🔄 Seamless looping</li>
              <li>📱 Responsive design</li>
              <li>🚀 60 FPS performance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationDemo;