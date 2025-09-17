import React, { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, Palette, Upload, Image, Paintbrush, Eraser } from 'lucide-react';
import ColorPaletteEnhanced from './ColorPaletteEnhanced';
import MandalaRenderer from './MandalaRenderer';
import ImageUpload from './ImageUpload';

const MandalaColoringEnhanced = () => {
  // Main application state
  const [currentView, setCurrentView] = useState('gallery'); // 'gallery', 'upload', 'coloring'
  const [selectedColors, setSelectedColors] = useState(['#FF6B6B', '#4ECDC4', '#45B7D1']);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [currentTool, setCurrentTool] = useState('paint');
  const [currentMandala, setCurrentMandala] = useState(null);
  const [svgContent, setSvgContent] = useState('');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Predefined mandala gallery
  const mandalaGallery = [
    { 
      id: 'test', 
      name: 'Test Mandala', 
      file: '/mandalas/test.svg',
      description: 'Simple geometric patterns perfect for beginners'
    },
    { 
      id: 'lotus', 
      name: 'Lotus Mandala', 
      file: '/mandalas/lotus.svg',
      description: 'Beautiful lotus flower with intricate petals'
    },
    { 
      id: 'star', 
      name: 'Star Mandala', 
      file: '/mandalas/star.svg',
      description: 'Celestial star pattern with radiating designs'
    },
    { 
      id: 'geometric', 
      name: 'Geometric Mandala', 
      file: '/mandalas/geometric.svg',
      description: 'Complex geometric shapes and patterns'
    }
  ];

  // Load mandala from gallery or create fallback
  const loadMandala = useCallback(async (mandalaId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const mandala = mandalaGallery.find(m => m.id === mandalaId);
      if (mandala) {
        const response = await fetch(mandala.file);
        if (response.ok) {
          const svgText = await response.text();
          setSvgContent(svgText);
          setCurrentMandala(mandala);
          setCurrentView('coloring');
        } else {
          throw new Error('Failed to load mandala');
        }
      } else {
        // Generate a simple fallback mandala
        const fallbackSVG = generateFallbackMandala();
        setSvgContent(fallbackSVG);
        setCurrentMandala({ id: 'fallback', name: 'Simple Mandala', description: 'Basic circular pattern' });
        setCurrentView('coloring');
      }
    } catch (err) {
      console.error('Error loading mandala:', err);
      setError('Failed to load mandala. Using fallback design.');
      
      // Use fallback mandala
      const fallbackSVG = generateFallbackMandala();
      setSvgContent(fallbackSVG);
      setCurrentMandala({ id: 'fallback', name: 'Simple Mandala', description: 'Basic circular pattern' });
      setCurrentView('coloring');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate a simple fallback mandala
  const generateFallbackMandala = () => {
    return `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <circle cx="200" cy="200" r="180" fill="none" stroke="#ffffff" stroke-width="2" id="outer-circle"/>
        <circle cx="200" cy="200" r="150" fill="none" stroke="#ffffff" stroke-width="2" id="circle-1"/>
        <circle cx="200" cy="200" r="120" fill="none" stroke="#ffffff" stroke-width="2" id="circle-2"/>
        <circle cx="200" cy="200" r="90" fill="none" stroke="#ffffff" stroke-width="2" id="circle-3"/>
        <circle cx="200" cy="200" r="60" fill="none" stroke="#ffffff" stroke-width="2" id="circle-4"/>
        <circle cx="200" cy="200" r="30" fill="none" stroke="#ffffff" stroke-width="2" id="inner-circle"/>
        
        ${Array.from({ length: 8 }, (_, i) => {
          const angle = (i * 45) * Math.PI / 180;
          const x1 = 200 + Math.cos(angle) * 30;
          const y1 = 200 + Math.sin(angle) * 30;
          const x2 = 200 + Math.cos(angle) * 180;
          const y2 = 200 + Math.sin(angle) * 180;
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ffffff" stroke-width="2" id="spoke-${i}"/>`;
        }).join('')}
        
        ${Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30) * Math.PI / 180;
          const x = 200 + Math.cos(angle) * 135;
          const y = 200 + Math.sin(angle) * 135;
          return `<circle cx="${x}" cy="${y}" r="15" fill="none" stroke="#ffffff" stroke-width="2" id="petal-${i}"/>`;
        }).join('')}
      </svg>
    `;
  };

  // Handle image upload
  const handleImageUpload = useCallback((svgContent, fileInfo) => {
    setSvgContent(svgContent);
    setCurrentMandala({
      id: 'uploaded',
      name: fileInfo.name,
      description: 'Uploaded image',
      fileInfo
    });
    setCurrentView('coloring');
    setError(null);
  }, []);

  // Handle upload error
  const handleUploadError = useCallback((errorMessage) => {
    setError(errorMessage);
  }, []);

  // Handle color palette changes
  const handleColorSelect = useCallback((colors) => {
    setSelectedColors(colors);
    // If we had a selected index beyond the new array, reset to 0
    if (currentColorIndex >= colors.length) {
      setCurrentColorIndex(0);
    }
  }, [currentColorIndex]);

  // Handle tool changes
  const handleToolChange = useCallback((tool) => {
    setCurrentTool(tool);
  }, []);

  // Handle history changes from renderer
  const handleHistoryChange = useCallback((newHistory, newIndex) => {
    setHistory(newHistory);
    setHistoryIndex(newIndex);
  }, []);

  // Navigation handlers
  const goToGallery = () => {
    setCurrentView('gallery');
    setError(null);
  };

  const goToUpload = () => {
    setCurrentView('upload');
    setError(null);
  };

  // Reset view state when switching views
  useEffect(() => {
    if (currentView !== 'coloring') {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setHistory([]);
      setHistoryIndex(-1);
    }
  }, [currentView]);

  return (
    <div className="mandala-coloring-enhanced">
      {/* Header */}
      <div className="app-header">
        <div className="header-content">
          {currentView !== 'gallery' && (
            <button onClick={goToGallery} className="back-btn">
              <ArrowLeft size={20} />
              Back to Gallery
            </button>
          )}
          
          <h1 className="app-title">
            <Palette size={24} />
            Mandala Coloring Studio
          </h1>
          
          {currentView === 'gallery' && (
            <button onClick={goToUpload} className="upload-btn">
              <Upload size={20} />
              Upload Image
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">
        {currentView === 'gallery' && (
          <div className="gallery-view">
            <div className="gallery-header">
              <h2>Choose a Mandala to Color</h2>
              <p>Select from our collection of beautiful mandala designs</p>
            </div>
            
            <div className="mandala-grid">
              {mandalaGallery.map((mandala) => (
                <div 
                  key={mandala.id} 
                  className="mandala-card"
                  onClick={() => loadMandala(mandala.id)}
                >
                  <div className="card-image">
                    <Image size={48} />
                  </div>
                  <div className="card-content">
                    <h3>{mandala.name}</h3>
                    <p>{mandala.description}</p>
                    <button className="select-btn">Start Coloring</button>
                  </div>
                </div>
              ))}
              
              {/* Upload Card */}
              <div className="mandala-card upload-card" onClick={goToUpload}>
                <div className="card-image">
                  <Upload size={48} />
                </div>
                <div className="card-content">
                  <h3>Upload Your Own</h3>
                  <p>Upload SVG or PNG images to create custom coloring pages</p>
                  <button className="select-btn">Upload Image</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'upload' && (
          <div className="upload-view">
            <div className="upload-header">
              <h2>Upload Your Image</h2>
              <p>Transform your line art into a colorable mandala</p>
            </div>
            
            <ImageUpload 
              onImageLoad={handleImageUpload}
              onError={handleUploadError}
            />
          </div>
        )}

        {currentView === 'coloring' && (
          <div className="coloring-view">
            {/* Sidebar */}
            <div className="coloring-sidebar">
              {/* Tools */}
              <div className="tools-section">
                <h3>Tools</h3>
                <div className="tool-buttons">
                  <button
                    onClick={() => handleToolChange('paint')}
                    className={`tool-btn ${currentTool === 'paint' ? 'active' : ''}`}
                    title="Paint Tool"
                  >
                    <Paintbrush size={20} />
                    Paint
                  </button>
                  <button
                    onClick={() => handleToolChange('eraser')}
                    className={`tool-btn ${currentTool === 'eraser' ? 'active' : ''}`}
                    title="Eraser Tool"
                  >
                    <Eraser size={20} />
                    Eraser
                  </button>
                </div>
              </div>

              {/* Color Palette */}
              <ColorPaletteEnhanced
                selectedColors={selectedColors}
                onColorSelect={handleColorSelect}
                maxColors={5}
              />

              {/* Current Color Selector */}
              {selectedColors.length > 1 && (
                <div className="current-color-section">
                  <h3>Active Color</h3>
                  <div className="color-selector">
                    {selectedColors.map((color, index) => (
                      <button
                        key={index}
                        className={`color-option ${index === currentColorIndex ? 'active' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setCurrentColorIndex(index)}
                        title={`Color ${index + 1}: ${color}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mandala Info */}
              {currentMandala && (
                <div className="mandala-info">
                  <h3>Current Mandala</h3>
                  <p className="mandala-name">{currentMandala.name}</p>
                  <p className="mandala-description">{currentMandala.description}</p>
                </div>
              )}
            </div>

            {/* Renderer */}
            <div className="coloring-canvas">
              {isLoading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading mandala...</p>
                </div>
              ) : (
                <MandalaRenderer
                  svgContent={svgContent}
                  selectedColors={selectedColors}
                  currentColorIndex={currentColorIndex}
                  currentTool={currentTool}
                  zoom={zoom}
                  pan={pan}
                  onZoomChange={setZoom}
                  onPanChange={setPan}
                  onHistoryChange={handleHistoryChange}
                />
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .mandala-coloring-enhanced {
          min-height: 100vh;
          background: linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%);
          color: #f7efea;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .app-header {
          background: rgba(12, 12, 12, 0.9);
          border-bottom: 1px solid rgba(247, 239, 230, 0.1);
          padding: 16px 24px;
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
        }

        .app-title {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #ffd68a, #ff9a8b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .back-btn, .upload-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 214, 138, 0.1);
          border: 1px solid rgba(255, 214, 138, 0.2);
          color: #ffd68a;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 500;
        }

        .back-btn:hover, .upload-btn:hover {
          background: rgba(255, 214, 138, 0.2);
          border-color: rgba(255, 214, 138, 0.4);
        }

        .error-banner {
          background: rgba(255, 82, 82, 0.1);
          border: 1px solid rgba(255, 82, 82, 0.2);
          color: #ff5252;
          padding: 12px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .error-banner button {
          background: none;
          border: none;
          color: #ff5252;
          font-size: 20px;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .main-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px;
        }

        .gallery-view, .upload-view {
          max-width: 800px;
          margin: 0 auto;
        }

        .gallery-header, .upload-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .gallery-header h2, .upload-header h2 {
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 8px 0;
          background: linear-gradient(135deg, #ffd68a, #ff9a8b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .gallery-header p, .upload-header p {
          font-size: 16px;
          color: rgba(247, 239, 230, 0.7);
          margin: 0;
        }

        .mandala-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .mandala-card {
          background: rgba(12, 12, 12, 0.8);
          border: 1px solid rgba(247, 239, 230, 0.1);
          border-radius: 16px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .mandala-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 214, 138, 0.3);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
        }

        .upload-card {
          border: 2px dashed rgba(255, 214, 138, 0.3);
        }

        .card-image {
          text-align: center;
          color: #ffd68a;
          margin-bottom: 16px;
        }

        .card-content h3 {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 600;
        }

        .card-content p {
          color: rgba(247, 239, 230, 0.7);
          margin: 0 0 16px 0;
          font-size: 14px;
          line-height: 1.5;
        }

        .select-btn {
          width: 100%;
          background: rgba(255, 214, 138, 0.1);
          border: 1px solid rgba(255, 214, 138, 0.2);
          color: #ffd68a;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .select-btn:hover {
          background: rgba(255, 214, 138, 0.2);
          border-color: rgba(255, 214, 138, 0.4);
        }

        .coloring-view {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 24px;
          height: calc(100vh - 120px);
        }

        .coloring-sidebar {
          display: flex;
          flex-direction: column;
          gap: 24px;
          overflow-y: auto;
        }

        .tools-section, .current-color-section, .mandala-info {
          background: rgba(12, 12, 12, 0.8);
          border: 1px solid rgba(247, 239, 230, 0.1);
          border-radius: 16px;
          padding: 20px;
          backdrop-filter: blur(10px);
        }

        .tools-section h3, .current-color-section h3, .mandala-info h3 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #ffd68a;
        }

        .tool-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .tool-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          background: rgba(255, 214, 138, 0.1);
          border: 1px solid rgba(255, 214, 138, 0.2);
          color: #ffd68a;
          padding: 16px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .tool-btn:hover {
          background: rgba(255, 214, 138, 0.2);
          border-color: rgba(255, 214, 138, 0.4);
        }

        .tool-btn.active {
          background: rgba(255, 214, 138, 0.3);
          border-color: rgba(255, 214, 138, 0.6);
        }

        .color-selector {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .color-option {
          width: 40px;
          height: 40px;
          border: 2px solid transparent;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        }

        .color-option:hover {
          transform: scale(1.05);
          border-color: rgba(247, 239, 230, 0.5);
        }

        .color-option.active {
          border-color: #ffd68a;
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(255, 214, 138, 0.4);
        }

        .mandala-name {
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .mandala-description {
          color: rgba(247, 239, 230, 0.7);
          font-size: 14px;
          margin: 0;
          line-height: 1.4;
        }

        .coloring-canvas {
          background: rgba(12, 12, 12, 0.4);
          border-radius: 16px;
          overflow: hidden;
          position: relative;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 16px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 214, 138, 0.2);
          border-top: 3px solid #ffd68a;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Mobile Responsive */
        @media (max-width: 1024px) {
          .coloring-view {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr;
            height: auto;
          }

          .coloring-sidebar {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            grid-template-rows: none;
            flex-direction: row;
            overflow-x: auto;
            overflow-y: visible;
          }

          .coloring-canvas {
            min-height: 70vh;
          }
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 16px;
          }

          .header-content {
            padding: 0 16px;
          }

          .app-title {
            font-size: 20px;
          }

          .mandala-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .coloring-sidebar {
            flex-direction: column;
            gap: 16px;
          }

          .tool-buttons {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default MandalaColoringEnhanced;