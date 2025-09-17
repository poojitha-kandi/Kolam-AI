import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, FileImage, AlertCircle, CheckCircle } from 'lucide-react';

const ImageUpload = ({ onImageLoad, onError }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  
  const fileInputRef = useRef(null);

  // Validate file type and size
  const validateFile = (file) => {
    const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type)) {
      throw new Error('Please upload an SVG, PNG, JPG, or GIF file');
    }
    
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }
    
    return true;
  };

  // Process SVG file to make it colorable
  const processSVGFile = async (file) => {
    const text = await file.text();
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(text, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');
    
    if (!svgElement) {
      throw new Error('Invalid SVG file');
    }
    
    // Process SVG to ensure proper structure for coloring
    const drawableElements = svgElement.querySelectorAll('path, circle, polygon, rect, ellipse, line, polyline');
    
    drawableElements.forEach((element, index) => {
      // Ensure white stroke for visibility
      const currentStroke = element.getAttribute('stroke');
      if (!currentStroke || currentStroke === 'none' || currentStroke === '#000' || currentStroke === '#000000' || currentStroke === 'black') {
        element.setAttribute('stroke', '#ffffff');
        element.setAttribute('stroke-width', element.getAttribute('stroke-width') || '1');
      }
      
      // Add unique IDs for coloring regions
      if (!element.id) {
        element.setAttribute('id', `region-${index}`);
      }
      
      // Ensure fill is transparent by default
      if (!element.getAttribute('fill') || element.getAttribute('fill') === 'black') {
        element.setAttribute('fill', 'none');
      }
    });
    
    // Serialize back to string
    const serializer = new XMLSerializer();
    return serializer.serializeToString(svgDoc);
  };

  // Convert raster image to colorable SVG-like structure
  const createColorableGridFromImage = async (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        try {
          // Set canvas size (max 800px for performance)
          const maxSize = 800;
          const scale = Math.min(maxSize / img.width, maxSize / img.height);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          
          // Draw image
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Create SVG with rectangular grid for coloring
          const gridSize = 20; // Size of each colorable square
          const cols = Math.ceil(canvas.width / gridSize);
          const rows = Math.ceil(canvas.height / gridSize);
          
          let svgContent = `<svg width="${canvas.width}" height="${canvas.height}" xmlns="http://www.w3.org/2000/svg">`;
          
          // Add background image
          const dataUrl = canvas.toDataURL();
          svgContent += `<image href="${dataUrl}" width="${canvas.width}" height="${canvas.height}" opacity="0.7"/>`;
          
          // Add grid of colorable rectangles
          for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
              const x = col * gridSize;
              const y = row * gridSize;
              const width = Math.min(gridSize, canvas.width - x);
              const height = Math.min(gridSize, canvas.height - y);
              
              svgContent += `<rect 
                id="grid-${row}-${col}" 
                x="${x}" 
                y="${y}" 
                width="${width}" 
                height="${height}" 
                fill="none" 
                stroke="#ffffff" 
                stroke-width="0.5" 
                stroke-opacity="0.3"
                data-region-id="grid-${row}-${col}"
              />`;
            }
          }
          
          svgContent += '</svg>';
          resolve(svgContent);
        } catch (error) {
          reject(new Error('Failed to process image: ' + error.message));
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  // Handle file processing
  const processFile = async (file) => {
    setIsProcessing(true);
    setUploadProgress(0);
    
    try {
      validateFile(file);
      
      // Generate preview
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      setFileName(file.name);
      setFileSize(file.size);
      
      setUploadProgress(25);
      
      let svgContent;
      
      if (file.type === 'image/svg+xml') {
        // Process SVG file
        setUploadProgress(50);
        svgContent = await processSVGFile(file);
      } else {
        // Convert raster image to colorable grid
        setUploadProgress(50);
        svgContent = await createColorableGridFromImage(file);
      }
      
      setUploadProgress(75);
      
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setUploadProgress(100);
      
      // Pass to parent component
      onImageLoad?.(svgContent, {
        name: file.name,
        type: file.type,
        size: file.size,
        preview
      });
      
    } catch (error) {
      console.error('File processing error:', error);
      onError?.(error.message);
      clearPreview();
    } finally {
      setIsProcessing(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  // Clear preview and reset state
  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFileName('');
    setFileSize(0);
    setUploadProgress(0);
  };

  // File input change handler
  const handleFileSelect = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, []);

  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="image-upload">
      {/* Upload Area */}
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''} ${isProcessing ? 'processing' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".svg,.png,.jpg,.jpeg,.gif"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          disabled={isProcessing}
        />
        
        {isProcessing ? (
          <div className="processing-state">
            <div className="progress-circle">
              <svg viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(255, 214, 138, 0.2)"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#ffd68a"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${uploadProgress * 2.83} 283`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <span className="progress-text">{uploadProgress}%</span>
            </div>
            <p>Processing your image...</p>
          </div>
        ) : (
          <div className="upload-prompt">
            <div className="upload-icon">
              <Upload size={48} />
            </div>
            <h3>Upload Mandala Image</h3>
            <p>Drag and drop your SVG or PNG file here, or click to browse</p>
            <div className="supported-formats">
              <span>Supported: SVG, PNG, JPG, GIF (max 10MB)</span>
            </div>
          </div>
        )}
      </div>

      {/* Preview Section */}
      {previewUrl && !isProcessing && (
        <div className="preview-section">
          <div className="preview-header">
            <h4>
              <FileImage size={18} />
              Preview
            </h4>
            <button
              onClick={clearPreview}
              className="clear-btn"
              title="Remove image"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="preview-content">
            <img src={previewUrl} alt="Preview" className="preview-image" />
            <div className="file-info">
              <p className="file-name">{fileName}</p>
              <p className="file-size">{formatFileSize(fileSize)}</p>
              <div className="status">
                <CheckCircle size={16} />
                <span>Ready to color</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="upload-instructions">
        <h4>
          <AlertCircle size={16} />
          Tips for best results:
        </h4>
        <ul>
          <li><strong>SVG files:</strong> Will be processed to detect existing shapes and make them colorable</li>
          <li><strong>PNG/JPG files:</strong> Will be converted to a grid-based coloring system</li>
          <li><strong>Line art works best:</strong> Clear outlines with transparent or white backgrounds</li>
          <li><strong>High contrast:</strong> Dark lines on light backgrounds are easier to process</li>
        </ul>
      </div>

      <style jsx>{`
        .image-upload {
          background: rgba(12, 12, 12, 0.8);
          border: 1px solid rgba(247, 239, 230, 0.1);
          border-radius: 16px;
          padding: 24px;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .upload-area {
          border: 2px dashed rgba(247, 239, 230, 0.3);
          border-radius: 12px;
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 20px;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .upload-area:hover:not(.processing) {
          border-color: rgba(255, 214, 138, 0.5);
          background: rgba(255, 214, 138, 0.05);
        }

        .upload-area.drag-active {
          border-color: #ffd68a;
          background: rgba(255, 214, 138, 0.1);
          transform: scale(1.02);
        }

        .upload-area.processing {
          cursor: not-allowed;
          border-color: rgba(255, 214, 138, 0.4);
        }

        .upload-prompt {
          color: #f7efea;
        }

        .upload-icon {
          color: #ffd68a;
          margin-bottom: 16px;
        }

        .upload-prompt h3 {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 600;
        }

        .upload-prompt p {
          margin: 0 0 16px 0;
          color: rgba(247, 239, 230, 0.8);
          font-size: 14px;
        }

        .supported-formats {
          font-size: 12px;
          color: rgba(247, 239, 230, 0.6);
          background: rgba(255, 214, 138, 0.1);
          padding: 8px 16px;
          border-radius: 8px;
          display: inline-block;
        }

        .processing-state {
          color: #f7efea;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .progress-circle {
          position: relative;
          width: 80px;
          height: 80px;
        }

        .progress-circle svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-weight: bold;
          color: #ffd68a;
        }

        .preview-section {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .preview-header h4 {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #f7efea;
          margin: 0;
          font-size: 16px;
        }

        .clear-btn {
          background: rgba(255, 82, 82, 0.1);
          border: 1px solid rgba(255, 82, 82, 0.2);
          color: #ff5252;
          padding: 6px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-btn:hover {
          background: rgba(255, 82, 82, 0.2);
          border-color: rgba(255, 82, 82, 0.4);
        }

        .preview-content {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .preview-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid rgba(247, 239, 230, 0.2);
        }

        .file-info {
          flex: 1;
          color: #f7efea;
        }

        .file-name {
          font-weight: 600;
          margin: 0 0 4px 0;
          word-break: break-all;
        }

        .file-size {
          color: rgba(247, 239, 230, 0.7);
          font-size: 14px;
          margin: 0 0 8px 0;
        }

        .status {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #4CAF50;
          font-size: 14px;
        }

        .upload-instructions {
          background: rgba(255, 214, 138, 0.05);
          border: 1px solid rgba(255, 214, 138, 0.2);
          border-radius: 12px;
          padding: 16px;
          color: #f7efea;
        }

        .upload-instructions h4 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 12px 0;
          color: #ffd68a;
          font-size: 14px;
        }

        .upload-instructions ul {
          margin: 0;
          padding-left: 16px;
          font-size: 13px;
          line-height: 1.5;
        }

        .upload-instructions li {
          margin-bottom: 6px;
          color: rgba(247, 239, 230, 0.8);
        }

        .upload-instructions strong {
          color: #ffd68a;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .image-upload {
            padding: 16px;
          }

          .upload-area {
            padding: 30px 15px;
            min-height: 160px;
          }

          .upload-prompt h3 {
            font-size: 18px;
          }

          .preview-content {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .progress-circle {
            width: 60px;
            height: 60px;
          }
        }
      `}</style>
    </div>
  );
};

export default ImageUpload;