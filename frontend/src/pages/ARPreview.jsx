import React, { useState, useRef, useEffect } from 'react';
import '../App.css';

const ARPreview = () => {
  const [selectedKolam, setSelectedKolam] = useState(null);
  const [arActive, setArActive] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [arSupported, setArSupported] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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
      name: 'Butterfly Kolam',
      thumbnail: '/api/placeholder/150/150',
      arModel: '/models/butterfly-kolam.glb',
      description: 'Symmetric butterfly pattern'
    }
  ];

  useEffect(() => {
    // Check for AR support
    const checkARSupport = async () => {
      if ('navigator' in window && 'xr' in navigator) {
        try {
          const supported = await navigator.xr.isSessionSupported('immersive-ar');
          setArSupported(supported);
        } catch (err) {
          console.log('WebXR not supported');
          setArSupported(false);
        }
      } else {
        setArSupported(false);
      }
    };

    checkARSupport();
  }, []);

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setArActive(true);
    } catch (err) {
      setError('Failed to access camera. Please allow camera permissions.');
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
    setSelectedKolam(null);
  };

  const selectKolamForAR = (kolam) => {
    setSelectedKolam(kolam);
    if (!arActive) {
      startCamera();
    }
  };

  const renderKolamOverlay = () => {
    if (!selectedKolam || !videoRef.current) return null;

    // Simulate AR overlay positioning
    const overlayStyle = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '200px',
      height: '200px',
      opacity: 0.8,
      pointerEvents: 'none',
      zIndex: 10
    };

    return (
      <div style={overlayStyle}>
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="ar-kolam-overlay"
        >
          {/* Simple kolam pattern overlay */}
          <defs>
            <pattern id="kolamPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="#FF6B35" opacity="0.8"/>
            </pattern>
          </defs>
          
          {/* Different patterns based on selected kolam */}
          {selectedKolam.id === 1 && (
            <g>
              <circle cx="100" cy="100" r="80" fill="none" stroke="#FF6B35" strokeWidth="3" opacity="0.8"/>
              <circle cx="100" cy="100" r="60" fill="none" stroke="#FF6B35" strokeWidth="2" opacity="0.6"/>
              <circle cx="100" cy="100" r="40" fill="none" stroke="#FF6B35" strokeWidth="2" opacity="0.6"/>
              <circle cx="100" cy="100" r="20" fill="none" stroke="#FF6B35" strokeWidth="2" opacity="0.6"/>
              {/* Petals */}
              <path d="M100,20 Q140,60 100,100 Q60,60 100,20" fill="#FF6B35" opacity="0.3"/>
              <path d="M180,100 Q140,140 100,100 Q140,60 180,100" fill="#FF6B35" opacity="0.3"/>
              <path d="M100,180 Q60,140 100,100 Q140,140 100,180" fill="#FF6B35" opacity="0.3"/>
              <path d="M20,100 Q60,60 100,100 Q60,140 20,100" fill="#FF6B35" opacity="0.3"/>
            </g>
          )}
          
          {selectedKolam.id === 2 && (
            <g>
              <polygon points="100,20 130,70 180,70 140,110 160,160 100,130 40,160 60,110 20,70 70,70" 
                      fill="none" stroke="#FF6B35" strokeWidth="3" opacity="0.8"/>
              <polygon points="100,40 120,80 150,80 130,110 140,140 100,120 60,140 70,110 50,80 80,80" 
                      fill="#FF6B35" opacity="0.3"/>
            </g>
          )}
          
          {selectedKolam.id === 3 && (
            <g>
              {/* Peacock body */}
              <ellipse cx="100" cy="120" rx="30" ry="50" fill="#FF6B35" opacity="0.4"/>
              {/* Peacock tail feathers */}
              <path d="M70,80 Q50,50 80,30 Q100,50 90,80" fill="#FF6B35" opacity="0.6"/>
              <path d="M100,70 Q80,40 110,20 Q130,40 120,70" fill="#FF6B35" opacity="0.6"/>
              <path d="M130,80 Q150,50 120,30 Q100,50 110,80" fill="#FF6B35" opacity="0.6"/>
              {/* Decorative elements */}
              <circle cx="75" cy="45" r="8" fill="none" stroke="#FF6B35" strokeWidth="2"/>
              <circle cx="115" cy="35" r="8" fill="none" stroke="#FF6B35" strokeWidth="2"/>
              <circle cx="125" cy="45" r="8" fill="none" stroke="#FF6B35" strokeWidth="2"/>
            </g>
          )}
        </svg>
      </div>
    );
  };

  const ARControls = () => (
    <div className="ar-controls">
      <div className="ar-controls-panel">
        <button className="control-btn" onClick={() => setSelectedKolam(null)}>
          🔄 Change Design
        </button>
        <button className="control-btn">
          📏 Resize
        </button>
        <button className="control-btn">
          🔄 Rotate
        </button>
        <button className="control-btn danger" onClick={stopCamera}>
          ❌ Exit AR
        </button>
      </div>
    </div>
  );

  return (
    <div className="ar-preview-page">
      <header className="page-header">
        <h1>📱 AR Kolam Preview</h1>
        <p>Preview Kolam designs in your space using Augmented Reality</p>
      </header>

      <div className="ar-content">
        {!arActive ? (
          <div className="ar-setup">
            <div className="ar-info">
              <h2>Welcome to AR Kolam Preview</h2>
              <p>
                Experience traditional Kolam designs in your own space! 
                Select a design below and we'll help you visualize how it would look on your floor.
              </p>
              
              {!arSupported && (
                <div className="ar-notice">
                  <p>⚠️ Full AR features require a supported device. You can still preview designs using your camera.</p>
                </div>
              )}
            </div>

            <div className="kolam-gallery">
              <h3>Choose a Kolam Design</h3>
              <div className="designs-grid">
                {kolamDesigns.map((kolam) => (
                  <div 
                    key={kolam.id}
                    className="design-card"
                    onClick={() => selectKolamForAR(kolam)}
                  >
                    <img src={kolam.thumbnail} alt={kolam.name} />
                    <div className="design-info">
                      <h4>{kolam.name}</h4>
                      <p>{kolam.description}</p>
                    </div>
                    <button className="preview-btn">
                      👁️ Preview in AR
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="ar-instructions">
              <h3>How to use AR Preview:</h3>
              <ol>
                <li>🎨 Select a Kolam design from the gallery above</li>
                <li>📷 Allow camera access when prompted</li>
                <li>🏠 Point your camera at a flat floor surface</li>
                <li>👆 Use touch gestures to resize and position the design</li>
                <li>📸 Capture or share your AR preview</li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="ar-viewer">
            <div className="camera-view">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-stream"
                onLoadedMetadata={() => {
                  // Camera is ready
                }}
              />
              
              {renderKolamOverlay()}
              
              {/* Surface detection indicator */}
              <div className="surface-indicator">
                <div className="scanning-frame">
                  <div className="corner top-left"></div>
                  <div className="corner top-right"></div>
                  <div className="corner bottom-left"></div>
                  <div className="corner bottom-right"></div>
                </div>
                <p>Point camera at a flat surface</p>
              </div>

              <ARControls />
            </div>

            <div className="ar-sidebar">
              <div className="selected-design">
                <h3>Current Design</h3>
                <div className="design-preview">
                  <img src={selectedKolam?.thumbnail} alt={selectedKolam?.name} />
                  <div>
                    <h4>{selectedKolam?.name}</h4>
                    <p>{selectedKolam?.description}</p>
                  </div>
                </div>
              </div>

              <div className="ar-tips">
                <h3>💡 AR Tips</h3>
                <ul>
                  <li>Ensure good lighting for best results</li>
                  <li>Use a flat, textured surface for better tracking</li>
                  <li>Move slowly to maintain tracking</li>
                  <li>Try different camera angles</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Starting AR Preview...</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .ar-preview-page {
          min-height: 100vh;
          background: var(--bg-primary);
        }

        .ar-viewer {
          display: flex;
          height: 80vh;
          gap: var(--spacing-lg);
        }

        .camera-view {
          flex: 1;
          position: relative;
          background: #000;
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .camera-stream {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .surface-indicator {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: white;
        }

        .scanning-frame {
          position: relative;
          width: 200px;
          height: 200px;
          margin: 0 auto 10px;
        }

        .corner {
          position: absolute;
          width: 30px;
          height: 30px;
          border: 3px solid #FF6B35;
        }

        .corner.top-left {
          top: 0;
          left: 0;
          border-bottom: none;
          border-right: none;
        }

        .corner.top-right {
          top: 0;
          right: 0;
          border-bottom: none;
          border-left: none;
        }

        .corner.bottom-left {
          bottom: 0;
          left: 0;
          border-top: none;
          border-right: none;
        }

        .corner.bottom-right {
          bottom: 0;
          right: 0;
          border-top: none;
          border-left: none;
        }

        .ar-controls {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
        }

        .ar-controls-panel {
          display: flex;
          gap: var(--spacing-sm);
          background: rgba(0, 0, 0, 0.7);
          padding: var(--spacing-md);
          border-radius: var(--radius-lg);
        }

        .control-btn {
          padding: var(--spacing-sm) var(--spacing-md);
          border: none;
          border-radius: var(--radius-md);
          background: var(--accent-primary);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-normal);
        }

        .control-btn:hover {
          background: var(--accent-hover);
          transform: scale(1.05);
        }

        .control-btn.danger {
          background: #E53E3E;
        }

        .control-btn.danger:hover {
          background: #C53030;
        }

        .ar-sidebar {
          width: 300px;
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          overflow-y: auto;
        }

        .designs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .design-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-md);
          cursor: pointer;
          transition: all var(--transition-normal);
          border: 2px solid transparent;
        }

        .design-card:hover {
          border-color: var(--accent-primary);
          transform: translateY(-4px);
          box-shadow: var(--shadow-hover);
        }

        .design-card img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: var(--radius-md);
          margin-bottom: var(--spacing-sm);
        }

        .preview-btn {
          width: 100%;
          padding: var(--spacing-sm);
          border: none;
          border-radius: var(--radius-md);
          background: var(--accent-primary);
          color: white;
          font-weight: 600;
          cursor: pointer;
          margin-top: var(--spacing-sm);
        }

        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .loading-spinner {
          text-align: center;
          color: white;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #333;
          border-top: 4px solid #FF6B35;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .ar-kolam-overlay {
          filter: drop-shadow(0 0 10px rgba(255, 107, 53, 0.5));
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default ARPreview;