import React, { useState, useRef } from 'react';
import '../App.css';

const CommunityGallery = () => {
  const [selectedTab, setSelectedTab] = useState('gallery'); // 'gallery', 'upload'
  const [artworks, setArtworks] = useState([
    {
      id: 1,
      title: 'Diwali Festival Kolam',
      artist: 'Priya Sharma',
      location: 'Chennai, Tamil Nadu',
      likes: 127,
      shares: 23,
      image: '/api/placeholder/300/300',
      description: 'Traditional Diwali Kolam created with rice flour and turmeric. This design represents prosperity and welcoming Goddess Lakshmi.',
      tags: ['Diwali', 'Traditional', 'Rice Flour'],
      createdAt: '2 days ago'
    },
    {
      id: 2,
      title: 'Modern Geometric Mandala',
      artist: 'Raj Patel',
      location: 'Mumbai, Maharashtra',
      likes: 89,
      shares: 15,
      image: '/api/placeholder/300/300',
      description: 'Contemporary interpretation of traditional Rangoli using geometric patterns and vibrant colors.',
      tags: ['Modern', 'Geometric', 'Colorful'],
      createdAt: '5 days ago'
    },
    {
      id: 3,
      title: 'Peacock Kolam Masterpiece',
      artist: 'Sneha Reddy',
      location: 'Hyderabad, Andhra Pradesh',
      likes: 156,
      shares: 34,
      image: '/api/placeholder/300/300',
      description: 'Intricate peacock design symbolizing grace and beauty. Created for Saraswati Puja celebration.',
      tags: ['Peacock', 'Festival', 'Artistic'],
      createdAt: '1 week ago'
    },
    {
      id: 4,
      title: 'Lotus Temple Inspired',
      artist: 'Maya Singh',
      location: 'Bangalore, Karnataka',
      likes: 203,
      shares: 45,
      image: '/api/placeholder/300/300',
      description: 'Lotus flower Rangoli inspired by the architectural beauty of the Lotus Temple in Delhi.',
      tags: ['Lotus', 'Spiritual', 'Architecture'],
      createdAt: '1 week ago'
    },
    {
      id: 5,
      title: 'Rangoli Competition Winner',
      artist: 'Arjun Nair',
      location: 'Kochi, Kerala',
      likes: 312,
      shares: 67,
      image: '/api/placeholder/300/300',
      description: 'Award-winning design from the local Onam celebration. Features traditional Kerala boat race theme.',
      tags: ['Award Winner', 'Onam', 'Kerala'],
      createdAt: '2 weeks ago'
    },
    {
      id: 6,
      title: 'Children\'s Workshop Creation',
      artist: 'Classroom 5B',
      location: 'Delhi Public School',
      likes: 78,
      shares: 12,
      image: '/api/placeholder/300/300',
      description: 'Collaborative Kolam created by 25 students during art workshop. Each child contributed a section.',
      tags: ['Kids', 'Collaborative', 'Educational'],
      createdAt: '3 weeks ago'
    }
  ]);

  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    tags: '',
    location: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleLike = (artworkId) => {
    setArtworks(prev => prev.map(artwork => 
      artwork.id === artworkId 
        ? { ...artwork, likes: artwork.likes + 1 }
        : artwork
    ));
  };

  const handleShare = (artwork, platform) => {
    const shareText = `Check out this beautiful Kolam "${artwork.title}" by ${artwork.artist}!`;
    const shareUrl = `${window.location.origin}/artwork/${artwork.id}`;

    switch (platform) {
      case 'instagram':
        // Instagram sharing would typically require their API
        window.open(`https://www.instagram.com/`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      default:
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
    }

    // Update share count
    setArtworks(prev => prev.map(art => 
      art.id === artwork.id 
        ? { ...art, shares: art.shares + 1 }
        : art
    ));
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setUploadFile(file);
    } else {
      alert('Please select a valid image file.');
    }
  };

  const handleUploadSubmit = async (event) => {
    event.preventDefault();
    
    if (!uploadFile) {
      alert('Please select an image to upload.');
      return;
    }

    setIsUploading(true);

    // Simulate upload process
    setTimeout(() => {
      const newArtwork = {
        id: artworks.length + 1,
        title: uploadForm.title,
        artist: 'You', // In a real app, this would be the logged-in user
        location: uploadForm.location,
        likes: 0,
        shares: 0,
        image: URL.createObjectURL(uploadFile),
        description: uploadForm.description,
        tags: uploadForm.tags.split(',').map(tag => tag.trim()),
        createdAt: 'Just now'
      };

      setArtworks(prev => [newArtwork, ...prev]);
      
      // Reset form
      setUploadForm({ title: '', description: '', tags: '', location: '' });
      setUploadFile(null);
      setIsUploading(false);
      setSelectedTab('gallery');
      
      alert('Your artwork has been uploaded successfully!');
    }, 2000);
  };

  const ArtworkModal = ({ artwork, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-image">
          <img src={artwork.image} alt={artwork.title} />
        </div>
        
        <div className="modal-info">
          <h2>{artwork.title}</h2>
          <div className="artist-info">
            <span className="artist">by {artwork.artist}</span>
            <span className="location">📍 {artwork.location}</span>
            <span className="date">🕒 {artwork.createdAt}</span>
          </div>
          
          <p className="description">{artwork.description}</p>
          
          <div className="tags">
            {artwork.tags.map((tag, index) => (
              <span key={index} className="tag">#{tag}</span>
            ))}
          </div>
          
          <div className="modal-actions">
            <button 
              className="action-btn like"
              onClick={() => handleLike(artwork.id)}
            >
              ❤️ {artwork.likes}
            </button>
            
            <div className="share-buttons">
              <span>Share:</span>
              <button onClick={() => handleShare(artwork, 'instagram')}>📷</button>
              <button onClick={() => handleShare(artwork, 'whatsapp')}>💬</button>
              <button onClick={() => handleShare(artwork, 'facebook')}>📘</button>
              <button onClick={() => handleShare(artwork, 'copy')}>🔗</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const GalleryView = () => (
    <div className="gallery-content">
      <div className="gallery-header">
        <h2>🎨 Community Artworks</h2>
        <p>Discover beautiful Kolam and Rangoli creations from artists around the world</p>
      </div>

      <div className="gallery-filters">
        <button className="filter-btn active">All</button>
        <button className="filter-btn">Traditional</button>
        <button className="filter-btn">Modern</button>
        <button className="filter-btn">Festival</button>
        <button className="filter-btn">Regional</button>
      </div>

      <div className="artworks-grid">
        {artworks.map((artwork) => (
          <div key={artwork.id} className="artwork-card" onClick={() => setSelectedArtwork(artwork)}>
            <div className="artwork-image">
              <img src={artwork.image} alt={artwork.title} />
              <div className="artwork-overlay">
                <div className="artwork-stats">
                  <span>❤️ {artwork.likes}</span>
                  <span>📤 {artwork.shares}</span>
                </div>
              </div>
            </div>
            
            <div className="artwork-info">
              <h3>{artwork.title}</h3>
              <div className="artist-details">
                <span className="artist">by {artwork.artist}</span>
                <span className="location">📍 {artwork.location}</span>
              </div>
              <p className="artwork-description">{artwork.description}</p>
              
              <div className="artwork-actions">
                <button 
                  className="quick-like"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(artwork.id);
                  }}
                >
                  ❤️ {artwork.likes}
                </button>
                
                <div className="quick-share">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(artwork, 'whatsapp');
                    }}
                  >
                    💬 Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const UploadView = () => (
    <div className="upload-content">
      <div className="upload-header">
        <h2>📤 Share Your Creation</h2>
        <p>Upload your Kolam or Rangoli artwork to inspire others</p>
      </div>

      <form onSubmit={handleUploadSubmit} className="upload-form">
        <div className="form-group">
          <label>Upload Image</label>
          <div 
            className="file-upload-area"
            onClick={() => fileInputRef.current?.click()}
          >
            {uploadFile ? (
              <div className="file-preview">
                <img src={URL.createObjectURL(uploadFile)} alt="Preview" />
                <p>{uploadFile.name}</p>
              </div>
            ) : (
              <div className="upload-placeholder">
                <span className="upload-icon">📷</span>
                <p>Click to select an image</p>
                <p className="upload-hint">JPG, PNG, or GIF up to 10MB</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={uploadForm.title}
            onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Give your artwork a title..."
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={uploadForm.description}
            onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Tell us about your creation, inspiration, or technique..."
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>Tags</label>
          <input
            type="text"
            value={uploadForm.tags}
            onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
            placeholder="Diwali, Traditional, Colorful (separate with commas)"
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={uploadForm.location}
            onChange={(e) => setUploadForm(prev => ({ ...prev, location: e.target.value }))}
            placeholder="City, State"
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isUploading || !uploadFile}
        >
          {isUploading ? '⏳ Uploading...' : '🚀 Share with Community'}
        </button>
      </form>
    </div>
  );

  return (
    <div className="community-gallery-page">
      <header className="page-header">
        <h1>👥 Community Gallery</h1>
        <p>Share your creations and get inspired by the global Kolam community</p>
      </header>

      <div className="gallery-nav">
        <button 
          className={`nav-tab ${selectedTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setSelectedTab('gallery')}
        >
          🖼️ Gallery
        </button>
        <button 
          className={`nav-tab ${selectedTab === 'upload' ? 'active' : ''}`}
          onClick={() => setSelectedTab('upload')}
        >
          📤 Upload Your Art
        </button>
      </div>

      <div className="gallery-content-wrapper">
        {selectedTab === 'gallery' ? <GalleryView /> : <UploadView />}
      </div>

      {selectedArtwork && (
        <ArtworkModal 
          artwork={selectedArtwork} 
          onClose={() => setSelectedArtwork(null)} 
        />
      )}

      <style jsx>{`
        .community-gallery-page {
          min-height: 100vh;
          background: var(--bg-primary);
          padding: var(--spacing-lg);
        }

        .gallery-nav {
          display: flex;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-xl);
          border-bottom: 2px solid var(--border-subtle);
        }

        .nav-tab {
          padding: var(--spacing-md) var(--spacing-lg);
          border: none;
          background: none;
          color: var(--text-secondary);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all var(--transition-normal);
          font-size: 1rem;
          font-weight: 600;
        }

        .nav-tab.active {
          color: var(--accent-primary);
          border-bottom-color: var(--accent-primary);
        }

        .gallery-filters {
          display: flex;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-lg);
          justify-content: center;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: var(--spacing-sm) var(--spacing-lg);
          border: 2px solid var(--border-subtle);
          background: var(--bg-secondary);
          color: var(--text-primary);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all var(--transition-normal);
        }

        .filter-btn.active,
        .filter-btn:hover {
          border-color: var(--accent-primary);
          background: var(--accent-primary);
          color: white;
        }

        .artworks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--spacing-lg);
        }

        .artwork-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          overflow: hidden;
          cursor: pointer;
          transition: all var(--transition-normal);
          border: 2px solid transparent;
        }

        .artwork-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-hover);
          border-color: var(--accent-primary);
        }

        .artwork-image {
          position: relative;
          height: 250px;
          overflow: hidden;
        }

        .artwork-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-normal);
        }

        .artwork-card:hover .artwork-image img {
          transform: scale(1.05);
        }

        .artwork-overlay {
          position: absolute;
          top: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: var(--spacing-sm);
          border-radius: 0 0 0 var(--radius-md);
          opacity: 0;
          transition: opacity var(--transition-normal);
        }

        .artwork-card:hover .artwork-overlay {
          opacity: 1;
        }

        .artwork-stats {
          display: flex;
          gap: var(--spacing-sm);
          font-size: 0.875rem;
        }

        .artwork-info {
          padding: var(--spacing-lg);
        }

        .artist-details {
          display: flex;
          gap: var(--spacing-md);
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: var(--spacing-sm);
        }

        .artwork-description {
          font-size: 0.875rem;
          line-height: 1.5;
          margin-bottom: var(--spacing-md);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .artwork-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .quick-like,
        .quick-share button {
          padding: var(--spacing-xs) var(--spacing-sm);
          border: none;
          border-radius: var(--radius-md);
          background: var(--bg-tertiary);
          color: var(--text-primary);
          cursor: pointer;
          transition: all var(--transition-normal);
          font-size: 0.875rem;
        }

        .quick-like:hover,
        .quick-share button:hover {
          background: var(--accent-primary);
          color: white;
        }

        .upload-form {
          max-width: 600px;
          margin: 0 auto;
          background: var(--bg-secondary);
          padding: var(--spacing-xl);
          border-radius: var(--radius-lg);
        }

        .form-group {
          margin-bottom: var(--spacing-lg);
        }

        .form-group label {
          display: block;
          margin-bottom: var(--spacing-sm);
          font-weight: 600;
          color: var(--text-primary);
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: var(--spacing-md);
          border: 2px solid var(--border-subtle);
          border-radius: var(--radius-md);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 1rem;
          transition: border-color var(--transition-normal);
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--accent-primary);
        }

        .file-upload-area {
          border: 2px dashed var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
          text-align: center;
          cursor: pointer;
          transition: all var(--transition-normal);
          background: var(--bg-primary);
        }

        .file-upload-area:hover {
          border-color: var(--accent-primary);
          background: var(--bg-tertiary);
        }

        .file-preview img {
          max-width: 200px;
          max-height: 200px;
          object-fit: cover;
          border-radius: var(--radius-md);
          margin-bottom: var(--spacing-sm);
        }

        .upload-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: var(--spacing-md);
        }

        .upload-hint {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .submit-btn {
          width: 100%;
          padding: var(--spacing-lg);
          border: none;
          border-radius: var(--radius-lg);
          background: var(--accent-primary);
          color: white;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all var(--transition-normal);
        }

        .submit-btn:hover:not(:disabled) {
          background: var(--accent-hover);
          transform: translateY(-2px);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .modal-overlay {
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
          padding: var(--spacing-lg);
        }

        .modal-content {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: var(--spacing-md);
          right: var(--spacing-md);
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          font-size: 1.5rem;
          cursor: pointer;
          z-index: 10;
        }

        .modal-image img {
          width: 100%;
          height: 400px;
          object-fit: cover;
        }

        .modal-info {
          padding: var(--spacing-xl);
        }

        .tags {
          display: flex;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
          margin: var(--spacing-lg) 0;
        }

        .tag {
          background: var(--accent-primary);
          color: white;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
        }

        .modal-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--border-subtle);
        }

        .share-buttons {
          display: flex;
          gap: var(--spacing-sm);
          align-items: center;
        }

        .share-buttons button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: var(--spacing-xs);
          border-radius: var(--radius-md);
          transition: background var(--transition-normal);
        }

        .share-buttons button:hover {
          background: var(--bg-tertiary);
        }
      `}</style>
    </div>
  );
};

export default CommunityGallery;