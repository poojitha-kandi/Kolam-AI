import React, { useState, useRef, useEffect } from 'react';
import anime from 'animejs';
import './ExactKolamAnimator.css';

const ExactKolamAnimator = () => {
  const [inputType, setInputType] = useState('svg'); // 'svg' | 'raster'
  const [svgInput, setSvgInput] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [vectorizedSvg, setVectorizedSvg] = useState('');
  const [isVectorizing, setIsVectorizing] = useState(false);
  const [animationPaths, setAnimationPaths] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [orderBy, setOrderBy] = useState('nearest');
  const [connectGapsEnabled, setConnectGapsEnabled] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [showBrush, setShowBrush] = useState(true);
  
  const svgContainerRef = useRef(null);
  const animationRef = useRef(null);
  const brushRef = useRef(null);

  // Default example SVG for testing
  const exampleSvg = `
    <svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <circle cx="150" cy="150" r="100" fill="none" stroke="#2563eb" stroke-width="3"/>
      <path d="M150 50 L250 150 L150 250 L50 150 Z" fill="none" stroke="#dc2626" stroke-width="3"/>
      <circle cx="150" cy="150" r="50" fill="none" stroke="#16a34a" stroke-width="2"/>
      <path d="M100 100 L200 100 L200 200 L100 200 Z" fill="none" stroke="#ca8a04" stroke-width="2"/>
    </svg>
  `;

  /**
   * Prepares SVG for animation by normalizing paths and adding animation attributes
   * @param {SVGElement} svgRoot - The root SVG element
   * @returns {Array} Array of path elements ready for animation
   */
  const prepareSvgForAnimation = (svgRoot) => {
    const paths = [];
    let pathId = 0;

    // Convert all drawable elements to paths
    const convertElementToPath = (element) => {
      let pathData = '';
      
      switch (element.tagName.toLowerCase()) {
        case 'circle':
          const cx = parseFloat(element.getAttribute('cx') || 0);
          const cy = parseFloat(element.getAttribute('cy') || 0);
          const r = parseFloat(element.getAttribute('r') || 0);
          pathData = `M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy}`;
          break;
          
        case 'ellipse':
          const ecx = parseFloat(element.getAttribute('cx') || 0);
          const ecy = parseFloat(element.getAttribute('cy') || 0);
          const rx = parseFloat(element.getAttribute('rx') || 0);
          const ry = parseFloat(element.getAttribute('ry') || 0);
          pathData = `M ${ecx - rx} ${ecy} A ${rx} ${ry} 0 1 0 ${ecx + rx} ${ecy} A ${rx} ${ry} 0 1 0 ${ecx - rx} ${ecy}`;
          break;
          
        case 'rect':
          const x = parseFloat(element.getAttribute('x') || 0);
          const y = parseFloat(element.getAttribute('y') || 0);
          const width = parseFloat(element.getAttribute('width') || 0);
          const height = parseFloat(element.getAttribute('height') || 0);
          pathData = `M ${x} ${y} L ${x + width} ${y} L ${x + width} ${y + height} L ${x} ${y + height} Z`;
          break;
          
        case 'line':
          const x1 = parseFloat(element.getAttribute('x1') || 0);
          const y1 = parseFloat(element.getAttribute('y1') || 0);
          const x2 = parseFloat(element.getAttribute('x2') || 0);
          const y2 = parseFloat(element.getAttribute('y2') || 0);
          pathData = `M ${x1} ${y1} L ${x2} ${y2}`;
          break;
          
        case 'polyline':
        case 'polygon':
          const points = element.getAttribute('points') || '';
          const coords = points.trim().split(/\s+|,/).filter(Boolean);
          if (coords.length >= 4) {
            pathData = `M ${coords[0]} ${coords[1]}`;
            for (let i = 2; i < coords.length; i += 2) {
              pathData += ` L ${coords[i]} ${coords[i + 1]}`;
            }
            if (element.tagName.toLowerCase() === 'polygon') {
              pathData += ' Z';
            }
          }
          break;
          
        case 'path':
          pathData = element.getAttribute('d') || '';
          break;
      }

      if (pathData) {
        // Create new path element
        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('d', pathData);
        pathElement.setAttribute('data-anim-id', `path-${pathId++}`);
        
        // Copy styling attributes
        const styleAttrs = ['stroke', 'stroke-width', 'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin', 'fill'];
        styleAttrs.forEach(attr => {
          const value = element.getAttribute(attr) || getComputedStyle(element)[attr.replace('-', '')];
          if (value && value !== 'none') {
            pathElement.setAttribute(attr, value);
          }
        });
        
        // Ensure stroke is visible for animation
        if (!pathElement.getAttribute('stroke') || pathElement.getAttribute('stroke') === 'none') {
          pathElement.setAttribute('stroke', '#000');
          pathElement.setAttribute('stroke-width', '2');
        }
        
        // Set fill to none for stroke animation
        pathElement.setAttribute('fill', 'none');
        
        return pathElement;
      }
      
      return null;
    };

    // Process all drawable elements
    const drawableElements = svgRoot.querySelectorAll('circle, ellipse, rect, line, polyline, polygon, path');
    drawableElements.forEach(element => {
      const pathElement = convertElementToPath(element);
      if (pathElement) {
        paths.push(pathElement);
      }
    });

    return paths;
  };

  /**
   * Computes optimal stroke order for human-like drawing
   * @param {Array} paths - Array of path elements
   * @returns {Array} Ordered array of paths
   */
  const computeStrokeOrder = (paths) => {
    if (orderBy === 'provided') {
      return [...paths];
    }

    const pathData = paths.map(path => {
      const length = path.getTotalLength();
      const startPoint = path.getPointAtLength(0);
      const endPoint = path.getPointAtLength(length);
      const midPoint = path.getPointAtLength(length / 2);
      
      return {
        element: path,
        length,
        startPoint,
        endPoint,
        midPoint,
        bounds: path.getBBox()
      };
    });

    if (orderBy === 'longest') {
      return pathData
        .sort((a, b) => b.length - a.length)
        .map(p => p.element);
    }

    // Nearest neighbor ordering (default)
    const ordered = [];
    const remaining = [...pathData];
    
    // Start with the topmost-leftmost path
    let current = remaining.reduce((min, path) => 
      (path.bounds.y + path.bounds.x < min.bounds.y + min.bounds.x) ? path : min
    );
    
    remaining.splice(remaining.indexOf(current), 1);
    ordered.push(current.element);

    // Continue with nearest neighbor
    while (remaining.length > 0) {
      let minDistance = Infinity;
      let nextIndex = 0;
      
      remaining.forEach((path, index) => {
        // Calculate distance from current endpoint to path start/end
        const distToStart = Math.hypot(
          current.endPoint.x - path.startPoint.x,
          current.endPoint.y - path.startPoint.y
        );
        const distToEnd = Math.hypot(
          current.endPoint.x - path.endPoint.x,
          current.endPoint.y - path.endPoint.y
        );
        
        const minDist = Math.min(distToStart, distToEnd);
        if (minDist < minDistance) {
          minDistance = minDist;
          nextIndex = index;
        }
      });
      
      current = remaining[nextIndex];
      remaining.splice(nextIndex, 1);
      ordered.push(current.element);
    }

    return ordered;
  };

  /**
   * Connects nearby path endpoints to create continuous strokes
   * @param {Array} paths - Array of path elements
   * @param {number} tolerancePx - Maximum distance to connect gaps
   * @returns {Array} Paths with connected gaps
   */
  const connectGaps = (paths, tolerancePx = 10) => {
    if (!connectGapsEnabled) return paths;

    // This is a simplified version - full implementation would merge actual path data
    const connected = [];
    const processed = new Set();

    paths.forEach((path, index) => {
      if (processed.has(index)) return;

      const currentLength = path.getTotalLength();
      const currentEnd = path.getPointAtLength(currentLength);
      
      // Look for nearby starting points
      for (let i = index + 1; i < paths.length; i++) {
        if (processed.has(i)) continue;
        
        const nextPath = paths[i];
        const nextStart = nextPath.getPointAtLength(0);
        
        const distance = Math.hypot(
          currentEnd.x - nextStart.x,
          currentEnd.y - nextStart.y
        );
        
        if (distance <= tolerancePx) {
          // Mark both as processed and add connecting line
          processed.add(index);
          processed.add(i);
          
          // Create combined path (simplified - would need proper path merging)
          const combinedPath = path.cloneNode(true);
          const currentD = combinedPath.getAttribute('d');
          const nextD = nextPath.getAttribute('d');
          combinedPath.setAttribute('d', currentD + ` L ${nextStart.x} ${nextStart.y} ` + nextD.substring(1));
          
          connected.push(combinedPath);
          return;
        }
      }
      
      if (!processed.has(index)) {
        connected.push(path);
      }
    });

    return connected;
  };

  /**
   * Animates the paths in sequence
   * @param {Array} orderedPaths - Paths in drawing order
   */
  const animatePaths = (orderedPaths) => {
    if (!svgContainerRef.current) return;

    // Clear previous animation
    if (animationRef.current) {
      animationRef.current.pause();
    }

    // Clear the SVG and add new paths
    const svgElement = svgContainerRef.current.querySelector('svg');
    if (!svgElement) return;

    // Clear existing paths
    svgElement.innerHTML = '';
    
    // Add brush element if enabled
    let brushElement = null;
    if (showBrush) {
      brushElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      brushElement.setAttribute('r', '8');
      brushElement.setAttribute('fill', '#ff6b6b');
      brushElement.setAttribute('opacity', '0.8');
      brushElement.style.display = 'none';
      svgElement.appendChild(brushElement);
      brushRef.current = brushElement;
    }

    // Add all paths to SVG
    orderedPaths.forEach(path => {
      svgElement.appendChild(path.cloneNode(true));
    });

    const paths = svgElement.querySelectorAll('path');
    let totalLength = 0;
    let animatedLength = 0;

    // Setup initial state for all paths
    paths.forEach(path => {
      const length = path.getTotalLength();
      totalLength += length;
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.opacity = '1';
    });

    // Create timeline for sequential animation
    const timeline = anime.timeline({
      easing: 'easeInOutQuad',
      duration: 2000 / animationSpeed,
      complete: () => {
        setIsAnimating(false);
        setAnimationProgress(100);
        if (brushElement) brushElement.style.display = 'none';
      }
    });

    paths.forEach((path, index) => {
      const length = path.getTotalLength();
      const duration = (length / totalLength) * 2000 / animationSpeed;
      
      timeline.add({
        targets: path,
        strokeDashoffset: [length, 0],
        duration: duration,
        begin: () => {
          if (brushElement) {
            brushElement.style.display = 'block';
          }
        },
        update: (anim) => {
          const progress = anim.progress;
          const currentOffset = length - (length * progress / 100);
          const currentLength = length - currentOffset;
          
          // Update brush position
          if (brushElement && currentLength > 0) {
            const point = path.getPointAtLength(currentLength);
            brushElement.setAttribute('cx', point.x);
            brushElement.setAttribute('cy', point.y);
          }
          
          // Update overall progress
          const newAnimatedLength = animatedLength + currentLength;
          setAnimationProgress((newAnimatedLength / totalLength) * 100);
        },
        complete: () => {
          animatedLength += length;
        }
      }, index === 0 ? 0 : '-=200'); // Slight overlap for smooth flow
    });

    animationRef.current = timeline;
    setIsAnimating(true);
  };

  /**
   * Handles SVG input and processes it for animation
   */
  const processSvgInput = () => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgInput, 'image/svg+xml');
      const svgElement = doc.querySelector('svg');
      
      if (!svgElement) {
        alert('Invalid SVG format');
        return;
      }

      const paths = prepareSvgForAnimation(svgElement);
      const connectedPaths = connectGaps(paths);
      const orderedPaths = computeStrokeOrder(connectedPaths);
      
      setAnimationPaths(orderedPaths);
      
      // Display the SVG
      if (svgContainerRef.current) {
        svgContainerRef.current.innerHTML = svgInput;
      }
    } catch (error) {
      console.error('Error processing SVG:', error);
      alert('Error processing SVG: ' + error.message);
    }
  };

  /**
   * Handles image upload and vectorization
   */
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedImage(URL.createObjectURL(file));
    setIsVectorizing(true);

    try {
      // Simplified vectorization - in a real implementation, you'd use:
      // - potrace library for bitmap tracing
      // - opencv.js for contour detection
      // - or send to backend service
      
      // For demo purposes, create a placeholder SVG
      setTimeout(() => {
        const placeholderSvg = `
          <svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 150 Q150 50 250 150 Q150 250 50 150" fill="none" stroke="#000" stroke-width="3"/>
            <circle cx="150" cy="150" r="30" fill="none" stroke="#666" stroke-width="2"/>
          </svg>
        `;
        setVectorizedSvg(placeholderSvg);
        setIsVectorizing(false);
      }, 2000);
      
    } catch (error) {
      console.error('Vectorization error:', error);
      setIsVectorizing(false);
    }
  };

  /**
   * Starts the animation
   */
  const startAnimation = () => {
    if (animationPaths.length === 0) {
      if (inputType === 'svg') {
        processSvgInput();
      } else if (vectorizedSvg) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(vectorizedSvg, 'image/svg+xml');
        const svgElement = doc.querySelector('svg');
        if (svgElement) {
          const paths = prepareSvgForAnimation(svgElement);
          const connectedPaths = connectGaps(paths);
          const orderedPaths = computeStrokeOrder(connectedPaths);
          setAnimationPaths(orderedPaths);
          animatePaths(orderedPaths);
        }
      }
      return;
    }

    animatePaths(animationPaths);
  };

  /**
   * Exports the animation source SVG
   */
  const exportAnimationSource = () => {
    const svgElement = svgContainerRef.current?.querySelector('svg');
    if (!svgElement) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kolam-animation-source.svg';
    link.click();
    
    URL.revokeObjectURL(url);
  };

  // Load example SVG on mount
  useEffect(() => {
    if (inputType === 'svg' && !svgInput) {
      setSvgInput(exampleSvg);
    }
  }, [inputType]);

  return (
    <div className="exact-kolam-animator">
      <div className="animator-header">
        <h2>🎨 Exact Kolam Animator</h2>
        <p>Reproduce kolam patterns with precise path-based animation</p>
      </div>

      {/* Input Type Selection */}
      <div className="input-type-selector">
        <label>
          <input
            type="radio"
            value="svg"
            checked={inputType === 'svg'}
            onChange={(e) => setInputType(e.target.value)}
          />
          SVG Input
        </label>
        <label>
          <input
            type="radio"
            value="raster"
            checked={inputType === 'raster'}
            onChange={(e) => setInputType(e.target.value)}
          />
          Image Upload (Vectorize)
        </label>
      </div>

      {/* SVG Input */}
      {inputType === 'svg' && (
        <div className="svg-input-section">
          <textarea
            value={svgInput}
            onChange={(e) => setSvgInput(e.target.value)}
            placeholder="Paste your SVG code here..."
            rows={8}
            className="svg-textarea"
          />
          <button onClick={processSvgInput} className="process-btn">
            Process SVG
          </button>
        </div>
      )}

      {/* Image Upload */}
      {inputType === 'raster' && (
        <div className="image-upload-section">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input"
          />
          {uploadedImage && (
            <div className="uploaded-preview">
              <img src={uploadedImage} alt="Uploaded" className="preview-image" />
              {isVectorizing && <div className="vectorizing">Vectorizing...</div>}
            </div>
          )}
          {vectorizedSvg && (
            <div className="vectorized-result">
              <h4>Vectorized Result:</h4>
              <div dangerouslySetInnerHTML={{ __html: vectorizedSvg }} />
            </div>
          )}
        </div>
      )}

      {/* Animation Controls */}
      <div className="animation-controls">
        <div className="control-group">
          <label>Stroke Order:</label>
          <select value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
            <option value="nearest">Nearest Neighbor</option>
            <option value="longest">Longest First</option>
            <option value="provided">Original Order</option>
          </select>
        </div>

        <div className="control-group">
          <label>Speed:</label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
          />
          <span>{animationSpeed}x</span>
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={connectGapsEnabled}
              onChange={(e) => setConnectGapsEnabled(e.target.checked)}
            />
            Connect Gaps
          </label>
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={showBrush}
              onChange={(e) => setShowBrush(e.target.checked)}
            />
            Show Brush
          </label>
        </div>
      </div>

      {/* Animation Area */}
      <div className="animation-area">
        <div ref={svgContainerRef} className="svg-container">
          {inputType === 'svg' && svgInput && (
            <div dangerouslySetInnerHTML={{ __html: svgInput }} />
          )}
        </div>

        {/* Progress Bar */}
        {isAnimating && (
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${animationProgress}%` }}
              />
            </div>
            <span className="progress-text">{Math.round(animationProgress)}%</span>
          </div>
        )}

        {/* Control Buttons */}
        <div className="animation-buttons">
          <button 
            onClick={startAnimation} 
            disabled={isAnimating}
            className="animate-btn"
          >
            {isAnimating ? 'Animating...' : 'Start Animation'}
          </button>
          
          <button 
            onClick={() => {
              if (animationRef.current) {
                if (animationRef.current.paused) {
                  animationRef.current.play();
                } else {
                  animationRef.current.pause();
                }
              }
            }}
            disabled={!isAnimating}
            className="control-btn"
          >
            Pause/Resume
          </button>

          <button 
            onClick={exportAnimationSource}
            className="export-btn"
          >
            Export SVG
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExactKolamAnimator;