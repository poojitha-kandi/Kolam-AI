import React, { useState, useRef, useEffect } from 'react';
import '../App.css';

const ARPreview = () => {
  const [selectedKolam, setSelectedKolam] = useState(null);
  const [arActive, setArActive] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [arSupported, setArSupported] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [kolamSize, setKolamSize] = useState(1);
  const [kolamRotation, setKolamRotation] = useState(0);
  const [kolamColor, setKolamColor] = useState('#FF6B35');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const kolamDesigns = [
    {
      id: 1,
      name: 'Lotus Bloom',
      thumbnail: '/api/placeholder/150/150',
      arModel: '/models/lotus-kolam.glb',
      description: 'Sacred lotus flower design'
    },
    {
      id: 2,
      name: 'Star Mandala',
      thumbnail: '/api/placeholder/150/150',
      arModel: '/models/star-mandala.glb',
      description: 'Geometric star pattern'
    },
    {
      id: 3,
      name: 'Peacock Design',
      thumbnail: '/api/placeholder/150/150',
      arModel: '/models/peacock-kolam.glb',
      description: 'Traditional peacock motif'
    },
    {
      id: 4,
      name: 'Flower Chain',
      thumbnail: '/api/placeholder/150/150',
      arModel: '/models/flower-chain.glb',
      description: 'Interlocked flower pattern'
    },
    {
      id: 5,
      name: 'Diya Circle',
      thumbnail: '/api/placeholder/150/150',
      arModel: '/models/diya-circle.glb',
      description: 'Oil lamp circular design'
    },
    {
      id: 6,
      name: 'Rangoli Sun',
      thumbnail: '/api/placeholder/150/150',
      arModel: '/models/sun-rangoli.glb',
      description: 'Solar-inspired pattern'
    }
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setSelectedKolam({
          id: 'uploaded',
          name: file.name,
          thumbnail: e.target.result,
          description: 'Uploaded design'
        });
        setShowOptions(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const openUploadModal = () => {
    setShowOptions(true);
  };

  const handleKolamSelect = (kolam) => {
    setSelectedKolam(kolam);
    setUploadedImage(null);
    setShowOptions(false);
  };

  useEffect(() => {
    // Check AR support
    if ('navigator' in window && 'xr' in navigator) {
      navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
        setArSupported(supported);
      }).catch(() => {
        setArSupported(false);
      });
    } else {
      setArSupported(false);
    }
  }, []);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setArActive(true);
      setError(null);
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
      console.error('Camera error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setArActive(false);
  };

  const startARSession = async () => {
    if (!selectedKolam) {
      setError('Please select a Kolam design first');
      return;
    }

    if (!arSupported) {
      await startCamera();
      return;
    }

    try {
      setIsLoading(true);
      await startCamera();
      // Here you would initialize WebXR AR session
      // For now, we'll use the camera preview
      setError(null);
    } catch (err) {
      setError('Failed to start AR session');
      console.error('AR error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAROverlay = () => {
    if (!arActive || !selectedKolam) return null;

    return (
      <div className="ar-overlay">
        <div 
          className="kolam-projection"
          style={{
            transform: `scale(${kolamSize}) rotate(${kolamRotation}deg)`,
            filter: `hue-rotate(${kolamColor === '#FF6B35' ? '0' : '180'}deg)`
          }}
        >
          <img 
            src={selectedKolam.thumbnail} 
            alt={selectedKolam.name}
            className="ar-kolam-image"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="ar-preview-container">
      <div className="ar-header">
        <h1 className="ar-title">📱 AR Kolam Preview</h1>
        <p className="ar-subtitle">
          Project Kolam designs onto your floor using Augmented Reality
        </p>
      </div>

      {!arActive ? (
        <div className="ar-setup">
          {/* Option Selection */}
          <div className="ar-options">
            <button 
              className="ar-option-btn primary"
              onClick={openUploadModal}
            >
              📤 Upload Image
            </button>
            <button 
              className="ar-option-btn secondary"
              onClick={() => setShowOptions(true)}
            >
              🎨 Choose from Existing
            </button>
          </div>

          {selectedKolam && (
            <div className="selected-kolam-preview">
              <h3>Selected Design:</h3>
              <div className="kolam-preview-card">
                <img 
                  src={selectedKolam.thumbnail} 
                  alt={selectedKolam.name}
                  className="kolam-preview-image"
                />
                <div className="kolam-preview-info">
                  <h4>{selectedKolam.name}</h4>
                  <p>{selectedKolam.description}</p>
                </div>
              </div>

              {/* Controls */}
              <div className="ar-controls">
                <div className="control-group">
                  <label>Size:</label>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="2" 
                    step="0.1" 
                    value={kolamSize}
                    onChange={(e) => setKolamSize(parseFloat(e.target.value))}
                  />
                  <span>{kolamSize}x</span>
                </div>
                
                <div className="control-group">
                  <label>Rotation:</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="360" 
                    value={kolamRotation}
                    onChange={(e) => setKolamRotation(parseInt(e.target.value))}
                  />
                  <span>{kolamRotation}°</span>
                </div>
                
                <div className="control-group">
                  <label>Color:</label>
                  <select 
                    value={kolamColor} 
                    onChange={(e) => setKolamColor(e.target.value)}
                  >
                    <option value="#FF6B35">Orange</option>
                    <option value="#FF0000">Red</option>
                    <option value="#FFFF00">Yellow</option>
                    <option value="#FFFFFF">White</option>
                    <option value="#800080">Purple</option>
                  </select>
                </div>
              </div>

              <button 
                className="start-ar-btn"
                onClick={startARSession}
                disabled={isLoading}
              >
                {isLoading ? '🔄 Loading...' : '🚀 Start AR Preview'}
              </button>
            </div>
          )}

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          {!arSupported && (
            <div className="ar-info">
              ℹ️ WebXR AR not supported on this device. Using camera preview mode.
            </div>
          )}
        </div>
      ) : (
        <div className="ar-view">
          <div className="camera-container">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="camera-feed"
            />
            {renderAROverlay()}
          </div>
          
          <div className="ar-view-controls">
            <button 
              className="control-btn"
              onClick={() => setKolamSize(kolamSize - 0.1)}
              disabled={kolamSize <= 0.5}
            >
              🔍 Smaller
            </button>
            <button 
              className="control-btn"
              onClick={() => setKolamSize(kolamSize + 0.1)}
              disabled={kolamSize >= 2}
            >
              🔍 Larger
            </button>
            <button 
              className="control-btn"
              onClick={() => setKolamRotation((kolamRotation + 45) % 360)}
            >
              🔄 Rotate
            </button>
            <button 
              className="control-btn stop"
              onClick={stopCamera}
            >
              ⏹️ Stop AR
            </button>
          </div>
        </div>
      )}

      {/* Upload Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />

      {/* Design Selection Modal */}
      {showOptions && (
        <div className="modal-overlay" onClick={() => setShowOptions(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📱 Select AR Option</h2>
              <button className="modal-close" onClick={() => setShowOptions(false)}>✖️</button>
            </div>
            <div className="modal-body">
              <div className="ar-option-buttons">
                <button 
                  className="upload-option"
                  onClick={() => {
                    fileInputRef.current?.click();
                    setShowOptions(false);
                  }}
                >
                  <div className="option-icon">📤</div>
                  <h3>Upload Image</h3>
                  <p>Select a Kolam image from your device</p>
                </button>
                
                <div className="existing-designs">
                  <h3>Choose from Existing Designs:</h3>
                  <div className="designs-grid">
                    {kolamDesigns.map((design) => (
                      <button
                        key={design.id}
                        className="design-option"
                        onClick={() => handleKolamSelect(design)}
                      >
                        <img 
                          src={design.thumbnail} 
                          alt={design.name}
                          className="design-thumbnail"
                        />
                        <div className="design-name">{design.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARPreview;