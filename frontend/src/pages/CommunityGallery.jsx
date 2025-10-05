import React, { useState, useRef } from 'react';
import { COMMUNITY_POSTS, getFeaturedPosts, getMostLikedPosts, getRecentPosts } from '../data/products.js';
import '../App.css';

const CommunityGallery = () => {
  const [selectedTab, setSelectedTab] = useState('gallery');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showComments, setShowComments] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]); // For session-only uploads
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    tags: '',
    image: null
  });
  const fileInputRef = useRef(null);

  // Handle community upload
  const handleCommunityUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const newUpload = {
        id: Date.now(), // Simple ID for session
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        artist: 'You',
        location: 'Your Location',
        likes: 0,
        shares: 0,
        liked: false,
        image: imageUrl,
        description: 'Uploaded from your device',
        tags: ['New Upload'],
        createdAt: 'Just now',
        comments: []
      };
      
      // Add to the beginning of artworks array
      setArtworks(prev => [newUpload, ...prev]);
    }
  };

  // Transform community posts to match component structure
  const transformCommunityPosts = () => {
    return COMMUNITY_POSTS.map(post => ({
      id: post.id,
      title: post.title,
      artist: post.author,
      location: post.location,
      likes: post.likes,
      shares: post.shares,
      liked: false,
      image: post.image,
      description: post.description,
      tags: post.hashtags.map(tag => tag.replace('#', '')),
      createdAt: post.timeAgo,
      comments: [
        { id: 1, user: 'Community Member', comment: 'Beautiful work!', time: '1 hour ago' },
        { id: 2, user: 'Art Lover', comment: 'Love the traditional style 😊', time: '30 minutes ago' }
      ]
    }));
  };

  const [artworks, setArtworks] = useState(() => {
    // Start with transformed community posts, then add the existing hardcoded ones
    const communityArtworks = transformCommunityPosts();
    const existingArtworks = [
    {
      id: 104,
      title: 'Ganesh Chaturthi Splendor',
      artist: 'Ananya Rao',
      location: 'Pune, Maharashtra',
      likes: 215,
      shares: 18,
      liked: false,
      image: 'IMG-20251003-WA0004.jpg',
      description: 'A stunning Ganesh rangoli meticulously crafted with colored rice and diyas, celebrating the auspicious festival.',
      tags: ['GaneshChaturthi', 'RangoliArt', 'FestivalVibes', 'EcoFriendly'],
      createdAt: '4 days ago',
      comments: [
        { id: 1, user: 'Rohit Gupta', comment: 'What a beautiful tribute to Lord Ganesha!', time: '3 days ago' },
        { id: 2, user: 'Kavya Nair', comment: 'The colors are so vibrant! 🌈', time: '2 days ago' }
      ]
    },
    {
      id: 105,
      title: 'Vibrant Kalash Rangoli',
      artist: 'Ishika Verma',
      location: 'Jaipur, Rajasthan',
      likes: 188,
      shares: 22,
      liked: false,
      image: 'IMG-20251003-WA0005.jpg',
      description: 'A vibrant and colorful rangoli featuring a traditional Kalash, symbolizing prosperity and welcome.',
      tags: ['Diwali', 'Colorful', 'TraditionalArt', 'Kalash'],
      createdAt: '5 days ago',
      comments: [
        { id: 1, user: 'Arjun Singh', comment: 'Perfect for welcoming guests during festivals!', time: '4 days ago' },
        { id: 2, user: 'Neha Jain', comment: 'The symmetry is incredible!', time: '3 days ago' }
      ]
    },
    {
      id: 106,
      title: 'Intricate Mandala Design',
      artist: 'Aarav Shah',
      location: 'Ahmedabad, Gujarat',
      likes: 350,
      shares: 40,
      liked: true,
      image: 'IMG-20251003-WA0006.jpg',
      description: 'An exceptionally detailed hand-painted mandala, showcasing precision and symmetry in red and white.',
      tags: ['Mandala', 'IntricateArt', 'HandPainted', 'Meditation'],
      createdAt: '1 week ago',
      comments: [
        { id: 1, user: 'Sonia Rao', comment: 'This must have taken hours! Amazing patience.', time: '6 days ago' },
        { id: 2, user: 'Dev Patel', comment: 'Perfect for meditation and focus 🧘‍♂️', time: '5 days ago' },
        { id: 3, user: 'Aarav Shah', comment: '@Sonia Actually took me 4 hours with breaks!', time: '5 days ago' }
      ]
    },
    {
      id: 107,
      title: 'Festival of Lights Lotus Kolam',
      artist: 'Jyothi Sridhar',
      location: 'Bengaluru, Karnataka',
      likes: 412,
      shares: 55,
      liked: false,
      image: 'IMG-20251003-WA0007.jpg',
      description: 'A radiant Kolam celebrating the festival of lights with beautiful lotus motifs and glowing diyas.',
      tags: ['Diwali', 'Kolam', 'LotusDesign', 'Deepavali'],
      createdAt: '1 week ago',
      comments: [
        { id: 1, user: 'Ravi Kumar', comment: 'The lotus petals look so realistic!', time: '6 days ago' },
        { id: 2, user: 'Yamini Reddy', comment: 'Perfect for Deepavali celebrations 🪔', time: '5 days ago' },
        { id: 3, user: 'Suresh Babu', comment: 'Traditional techniques with modern appeal!', time: '4 days ago' }
      ]
    },
    {
      id: 108,
      title: 'Onam Pookalam Masterpiece',
      artist: 'Arjun Nair',
      location: 'Kochi, Kerala',
      likes: 520,
      shares: 72,
      liked: true,
      image: 'IMG-20251003-WA0008.jpg',
      description: 'A magnificent peacock pookalam made entirely of fresh flower petals to celebrate the harvest festival of Onam.',
      tags: ['Onam', 'Pookalam', 'FlowerArt', 'KeralaTradition'],
      createdAt: '2 weeks ago',
      comments: [
        { id: 1, user: 'Maya Pillai', comment: 'Absolutely stunning! The peacock is so detailed 🦚', time: '1 week ago' },
        { id: 2, user: 'Vineeth George', comment: 'This brings back memories of Onam in Kerala', time: '1 week ago' },
        { id: 3, user: 'Lakshmi Nair', comment: 'Beautiful use of fresh flowers!', time: '6 days ago' }
      ]
    },
    {
      id: 109,
      title: 'Traditional Sikku Kolam',
      artist: 'Kasturi.V',
      location: 'Madurai, Tamil Nadu',
      likes: 290,
      shares: 35,
      liked: false,
      image: 'IMG-20251003-WA0010.jpg',
      description: 'A classic \'Sikku\' or \'Chikku\' Kolam, known for its intricate, looping lines drawn with rice flour.',
      tags: ['SikkuKolam', 'Traditional', 'TamilNadu', 'LineArt'],
      createdAt: '3 weeks ago',
      comments: [
        { id: 1, user: 'Kamala Devi', comment: 'Such precise lines! True Tamil tradition 🙏', time: '2 weeks ago' },
        { id: 2, user: 'Gopal Krishnan', comment: 'My grandmother used to make these every morning', time: '2 weeks ago' },
        { id: 3, user: 'Kasturi.V', comment: 'Thank you! It\'s an art passed down generations', time: '1 week ago' }
      ]
    }
    ];
    
    // Combine community posts (which should appear first) with existing artworks
    return [...communityArtworks, ...existingArtworks];
  });

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

      <div className="artworks-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '1.5rem',
        '@media (max-width: 768px)': {
          gridTemplateColumns: '1fr',
          gap: '1rem'
        }
      }}>
        {artworks.map((artwork) => (
          <div key={artwork.id} style={{
            background: 'white',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              position: 'relative',
              overflow: 'hidden',
              height: '300px',
              flex: 'none'
            }}>
              <img 
                src={artwork.image} 
                alt={artwork.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease'
                }}
              />
            </div>
            
            <div style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              flex: '1',
              minHeight: '280px'
            }}>
              <div style={{
                marginBottom: '1rem',
                height: '4rem'
              }}>
                <h3 style={{
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '0.5rem',
                  height: '1.5rem',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  fontSize: '1.125rem'
                }}>{artwork.title}</h3>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  height: '2rem'
                }}>
                  <span style={{display: 'block'}}>by {artwork.artist}</span>
                  <span>📍 {artwork.location}</span>
                </div>
              </div>
              
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                marginBottom: '1rem',
                height: '3rem',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: '1.5rem'
              }}>{artwork.description}</p>
              
              <div style={{
                marginBottom: '1rem',
                height: '2rem',
                overflow: 'hidden'
              }}>
                {artwork.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} style={{
                    background: '#f3f4f6',
                    color: '#6b7280',
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.375rem',
                    marginRight: '0.5rem',
                    display: 'inline-block'
                  }}>#{tag}</span>
                ))}
              </div>
              
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginTop: 'auto',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <button 
                  onClick={() => handleLike(artwork.id)}
                  style={{
                    background: '#f3f4f6',
                    color: '#6b7280',
                    fontWeight: '600',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <span style={{
                    color: artwork.liked ? '#ef4444' : '#6b7280',
                    transition: 'color 0.3s ease'
                  }}>{artwork.liked ? '❤️' : '🤍'}</span>
                  {artwork.likes}
                </button>
                
                <button 
                  onClick={() => setShowComments(showComments === artwork.id ? null : artwork.id)}
                  style={{
                    background: '#6b7280',
                    color: 'white',
                    fontWeight: '600',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  💬 {artwork.comments.length}
                </button>
                
                <button 
                  onClick={() => handleShare(artwork)}
                  style={{
                    background: 'linear-gradient(to right, #f97316, #9333ea)',
                    color: 'white',
                    fontWeight: '600',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  📤 {artwork.shares}
                </button>
                
                <span style={{
                  fontSize: '0.75rem',
                  color: '#9ca3af',
                  marginLeft: 'auto'
                }}>{artwork.createdAt}</span>
              </div>
              
              {showComments === artwork.id && (
                <div className="comments-section">
                  <div className="comments-list">
                    {artwork.comments.map((comment) => (
                      <div key={comment.id} className="comment">
                        <div className="comment-header">
                          <span className="comment-user" style={{color: '#000000', fontWeight: '600'}}>{comment.user}</span>
                          <span className="comment-time" style={{color: '#333333'}}>{comment.time}</span>
                        </div>
                        <p className="comment-text" style={{color: '#000000', margin: '0'}}>{comment.comment}</p>
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
      <style>{`
        @media (max-width: 1200px) {
          .artworks-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .artworks-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }
      `}</style>
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