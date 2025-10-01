import React, { useState, useEffect, useRef } from 'react';
import { getOccasionImages } from '../services/occasionService';

/**
 * GalleryModal Component
 * 
 * Opens with images for a specific occasion.
 * Ensures that clicking on Diwali opens Diwali gallery, not some other occasion.
 */

const GalleryModal = ({ occasion, isOpen, onClose }) => {
    const [images, setImages] = useState(occasion.images || []);
    const [loading, setLoading] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const modalRef = useRef(null);
    
    // Load images for this specific occasion if not already provided
    useEffect(() => {
        if (!occasion || images.length > 0) return;
        
        let mounted = true;
        
        (async () => {
            try {
                setLoading(true);
                const occasionImages = await getOccasionImages(occasion.occasionId);
                
                if (mounted) {
                    setImages(occasionImages);
                }
            } catch (error) {
                console.error(`Failed to load images for ${occasion.title}:`, error);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        })();
        
        return () => {
            mounted = false;
        };
    }, [occasion?.occasionId, images.length]);
    
    // Handle keyboard navigation
    useEffect(() => {
        if (!isOpen) return;
        
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowLeft':
                    if (lightboxOpen && selectedImageIndex > 0) {
                        setSelectedImageIndex(selectedImageIndex - 1);
                    }
                    break;
                case 'ArrowRight':
                    if (lightboxOpen && selectedImageIndex < images.length - 1) {
                        setSelectedImageIndex(selectedImageIndex + 1);
                    }
                    break;
                default:
                    break;
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, lightboxOpen, selectedImageIndex, images.length, onClose]);
    
    // Focus management
    useEffect(() => {
        if (isOpen && modalRef.current) {
            modalRef.current.focus();
        }
    }, [isOpen]);
    
    // Handle clicking on gallery image
    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
        setLightboxOpen(true);
    };
    
    // Handle lightbox navigation
    const handlePrevious = () => {
        if (selectedImageIndex > 0) {
            setSelectedImageIndex(selectedImageIndex - 1);
        }
    };
    
    const handleNext = () => {
        if (selectedImageIndex < images.length - 1) {
            setSelectedImageIndex(selectedImageIndex + 1);
        }
    };
    
    // Handle download
    const handleDownload = () => {
        if (images[selectedImageIndex]) {
            const link = document.createElement('a');
            link.href = images[selectedImageIndex].src;
            link.download = `${occasion.title}-${selectedImageIndex + 1}.jpg`;
            link.click();
        }
    };
    
    if (!isOpen || !occasion) return null;
    
    const currentImage = images[selectedImageIndex];
    
    return (
        <div className="gallery-modal" onClick={onClose}>
            <div 
                className="gallery-modal__content" 
                ref={modalRef}
                tabIndex={-1}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-labelledby="gallery-title"
                aria-describedby="gallery-description"
            >
                {/* Header */}
                <div className="gallery-modal__header">
                    <div>
                        <h2 id="gallery-title" className="gallery-modal__title">
                            {occasion.title} Collection
                        </h2>
                        <p id="gallery-description" className="gallery-modal__subtitle">
                            {images.length} beautiful designs for {occasion.title}
                        </p>
                    </div>
                    <button 
                        className="gallery-modal__close"
                        onClick={onClose}
                        aria-label="Close gallery"
                    >
                        ✕
                    </button>
                </div>
                
                {/* Loading state */}
                {loading && (
                    <div className="gallery-modal__loading">
                        <div className="gallery-modal__loading-spinner" />
                        <p>Loading {occasion.title} images...</p>
                    </div>
                )}
                
                {/* Gallery grid */}
                {!loading && images.length > 0 && (
                    <div className="gallery-modal__grid">
                        {images.map((image, index) => (
                            <div
                                key={image.id}
                                className="gallery-modal__grid-item"
                                onClick={() => handleImageClick(index)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleImageClick(index);
                                    }
                                }}
                                aria-label={`View image ${index + 1} of ${images.length}`}
                            >
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="gallery-modal__grid-image"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Empty state */}
                {!loading && images.length === 0 && (
                    <div className="gallery-modal__empty">
                        <p>No images found for {occasion.title}</p>
                    </div>
                )}
            </div>
            
            {/* Lightbox */}
            {lightboxOpen && currentImage && (
                <div className="gallery-lightbox" onClick={() => setLightboxOpen(false)}>
                    <div className="gallery-lightbox__content" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="gallery-lightbox__close"
                            onClick={() => setLightboxOpen(false)}
                            aria-label="Close lightbox"
                        >
                            ✕
                        </button>
                        
                        <button 
                            className="gallery-lightbox__nav gallery-lightbox__prev"
                            onClick={handlePrevious}
                            disabled={selectedImageIndex === 0}
                            aria-label="Previous image"
                        >
                            ‹
                        </button>
                        
                        <img
                            src={currentImage.src}
                            alt={currentImage.alt}
                            className="gallery-lightbox__image"
                        />
                        
                        <button 
                            className="gallery-lightbox__nav gallery-lightbox__next"
                            onClick={handleNext}
                            disabled={selectedImageIndex === images.length - 1}
                            aria-label="Next image"
                        >
                            ›
                        </button>
                        
                        <div className="gallery-lightbox__info">
                            <h3 className="gallery-lightbox__title">{occasion.title}</h3>
                            <p className="gallery-lightbox__counter">
                                {selectedImageIndex + 1} / {images.length}
                            </p>
                            <button 
                                className="gallery-lightbox__download"
                                onClick={handleDownload}
                                aria-label="Download image"
                            >
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryModal;