import React, { useState } from 'react';
import './App.css';
import AnimationDemo from './components/AnimationDemo';
import MandalaColoring from './components/MandalaColoring';
import KolamBackground from './components/KolamBackground';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('kolam'); // 'kolam' or 'mandala'

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
    <KolamBackground>
      <div className="App">
        {/* Navigation Header */}
        <nav className="nav-header">
          <div className="nav-container">
            <h1 className="nav-title">🎨 Kolam AI Studio</h1>
            <div className="nav-buttons">
              <button 
                onClick={() => setCurrentView('kolam')}
                className={`nav-button ${currentView === 'kolam' ? 'active' : ''}`}
              >
                Kolam Recreation
              </button>
              <button 
                onClick={() => setCurrentView('mandala')}
                className={`nav-button ${currentView === 'mandala' ? 'active' : ''}`}
              >
                Mandala Coloring
              </button>
            </div>
          </div>
        </nav>

      {/* Main Content */}
      {currentView === 'mandala' ? (
        <MandalaColoring />
      ) : (
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

        {/* AI Drawing Animation section removed */}

        {result && (
          <div className="results-section">
            <h2>✨ Your Kolam Pattern</h2>
            <p>Preserving the beautiful traditional design you uploaded</p>
            <img 
              src={`data:image/png;base64,${result.recreated_input}`} 
              alt="Your Kolam Pattern" 
              className="result-image"
            />
            
            {/* AI Drawing Animation section removed */}
          </div>
        )}

        {/* Interactive Animation Demo */}
        <AnimationDemo />
        </header>
      )}
      </div>
    </KolamBackground>
  );
}

export default App;
