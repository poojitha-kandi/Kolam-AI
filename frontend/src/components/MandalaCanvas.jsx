import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const MandalaCanvas = forwardRef(({ mandala, mandalaColors, onSectionColor }, ref) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    saveAsPNG: () => {
      if (svgRef.current) {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = 800;
        canvas.height = 800;
        
        // Create SVG data URL
        const svgElement = svgRef.current;
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        
        // Create image and draw to canvas
        const img = new Image();
        img.onload = () => {
          // Fill canvas with white background
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw the SVG
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Download the image
          canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `mandala-${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);
          });
          
          URL.revokeObjectURL(svgUrl);
        };
        img.src = svgUrl;
      }
    }
  }));

  // Handle section click
  const handleSectionClick = (event) => {
    const section = event.target.closest('.mandala-section');
    if (section) {
      const sectionId = section.getAttribute('data-section');
      if (sectionId && onSectionColor) {
        onSectionColor(sectionId);
      }
    }
  };

  // Apply colors to SVG sections
  useEffect(() => {
    if (svgRef.current && mandalaColors) {
      const svgElement = svgRef.current;
      const sections = svgElement.querySelectorAll('.mandala-section');
      
      sections.forEach((section) => {
        const sectionId = section.getAttribute('data-section');
        if (sectionId && mandalaColors[sectionId]) {
          section.style.fill = mandalaColors[sectionId];
          section.style.fillOpacity = '0.7';
        } else {
          section.style.fill = 'none';
          section.style.fillOpacity = '1';
        }
      });
    }
  }, [mandalaColors]);

  // Add hover effects and click handlers
  useEffect(() => {
    if (svgRef.current) {
      const svgElement = svgRef.current;
      const sections = svgElement.querySelectorAll('.mandala-section');
      
      sections.forEach((section) => {
        // Add hover styles
        section.style.cursor = 'pointer';
        section.style.transition = 'all 0.2s ease';
        
        const handleMouseEnter = () => {
          if (!section.style.fill || section.style.fill === 'none') {
            section.style.fill = 'rgba(59, 130, 246, 0.2)'; // Light blue hover
          } else {
            section.style.opacity = '0.8';
          }
          section.style.strokeWidth = '3';
        };
        
        const handleMouseLeave = () => {
          if (section.style.fill === 'rgba(59, 130, 246, 0.2)') {
            section.style.fill = 'none';
          } else {
            section.style.opacity = '1';
          }
          section.style.strokeWidth = '2';
        };
        
        section.addEventListener('mouseenter', handleMouseEnter);
        section.addEventListener('mouseleave', handleMouseLeave);
        
        // Cleanup function
        return () => {
          section.removeEventListener('mouseenter', handleMouseEnter);
          section.removeEventListener('mouseleave', handleMouseLeave);
        };
      });
    }
  }, [mandala]);

  if (!mandala) {
    return null;
  }

  return (
    <div ref={containerRef} className="w-full">
      <div className="flex justify-center p-4">
        <div
          className="max-w-full max-h-96 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
          style={{ aspectRatio: '1:1' }}
        >
          <div
            ref={svgRef}
            className="w-full h-full"
            onClick={handleSectionClick}
            dangerouslySetInnerHTML={{ __html: mandala.svg }}
          />
        </div>
      </div>
      
      {/* Instructions */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-700">
          <span className="font-medium">How to color:</span> Click on any section of the mandala to fill it with your selected color. 
          Hover over sections to see them highlighted.
        </p>
      </div>
    </div>
  );
});

MandalaCanvas.displayName = 'MandalaCanvas';

export default MandalaCanvas;