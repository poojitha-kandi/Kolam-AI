import React, { useState } from 'react';
import './App.css';
import AnimationDemo from './components/AnimationDemo';
import MandalaColoring from './components/MandalaColoring';
import KolamBackground from './components/KolamBackground';
import OccasionRangoli from './pages/OccasionRangoli';
import ShopPage from './components/ShopPage';
import CartPage from './components/CartPage';
import CartBadge from './components/CartBadge';
import RegionalStyles from './pages/RegionalStyles';
import LearnToDraw from './pages/LearnToDraw';
import ARPreview from './pages/ARPreview';
import Challenges from './pages/Challenges';
import CommunityGallery from './pages/CommunityGallery';
import { CartProvider } from './contexts/CartContext';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('kolam');

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
    <CartProvider>
      <KolamBackground>
        <div className="App">
          <nav className="nav-header">
            <div className="nav-container">
              <h1 className="nav-title">🎨 Kolam AI Studio</h1>
              <div className="nav-buttons">
                <button 
                  onClick={() => setCurrentView('kolam')}
                  className={`nav-button ${currentView === 'kolam' ? 'active' : ''}`}
                >
                  Kolam AI
                </button>
                <button 
                  onClick={() => setCurrentView('occasions')}
                  className={`nav-button occasion-button ${currentView === 'occasions' ? 'active' : ''}`}
                  title="Browse traditional rangoli designs by occasion"
                >
                  🎉 Occasion Rangoli
                </button>
                <button 
                  onClick={() => setCurrentView('regional')}
                  className={`nav-button ${currentView === 'regional' ? 'active' : ''}`}
                  title="Explore regional kolam styles"
                >
                  🗺️ Regional Styles
                </button>
                <button 
                  onClick={() => setCurrentView('learn')}
                  className={`nav-button ${currentView === 'learn' ? 'active' : ''}`}
                  title="Interactive drawing tutorials"
                >
                  📚 Learn to Draw
                </button>
                <button 
                  onClick={() => setCurrentView('ar')}
                  className={`nav-button ${currentView === 'ar' ? 'active' : ''}`}
                  title="AR preview of your designs"
                >
                  📱 AR Preview
                </button>
                <button 
                  onClick={() => setCurrentView('challenges')}
                  className={`nav-button ${currentView === 'challenges' ? 'active' : ''}`}
                  title="Daily challenges and achievements"
                >
                  🏆 Challenges
                </button>
                <button 
                  onClick={() => setCurrentView('community')}
                  className={`nav-button ${currentView === 'community' ? 'active' : ''}`}
                  title="Community gallery and sharing"
                >
                  👥 Community
                </button>
                <button 
                  onClick={() => setCurrentView('mandala')}
                  className={`nav-button ${currentView === 'mandala' ? 'active' : ''}`}
                >
                  Mandala Coloring
                </button>
                <button 
                  onClick={() => setCurrentView('shop')}
                  className={`nav-button shop-button ${currentView === 'shop' ? 'active' : ''}`}
                  title="Shop Kolam art supplies"
                >
                  🛍️ Shop
                </button>
                <CartBadge 
                  onClick={() => setCurrentView('cart')}
                  className={`nav-button cart-button ${currentView === 'cart' ? 'active' : ''}`}
                />
              </div>
            </div>
          </nav>

          {currentView === 'shop' ? (
            <ShopPage />
          ) : currentView === 'cart' ? (
            <CartPage onBackToShop={() => setCurrentView('shop')} />
          ) : currentView === 'regional' ? (
            <RegionalStyles />
          ) : currentView === 'learn' ? (
            <LearnToDraw />
          ) : currentView === 'ar' ? (
            <ARPreview />
          ) : currentView === 'challenges' ? (
            <Challenges />
          ) : currentView === 'community' ? (
            <CommunityGallery />
          ) : currentView === 'occasions' ? (
            <OccasionRangoli />
          ) : currentView === 'mandala' ? (
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

              <AnimationDemo />
            </header>
          )}
        </div>
      </KolamBackground>
    </CartProvider>
  );
}

export default App;