import React, { useState, useEffect } from 'react';
import './KolamTypesGrid.css';

const KolamTypesGrid = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Default example items if no props provided
  const defaultItems = [
    {
      id: 1,
      src: '/public/kolam-types/original-kolam.jpg',
      alt: 'Original traditional kolam pattern',
      title: 'Original Image'
    },
    {
      id: 2,
      src: '/public/kolam-types/grayscale-kolam.jpg',
      alt: 'Grayscale processed kolam pattern',
      title: 'Grayscale'
    },
    {
      id: 3,
      src: '/public/kolam-types/detected-dots.jpg',
      alt: 'Kolam with detected dot points highlighted',
      title: 'Detected Dots (11)'
    },
    {
      id: 4,
      src: '/public/kolam-types/skeleton-pattern.jpg',
      alt: 'Mathematical skeleton pattern of kolam',
      title: 'Skeleton Pattern'
    },
    {
      id: 5,
      src: '/public/kolam-types/mathematical-curves.jpg',
      alt: 'Mathematical curves representation of kolam',
      title: 'Mathematical Curves'
    },
    {
      id: 6,
      src: '/public/kolam-types/enhanced-recreation.jpg',
      alt: 'AI enhanced recreation of kolam pattern',
      title: 'Enhanced Recreation'
    }
  ];

  const displayItems = items || defaultItems;

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const handleKeyDown = (event, item) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModal(item);
    }
  };

  const handleModalKeyDown = (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('keydown', handleModalKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.removeEventListener('keydown', handleModalKeyDown);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleModalKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <>
      <div className="kolam-types-container">
        <div className="kolam-types-grid">
          {displayItems.map((item) => (
            <div
              key={item.id}
              className="kolam-card"
              tabIndex="0"
              role="button"
              aria-label={`View ${item.title} in fullscreen`}
              onClick={() => openModal(item)}
              onKeyDown={(e) => handleKeyDown(e, item)}
            >
              <div className="kolam-image-wrapper">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="kolam-image"
                  loading="lazy"
                />
              </div>
              <div className="kolam-caption">
                <h3 className="kolam-title">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal/Lightbox */}
      {isModalOpen && selectedItem && (
        <div className="kolam-modal-overlay" onClick={closeModal}>
          <div className="kolam-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="kolam-modal-close"
              onClick={closeModal}
              aria-label="Close modal"
            >
              ×
            </button>
            <div className="kolam-modal-image-wrapper">
              <img
                src={selectedItem.src}
                alt={selectedItem.alt}
                className="kolam-modal-image"
              />
            </div>
            <div className="kolam-modal-title">
              <h2>{selectedItem.title}</h2>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KolamTypesGrid;

/*
Example Usage:

import KolamTypesGrid from './components/KolamTypesGrid';

// With custom items
const customItems = [
  {
    id: 1,
    src: '/images/kolam1.jpg',
    alt: 'Traditional kolam pattern',
    title: 'Original Image'
  },
  {
    id: 2,
    src: '/images/kolam2.jpg',
    alt: 'Processed grayscale kolam',
    title: 'Grayscale'
  },
  {
    id: 3,
    src: '/images/kolam3.jpg',
    alt: 'Kolam with detected points',
    title: 'Detected Dots (11)'
  },
  {
    id: 4,
    src: '/images/kolam4.jpg',
    alt: 'Mathematical skeleton pattern',
    title: 'Skeleton Pattern'
  },
  {
    id: 5,
    src: '/images/kolam5.jpg',
    alt: 'Mathematical curves representation',
    title: 'Mathematical Curves'
  },
  {
    id: 6,
    src: '/images/kolam6.jpg',
    alt: 'AI enhanced recreation',
    title: 'Enhanced Recreation'
  }
];

function App() {
  return (
    <div>
      <KolamTypesGrid items={customItems} />
      <KolamTypesGrid />
    </div>
  );
}
*/