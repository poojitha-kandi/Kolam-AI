import React, { useState } from 'react';
import './App.css';
import KolamAnimation from './components/KolamAnimation';
import SkeletonKolamAnimation from './components/SkeletonKolamAnimation';
import AnimationDemo from './components/AnimationDemo';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null);
    } else {
      setError('Please select a valid image file.');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first.');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to process image. Make sure the backend server is running.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎨 Kolam AI - Pattern Recreation</h1>
        <p>Upload a Kolam image to see your beautiful traditional design</p>
        
        <div className="upload-section">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="file-input"
          />
          
          {selectedFile && (
            <div className="selected-file">
              <p>Selected: {selectedFile.name}</p>
              <img 
                src={URL.createObjectURL(selectedFile)} 
                alt="Selected Kolam" 
                className="preview-image"
              />
            </div>
          )}
          
          <button 
            onClick={handleUpload} 
            disabled={!selectedFile || uploading}
            className="upload-button"
          >
            {uploading ? 'Processing...' : 'Recreate Kolam'}
          </button>
        </div>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {/* Animation Showcase - Always visible */}
        <div className="animation-showcase">
          <h2>🎨 AI Kolam Drawing Animation</h2>
          <p>Experience how AI recreates traditional Kolam patterns with mathematical precision</p>
          
          <div className="showcase-animation">
            <KolamAnimation 
              width={400}
              height={400}
              speed={1}
              gridSize={3}
              pattern="lissajous"
              autoPlay={true}
              className="showcase-kolam"
            />
          </div>
          
          <div className="animation-features">
            <div className="feature">
              <span className="feature-icon">✨</span>
              <span>Smooth line tracing effects</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🔄</span>
              <span>Loopable animations</span>
            </div>
            <div className="feature">
              <span className="feature-icon">⚡</span>
              <span>Customizable speed control</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🎯</span>
              <span>Mathematical precision</span>
            </div>
          </div>
        </div>

        {result && (
          <div className="results-section">
            <h2>✨ Your Kolam Pattern</h2>
            <p>Preserving the beautiful traditional design you uploaded</p>
            <img 
              src={`data:image/png;base64,${result.recreated_input}`} 
              alt="Your Kolam Pattern" 
              className="result-image"
            />
            
            {/* AI Animation Section */}
            <div className="animation-section">
              <h3>🤖 AI Drawing Animation</h3>
              <p>Watch how AI recreates your Kolam pattern step by step</p>
              
              <div className="animations-grid">
                {/* Basic mathematical animation */}
                <div className="animation-card">
                  <h4>Mathematical Pattern</h4>
                  <KolamAnimation 
                    width={350}
                    height={350}
                    speed={1.2}
                    gridSize={result.grid_size || 3}
                    pattern="lissajous"
                    className="kolam-animation"
                  />
                </div>
                
                {/* Advanced skeleton-based animation */}
                <div className="animation-card">
                  <h4>AI Skeleton Tracing</h4>
                  <SkeletonKolamAnimation 
                    width={350}
                    height={350}
                    speed={1}
                    detectedDots={result.processing_details ? 
                      Array.from({length: result.num_dots_detected}, (_, i) => ({
                        x: 100 + (i % 3) * 100,
                        y: 100 + Math.floor(i / 3) * 100,
                        radius: 8
                      })) : []
                    }
                    className="skeleton-animation"
                  />
                </div>
              </div>
              
              {/* Animation Controls */}
              <div className="animation-controls">
                <div className="control-group">
                  <label>Animation Style:</label>
                  <select className="control-select">
                    <option value="lissajous">Lissajous Curves</option>
                    <option value="spiral">Spiral Pattern</option>
                    <option value="interwoven">Interwoven Loops</option>
                  </select>
                </div>
                
                <div className="control-group">
                  <label>Drawing Speed:</label>
                  <select className="control-select">
                    <option value="0.5">Slow (0.5x)</option>
                    <option value="1">Normal (1x)</option>
                    <option value="1.5">Fast (1.5x)</option>
                    <option value="2">Very Fast (2x)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Animation Demo */}
        <AnimationDemo />
      </header>
    </div>
  );
}

export default App;
