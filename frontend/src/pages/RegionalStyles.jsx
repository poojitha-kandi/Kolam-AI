import React, { useState } from 'react';
import '../App.css';

const RegionalStyles = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);

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
    'Maharashtra': {
      description: 'Maharashtrian Rangoli is characterized by bold patterns and use of colored powders. Often features religious symbols and motifs.',
      designs: [
        {
          id: 7,
          name: 'Ganpati Rangoli',
          image: '/api/placeholder/300/300',
          description: 'Lord Ganesha inspired design for festivals, bringing good fortune and removing obstacles.'
        },
        {
          id: 8,
          name: 'Shankh Rangoli',
          image: '/api/placeholder/300/300',
          description: 'Conch shell pattern symbolizing divine sound and spiritual awakening.'
        },
        {
          id: 9,
          name: 'Swastik Rangoli',
          image: '/api/placeholder/300/300',
          description: 'Ancient symbol of good fortune and prosperity in Marathi tradition.'
        }
      ]
    },
    'Gujarat': {
      description: 'Gujarati Rangoli features vibrant mirror work and intricate patterns. Known for their festive colors and celebratory themes.',
      designs: [
        {
          id: 10,
          name: 'Navratri Rangoli',
          image: '/api/placeholder/300/300',
          description: 'Nine-night festival design with dancing figures and geometric patterns.'
        },
        {
          id: 11,
          name: 'Mirror Work Rangoli',
          image: '/api/placeholder/300/300',
          description: 'Traditional Gujarati style with embedded mirror pieces reflecting light beautifully.'
        },
        {
          id: 12,
          name: 'Garba Circle Rangoli',
          image: '/api/placeholder/300/300',
          description: 'Circular design inspired by traditional Garba dance formations.'
        }
      ]
    },
    'Kerala': {
      description: 'Kerala Rangoli, known as Kolam or Pookalam, often uses flower petals and natural colors. Designs are inspired by nature.',
      designs: [
        {
          id: 13,
          name: 'Onam Pookalam',
          image: '/api/placeholder/300/300',
          description: 'Flower carpet design for Onam festival using colorful flower petals in circular patterns.'
        },
        {
          id: 14,
          name: 'Thiruvathira Kolam',
          image: '/api/placeholder/300/300',
          description: 'Women\'s festival design with intricate geometric patterns and floral borders.'
        },
        {
          id: 15,
          name: 'Boat Race Kolam',
          image: '/api/placeholder/300/300',
          description: 'Snake boat inspired design celebrating Kerala\'s famous boat races.'
        }
      ]
    },
    'Rajasthan': {
      description: 'Rajasthani Rangoli features bold desert colors and royal motifs. Often includes peacock and camel designs.',
      designs: [
        {
          id: 16,
          name: 'Desert Bloom Rangoli',
          image: '/api/placeholder/300/300',
          description: 'Desert flower motifs in warm colors representing the beauty of Rajasthani landscape.'
        },
        {
          id: 17,
          name: 'Rajasthani Mandala',
          image: '/api/placeholder/300/300',
          description: 'Royal circular design with intricate patterns inspired by palace architecture.'
        },
        {
          id: 18,
          name: 'Camel Caravan Rangoli',
          image: '/api/placeholder/300/300',
          description: 'Traditional desert caravan scene in vibrant Rangoli form.'
        }
      ]
    }
  };

  const regions = Object.keys(regionalData);

  return (
    <div className="regional-styles-page">
      <header className="page-header">
        <h1>🗺️ Regional Kolam & Rangoli Styles</h1>
        <p>Explore the diverse traditional art forms across different Indian states</p>
      </header>

      <div className="regional-content">
        {!selectedRegion ? (
          <div className="regions-grid">
            {regions.map((region) => (
              <div 
                key={region}
                className="region-card"
                onClick={() => setSelectedRegion(region)}
              >
                <div className="region-card-header">
                  <h3>{region}</h3>
                </div>
                <div className="region-description">
                  <p>{regionalData[region].description}</p>
                </div>
                <div className="region-preview">
                  <div className="preview-grid">
                    {regionalData[region].designs.slice(0, 3).map((design) => (
                      <div key={design.id} className="preview-item">
                        <img src={design.image} alt={design.name} />
                      </div>
                    ))}
                  </div>
                </div>
                <button className="explore-btn">
                  Explore {region} Styles →
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="region-detail">
            <div className="region-detail-header">
              <button 
                className="back-btn"
                onClick={() => setSelectedRegion(null)}
              >
                ← Back to Regions
              </button>
              <h2>{selectedRegion} Kolam Styles</h2>
              <p>{regionalData[selectedRegion].description}</p>
            </div>

            <div className="designs-gallery">
              {regionalData[selectedRegion].designs.map((design) => (
                <div key={design.id} className="design-card">
                  <div className="design-image">
                    <img src={design.image} alt={design.name} />
                  </div>
                  <div className="design-info">
                    <h4>{design.name}</h4>
                    <p>{design.description}</p>
                    <div className="design-actions">
                      <button className="action-btn primary">
                        📱 Try in AR
                      </button>
                      <button className="action-btn secondary">
                        🎨 Learn to Draw
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionalStyles;