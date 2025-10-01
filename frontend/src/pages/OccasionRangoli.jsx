import React from 'react';
import OccasionGrid from '../components/OccasionGrid';
import '../styles/occasion-components.css';

/**
 * OccasionRangoli Page Component
 * 
 * MANUAL TEST PLAN (as comments):
 * 
 * ✅ Test 1: Diwali card shows Diwali front image (not Ganesh)
 *    - Load page and verify Diwali card shows correct cover image
 *    - Should show "Beautiful rangoli.jpg" or first Diwali image
 *    - NOT any other occasion's image
 * 
 * ✅ Test 2: Dussehra card shows Dussehra front image
 *    - Verify Dussehra card shows "Maa Durga.jpg" or first Dussehra image
 *    - Should be different from Diwali image
 * 
 * ✅ Test 3: Clicking Diwali opens Diwali gallery with correct images
 *    - Click on Diwali card
 *    - Gallery modal should open with "Diwali Collection" title
 *    - Should show only Diwali images, not mixed with other occasions
 *    - Image count should match Diwali folder contents
 * 
 * ✅ Test 4: Placeholder appears when occasion has no images or fetch fails
 *    - If an occasion folder is empty or images fail to load
 *    - Should show default-cover.svg placeholder
 *    - Should not break the layout or show broken images
 * 
 * PREVIOUS BUGS FIXED:
 * - All cards showing same image due to shared closure variables
 * - Race conditions in async image loading
 * - Wrong gallery content when clicking cards
 * - Unstable React keys causing unnecessary re-renders
 */

const OccasionRangoli = () => {
    return (
        <div className="occasion-rangoli-page">
            {/* Header */}
            <header className="occasion-rangoli-header">
                <div className="container">
                    <h1 className="logo">🎨 Kolam AI</h1>
                    <nav className="nav">
                        <button 
                            className="nav-btn" 
                            onClick={() => window.location.href = '/'}
                        >
                            Main App
                        </button>
                        <button className="nav-btn active">
                            Occasion Wise Rangoli
                        </button>
                    </nav>
                </div>
            </header>
            
            {/* Main Content */}
            <main className="occasion-rangoli-main">
                <OccasionGrid className="occasion-rangoli-grid" />
            </main>
            
            {/* Footer */}
            <footer className="occasion-rangoli-footer">
                <div className="container">
                    <p>&copy; 2025 Kolam AI. Preserving traditional art through technology.</p>
                </div>
            </footer>
        </div>
    );
};

export default OccasionRangoli;