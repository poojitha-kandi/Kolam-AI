import React, { useState, useRef } from 'react';
import '../App.css';

const CommunityGallery = () => {
  const [selectedTab, setSelectedTab] = useState('gallery');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showComments, setShowComments] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    tags: '',
    image: null
  });
  const fileInputRef = useRef(null);

  const [artworks, setArtworks] = useState([
    {
      id: 1,
      title: 'Diwali Festival Kolam',
      artist: 'Priya Sharma',
      location: 'Chennai, Tamil Nadu',
      likes: 127,
      shares: 23,
      liked: false,
      image: '/api/placeholder/300/300',
      description: 'Traditional Diwali Kolam created with rice flour and turmeric. This design represents prosperity and welcoming Goddess Lakshmi.',
      tags: ['Diwali', 'Traditional', 'Rice Flour'],
      createdAt: '2 days ago',
      comments: [
        { id: 1, user: 'Anita Kumar', comment: 'Beautiful work! Love the traditional approach.', time: '1 day ago' },
        { id: 2, user: 'Ravi Iyer', comment: 'This brings back childhood memories 😊', time: '2 hours ago' }
      ]
    },
    {
      id: 2,
      title: 'Modern Geometric Mandala',
      artist: 'Raj Patel',
      location: 'Mumbai, Maharashtra',
      likes: 89,
      shares: 15,
      liked: true,
      image: '/api/placeholder/300/300',
      description: 'Contemporary interpretation of traditional Rangoli using geometric patterns and vibrant colors.',
      tags: ['Modern', 'Geometric', 'Colorful'],
      createdAt: '5 days ago',
      comments: [
        { id: 1, user: 'Meera Singh', comment: 'Love the modern twist on traditional art!', time: '3 days ago' }
      ]
    },
    {
      id: 3,
      title: 'Peacock Kolam Masterpiece',
      artist: 'Sneha Reddy',
      location: 'Hyderabad, Andhra Pradesh',
      likes: 156,
      shares: 34,
      liked: false,
      image: '/api/placeholder/300/300',
      description: 'Intricate peacock design symbolizing grace and beauty. Created for Saraswati Puja celebration.',
      tags: ['Peacock', 'Festival', 'Artistic'],
      createdAt: '1 week ago',
      comments: [
        { id: 1, user: 'Vikram Kumar', comment: 'Absolutely stunning detail work!', time: '6 days ago' },
        { id: 2, user: 'Deepika Joshi', comment: 'How long did this take to create?', time: '5 days ago' },
        { id: 3, user: 'Sneha Reddy', comment: '@Deepika About 3 hours with careful planning', time: '4 days ago' }
      ]
    }
  ]);

  const handleLike = (artworkId) => {
    setArtworks(prev => prev.map(artwork => 
      artwork.id === artworkId 
        ? { 
            ...artwork, 
            liked: !artwork.liked,
            likes: artwork.liked ? artwork.likes - 1 : artwork.likes + 1
          }
        : artwork
    ));
  };

  const handleShare = (artwork) => {
    if (navigator.share) {
      navigator.share({
        title: artwork.title,
        text: artwork.description,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(
        `Check out this amazing Kolam: "${artwork.title}" by ${artwork.artist}`
      );
      alert('Link copied to clipboard!');
    }
  };

  const handleAddComment = (artworkId) => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      user: 'You',
      comment: newComment,
      time: 'Just now'
    };

    setArtworks(prev => prev.map(artwork => 
      artwork.id === artworkId 
        ? { ...artwork, comments: [...artwork.comments, comment] }
        : artwork
    ));
    
    setNewComment('');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewPost(prev => ({ ...prev, image: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostSubmit = () => {
    if (!newPost.title || !newPost.image) {
      alert('Please provide a title and image for your post');
      return;
    }

    const post = {
      id: Date.now(),
      title: newPost.title,
      artist: 'You',
      location: 'Your Location',
      likes: 0,
      shares: 0,
      liked: false,
      image: newPost.image,
      description: newPost.description,
      tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: 'Just now',
      comments: []
    };

    setArtworks(prev => [post, ...prev]);
    setNewPost({ title: '', description: '', tags: '', image: null });
    setShowUploadModal(false);
    alert('Your Kolam has been shared with the community! 🎉');
  };

  const renderGallery = () => (
    <div className="gallery-container">
      <div className="gallery-header">
        <h1>👥 Community Gallery</h1>
        <p>Discover and share beautiful Kolam creations from artists around the world</p>
      </div>

      <div className="artworks-grid">
        {artworks.map((artwork) => (
          <div key={artwork.id} className="artwork-card">
            <div className="artwork-image-container">
              <img 
                src={artwork.image} 
                alt={artwork.title}
                className="artwork-image"
              />
            </div>
            
            <div className="artwork-content">
              <div className="artwork-header">
                <h3 className="artwork-title">{artwork.title}</h3>
                <div className="artist-info">
                  <span className="artist-name">by {artwork.artist}</span>
                  <span className="artist-location">📍 {artwork.location}</span>
                </div>
              </div>
              
              <p className="artwork-description">{artwork.description}</p>
              
              <div className="artwork-tags">
                {artwork.tags.map((tag, index) => (
                  <span key={index} className="tag">#{tag}</span>
                ))}
              </div>
              
              <div className="artwork-actions">
                <button 
                  className={`action-btn like ${artwork.liked ? 'liked' : ''}`}
                  onClick={() => handleLike(artwork.id)}
                >
                  {artwork.liked ? '❤️' : '🤍'} {artwork.likes}
                </button>
                
                <button 
                  className="action-btn comment"
                  onClick={() => setShowComments(showComments === artwork.id ? null : artwork.id)}
                >
                  💬 {artwork.comments.length}
                </button>
                
                <button 
                  className="action-btn share"
                  onClick={() => handleShare(artwork)}
                >
                  📤 {artwork.shares}
                </button>
                
                <span className="artwork-time">{artwork.createdAt}</span>
              </div>
              
              {showComments === artwork.id && (
                <div className="comments-section">
                  <div className="comments-list">
                    {artwork.comments.map((comment) => (
                      <div key={comment.id} className="comment">
                        <div className="comment-header">
                          <span className="comment-user">{comment.user}</span>
                          <span className="comment-time">{comment.time}</span>
                        </div>
                        <p className="comment-text">{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="add-comment">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="comment-input"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(artwork.id)}
                    />
                    <button 
                      className="comment-submit"
                      onClick={() => handleAddComment(artwork.id)}
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="community-container">
      {renderGallery()}
      
      {/* Floating Upload Button */}
      <button 
        className="floating-upload-btn"
        onClick={() => setShowUploadModal(true)}
        title="Share your Kolam"
      >
        ➕
      </button>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📤 Share Your Kolam</h2>
              <button className="modal-close" onClick={() => setShowUploadModal(false)}>✖️</button>
            </div>
            
            <div className="modal-body">
              <div className="upload-form">
                <div className="form-group">
                  <label htmlFor="title">Title *</label>
                  <input
                    type="text"
                    id="title"
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Give your Kolam a title..."
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={newPost.description}
                    onChange={(e) => setNewPost(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Tell us about your Kolam creation..."
                    className="form-textarea"
                    rows="3"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="tags">Tags</label>
                  <input
                    type="text"
                    id="tags"
                    value={newPost.tags}
                    onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="e.g., Traditional, Diwali, Geometric (separated by commas)"
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Image *</label>
                  <div className="image-upload-area">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    
                    {newPost.image ? (
                      <div className="uploaded-image-preview">
                        <img src={newPost.image} alt="Preview" className="preview-image" />
                        <button 
                          className="change-image-btn"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Change Image
                        </button>
                      </div>
                    ) : (
                      <div 
                        className="upload-placeholder"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="upload-icon">📷</div>
                        <p>Click to upload your Kolam image</p>
                        <span className="upload-hint">JPG, PNG up to 10MB</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="form-actions">
                  <button 
                    className="submit-btn"
                    onClick={handlePostSubmit}
                    disabled={!newPost.title || !newPost.image}
                  >
                    🎨 Share Kolam
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={() => {
                      setNewPost({ title: '', description: '', tags: '', image: null });
                      setShowUploadModal(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityGallery;