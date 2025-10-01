import React, { useState, useEffect } from 'react';
import OccasionCard from './OccasionCard';
import GalleryModal from './GalleryModal';
import { getAllOccasions, sortOccasionsByFeatured } from '../services/occasionService';

/**
 * OccasionGrid Component with Featured Ordering
 * 
 * FEATURED ORDERING LOGIC:
 * - Certain occasions appear first in a specific order
 * - Remaining occasions follow in their natural order
 * - Change featuredOrder array below to modify which occasions appear first
 * 
 * PREVIOUS BUG ANALYSIS:
 * - Used array indices as React keys (unstable, causes re-renders)
 * - Shared global state between cards (occasions[0] affects occasions[1])
 * - No proper async loading states
 * - Race conditions when rapidly switching between occasions
 * 
 * THIS FIX:
 * - Uses stable occasion.id as React keys
 * - Each card manages its own state independently
 * - Proper loading states and error handling
 * - Clean separation between grid state and card state
 * - Featured ordering for promotional purposes
 */

// FEATURED ORDER CONFIGURATION
// Change this array to modify which occasions appear first and in what order
// Use occasion IDs from the service (ganesh, maha_shivaratri, rama_navami, etc.)
const FEATURED_ORDER = ['ganesh', 'maha_shivaratri', 'rama_navami'];

/**
 * Example occasions data for testing (matches service configuration):
 * 
 * const exampleOccasions = [
 *   { id: 'diwali', title: 'Diwali', imageCount: 32, images: [...] },
 *   { id: 'dusshera', title: 'Dusshera', imageCount: 29, images: [...] },
 *   { id: 'ganesh', title: 'Ganesh Chaturthi', imageCount: 15, images: [...] },     // Featured #1
 *   { id: 'onam', title: 'Onam', imageCount: 8, images: [...] },                   // Newly added
 *   { id: 'maha_shivaratri', title: 'Maha Shivaratri', imageCount: 12, images: [...] }, // Featured #2
 *   { id: 'rama_navami', title: 'Rama Navami', imageCount: 10, images: [...] },    // Featured #3
 *   { id: 'pongal', title: 'Pongal', imageCount: 18, images: [...] },
 *   { id: 'ugadi', title: 'Ugadi', imageCount: 14, images: [...] },
 *   // ... other occasions
 * ];
 * 
 * After sorting: [ganesh, maha_shivaratri, rama_navami, diwali, dusshera, onam, pongal, ugadi, ...]
 */

const OccasionGrid = ({ className = '' }) => {
    const [occasions, setOccasions] = useState([]);
    const [sortedOccasions, setSortedOccasions] = useState([]); // Sorted for display
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOccasion, setSelectedOccasion] = useState(null);
    const [galleryOpen, setGalleryOpen] = useState(false);
    
    // Load occasions on component mount
    useEffect(() => {
        let mounted = true;
        
        (async () => {
            try {
                setLoading(true);
                setError(null);
                
                const occasionsData = await getAllOccasions();
                
                if (mounted) {
                    // Store original occasions
                    setOccasions(occasionsData);
                    
                    // Apply featured ordering for display
                    const sorted = sortOccasionsByFeatured(occasionsData, FEATURED_ORDER);
                    setSortedOccasions(sorted);
                    
                    console.log(`Loaded ${occasionsData.length} occasions, reordered with featured items first`);
                }
            } catch (err) {
                console.error('Failed to load occasions:', err);
                if (mounted) {
                    setError('Failed to load occasions. Please try again.');
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        })();
        
        return () => {
            mounted = false;
        };
    }, []);
    
    // Handle opening gallery with specific occasion data
    const handleOpenGallery = (occasionData) => {
        // Ensure we're opening with the correct occasion's data
        setSelectedOccasion({
            ...occasionData,
            // Add timestamp to ensure fresh data
            openedAt: Date.now()
        });
        setGalleryOpen(true);
    };
    
    // Handle closing gallery
    const handleCloseGallery = () => {
        setGalleryOpen(false);
        // Clear selection after a brief delay to allow closing animation
        setTimeout(() => setSelectedOccasion(null), 300);
    };
    
    if (loading) {
        return (
            <div className={`occasion-grid ${className}`}>
                <div className="occasion-grid__loading">
                    <div className="occasion-grid__loading-spinner" />
                    <p>Loading occasions...</p>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className={`occasion-grid ${className}`}>
                <div className="occasion-grid__error">
                    <p>{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="occasion-grid__retry-button"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }
    
    if (sortedOccasions.length === 0) {
        return (
            <div className={`occasion-grid ${className}`}>
                <div className="occasion-grid__empty">
                    <p>No occasions found.</p>
                </div>
            </div>
        );
    }
    
    return (
        <>
            <div className={`occasion-grid ${className}`}>
                <div className="occasion-grid__header">
                    <h2>Occasion Wise Rangoli Collections</h2>
                    <p>Explore beautiful rangoli designs organized by festivals and occasions</p>
                </div>
                
                <div className="occasion-grid__container">
                    {/* Render sorted occasions with featured items first */}
                    {sortedOccasions.map((occasion, index) => {
                        // Check if this occasion is featured (appears in first 3 positions)
                        const isFeatured = index < FEATURED_ORDER.length && 
                                         FEATURED_ORDER.includes(occasion.id);
                        
                        return (
                            <OccasionCard
                                key={occasion.id} // STABLE KEY - fixes React re-render issues
                                occasion={occasion}
                                onOpenGallery={handleOpenGallery}
                                className={`occasion-grid__card ${isFeatured ? 'featured' : ''}`}
                                isFeatured={isFeatured}
                            />
                        );
                    })}
                </div>
            </div>
            
            {/* Gallery Modal */}
            {galleryOpen && selectedOccasion && (
                <GalleryModal
                    occasion={selectedOccasion}
                    isOpen={galleryOpen}
                    onClose={handleCloseGallery}
                />
            )}
        </>
    );
};

export default OccasionGrid;