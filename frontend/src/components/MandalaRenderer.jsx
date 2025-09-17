import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ZoomIn, ZoomOut, Move, Undo, Redo, Download, RotateCcw } from 'lucide-react';
import html2canvas from 'html2canvas';

const MandalaRenderer = ({ 
  svgContent, 
  selectedColors = [], 
  currentColorIndex = 0,
  currentTool = 'paint',
  onHistoryChange,
  zoom = 1,
  pan = { x: 0, y: 0 },
  onZoomChange,
  onPanChange 
}) => {
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  // Initialize SVG regions and apply white strokes for visibility
  useEffect(() => {
    if (!svgContent || !svgRef.current) return;
    
    // Inject SVG content
    svgRef.current.innerHTML = svgContent;
    
    // Process all SVG elements to ensure white strokes and make them interactive
    const initializeSVGRegions = () => {
      const regions = svgRef.current.querySelectorAll('path, circle, polygon, rect, ellipse, line, polyline, g');
      
      regions.forEach((region, index) => {
        // Ensure white stroke for dark theme visibility
        const currentStroke = region.getAttribute('stroke');
        if (!currentStroke || currentStroke === 'none' || currentStroke === '#000' || currentStroke === '#000000' || currentStroke === 'black') {
          region.setAttribute('stroke', '#ffffff');
          region.setAttribute('stroke-width', region.getAttribute('stroke-width') || '1');
        }
        
        // Make regions interactive
        region.style.cursor = 'pointer';
        region.setAttribute('data-region-id', region.id || `region-${index}`);
        
        // Add event listeners
        region.addEventListener('click', handleRegionClick);
        region.addEventListener('touchstart', handleRegionTouch, { passive: false });
        region.addEventListener('mouseenter', handleRegionHover);
        region.addEventListener('mouseleave', handleRegionLeave);
      });
    };

    initializeSVGRegions();
    
    return () => {
      // Cleanup event listeners
      const regions = svgRef.current?.querySelectorAll('path, circle, polygon, rect, ellipse, line, polyline, g') || [];
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
    
    const region = event.target.closest('[data-region-id]');
    if (!region) return;
    
    const regionId = region.getAttribute('data-region-id');
    const oldFill = region.getAttribute('fill') || 'none';
    let newFill = oldFill;

    switch (currentTool) {
      case 'paint':
        // Use selected color from palette
        if (selectedColors.length > 0) {
          const colorToUse = selectedColors[currentColorIndex] || selectedColors[0];
          newFill = colorToUse;
        }
        break;
      case 'eraser':
        newFill = 'none';
        break;
      default:
        return;
    }

    // Apply fill to the region
    applyFill(region, newFill);
    
    // Push to history
    pushHistory(regionId, oldFill, newFill);
  }, [currentTool, selectedColors, currentColorIndex]);

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

  // Push action to history stack
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
    onHistoryChange?.(newHistory, historyIndex + 1);
  }, [history, historyIndex, onHistoryChange]);

  // Undo functionality
  const handleUndo = useCallback(() => {
    if (historyIndex < 0) return;
    
    const action = history[historyIndex];
    const region = svgRef.current?.querySelector(`[data-region-id="${action.regionId}"]`);
    
    if (region) {
      applyFill(region, action.oldFill);
    }
    
    setHistoryIndex(historyIndex - 1);
    onHistoryChange?.(history, historyIndex - 1);
  }, [history, historyIndex, applyFill, onHistoryChange]);

  // Redo functionality
  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    
    const nextIndex = historyIndex + 1;
    const action = history[nextIndex];
    const region = svgRef.current?.querySelector(`[data-region-id="${action.regionId}"]`);
    
    if (region) {
      applyFill(region, action.newFill);
    }
    
    setHistoryIndex(nextIndex);
    onHistoryChange?.(history, nextIndex);
  }, [history, historyIndex, applyFill, onHistoryChange]);

  // Clear all coloring
  const handleClear = useCallback(() => {
    if (!svgRef.current) return;
    
    const regions = svgRef.current.querySelectorAll('[data-region-id]');
    regions.forEach(region => {
      applyFill(region, 'none');
    });
    
    setHistory([]);
    setHistoryIndex(-1);
    onHistoryChange?.([], -1);
  }, [applyFill, onHistoryChange]);

  // Hover effects
  const handleRegionHover = useCallback((event) => {
    const region = event.target.closest('[data-region-id]');
    if (!region) return;
    
    region.style.stroke = '#ffffff';
    region.style.strokeWidth = '3';
    region.style.opacity = '0.8';
  }, []);

  const handleRegionLeave = useCallback((event) => {
    const region = event.target.closest('[data-region-id]');
    if (!region) return;
    
    region.style.stroke = '#ffffff';
    region.style.strokeWidth = '1';
    region.style.opacity = '1';
  }, []);

  // Zoom functionality
  const handleZoom = useCallback((direction) => {
    const factor = direction === 'in' ? 1.2 : 0.8;
    const newZoom = Math.max(0.5, Math.min(3, zoom * factor));
    onZoomChange?.(newZoom);
  }, [zoom, onZoomChange]);

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
      
      onPanChange?.({
        x: pan.x + deltaX,
        y: pan.y + deltaY
      });
      
      setLastPanPoint({ x: event.clientX, y: event.clientY });
    }
  }, [isPanning, lastPanPoint, pan, onPanChange]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Touch events for mobile pan
  const handleTouchStart = useCallback((event) => {
    if (event.touches.length === 2) {
      // Two finger touch for pan
      setIsPanning(true);
      const touch = event.touches[0];
      setLastPanPoint({ x: touch.clientX, y: touch.clientY });
      event.preventDefault();
    }
  }, []);

  const handleTouchMove = useCallback((event) => {
    if (isPanning && event.touches.length === 2) {
      const touch = event.touches[0];
      const deltaX = touch.clientX - lastPanPoint.x;
      const deltaY = touch.clientY - lastPanPoint.y;
      
      onPanChange?.({
        x: pan.x + deltaX,
        y: pan.y + deltaY
      });
      
      setLastPanPoint({ x: touch.clientX, y: touch.clientY });
      event.preventDefault();
    }
  }, [isPanning, lastPanPoint, pan, onPanChange]);

  const handleTouchEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Export functionality
  const handleExport = useCallback(async () => {
    if (!svgRef.current) return;
    
    try {
      const canvas = await html2canvas(svgRef.current, {
        backgroundColor: null,
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = `mandala-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, []);

  return (
    <div className="mandala-renderer" ref={containerRef}>
      {/* Control Panel */}
      <div className="renderer-controls">
        <div className="control-group">
          <button
            onClick={() => handleZoom('in')}
            className="control-btn"
            title="Zoom In"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={() => handleZoom('out')}
            className="control-btn"
            title="Zoom Out"
          >
            <ZoomOut size={18} />
          </button>
          <span className="zoom-indicator">{Math.round(zoom * 100)}%</span>
        </div>
        
        <div className="control-group">
          <button
            onClick={handleUndo}
            disabled={historyIndex < 0}
            className="control-btn"
            title="Undo"
          >
            <Undo size={18} />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="control-btn"
            title="Redo"
          >
            <Redo size={18} />
          </button>
          <button
            onClick={handleClear}
            className="control-btn danger"
            title="Clear All"
          >
            <RotateCcw size={18} />
          </button>
        </div>
        
        <div className="control-group">
          <button
            onClick={handleExport}
            className="control-btn primary"
            title="Export as PNG"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div 
        className="svg-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          cursor: currentTool === 'pan' || isPanning ? 'move' : 'default'
        }}
      >
        <div
          className="svg-wrapper"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: 'center center'
          }}
        >
          <div ref={svgRef} className="svg-content" />
        </div>
      </div>

      <style jsx>{`
        .mandala-renderer {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: rgba(12, 12, 12, 0.8);
          border: 1px solid rgba(247, 239, 230, 0.1);
          border-radius: 16px;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        .renderer-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: rgba(0, 0, 0, 0.3);
          border-bottom: 1px solid rgba(247, 239, 230, 0.1);
          flex-wrap: wrap;
          gap: 12px;
        }

        .control-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .control-btn {
          background: rgba(255, 214, 138, 0.1);
          border: 1px solid rgba(255, 214, 138, 0.2);
          color: #ffd68a;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .control-btn:hover:not(:disabled) {
          background: rgba(255, 214, 138, 0.2);
          border-color: rgba(255, 214, 138, 0.4);
        }

        .control-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .control-btn.primary {
          background: rgba(255, 214, 138, 0.2);
          border-color: rgba(255, 214, 138, 0.3);
        }

        .control-btn.danger {
          background: rgba(255, 82, 82, 0.1);
          border-color: rgba(255, 82, 82, 0.2);
          color: #ff5252;
        }

        .control-btn.danger:hover:not(:disabled) {
          background: rgba(255, 82, 82, 0.2);
          border-color: rgba(255, 82, 82, 0.4);
        }

        .zoom-indicator {
          color: #f7efea;
          font-size: 14px;
          font-weight: 500;
          min-width: 50px;
          text-align: center;
        }

        .svg-container {
          flex: 1;
          overflow: hidden;
          position: relative;
          background: radial-gradient(circle at center, rgba(247, 239, 230, 0.05), transparent);
        }

        .svg-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.1s ease;
        }

        .svg-content {
          max-width: 100%;
          max-height: 100%;
        }

        .svg-content :global(svg) {
          max-width: 100%;
          max-height: 100%;
          height: auto;
          width: auto;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .renderer-controls {
            padding: 12px;
            gap: 8px;
          }

          .control-btn {
            padding: 10px;
          }

          .control-group {
            gap: 6px;
          }

          .zoom-indicator {
            font-size: 12px;
            min-width: 45px;
          }
        }

        /* Touch-friendly interactions */
        @media (pointer: coarse) {
          .control-btn {
            padding: 12px;
            min-width: 44px;
            min-height: 44px;
          }
        }
      `}</style>
    </div>
  );
};

export default MandalaRenderer;