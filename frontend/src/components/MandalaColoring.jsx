import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import html2canvas from 'html2canvas';
import { 
  Paintbrush, 
  Eraser, 
  Droplet, 
  Undo, 
  Redo, 
  Download, 
  Palette,
  RotateCcw,
  Save,
  Upload,
  ZoomIn,
  ZoomOut,
  Move
} from 'lucide-react';

// Predefined color palette (24 colors)
const COLOR_PALETTE = [
  '#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00', '#00FF80',
  '#00FFFF', '#0080FF', '#0000FF', '#8000FF', '#FF00FF', '#FF0080',
  '#800000', '#804000', '#808000', '#408000', '#008000', '#008040',
  '#008080', '#004080', '#000080', '#400080', '#800080', '#800040'
];

const MandalaColoring = () => {
  // State management
  const [selectedMandala, setSelectedMandala] = useState('test');
  const [selectedColor, setSelectedColor] = useState({ hex: '#FF6B6B', a: 1 });
  const [currentTool, setCurrentTool] = useState('paint'); // paint, eraser, eyedropper
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [svgContent, setSvgContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [uploadedFile, setUploadedFile] = useState(null);
  
  // Refs
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Available mandala designs
  const mandalaDesigns = [
    { id: 'test', name: 'Test Mandala', file: '/mandalas/test.svg' },
    { id: 'lotus', name: 'Lotus Mandala', file: '/mandalas/lotus.svg' },
    { id: 'star', name: 'Star Mandala', file: '/mandalas/star.svg' },
    { id: 'geometric', name: 'Geometric Mandala', file: '/mandalas/geometric.svg' }
  ];

  // Load SVG content (from file or upload)
  const loadSVG = useCallback(async (source) => {
    setIsLoading(true);
    try {
      let svgText = '';
      
      if (typeof source === 'string') {
        // Load from file path
        const response = await fetch(source);
        svgText = await response.text();
      } else if (source instanceof File) {
        // Load from uploaded file
        svgText = await source.text();
        setUploadedFile(source);
      }
      
      // Process SVG to ensure white outlines for dark theme visibility
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
      const svgElement = svgDoc.querySelector('svg');
      
      if (svgElement) {
        // Set all path, circle, polygon, rect, etc. elements to have white stroke
        const drawableElements = svgElement.querySelectorAll('path, circle, polygon, rect, ellipse, line, polyline, g');
        drawableElements.forEach(element => {
          // Only set stroke if the element doesn't already have one, or if it's black/dark
          const currentStroke = element.getAttribute('stroke');
          if (!currentStroke || currentStroke === 'none' || currentStroke === '#000' || currentStroke === '#000000' || currentStroke === 'black') {
            element.setAttribute('stroke', '#ffffff');
            element.setAttribute('stroke-width', element.getAttribute('stroke-width') || '1');
          }
        });
        
        // Serialize back to string
        const serializer = new XMLSerializer();
        svgText = serializer.serializeToString(svgDoc);
      }
      
      setSvgContent(svgText);
      
      // Reset view state
      setZoom(1);
      setPan({ x: 0, y: 0 });
      
      // Clear history when loading new SVG
      setHistory([]);
      setHistoryIndex(-1);
      
    } catch (error) {
      console.error('Error loading SVG:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load selected mandala
  useEffect(() => {
    if (selectedMandala && !uploadedFile) {
      const design = mandalaDesigns.find(d => d.id === selectedMandala);
      if (design) {
        loadSVG(design.file);
      }
    }
  }, [selectedMandala, loadSVG, uploadedFile]);

  // Set up SVG event listeners when content changes
  useEffect(() => {
    if (!svgContent || !svgRef.current) return;
    
    // Inject SVG content
    svgRef.current.innerHTML = svgContent;
    
    // Add event listeners to regions and ensure white strokes for visibility
    const regions = svgRef.current.querySelectorAll('[data-region], [id]');
    regions.forEach(region => {
      region.style.cursor = 'pointer';
      
      // Ensure white stroke for dark theme visibility
      const currentStroke = region.getAttribute('stroke');
      if (!currentStroke || currentStroke === 'none' || currentStroke === '#000' || currentStroke === '#000000' || currentStroke === 'black') {
        region.setAttribute('stroke', '#ffffff');
        region.style.stroke = '#ffffff';
      }
      
      region.addEventListener('click', handleRegionClick);
      region.addEventListener('touchstart', handleRegionTouch);
      region.addEventListener('mouseenter', handleRegionHover);
      region.addEventListener('mouseleave', handleRegionLeave);
    });
    
    return () => {
      regions.forEach(region => {
        region.removeEventListener('click', handleRegionClick);
        region.removeEventListener('touchstart', handleRegionTouch);
        region.removeEventListener('mouseenter', handleRegionHover);
        region.removeEventListener('mouseleave', handleRegionLeave);
      });
    };
  }, [svgContent]);

  // Handle region click/touch interaction
  const handleRegionClick = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Find the region using closest to handle nested elements
    const region = event.target.closest('[data-region], [id]');
    if (!region) return;
    
    const regionId = region.getAttribute('data-region') || region.getAttribute('id');
    if (!regionId) return;

    const oldFill = region.getAttribute('fill') || 'none';
    let newFill = oldFill;

    switch (currentTool) {
      case 'paint':
        // Apply selected color with opacity
        newFill = selectedColor.a < 1 
          ? `rgba(${parseInt(selectedColor.hex.slice(1, 3), 16)}, ${parseInt(selectedColor.hex.slice(3, 5), 16)}, ${parseInt(selectedColor.hex.slice(5, 7), 16)}, ${selectedColor.a})`
          : selectedColor.hex;
        break;
      case 'eraser':
        // Remove fill or set to default
        newFill = 'none';
        break;
      case 'eyedropper':
        // Pick color from clicked region
        const currentFill = region.getAttribute('fill') || '#000000';
        if (currentFill !== 'none') {
          setSelectedColor({ hex: currentFill, a: 1 });
        }
        return; // Don't add to history for eyedropper
      default:
        return;
    }

    // Apply fill to the region
    applyFill(region, newFill);
    
    // Push to history
    pushHistory(regionId, oldFill, newFill);
  }, [currentTool, selectedColor]);

  // Handle touch events for mobile
  const handleRegionTouch = useCallback((event) => {
    event.preventDefault();
    handleRegionClick(event);
  }, [handleRegionClick]);

  // Apply fill to a region
  const applyFill = useCallback((region, fill) => {
    region.setAttribute('fill', fill);
    region.style.fill = fill;
  }, []);

  // Push action to history stack (max 50 actions)
  const pushHistory = useCallback((regionId, oldFill, newFill) => {
    const action = { regionId, oldFill, newFill };
    
    // Truncate history if we're not at the end
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(action);
    
    // Limit to 50 actions
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(historyIndex + 1);
    }
    
    setHistory(newHistory);
  }, [history, historyIndex]);

  // Undo functionality
  const undo = useCallback(() => {
    if (historyIndex < 0 || !svgRef.current) return;
    
    const action = history[historyIndex];
    const region = svgRef.current.querySelector(`[data-region="${action.regionId}"], [id="${action.regionId}"]`);
    
    if (region) {
      applyFill(region, action.oldFill);
    }
    
    setHistoryIndex(historyIndex - 1);
  }, [history, historyIndex, applyFill]);

  // Redo functionality
  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1 || !svgRef.current) return;
    
    const action = history[historyIndex + 1];
    const region = svgRef.current.querySelector(`[data-region="${action.regionId}"], [id="${action.regionId}"]`);
    
    if (region) {
      applyFill(region, action.newFill);
    }
    
    setHistoryIndex(historyIndex + 1);
  }, [history, historyIndex, applyFill]);

  // Clear all colors
  const clearAll = useCallback(() => {
    if (!svgRef.current) return;
    
    const regions = svgRef.current.querySelectorAll('[data-region], [id]');
    const actions = [];
    
    regions.forEach(region => {
      const regionId = region.getAttribute('data-region') || region.getAttribute('id');
      const oldFill = region.getAttribute('fill') || 'none';
      
      if (oldFill !== 'none') {
        applyFill(region, 'none');
        actions.push({ regionId, oldFill, newFill: 'none' });
      }
    });
    
    if (actions.length > 0) {
      // Add all clear actions as a single history entry
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(...actions);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [history, historyIndex, applyFill]);

  // Export as PNG
  const exportPNG = useCallback(async () => {
    if (!svgRef.current) return;
    
    try {
      const canvas = await html2canvas(svgRef.current, {
        backgroundColor: 'white',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const link = document.createElement('a');
      link.download = `mandala-colored-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error exporting PNG:', error);
      alert('Error exporting PNG. Please try again.');
    }
  }, []);

  // Export as SVG
  const exportSVG = useCallback(() => {
    if (!svgRef.current) return;
    
    const svgElement = svgRef.current.querySelector('svg');
    if (!svgElement) return;
    
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = `mandala-colored-${Date.now()}.svg`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  }, []);

  // Hover effects
  const handleRegionHover = useCallback((event) => {
    const region = event.target.closest('[data-region], [id]');
    if (!region) return;
    
    // Use white stroke with increased width for hover effect
    region.style.stroke = '#ffffff';
    region.style.strokeWidth = '3';
    region.style.opacity = '0.8';
  }, []);

  const handleRegionLeave = useCallback((event) => {
    const region = event.target.closest('[data-region], [id]');
    if (!region) return;
    
    // Return to default white stroke
    region.style.stroke = '#ffffff';
    region.style.strokeWidth = '1';
    region.style.opacity = '1';
  }, []);

  // Zoom functionality
  const handleZoom = useCallback((direction) => {
    const factor = direction === 'in' ? 1.2 : 0.8;
    const newZoom = Math.max(0.5, Math.min(3, zoom * factor));
    setZoom(newZoom);
  }, [zoom]);

  // Pan functionality
  const handleMouseDown = useCallback((event) => {
    if (currentTool === 'pan' || event.button === 1) { // Middle mouse button or pan tool
      setIsPanning(true);
      setLastPanPoint({ x: event.clientX, y: event.clientY });
      event.preventDefault();
    }
  }, [currentTool]);

  const handleMouseMove = useCallback((event) => {
    if (isPanning) {
      const deltaX = event.clientX - lastPanPoint.x;
      const deltaY = event.clientY - lastPanPoint.y;
      
      setPan(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPoint({ x: event.clientX, y: event.clientY });
    }
  }, [isPanning, lastPanPoint]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Touch handling for mobile
  const handleTouchStart = useCallback((event) => {
    if (event.touches.length === 2) {
      // Two-finger gesture for pan
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;
      setLastPanPoint({ x: centerX, y: centerY });
      setIsPanning(true);
    }
  }, []);

  const handleTouchMove = useCallback((event) => {
    if (event.touches.length === 2 && isPanning) {
      event.preventDefault();
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;
      
      const deltaX = centerX - lastPanPoint.x;
      const deltaY = centerY - lastPanPoint.y;
      
      setPan(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPoint({ x: centerX, y: centerY });
    }
  }, [isPanning, lastPanPoint]);

  // File upload handling
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type === 'image/svg+xml') {
      setSelectedMandala('');
      loadSVG(file);
    } else {
      alert('Please upload a valid SVG file.');
    }
  }, [loadSVG]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'z':
            event.preventDefault();
            if (event.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'y':
            event.preventDefault();
            redo();
            break;
          default:
            break;
        }
      } else {
        // Tool shortcuts (without modifiers)
        switch (event.key.toLowerCase()) {
          case 'p':
            setCurrentTool('paint');
            break;
          case 'e':
            setCurrentTool('eraser');
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [undo, redo]);

  return (
    <div className="mandala-coloring">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1>🎨 Mandala Coloring Studio</h1>
          <p>Click regions to color • Use tools to paint, erase, or pick colors</p>
        </div>

        {/* Main Layout */}
        <div className="main-layout">
          {/* Left Sidebar */}
          <div className="sidebar">
            {/* Gallery */}
            <div className="panel">
              <h3>📁 Gallery</h3>
              <div className="gallery-grid">
                {mandalaDesigns.map(design => (
                  <button
                    key={design.id}
                    onClick={() => {
                      setSelectedMandala(design.id);
                      setUploadedFile(null);
                    }}
                    className={`gallery-item ${selectedMandala === design.id && !uploadedFile ? 'active' : ''}`}
                  >
                    {design.name}
                  </button>
                ))}
              </div>
              
              {/* File Upload */}
              <div className="upload-section">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".svg,image/svg+xml"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="upload-btn"
                >
                  <Upload size={16} />
                  Upload SVG
                </button>
                {uploadedFile && (
                  <p className="upload-info">📄 {uploadedFile.name}</p>
                )}
              </div>
            </div>

            {/* Tools */}
            <div className="panel">
              <h3>🛠️ Tools</h3>
              <div className="tools-grid">
                <button
                  onClick={() => setCurrentTool('paint')}
                  className={`tool-btn ${currentTool === 'paint' ? 'active' : ''}`}
                  title="Paint (P)"
                >
                  <Paintbrush size={18} />
                </button>
                <button
                  onClick={() => setCurrentTool('eraser')}
                  className={`tool-btn ${currentTool === 'eraser' ? 'active' : ''}`}
                  title="Eraser (E)"
                >
                  <Eraser size={18} />
                </button>
                <button
                  onClick={() => setCurrentTool('eyedropper')}
                  className={`tool-btn ${currentTool === 'eyedropper' ? 'active' : ''}`}
                  title="Eyedropper"
                >
                  <Droplet size={18} />
                </button>
              </div>
            </div>

            {/* Color Palette */}
            <div className="panel">
              <h3>🎨 Colors</h3>
              <div className="color-palette">
                {COLOR_PALETTE.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor({ hex: color, a: 1 })}
                    className={`color-swatch ${selectedColor.hex === color ? 'active' : ''}`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              
              {/* Color Picker */}
              <div className="color-picker-section">
                <div className="current-color">
                  <div 
                    className="color-display"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                  <span>{selectedColor.hex}</span>
                </div>
                <ChromePicker
                  color={selectedColor}
                  onChange={(color) => setSelectedColor(color.rgb.a !== undefined 
                    ? { hex: color.hex, a: color.rgb.a }
                    : { hex: color.hex, a: 1 }
                  )}
                  disableAlpha={false}
                />
              </div>
            </div>
          </div>

          {/* Main Canvas Area */}
          <div className="canvas-area">
            {/* Toolbar */}
            <div className="toolbar">
              <div className="tool-group">
                <button onClick={undo} disabled={historyIndex < 0} title="Undo (Ctrl+Z)">
                  <Undo size={16} /> Undo
                </button>
                <button onClick={redo} disabled={historyIndex >= history.length - 1} title="Redo (Ctrl+Y)">
                  <Redo size={16} /> Redo
                </button>
                <button onClick={clearAll} className="clear-btn" title="Clear All">
                  <RotateCcw size={16} /> Clear
                </button>
              </div>
              
              <div className="tool-group">
                <button onClick={() => handleZoom('out')} title="Zoom Out">
                  <ZoomOut size={16} />
                </button>
                <span className="zoom-level">{Math.round(zoom * 100)}%</span>
                <button onClick={() => handleZoom('in')} title="Zoom In">
                  <ZoomIn size={16} />
                </button>
              </div>
              
              <div className="tool-group">
                <button onClick={exportPNG} className="export-btn" title="Export PNG">
                  <Download size={16} /> PNG
                </button>
                <button onClick={exportSVG} className="export-btn" title="Export SVG">
                  <Save size={16} /> SVG
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div 
              className="canvas-container"
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
            >
              {isLoading ? (
                <div className="loading">
                  <Palette size={48} />
                  <p>Loading mandala...</p>
                </div>
              ) : (
                <div 
                  className="svg-wrapper"
                  style={{
                    transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                    cursor: currentTool === 'pan' ? 'grab' : isPanning ? 'grabbing' : 'default'
                  }}
                >
                  <div ref={svgRef} className="svg-content" />
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="instructions">
              <h4>💡 Instructions:</h4>
              <ul>
                <li>Click mandala regions to apply color</li>
                <li>Use P (paint), E (eraser) for tools</li>
                <li>Ctrl+Z/Ctrl+Y for undo/redo</li>
                <li>Two-finger drag on mobile to pan</li>
                <li>Scroll to zoom, middle-click to pan</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .mandala-coloring {
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 15%, rgba(255,255,255,0.02), transparent 12%),
            linear-gradient(180deg, #050507 0%, #0b0c10 100%);
          padding: 1rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #f7efe6;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .header {
          text-align: center;
          margin-bottom: 2rem;
          color: #f7efe6;
        }

        .header h1 {
          font-size: 2.5rem;
          margin: 0 0 0.5rem 0;
          font-weight: 700;
          text-shadow: 2px 2px 8px rgba(0,0,0,0.6);
        }

        .header p {
          font-size: 1.1rem;
          opacity: 0.9;
          margin: 0;
        }

        .main-layout {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 1.5rem;
          height: calc(100vh - 200px);
        }

        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          overflow-y: auto;
        }

        .panel {
          background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.05));
          border: 1px solid rgba(247, 239, 230, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
        }

        .panel h3 {
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #f7efe6;
        }

        .gallery-grid {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .gallery-item {
          padding: 0.75rem;
          border: 2px solid rgba(247, 239, 230, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.03);
          color: #f7efe6;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
          text-align: left;
        }

        .gallery-item:hover {
          border-color: rgba(255, 214, 138, 0.6);
          background: rgba(255, 214, 138, 0.1);
        }

        .gallery-item.active {
          border-color: rgba(255, 214, 138, 0.8);
          background: rgba(255, 214, 138, 0.15);
          color: #ffd68a;
          font-weight: 600;
        }

        .upload-section {
          border-top: 1px solid rgba(247, 239, 230, 0.2);
          padding-top: 1rem;
        }

        .upload-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          width: 100%;
          border: 2px dashed rgba(247, 239, 230, 0.3);
          border-radius: 8px;
          background: transparent;
          color: #f7efe6;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
        }

        .upload-btn:hover {
          border-color: rgba(255, 214, 138, 0.6);
          color: #ffd68a;
          background: rgba(255, 214, 138, 0.05);
        }

        .upload-info {
          margin: 0.5rem 0 0 0;
          font-size: 0.8rem;
          color: #10b981;
          text-align: center;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }

        .tool-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem;
          border: 2px solid rgba(247, 239, 230, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.03);
          color: #f7efe6;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tool-btn:hover {
          border-color: rgba(255, 214, 138, 0.6);
          background: rgba(255, 214, 138, 0.1);
        }

        .tool-btn.active {
          border-color: rgba(255, 214, 138, 0.8);
          background: rgba(255, 214, 138, 0.15);
          color: #ffd68a;
        }

        .color-palette {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .color-swatch {
          width: 100%;
          height: 2rem;
          border: 2px solid rgba(247, 239, 230, 0.3);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .color-swatch:hover {
          transform: scale(1.1);
          box-shadow: 0 2px 8px rgba(255, 214, 138, 0.4);
        }

        .color-swatch.active {
          border-color: #ffd68a;
          transform: scale(1.1);
          box-shadow: 0 2px 8px rgba(255, 214, 138, 0.6);
        }

        .color-picker-section {
          border-top: 1px solid rgba(247, 239, 230, 0.2);
          padding-top: 1rem;
        }

        .current-color {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: #f7efe6;
        }

        .color-display {
          width: 2rem;
          height: 2rem;
          border: 2px solid rgba(247, 239, 230, 0.3);
          border-radius: 6px;
        }

        .canvas-area {
          display: flex;
          flex-direction: column;
          background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.05));
          border: 1px solid rgba(247, 239, 230, 0.1);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
          overflow: hidden;
        }

        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid rgba(247, 239, 230, 0.1);
          background: rgba(255, 255, 255, 0.03);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .tool-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .toolbar button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: 1px solid rgba(247, 239, 230, 0.3);
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.05);
          color: #f7efe6;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
        }

        .toolbar button:hover:not(:disabled) {
          border-color: rgba(255, 214, 138, 0.6);
          background: rgba(255, 214, 138, 0.1);
          color: #ffd68a;
        }

        .toolbar button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .clear-btn {
          border-color: rgba(239, 68, 68, 0.6) !important;
          color: #f87171;
        }

        .clear-btn:hover {
          background: rgba(239, 68, 68, 0.1) !important;
          border-color: rgba(239, 68, 68, 0.8) !important;
        }

        .export-btn {
          border-color: rgba(16, 185, 129, 0.6) !important;
          color: #34d399;
        }

        .export-btn:hover {
          background: rgba(16, 185, 129, 0.1) !important;
          border-color: rgba(16, 185, 129, 0.8) !important;
        }

        .zoom-level {
          font-size: 0.9rem;
          color: #f7efe6;
          min-width: 3rem;
          text-align: center;
        }

        .canvas-container {
          flex: 1;
          overflow: hidden;
          position: relative;
          background: rgba(250, 250, 250, 0.05);
          user-select: none;
        }

        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #f7efe6;
        }

        .loading p {
          margin: 1rem 0 0 0;
          font-size: 1.1rem;
        }

        .svg-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          transition: transform 0.1s ease-out;
          transform-origin: center center;
        }

        .svg-content {
          max-width: 100%;
          max-height: 100%;
        }

        .svg-content svg {
          max-width: 600px;
          max-height: 600px;
          width: auto;
          height: auto;
        }

        .instructions {
          padding: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border-top: 1px solid rgba(247, 239, 230, 0.1);
        }

        .instructions h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          color: #f7efe6;
        }

        .instructions ul {
          margin: 0;
          padding-left: 1.5rem;
          font-size: 0.9rem;
          color: rgba(247, 239, 230, 0.8);
        }

        .instructions li {
          margin-bottom: 0.25rem;
        }

        @media (max-width: 768px) {
          .main-layout {
            grid-template-columns: 1fr;
            height: auto;
          }

          .sidebar {
            order: 2;
          }

          .canvas-area {
            order: 1;
            height: 60vh;
          }

          .header h1 {
            font-size: 2rem;
          }

          .toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .tool-group {
            justify-content: center;
          }

          .color-palette {
            grid-template-columns: repeat(8, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default MandalaColoring;