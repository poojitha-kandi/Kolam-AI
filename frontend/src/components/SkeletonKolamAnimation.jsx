import React, { useRef, useEffect, useState } from 'react';

const SkeletonKolamAnimation = ({ 
  skeletonData = null,
  detectedDots = [],
  width = 400, 
  height = 400, 
  speed = 1,
  autoPlay = true,
  className = ''
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Convert skeleton data to traceable paths
  const extractPaths = (skeletonData) => {
    if (!skeletonData) return [];
    
    // This would process the skeleton image data to extract continuous paths
    // For now, we'll create sample paths based on typical Kolam patterns
    const paths = [];
    const center = { x: width / 2, y: height / 2 };
    const scale = Math.min(width, height) / 3;
    
    // Generate multiple interconnected paths
    for (let pathIndex = 0; pathIndex < 3; pathIndex++) {
      const path = [];
      const numPoints = 200;
      const offset = (pathIndex * Math.PI * 2) / 3;
      
      for (let i = 0; i <= numPoints; i++) {
        const t = (4 * Math.PI * i) / numPoints + offset;
        const radius = scale * (0.6 + 0.3 * Math.sin(3 * t));
        const x = center.x + radius * Math.cos(t);
        const y = center.y + radius * Math.sin(t);
        
        path.push({ 
          x, 
          y, 
          pressure: 0.5 + 0.5 * Math.sin(t * 2), // Variable line thickness
          speed: 0.8 + 0.4 * Math.cos(t * 3) // Variable drawing speed
        });
      }
      
      paths.push(path);
    }
    
    return paths;
  };

  // Advanced drawing with variable line thickness and glowing effects
  const drawAdvancedPath = (ctx, path, progress, pathIndex) => {
    if (!path || path.length === 0) return;
    
    const pointsToDraw = Math.floor(path.length * progress);
    if (pointsToDraw < 2) return;
    
    // Create gradient colors for different paths
    const colors = [
      { main: '#ffffff', glow: '#00ff88' },
      { main: '#f0f0f0', glow: '#0088ff' },
      { main: '#e8e8e8', glow: '#ff8800' }
    ];
    const color = colors[pathIndex % colors.length];
    
    // Draw path with variable thickness
    for (let i = 1; i < pointsToDraw; i++) {
      const prevPoint = path[i - 1];
      const currPoint = path[i];
      
      if (!prevPoint || !currPoint) continue;
      
      // Calculate line thickness based on pressure
      const thickness = 2 + (currPoint.pressure || 0.5) * 4;
      
      // Main line
      ctx.strokeStyle = color.main;
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';
      ctx.shadowColor = color.glow;
      ctx.shadowBlur = 6;
      
      ctx.beginPath();
      ctx.moveTo(prevPoint.x, prevPoint.y);
      ctx.lineTo(currPoint.x, currPoint.y);
      ctx.stroke();
      
      // Glow effect
      ctx.strokeStyle = color.glow;
      ctx.lineWidth = thickness * 0.3;
      ctx.shadowBlur = 12;
      ctx.globalAlpha = 0.6;
      
      ctx.beginPath();
      ctx.moveTo(prevPoint.x, prevPoint.y);
      ctx.lineTo(currPoint.x, currPoint.y);
      ctx.stroke();
      
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }
    
    // Draw animated head for this path
    if (pointsToDraw < path.length) {
      const currentPoint = path[pointsToDraw];
      
      // Pulsing glow effect
      const pulseIntensity = 0.8 + 0.2 * Math.sin(Date.now() * 0.01);
      const gradient = ctx.createRadialGradient(
        currentPoint.x, currentPoint.y, 0,
        currentPoint.x, currentPoint.y, 20 * pulseIntensity
      );
      gradient.addColorStop(0, color.glow);
      gradient.addColorStop(0.5, color.glow + '80');
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(currentPoint.x, currentPoint.y, 20 * pulseIntensity, 0, 2 * Math.PI);
      ctx.fill();
      
      // Bright center
      ctx.fillStyle = color.glow;
      ctx.beginPath();
      ctx.arc(currentPoint.x, currentPoint.y, 4, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  // Draw dots with sophisticated appearance animation
  const drawAdvancedDots = (ctx, dots, paths, progress) => {
    dots.forEach((dot, index) => {
      let dotProgress = 0;
      let nearestPathIndex = 0;
      
      // Check if any path has reached near this dot
      paths.forEach((path, pathIndex) => {
        const pointsToDraw = Math.floor(path.length * progress);
        
        for (let i = 0; i < pointsToDraw && i < path.length; i++) {
          const distance = Math.sqrt(
            Math.pow(path[i].x - dot.x, 2) + Math.pow(path[i].y - dot.y, 2)
          );
          if (distance < 40) {
            const pathProgress = Math.min(1, (pointsToDraw - i) / 30);
            if (pathProgress > dotProgress) {
              dotProgress = pathProgress;
              nearestPathIndex = pathIndex;
            }
          }
        }
      });
      
      if (dotProgress > 0) {
        const colors = ['#00ff88', '#0088ff', '#ff8800'];
        const dotColor = colors[nearestPathIndex % colors.length];
        
        // Sophisticated dot appearance with multiple layers
        const scale = Math.min(dotProgress * 1.2, 1);
        const alpha = dotProgress;
        
        // Outer pulse ring
        ctx.save();
        ctx.globalAlpha = alpha * 0.4;
        const pulseRadius = dot.radius * 3 * (1 + 0.3 * Math.sin(Date.now() * 0.008 + index));
        const pulseGradient = ctx.createRadialGradient(
          dot.x, dot.y, 0,
          dot.x, dot.y, pulseRadius
        );
        pulseGradient.addColorStop(0, dotColor + '00');
        pulseGradient.addColorStop(0.7, dotColor + '60');
        pulseGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = pulseGradient;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, pulseRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
        
        // Main glow
        ctx.save();
        ctx.globalAlpha = alpha * 0.8;
        const glowGradient = ctx.createRadialGradient(
          dot.x, dot.y, 0,
          dot.x, dot.y, dot.radius * 2.5 * scale
        );
        glowGradient.addColorStop(0, '#ffffff');
        glowGradient.addColorStop(0.6, dotColor);
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius * 2.5 * scale, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
        
        // Main dot body
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius * scale, 0, 2 * Math.PI);
        ctx.fill();
        
        // Inner shadow/depth
        const innerGradient = ctx.createRadialGradient(
          dot.x - dot.radius * 0.3, dot.y - dot.radius * 0.3, 0,
          dot.x, dot.y, dot.radius * scale
        );
        innerGradient.addColorStop(0, '#ffffff');
        innerGradient.addColorStop(0.7, '#f0f0f0');
        innerGradient.addColorStop(1, '#d0d0d0');
        ctx.fillStyle = innerGradient;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius * scale, 0, 2 * Math.PI);
        ctx.fill();
        
        // Center highlight
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(dot.x - dot.radius * 0.2, dot.y - dot.radius * 0.2, dot.radius * 0.3 * scale, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
      }
    });
  };

  const drawFrame = (ctx, currentProgress) => {
    // Clear with gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#1a0f08');
    bgGradient.addColorStop(1, '#2a1810');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    
    const paths = extractPaths(skeletonData);
    const dots = detectedDots.length > 0 ? detectedDots.map(dot => ({
      x: (dot.x || dot[0]) * width / 400, // Scale to canvas size
      y: (dot.y || dot[1]) * height / 400,
      radius: 8
    })) : [];
    
    // Draw paths with staggered animation
    paths.forEach((path, index) => {
      const staggerDelay = index * 0.1; // 10% delay between paths
      const pathProgress = Math.max(0, Math.min(1, (currentProgress - staggerDelay) / (1 - staggerDelay)));
      
      if (pathProgress > 0) {
        drawAdvancedPath(ctx, path, pathProgress, index);
      }
    });
    
    // Draw dots
    drawAdvancedDots(ctx, dots, paths, currentProgress);
    
    // Add particle effects for visual flair
    if (currentProgress > 0.1) {
      const numParticles = Math.floor(currentProgress * 20);
      for (let i = 0; i < numParticles; i++) {
        const particleLife = (currentProgress * 10 - i * 0.5) % 1;
        if (particleLife > 0) {
          const angle = (i * 137.5) * Math.PI / 180; // Golden angle
          const radius = particleLife * Math.min(width, height) * 0.3;
          const x = width / 2 + radius * Math.cos(angle);
          const y = height / 2 + radius * Math.sin(angle);
          
          ctx.save();
          ctx.globalAlpha = (1 - particleLife) * 0.6;
          ctx.fillStyle = '#00ff88';
          ctx.beginPath();
          ctx.arc(x, y, 2 * (1 - particleLife), 0, 2 * Math.PI);
          ctx.fill();
          ctx.restore();
        }
      }
    }
    
    setProgress(Math.round(currentProgress * 100));
  };

  const animate = () => {
    if (!isPlaying) return;
    
    const startTime = Date.now();
    const duration = 12000 / speed; // 12 seconds base duration for complex animation
    
    const step = () => {
      const elapsed = Date.now() - startTime;
      let currentProgress = elapsed / duration;
      
      // Easing function for smoother animation
      currentProgress = currentProgress < 0.5 
        ? 2 * currentProgress * currentProgress 
        : 1 - Math.pow(-2 * currentProgress + 2, 3) / 2;
      
      currentProgress = Math.min(currentProgress, 1);
      
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        drawFrame(ctx, currentProgress);
      }
      
      if (currentProgress < 1) {
        animationRef.current = requestAnimationFrame(step);
      } else {
        setIsComplete(true);
        
        // Auto-restart after pause
        setTimeout(() => {
          setIsComplete(false);
          if (isPlaying) {
            animate();
          }
        }, 3000);
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
  }, [isPlaying, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      drawFrame(ctx, 0);
    }
  }, [skeletonData, detectedDots]);

  return (
    <div className={`kolam-animation-container ${className}`}>
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="block"
        />
        
        {/* Enhanced Controls */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between bg-black bg-opacity-60 backdrop-blur-sm rounded-lg p-3 border border-white border-opacity-10">
            <div className="flex items-center space-x-3">
              <button
                onClick={togglePlayPause}
                className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:from-blue-400 hover:to-purple-500 transition-all duration-200 shadow-lg"
              >
                {isPlaying ? (
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              
              <button
                onClick={restart}
                className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-200 backdrop-blur-sm"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-white text-sm">
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="font-mono text-gray-300 min-w-[3rem]">{progress}%</span>
              </div>
              
              {isComplete && (
                <div className="flex items-center space-x-1 text-green-400 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Complete</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* AI Badge */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center space-x-2 bg-black bg-opacity-50 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white border-opacity-20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white text-xs font-medium">AI Drawing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonKolamAnimation;