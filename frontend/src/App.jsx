import React, { useState } from 'react';
import './App.css';

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

        {result && (
          <div className="results-section">
            <h2>✨ Your Kolam Pattern</h2>
            <p>Preserving the beautiful traditional design you uploaded</p>
            <img 
              src={`data:image/png;base64,${result.recreated_input}`} 
              alt="Your Kolam Pattern" 
              className="result-image"
            />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
