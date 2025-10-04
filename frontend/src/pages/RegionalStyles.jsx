import React, { useState } from 'react';
import '../App.css';

const RegionalStyles = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filteredDesigns, setFilteredDesigns] = useState([]);

  const regionalData = {
    'Tamil Nadu': {
      description: 'Tamil Nadu Kolams are known for their intricate geometric patterns and use of rice powder. Traditional designs often feature dots and flowing lines.',
      designs: [
        {
          id: 1,
          name: 'Padi Kolam',
          image: '/api/placeholder/300/300',
          description: 'Traditional step-pattern Kolam using rice flour, symbolizing prosperity and abundance.'
        },
        {
          id: 2,
          name: 'Pulli Kolam',
          image: '/api/placeholder/300/300',
          description: 'Dot-based Kolam pattern representing the mathematical precision of Tamil culture.'
        },
        {
          id: 3,
          name: 'Navarathri Kolam',
          image: '/api/placeholder/300/300',
          description: 'Nine-night festival Kolam with elaborate designs honoring the Divine Feminine.'
        }
      ]
    },
    'Andhra Pradesh': {
      description: 'Andhra Pradesh Rangoli, known as Muggu, features vibrant colors and floral motifs. These designs often incorporate natural elements.',
      designs: [
        {
          id: 4,
          name: 'Sankranti Muggu',
          image: '/api/placeholder/300/300',
          description: 'Harvest festival Rangoli with sun motifs and geometric patterns celebrating agricultural abundance.'
        },
        {
          id: 5,
          name: 'Lotus Muggu',
          image: '/api/placeholder/300/300',
          description: 'Sacred lotus flower design symbolizing purity and spiritual awakening.'
        },
        {
          id: 6,
          name: 'Peacock Muggu',
          image: '/api/placeholder/300/300',
          description: 'Traditional peacock motif representing grace and beauty in Telugu culture.'
        }
      ]
    },
    'Karnataka': {
      description: 'Karnataka Rangoli patterns often feature symmetric designs with cultural significance, incorporating both traditional and modern elements.',
      designs: [
        {
          id: 7,
          name: 'Mysore Rangoli',
          image: '/api/placeholder/300/300',
          description: 'Royal palace-inspired designs with intricate geometric patterns.'
        },
        {
          id: 8,
          name: 'Ganesha Rangoli',
          image: '/api/placeholder/300/300',
          description: 'Lord Ganesha motif for auspicious occasions and festivals.'
        },
        {
          id: 9,
          name: 'Hoysala Rangoli',
          image: '/api/placeholder/300/300',
          description: 'Inspired by Hoysala architecture with temple motifs.'
        }
      ]
    },
    'Kerala': {
      description: 'Kerala Rangoli, known as Kolam or Alpona, features traditional motifs inspired by nature and maritime culture.',
      designs: [
        {
          id: 10,
          name: 'Onam Kolam',
          image: '/api/placeholder/300/300',
          description: 'Harvest festival design with floral patterns and traditional motifs.'
        },
        {
          id: 11,
          name: 'Boat Kolam',
          image: '/api/placeholder/300/300',
          description: 'Traditional boat motif representing Kerala maritime heritage.'
        },
        {
          id: 12,
          name: 'Coconut Tree Kolam',
          image: '/api/placeholder/300/300',
          description: 'Coconut palm design symbolizing prosperity and natural abundance.'
        }
      ]
    }
  };

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setFilteredDesigns(regionalData[region].designs);
    setShowModal(false);
  };

  const openRegionalModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const getAllDesigns = () => {
    return Object.values(regionalData).flatMap(region => region.designs);
  };

  return (
    <div className="regional-styles-container">
      {/* Header Section */}
      <div className="regional-header">
        <h1 className="regional-title">🗺️ Regional Kolam Styles</h1>
        <p className="regional-subtitle">
          Explore the rich diversity of Kolam traditions across different regions of India
        </p>
        
        {/* Filter Button */}
        <button 
          className="region-filter-btn"
          onClick={openRegionalModal}
        >
          🎯 Filter by Region
        </button>
        
        {selectedRegion && (
          <div className="selected-region-info">
            <h3>📍 {selectedRegion}</h3>
            <p>{regionalData[selectedRegion].description}</p>
            <button 
              className="clear-filter-btn"
              onClick={() => {
                setSelectedRegion(null);
                setFilteredDesigns([]);
              }}
            >
              ✖️ Clear Filter
            </button>
          </div>
        )}
      </div>

      {/* Designs Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '1.5rem',
        marginTop: '2rem',
        padding: '0 1rem'
      }}>
        {(filteredDesigns.length > 0 ? filteredDesigns : getAllDesigns()).map((design) => (
          <div key={design.id} className="design-card">
            <div className="design-image-container" style={{height: '300px', overflow: 'hidden'}}>
              <img 
                src={design.image} 
                alt={design.name}
                className="design-image"
                style={{width: '100%', height: '100%', objectFit: 'cover'}}
              />
            </div>
            <div className="design-info">
              <h3 className="design-name">{design.name}</h3>
              <p className="design-description">{design.description}</p>
              <div className="design-actions">
                <button className="action-btn primary">📥 Download</button>
                <button className="action-btn secondary">👁️ View Details</button>
                <button className="action-btn tertiary">📱 AR Preview</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Regional Selection Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🗺️ Select Region</h2>
              <button className="modal-close" onClick={closeModal}>✖️</button>
            </div>
            <div className="modal-body">
              <p className="modal-description">
                Choose a region to explore its unique Kolam traditions and designs
              </p>
              <div className="region-grid">
                {Object.keys(regionalData).map((region) => (
                  <button
                    key={region}
                    className="region-option"
                    onClick={() => handleRegionSelect(region)}
                  >
                    <div className="region-icon">
                      {region === 'Tamil Nadu' && '🏛️'}
                      {region === 'Andhra Pradesh' && '🌅'}
                      {region === 'Karnataka' && '🏰'}
                      {region === 'Kerala' && '🌴'}
                    </div>
                    <h3>{region}</h3>
                    <p>{regionalData[region].designs.length} designs</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionalStyles;