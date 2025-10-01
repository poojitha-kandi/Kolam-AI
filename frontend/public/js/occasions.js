/**
 * Occasion Wise Rangoli Gallery
 * Vanilla JavaScript implementation with accessibility features
 */

// Global state
let occasions = [];
let currentOccasion = null;
let currentImages = [];
let currentImageIndex = 0;

// Configuration
const ASSETS_PATH = '/assets/occasions/';
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp'];

// DOM elements
const elements = {
    loading: null,
    occasionsGrid: null,
    occasionsSection: null,
    gallerySection: null,
    galleryGrid: null,
    galleryTitle: null,
    gallerySubtitle: null,
    lightbox: null,
    lightboxImage: null,
    lightboxTitle: null,
    lightboxCounter: null,
    errorMessage: null
};

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupKeyboardNavigation();
    loadOccasions();
});

/**
 * Initialize DOM element references
 */
function initializeElements() {
    elements.loading = document.getElementById('loading');
    elements.occasionsGrid = document.getElementById('occasions-grid');
    elements.occasionsSection = document.getElementById('occasions-section');
    elements.gallerySection = document.getElementById('gallery-section');
    elements.galleryGrid = document.getElementById('gallery-grid');
    elements.galleryTitle = document.getElementById('gallery-title');
    elements.gallerySubtitle = document.getElementById('gallery-subtitle');
    elements.lightbox = document.getElementById('lightbox');
    elements.lightboxImage = document.getElementById('lightbox-image');
    elements.lightboxTitle = document.getElementById('lightbox-title');
    elements.lightboxCounter = document.getElementById('lightbox-counter');
    elements.errorMessage = document.getElementById('error-message');
}

/**
 * Setup keyboard navigation for accessibility
 */
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (elements.lightbox && !elements.lightbox.classList.contains('hidden')) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    previousImage();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextImage();
                    break;
                case 'Home':
                    e.preventDefault();
                    currentImageIndex = 0;
                    updateLightboxImage();
                    break;
                case 'End':
                    e.preventDefault();
                    currentImageIndex = currentImages.length - 1;
                    updateLightboxImage();
                    break;
            }
        }
    });
}

/**
 * Load and discover all occasions from the assets folder
 */
async function loadOccasions() {
    try {
        showLoading(true);
        
        // Define known occasions based on the folder structure
        const knownOccasions = [
            { name: 'Diwali', folder: 'Diwali' },
            { name: 'Dusshera', folder: 'Dusshera' },
            { name: 'Ganesh Chaturthi', folder: 'Ganesh Charuthi' },
            { name: 'Janmashtami', folder: 'janamaashthami' },
            { name: 'Onam', folder: 'Onam' },
            { name: 'Rath Yatra', folder: 'rathyartra' },
            { name: 'Maha Shivaratri', folder: 'maha Shivaratri' },
            { name: 'New Year', folder: 'New Year' },
            { name: 'Pongal', folder: 'Pongal' },
            { name: 'Rama Navami', folder: 'Rama navami' },
            { name: 'Ugadi', folder: 'Ugadhi' },
            { name: 'Vasant Panchami', folder: 'Vasantha Panchami' }
        ];
        
        occasions = [];
        
        // Process each known occasion
        for (const occasion of knownOccasions) {
            try {
                const images = await getImagesForOccasion(occasion.folder);
                const cover = await getCoverImageForOccasion(occasion.folder);
                
                if (images.length > 0) {
                    occasions.push({
                        name: occasion.name,
                        folder: occasion.folder,
                        images: images,
                        cover: cover, // Use dedicated cover image
                        thumbnail: images[0], // Keep original thumbnail for backward compatibility
                        count: images.length
                    });
                }
            } catch (error) {
                console.warn(`Could not load images for ${occasion.name}:`, error);
            }
        }
        
        if (occasions.length === 0) {
            throw new Error('No occasions found');
        }
        
        renderOccasionGrid();
        
    } catch (error) {
        console.error('Error loading occasions:', error);
        showError('Failed to load occasions. Please check if the images are properly placed in the assets folder.');
    } finally {
        showLoading(false);
    }
}

/**
 * Find the best cover image for an occasion
 */
async function getCoverImageForOccasion(folder) {
    // Preferred cover file names in order of preference
    const coverFiles = ['cover.webp', 'cover.jpg', 'cover.png'];
    
    for (const coverFile of coverFiles) {
        const coverPath = `${ASSETS_PATH}${folder}/${coverFile}`;
        const exists = await checkImageExists(coverPath);
        if (exists) {
            return coverPath;
        }
    }
    
    // If no dedicated cover, get first image from the collection
    const images = await getImagesForOccasion(folder);
    if (images.length > 0) {
        return images[0]; // Return first image as cover
    }
    
    // Return default placeholder if no images found
    return '/assets/occasions/default-cover.svg';
}

/**
 * Get list of images for a specific occasion
 */
async function getImagesForOccasion(folder) {
    try {
        // Since we can't directly read directory contents in a browser,
        // we'll use a predefined list approach or try to fetch known file patterns
        const commonFileNames = [
            'download.jpg', 'download.jpeg',
            'download (1).jpg', 'download (1).jpeg',
            'download (2).jpg', 'download (2).jpeg',
            'download (3).jpg', 'download (3).jpeg',
            'download (4).jpg', 'download (4).jpeg',
            'download (5).jpg', 'download (5).jpeg',
            'download (6).jpg', 'download (6).jpeg',
            'download (7).jpg', 'download (7).jpeg',
            'download (8).jpg', 'download (8).jpeg',
            'download (9).jpg', 'download (9).jpeg',
            'download (10).jpg', 'download (10).jpeg',
            'download (11).jpg', 'download (11).jpeg',
            'download (12).jpg', 'download (12).jpeg',
            'download (13).jpg', 'download (13).jpeg',
            'download (14).jpg', 'download (14).jpeg',
            'download (15).jpg', 'download (15).jpeg',
            'download (16).jpg', 'download (16).jpeg',
            'download (17).jpg', 'download (17).jpeg',
            'download (18).jpg', 'download (18).jpeg',
            'download (19).jpg', 'download (19).jpeg',
            'download (20).jpg', 'download (20).jpeg',
            'images.jpg', 'images.jpeg', 'images.png',
            'images (1).jpg', 'images (1).jpeg', 'images (1).png',
            'images (2).jpg', 'images (2).jpeg',
            'images (3).jpg', 'images (3).jpeg',
            'images (4).jpg', 'images (4).jpeg',
            'images (5).jpg', 'images (5).jpeg',
            'images (6).jpg', 'images (6).jpeg'
        ];
        
        // Add specific known files for certain occasions
        const specificFiles = {
            'Diwali': [
                'Beautiful rangoli.jpg',
                'Diwali Rangoli Idea.jpg',
                'Happy Diwali.jpg',
                'Rangoli.jpg',
                'rangoli dewali.jpg',
                'rangoli dewali (1).jpg',
                'rangoli for Dewali.jpg'
            ],
            'Dusshera': [
                'Durga Rangoli Design Images (Kolam Ideas).jpg',
                'Dusshera special rangoli design.jpg',
                'Easy Rangoli Designs for Home.jpg',
                'Maa Durga.jpg',
                'Navratri rangoli.jpg',
                'rangoli design.jpg',
                'rangoli design (1).jpg',
                'Rangoli design (2).jpg',
                'Rangoli design (3).jpg'
            ],
            'Ganesh Charuthi': [
                'Ganapati Rangoli images.jpg',
                'Ganesha Rangoli.jpg',
                'Ganesha Rangoli (1).jpg'
            ]
        };
        
        let filesToCheck = [...commonFileNames];
        if (specificFiles[folder]) {
            filesToCheck = [...filesToCheck, ...specificFiles[folder]];
        }
        
        const validImages = [];
        
        for (const fileName of filesToCheck) {
            try {
                const imagePath = `${ASSETS_PATH}${folder}/${fileName}`;
                const exists = await checkImageExists(imagePath);
                if (exists) {
                    validImages.push(imagePath);
                }
            } catch (error) {
                // Image doesn't exist, continue
            }
        }
        
        return validImages;
        
    } catch (error) {
        console.warn(`Error getting images for ${folder}:`, error);
        return [];
    }
}

/**
 * Check if an image exists by trying to load it
 */
function checkImageExists(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = src;
        
        // Timeout after 3 seconds
        setTimeout(() => resolve(false), 3000);
    });
}

/**
 * Render the occasions grid
 */
function renderOccasionGrid() {
    if (!elements.occasionsGrid) return;
    
    elements.occasionsGrid.innerHTML = '';
    
    occasions.forEach((occasion, index) => {
        const card = createOccasionCard(occasion, index);
        elements.occasionsGrid.appendChild(card);
    });
    
    // Update grid accessibility
    elements.occasionsGrid.setAttribute('aria-label', `${occasions.length} occasions available`);
}

/**
 * Create an occasion card element
 */
function createOccasionCard(occasion, index) {
    const card = document.createElement('div');
    card.className = 'occasion-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `View ${occasion.name} rangoli collection with ${occasion.count} images`);
    
    // Use cover image with responsive variants and fallbacks
    const coverImage = occasion.cover || occasion.thumbnail;
    const coverImageLarge = coverImage.replace(/\.(jpg|jpeg|png|webp)$/i, '-large.$1');
    const coverImageSmall = coverImage.replace(/\.(jpg|jpeg|png|webp)$/i, '-small.$1');
    
    // Create unique ID for this card to track loading state
    const cardId = `card-${index}`;
    let isLoading = true;
    
    card.innerHTML = `
        <div class="image-wrapper">
            <picture>
                <source 
                    srcset="${coverImageSmall.replace(/\.(jpg|jpeg|png)$/i, '.webp')} 400w, ${coverImageLarge.replace(/\.(jpg|jpeg|png)$/i, '.webp')} 800w, ${coverImage.replace(/\.(jpg|jpeg|png)$/i, '.webp')} 1200w" 
                    sizes="(max-width: 768px) 400px, (max-width: 1024px) 800px, 1200px"
                    type="image/webp"
                >
                <img 
                    src="${coverImage}" 
                    alt="${occasion.name} rangoli cover"
                    class="occasion-cover rango-image"
                    loading="lazy"
                    srcset="${coverImageSmall} 400w, ${coverImageLarge} 800w, ${coverImage} 1200w"
                    sizes="(max-width: 768px) 400px, (max-width: 1024px) 800px, 1200px"
                    data-card-id="${cardId}"
                    aria-busy="true"
                >
            </picture>
            <div class="image-placeholder" id="placeholder-${cardId}">
                Loading...
            </div>
        </div>
        <div class="occasion-info">
            <h3 class="occasion-name">${occasion.name}</h3>
            <p class="occasion-count">${occasion.count} images</p>
        </div>
    `;
    
    // Get image element and set up loading state management
    const imgElement = card.querySelector('.rango-image');
    const placeholder = card.querySelector('.image-placeholder');
    
    // Handle successful image load - smooth fade-in
    const handleImageLoad = () => {
        if (isLoading) {
            isLoading = false;
            imgElement.classList.add('loaded');
            imgElement.setAttribute('aria-busy', 'false');
            
            // Hide placeholder with fade out
            setTimeout(() => {
                placeholder.classList.add('hidden');
            }, 100);
        }
    };
    
    // Handle image error - graceful fallback
    const handleImageError = () => {
        if (isLoading) {
            isLoading = false;
            // Try fallback image
            const fallbackSrc = occasion.thumbnail || '/assets/occasions/default-cover.svg';
            if (imgElement.src !== fallbackSrc) {
                imgElement.src = fallbackSrc;
                return; // Let it try loading the fallback
            }
            
            // Even fallback failed, show placeholder
            imgElement.style.display = 'none';
            placeholder.textContent = 'Image unavailable';
            placeholder.classList.remove('hidden');
        }
    };
    
    // Debounce rapid src changes to prevent multiple load events
    let loadTimeout;
    imgElement.addEventListener('load', () => {
        clearTimeout(loadTimeout);
        loadTimeout = setTimeout(handleImageLoad, 50);
    });
    
    imgElement.addEventListener('error', handleImageError);
    
    // Add click and keyboard event handlers
    const openGallery = () => renderGallery(occasion);
    card.addEventListener('click', openGallery);
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openGallery();
        }
    });
    
    return card;
}

/**
 * Render the gallery for a specific occasion
 */
function renderGallery(occasion) {
    currentOccasion = occasion;
    currentImages = occasion.images;
    
    // Update gallery header
    elements.galleryTitle.textContent = `${occasion.name} Rangoli Collection`;
    elements.gallerySubtitle.textContent = `${occasion.count} beautiful designs for ${occasion.name}`;
    
    // Clear and populate gallery grid
    elements.galleryGrid.innerHTML = '';
    
    occasion.images.forEach((imagePath, index) => {
        const item = createGalleryItem(imagePath, index, occasion.name);
        elements.galleryGrid.appendChild(item);
    });
    
    // Show gallery section and hide occasions
    elements.occasionsSection.classList.add('hidden');
    elements.gallerySection.classList.remove('hidden');
    
    // Update accessibility
    elements.galleryGrid.setAttribute('aria-label', `${occasion.name} gallery with ${occasion.count} images`);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Create a gallery item element
 */
function createGalleryItem(imagePath, index, occasionName) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', `View ${occasionName} rangoli image ${index + 1}`);
    
    // Extract filename for alt text
    const filename = imagePath.split('/').pop().replace(/\.[^/.]+$/, "");
    const altText = `${occasionName} rangoli design - ${filename}`;
    
    // Create unique ID for this gallery item to track loading state
    const itemId = `gallery-${index}`;
    let isLoading = true;
    
    item.innerHTML = `
        <div class="image-wrapper">
            <picture>
                <source srcset="${imagePath.replace(/\.(jpg|jpeg)$/i, '.webp')}" type="image/webp">
                <img 
                    src="${imagePath}" 
                    alt="${altText}"
                    class="gallery-image rango-image"
                    loading="lazy"
                    data-item-id="${itemId}"
                    aria-busy="true"
                >
            </picture>
            <div class="image-placeholder" id="gallery-placeholder-${itemId}">
                Loading...
            </div>
        </div>
    `;
    
    // Get image element and set up loading state management
    const imgElement = item.querySelector('.rango-image');
    const placeholder = item.querySelector('.image-placeholder');
    
    // Handle successful image load - smooth fade-in
    const handleImageLoad = () => {
        if (isLoading) {
            isLoading = false;
            imgElement.classList.add('loaded');
            imgElement.setAttribute('aria-busy', 'false');
            
            // Hide placeholder with fade out
            setTimeout(() => {
                placeholder.classList.add('hidden');
            }, 100);
        }
    };
    
    // Handle image error - graceful fallback
    const handleImageError = () => {
        if (isLoading) {
            isLoading = false;
            imgElement.style.display = 'none';
            placeholder.textContent = 'Image unavailable';
            placeholder.classList.remove('hidden');
        }
    };
    
    // Debounce rapid src changes to prevent multiple load events
    let loadTimeout;
    imgElement.addEventListener('load', () => {
        clearTimeout(loadTimeout);
        loadTimeout = setTimeout(handleImageLoad, 50);
    });
    
    imgElement.addEventListener('error', handleImageError);
    
    // Add click and keyboard event handlers
    const openLightbox = () => {
        currentImageIndex = index;
        showLightbox();
    };
    
    item.addEventListener('click', openLightbox);
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox();
        }
    });
    
    return item;
}

/**
 * Show the lightbox with current image
 */
function showLightbox() {
    if (!currentImages || currentImages.length === 0) return;
    
    elements.lightbox.classList.remove('hidden');
    updateLightboxImage();
    
    // Focus management for accessibility
    elements.lightbox.focus();
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
}

/**
 * Update the lightbox image and info
 */
function updateLightboxImage() {
    if (!currentImages || currentImageIndex < 0 || currentImageIndex >= currentImages.length) return;
    
    const currentImage = currentImages[currentImageIndex];
    const filename = currentImage.split('/').pop().replace(/\.[^/.]+$/, "");
    
    // Update image
    elements.lightboxImage.src = currentImage;
    elements.lightboxImage.alt = `${currentOccasion.name} rangoli - ${filename}`;
    
    // Update info
    elements.lightboxTitle.textContent = `${currentOccasion.name} - ${filename}`;
    elements.lightboxCounter.textContent = `${currentImageIndex + 1} / ${currentImages.length}`;
    
    // Update navigation button states
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    if (prevBtn) {
        prevBtn.disabled = currentImageIndex === 0;
        prevBtn.style.opacity = currentImageIndex === 0 ? '0.5' : '1';
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentImageIndex === currentImages.length - 1;
        nextBtn.style.opacity = currentImageIndex === currentImages.length - 1 ? '0.5' : '1';
    }
}

/**
 * Close the lightbox
 */
function closeLightbox() {
    elements.lightbox.classList.add('hidden');
    document.body.style.overflow = '';
    
    // Return focus to gallery
    const galleryItems = elements.galleryGrid.querySelectorAll('.gallery-item');
    if (galleryItems[currentImageIndex]) {
        galleryItems[currentImageIndex].focus();
    }
}

/**
 * Navigate to previous image in lightbox
 */
function previousImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateLightboxImage();
    }
}

/**
 * Navigate to next image in lightbox
 */
function nextImage() {
    if (currentImageIndex < currentImages.length - 1) {
        currentImageIndex++;
        updateLightboxImage();
    }
}

/**
 * Download current image
 */
function downloadImage() {
    if (!currentImages || currentImageIndex < 0 || currentImageIndex >= currentImages.length) return;
    
    const currentImage = currentImages[currentImageIndex];
    const filename = currentImage.split('/').pop();
    
    // Create download link
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = filename;
    link.target = '_blank';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Show occasions grid (back button functionality)
 */
function showOccasions() {
    elements.gallerySection.classList.add('hidden');
    elements.occasionsSection.classList.remove('hidden');
    
    // Clear current state
    currentOccasion = null;
    currentImages = [];
    currentImageIndex = 0;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Navigate to main app (placeholder for integration)
 */
function showMainApp() {
    // This would integrate with your main Kolam AI app
    // For now, redirect to the main page
    if (window.location.pathname.includes('occasions.html')) {
        window.location.href = '/';
    }
}

/**
 * Show/hide loading indicator
 */
function showLoading(show) {
    if (elements.loading) {
        elements.loading.classList.toggle('hidden', !show);
    }
}

/**
 * Show error message
 */
function showError(message) {
    if (elements.errorMessage) {
        elements.errorMessage.querySelector('p').textContent = message;
        elements.errorMessage.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(hideError, 5000);
    }
}

/**
 * Hide error message
 */
function hideError() {
    if (elements.errorMessage) {
        elements.errorMessage.classList.add('hidden');
    }
}

/**
 * Initialize lightbox (called from HTML)
 */
function initLightbox() {
    // This function is called if needed for additional lightbox setup
    // Currently, lightbox is initialized through other functions
}

// Export functions for global access (if needed)
window.loadOccasions = loadOccasions;
window.renderOccasionGrid = renderOccasionGrid;
window.renderGallery = renderGallery;
window.initLightbox = initLightbox;
window.showOccasions = showOccasions;
window.showMainApp = showMainApp;
window.closeLightbox = closeLightbox;
window.previousImage = previousImage;
window.nextImage = nextImage;
window.downloadImage = downloadImage;
window.hideError = hideError;