import React, { useState } from 'react';
import './App.css';
import AnimationDemo from './components/AnimationDemo';
import MandalaColoring from './components/MandalaColoring';
import KolamBackground from './components/KolamBackground';
import OccasionRangoli from './pages/OccasionRangoli';
impor        </div>
      </KolamBackground>
    </KolamBackground>
  );
}

export default App;Page from './components/ShopPage';
import CartPage from './components/CartPage';
import CartBadge from './components/CartBadge';
import RegionalStyles from './pages/RegionalStyles';
import LearnToDraw from './pages/LearnToDraw';
import ARPreview from './pages/ARPreview';
import Challenges from './pages/Challenges';
import CommunityGallery from './pages/CommunityGallery';
import AnimatedLogin from './components/AnimatedLogin';
import UserProfile from './components/UserProfile';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('kolam');
  const [showLogin, setShowLogin] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <AppContent 
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          uploading={uploading}
          setUploading={setUploading}
          result={result}
          setResult={setResult}
          error={error}
          setError={setError}
          currentView={currentView}
          setCurrentView={setCurrentView}
          showLogin={showLogin}
          setShowLogin={setShowLogin}
        />
      </CartProvider>
    </AuthProvider>
  );
}

function AppContent({ 
  selectedFile, setSelectedFile, uploading, setUploading, 
  result, setResult, error, setError, currentView, setCurrentView,
  showLogin, setShowLogin 
}) {
  const { isAuthenticated, login } = useAuth();

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
      <style>{`
        @media (max-width: 900px) {
          .nav-buttons {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 0.5rem !important;
            width: 100% !important;
          }
        }
        @media (max-width: 768px) {
          .nav-buttons {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .nav-buttons {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <div className="App">
        <nav className="nav-header" style={{background: 'rgba(45, 55, 72, 0.8)', padding: '1rem 0'}}>
          <div className="nav-container">
            <h1 className="nav-title">🎨 Kolam AI Studio</h1>
            <div className="nav-buttons" style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'}}>
              <button 
                onClick={() => setCurrentView('kolam')}
                className={`nav-button ${currentView === 'kolam' ? 'active' : ''}`}
                style={{fontSize: '0.7rem', padding: '0.25rem 0.75rem', minWidth: '70px'}}
              >
                Kolam AI
              </button>
              <button 
                onClick={() => setCurrentView('occasions')}
                className={`nav-button occasion-button ${currentView === 'occasions' ? 'active' : ''}`}
                title="Browse traditional rangoli designs by occasion"
                style={{fontSize: '0.7rem', padding: '0.25rem 0.75rem', minWidth: '70px'}}
              >
                🎉 Occasion Rangoli
              </button>
              <button 
                onClick={() => setCurrentView('regional')}
                className={`nav-button ${currentView === 'regional' ? 'active' : ''}`}
                title="Explore regional kolam styles"
                style={{fontSize: '0.7rem', padding: '0.25rem 0.75rem', minWidth: '70px'}}
              >
                🗺️ Regional Styles
              </button>
              <button 
                onClick={() => setCurrentView('learn')}
                className={`nav-button ${currentView === 'learn' ? 'active' : ''}`}
                title="Interactive drawing tutorials"
                style={{fontSize: '0.7rem', padding: '0.25rem 0.75rem', minWidth: '70px'}}
              >
                📚 Learn to Draw
              </button>
              <button 
                onClick={() => setCurrentView('ar')}
                className={`nav-button ${currentView === 'ar' ? 'active' : ''}`}
                title="AR preview of your designs"
                style={{fontSize: '0.7rem', padding: '0.25rem 0.75rem', minWidth: '70px'}}
              >
                📱 AR Preview
              </button>
              <button 
                onClick={() => setCurrentView('challenges')}
                className={`nav-button ${currentView === 'challenges' ? 'active' : ''}`}
                title="Daily challenges and achievements"
                style={{fontSize: '0.7rem', padding: '0.25rem 0.75rem', minWidth: '70px'}}
              >
                🏆 Challenges
              </button>
              <button 
                onClick={() => setCurrentView('community')}
                className={`nav-button ${currentView === 'community' ? 'active' : ''}`}
                title="Community gallery and sharing"
                style={{fontSize: '0.7rem', padding: '0.25rem 0.75rem', minWidth: '70px'}}
              >
                👥 Community
              </button>
              <button 
                onClick={() => setCurrentView('mandala')}
                className={`nav-button ${currentView === 'mandala' ? 'active' : ''}`}
                style={{fontSize: '0.7rem', padding: '0.25rem 0.75rem', minWidth: '70px'}}
              >
                Mandala Coloring
              </button>
              <button 
                onClick={() => setCurrentView('shop')}
                className={`nav-button shop-button ${currentView === 'shop' ? 'active' : ''}`}
                title="Shop Kolam art supplies"
                style={{fontSize: '0.7rem', padding: '0.25rem 0.75rem', minWidth: '70px'}}
              >
                🛍️ Shop
              </button>
              <CartBadge 
                onClick={() => setCurrentView('cart')}
                className={`nav-button cart-button ${currentView === 'cart' ? 'active' : ''}`}
                style={{fontSize: '0.7rem', padding: '0.25rem 0.75rem', minWidth: '70px'}}
              />
              
              {/* Authentication Section */}
              <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px'}}>
                {isAuthenticated ? (
                  <UserProfile />
                ) : (
                  <button 
                    onClick={() => setShowLogin(true)}
                    className="nav-button login-button"
                    style={{fontSize: '0.7rem', padding: '0.25rem 0.75rem', minWidth: '70px'}}
                  >
                    🔐 Login
                  </button>
                )}
              </div>
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
        
        {/* Animated Login Modal */}
        {showLogin && (
          <AnimatedLogin 
            onLogin={(userData) => {
              login(userData);
              setShowLogin(false);
            }}
            onClose={() => setShowLogin(false)}
          />
        )}
      </div>
    </KolamBackground>
  );
}

export default App;