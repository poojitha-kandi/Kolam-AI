import React, { useRef, useEffect, useState } from 'react';

const KolamAnimation = ({ 
  width = 400, 
  height = 400, 
  speed = 1, 
  autoPlay = true,
  gridSize = 3,
  pattern = 'lissajous',
  onComplete = null,
  className = ''
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Generate mathematical curve points for animation
  const generateKolamPath = (gridSize, pattern) => {
    const points = [];
    const center = { x: width / 2, y: height / 2 };
    const scale = Math.min(width, height) / 3;
    
    if (pattern === 'lissajous') {
      // Lissajous curve parameters
      const a = gridSize;
      const b = gridSize - 1;
      const delta = Math.PI / 2;
      const numPoints = 1000;
      
      for (let i = 0; i <= numPoints; i++) {
        const t = (4 * Math.PI * i) / numPoints;
        const x = center.x + scale * Math.sin(a * t + delta);
        const y = center.y + scale * Math.sin(b * t);
        points.push({ x, y });
      }
    } else if (pattern === 'spiral') {
      // Spiral pattern
      const numPoints = 800;
      const maxRadius = scale;
      
      for (let i = 0; i <= numPoints; i++) {
        const t = (6 * Math.PI * i) / numPoints;
        const r = (maxRadius * i) / numPoints;
        const x = center.x + r * Math.cos(t);
        const y = center.y + r * Math.sin(t);
        points.push({ x, y });
      }
    } else if (pattern === 'interwoven') {
      // Interwoven loops pattern
      const numPoints = 600;
      
      for (let i = 0; i <= numPoints; i++) {
        const t = (4 * Math.PI * i) / numPoints;
        const x = center.x + scale * 0.8 * Math.sin(2 * t) * Math.cos(t);
        const y = center.y + scale * 0.8 * Math.sin(2 * t) * Math.sin(t);
        points.push({ x, y });
      }
    }
    
    return points;
  };

  // Generate dot positions for 3x3 grid
  const generateDots = (gridSize) => {
    const dots = [];
    const margin = Math.min(width, height) / 6;
    const gridWidth = width - 2 * margin;
    const gridHeight = height - 2 * margin;
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = margin + (gridWidth * (i + 1)) / (gridSize + 1);
        const y = margin + (gridHeight * (j + 1)) / (gridSize + 1);
        dots.push({ x, y, radius: 6 });
      }
    }
    
    return dots;
  };

  const drawFrame = (ctx, currentProgress) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set canvas background
    ctx.fillStyle = '#2a1810';
    ctx.fillRect(0, 0, width, height);
    
    const path = generateKolamPath(gridSize, pattern);
    const dots = generateDots(gridSize);
    
    // Calculate how many points to draw based on progress
    const pointsToDraw = Math.floor(path.length * currentProgress);
    
    if (pointsToDraw > 0) {
      // Set up line drawing
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 8;
      
      // Draw the main path with smooth curves
      ctx.beginPath();
      if (path.length > 0) {
        ctx.moveTo(path[0].x, path[0].y);
        
        for (let i = 1; i < pointsToDraw; i++) {
          if (i < path.length) {
            // Use quadratic curves for smoother animation
            if (i + 1 < path.length && i + 1 < pointsToDraw) {
              const xc = (path[i].x + path[i + 1].x) / 2;
              const yc = (path[i].y + path[i + 1].y) / 2;
              ctx.quadraticCurveTo(path[i].x, path[i].y, xc, yc);
            } else {
              ctx.lineTo(path[i].x, path[i].y);
            }
          }
        }
        
        ctx.stroke();
      }
      
      // Add animated drawing head (glowing dot at the current drawing position)
      if (pointsToDraw < path.length) {
        const currentPoint = path[pointsToDraw];
        
        // Glowing effect for the drawing head
        const gradient = ctx.createRadialGradient(
          currentPoint.x, currentPoint.y, 0,
          currentPoint.x, currentPoint.y, 15
        );
        gradient.addColorStop(0, '#00ff88');
        gradient.addColorStop(0.5, '#00cc66');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(currentPoint.x, currentPoint.y, 15, 0, 2 * Math.PI);
        ctx.fill();
        
        // Bright center dot
        ctx.fillStyle = '#00ff88';
        ctx.beginPath();
        ctx.arc(currentPoint.x, currentPoint.y, 3, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
    
    // Draw dots that appear as the line passes near them
    dots.forEach((dot, index) => {
      let dotProgress = 0;
      
      // Check if the line has passed near this dot
      for (let i = 0; i < pointsToDraw && i < path.length; i++) {
        const distance = Math.sqrt(
          Math.pow(path[i].x - dot.x, 2) + Math.pow(path[i].y - dot.y, 2)
        );
        if (distance < 30) {
          dotProgress = Math.min(1, (pointsToDraw - i) / 20);
          break;
        }
      }
      
      if (dotProgress > 0) {
        // Animated dot appearance
        const scale = dotProgress;
        const alpha = dotProgress;
        
        // Outer glow
        ctx.save();
        ctx.globalAlpha = alpha * 0.6;
        const dotGradient = ctx.createRadialGradient(
          dot.x, dot.y, 0,
          dot.x, dot.y, dot.radius * 2 * scale
        );
        dotGradient.addColorStop(0, '#ffffff');
        dotGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = dotGradient;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius * 2 * scale, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
        
        // Main dot
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius * scale, 0, 2 * Math.PI);
        ctx.fill();
        
        // Black center
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, (dot.radius - 2) * scale, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
      }
    });
    
    // Update progress display
    setProgress(Math.round(currentProgress * 100));
  };

  const animate = () => {
    if (!isPlaying) return;
    
    const startTime = Date.now();
    const duration = 8000 / speed; // 8 seconds base duration
    
    const step = () => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(elapsed / duration, 1);
      
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        drawFrame(ctx, currentProgress);
      }
      
      if (currentProgress < 1) {
        animationRef.current = requestAnimationFrame(step);
      } else {
        setIsComplete(true);
        if (onComplete) onComplete();
        
        // Auto-restart after a pause
        setTimeout(() => {
          setIsComplete(false);
          if (isPlaying) {
            animate();
          }
        }, 2000);
      }
    };
    
    animationRef.current = requestAnimationFrame(step);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const restart = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsComplete(false);
    setProgress(0);
    if (isPlaying) {
      animate();
    }
  };

  useEffect(() => {
    if (isPlaying && !isComplete) {
      animate();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed, gridSize, pattern]);

  useEffect(() => {
    // Initial draw
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      drawFrame(ctx, 0);
    }
  }, [gridSize, pattern]);

  return (
    <div className={`kolam-animation-container ${className}`}>
      <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="block"
        />
        
        {/* Animation Controls */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black bg-opacity-50 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={togglePlayPause}
              className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-200"
            >
              {isPlaying ? (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            
            <button
              onClick={restart}
              className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-200"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center space-x-2 text-white text-sm">
            <span className="font-mono">{progress}%</span>
            {isComplete && (
              <span className="text-green-400 font-medium">Complete</span>
            )}
          </div>
        </div>
        
        {/* Pattern and Speed Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <select
            value={pattern}
            onChange={(e) => window.location.reload()} // Simple way to change pattern
            className="px-3 py-1 bg-black bg-opacity-50 text-white text-sm rounded-md border border-white border-opacity-20"
          >
            <option value="lissajous">Lissajous</option>
            <option value="spiral">Spiral</option>
            <option value="interwoven">Interwoven</option>
          </select>
          
          <select
            value={speed}
            onChange={(e) => window.location.reload()} // Simple way to change speed
            className="px-3 py-1 bg-black bg-opacity-50 text-white text-sm rounded-md border border-white border-opacity-20"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default KolamAnimation;