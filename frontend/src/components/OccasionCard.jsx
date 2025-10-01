import React, { useState, useEffect } from 'react';
import { getFrontImage } from '../services/occasionService';

/**
 * OccasionCard Component
 * 
 * PREVIOUS BUG: All cards showed the same image because of:
 * 1. Shared closure variables in vanilla JS loops
 * 2. Race conditions in async image loading
 * 3. Reusing the same global state for all cards
 * 
 * THIS FIX: Each card manages its own frontImage state with:
 * 1. Stable React keys (occasion.id, not array index)
 * 2. Per-component state with useEffect cleanup
 * 3. Race condition protection with mounted flag
 * 4. Proper async/await with error handling
 */

const OccasionCard = ({ occasion, onOpenGallery, className = '', isFeatured = false }) => {
    // Each card has its own front image state - NO SHARED STATE
    const [frontImage, setFrontImage] = useState('/assets/occasions/default-cover.svg');
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    
    // Load front image when component mounts or occasion.id changes
    useEffect(() => {
        let mounted = true; // Race condition protection
        
        // Reset state for new occasion
        setImageLoading(true);
        setImageError(false);
        setFrontImage('/assets/occasions/default-cover.svg');
        
        // Capture the occasion ID to avoid closure issues
        const occasionId = occasion.id;
        
        (async () => {
            try {
                // getFrontImage handles caching and preloading internally
                const src = await getFrontImage(occasionId);
                
                // Only update state if component is still mounted
                if (mounted && src) {
                    setFrontImage(src);
                    setImageError(false);
                }
            } catch (error) {
                console.warn(`Failed to load front image for ${occasionId}:`, error);
                if (mounted) {
                    setImageError(true);
                }
            } finally {
                if (mounted) {
                    setImageLoading(false);
                }
            }
        })();
        
        // Cleanup function prevents memory leaks and race conditions
        return () => {
            mounted = false;
        };
    }, [occasion.id]); // Only re-run when occasion.id changes
    
    // Handle image load errors (additional fallback)
    const handleImageError = () => {
        if (!imageError) {
            setImageError(true);
            setFrontImage('/assets/occasions/default-cover.svg');
        }
    };
    
    // Handle click to open gallery with correct occasion data
    const handleClick = () => {
        onOpenGallery({
            occasionId: occasion.id,
            title: occasion.title,
            images: occasion.images || [],
            imageCount: occasion.imageCount
        });
    };
    
    // Handle keyboard accessibility
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    };
    
    return (
        <div 
            className={`occasion-card ${className} ${isFeatured ? 'featured' : ''}`}
            role="button"
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            aria-label={`View ${occasion.title} rangoli collection with ${occasion.imageCount} images${isFeatured ? ' (Featured)' : ''}`}
        >
            <div className="occasion-card__image-wrapper">
                {imageLoading && (
                    <div className="occasion-card__placeholder">
                        <div className="occasion-card__loading-spinner" />
                        <span>Loading...</span>
                    </div>
                )}
                
                <picture className="occasion-card__picture">
                    <source 
                        srcSet={frontImage.replace(/\.(jpg|jpeg|png)$/i, '.webp')} 
                        type="image/webp" 
                    />
                    <img
                        src={frontImage}
                        alt={`${occasion.title} rangoli cover`}
                        className={`occasion-card__image ${imageLoading ? 'loading' : 'loaded'}`}
                        onLoad={() => setImageLoading(false)}
                        onError={handleImageError}
                        loading="lazy"
                    />
                </picture>
            </div>
            
            <div className="occasion-card__info">
                <h3 className="occasion-card__title">{occasion.title}</h3>
                <p className="occasion-card__count">
                    <span className="occasion-card__count-icon">📸</span>
                    {occasion.imageCount} images
                </p>
            </div>
        </div>
    );
};

export default OccasionCard;