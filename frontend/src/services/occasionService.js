/**
 * Occasion Service - Handles image loading, caching, and preloading
 * Fixes the bug where all cards showed the same image due to shared state
 */

// In-memory cache for occasion data and images
const occasionCache = new Map();
const imagePreloadCache = new Map();

// Configuration
const ASSETS_PATH = '/assets/occasions/';
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp'];

// Default occasions configuration with proper IDs matching featured order requirements
const DEFAULT_OCCASIONS = [
    { id: 'diwali', title: 'Diwali', folder: 'Diwali' },
    { id: 'dusshera', title: 'Dusshera', folder: 'Dusshera' },
    { id: 'ganesh', title: 'Ganesh Chaturthi', folder: 'Ganesh Charuthi' }, // Featured #1
    { id: 'janmashtami', title: 'Janmashtami', folder: 'janamaashthami' },
    { id: 'onam', title: 'Onam', folder: 'Onam' }, // Newly added occasion
    { id: 'rath-yatra', title: 'Rath Yatra', folder: 'rathyartra' },
    { id: 'maha_shivaratri', title: 'Maha Shivaratri', folder: 'maha Shivaratri' }, // Featured #2
    { id: 'new-year', title: 'New Year', folder: 'New Year' },
    { id: 'pongal', title: 'Pongal', folder: 'Pongal' },
    { id: 'rama_navami', title: 'Rama Navami', folder: 'Rama navami' }, // Featured #3
    { id: 'ugadi', title: 'Ugadi', folder: 'Ugadhi' },
    { id: 'vasant-panchami', title: 'Vasant Panchami', folder: 'Vasantha Panchami' }
];

/**
 * Preload an image and return a promise that resolves when loaded
 * This prevents flicker by ensuring the image is ready before displaying
 */
function preloadImage(src) {
    // Check cache first
    if (imagePreloadCache.has(src)) {
        return imagePreloadCache.get(src);
    }
    
    const promise = new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
        
        // Timeout after 10 seconds
        setTimeout(() => reject(new Error('Image load timeout')), 10000);
    });
    
    // Cache the promise to avoid duplicate requests
    imagePreloadCache.set(src, promise);
    return promise;
}

/**
 * Check if an image exists by attempting to load it
 */
async function checkImageExists(src) {
    try {
        await preloadImage(src);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Get list of images for a specific occasion folder
 * Returns array of image paths that actually exist
 */
async function getImagesForOccasion(folder) {
    const cacheKey = `images_${folder}`;
    
    // Return cached result if available
    if (occasionCache.has(cacheKey)) {
        return occasionCache.get(cacheKey);
    }
    
    // Common file patterns found in occasion folders
    const commonFileNames = [
        'download.jpg', 'download.jpeg', 'cover.jpg', 'cover.png',
        'download (1).jpg', 'download (2).jpg', 'download (3).jpg',
        'download (4).jpg', 'download (5).jpg', 'download (6).jpg',
        'download (7).jpg', 'download (8).jpg', 'download (9).jpg',
        'download (10).jpg', 'download (11).jpg', 'download (12).jpg',
        'download (13).jpg', 'download (14).jpg', 'download (15).jpg',
        'images.jpg', 'images (1).jpg', 'images (2).jpg', 'images (3).jpg'
    ];
    
    // Add specific known files for certain occasions
    const specificFiles = {
        'Diwali': [
            'Beautiful rangoli.jpg', 'Diwali Rangoli Idea.jpg', 'Happy Diwali.jpg',
            'Rangoli.jpg', 'rangoli dewali.jpg', 'rangoli for Dewali.jpg'
        ],
        'Dusshera': [
            'Durga Rangoli Design Images (Kolam Ideas).jpg', 'Dusshera special rangoli design.jpg',
            'Maa Durga.jpg', 'Navratri rangoli.jpg', 'rangoli design.jpg'
        ],
        'Ganesh Charuthi': [
            'Ganapati Rangoli images.jpg', 'Ganesha Rangoli.jpg', 'Ganesha Rangoli (1).jpg'
        ],
        'Onam': [
            'onam rangoli.jpg', 'pookalam design.jpg', 'traditional onam.jpg',
            'onam festival.jpg', 'kerala rangoli.jpg'
        ]
    };
    
    let filesToCheck = [...commonFileNames];
    if (specificFiles[folder]) {
        filesToCheck = [...filesToCheck, ...specificFiles[folder]];
    }
    
    // Check which images actually exist
    const validImages = [];
    const checkPromises = filesToCheck.map(async (fileName) => {
        const imagePath = `${ASSETS_PATH}${folder}/${fileName}`;
        const exists = await checkImageExists(imagePath);
        if (exists) {
            validImages.push({
                id: `${folder}_${fileName}`,
                src: imagePath,
                alt: `${folder} rangoli design - ${fileName.replace(/\.[^/.]+$/, "")}`
            });
        }
    });
    
    await Promise.allSettled(checkPromises);
    
    // Cache the result
    occasionCache.set(cacheKey, validImages);
    return validImages;
}

/**
 * Get the front/cover image for an occasion
 * Implements priority: cover.jpg > cover.png > first available image > placeholder
 */
async function getFrontImage(occasionId) {
    try {
        const cacheKey = `front_${occasionId}`;
        
        // Return cached result if available
        if (occasionCache.has(cacheKey)) {
            return occasionCache.get(cacheKey);
        }
        
        // Find occasion configuration
        const occasionConfig = DEFAULT_OCCASIONS.find(occ => occ.id === occasionId);
        if (!occasionConfig) {
            throw new Error(`Unknown occasion: ${occasionId}`);
        }
        
        const folder = occasionConfig.folder;
        
        // Priority 1: Look for dedicated cover files
        const coverFiles = ['cover.jpg', 'cover.png', 'cover.webp'];
        for (const coverFile of coverFiles) {
            const coverPath = `${ASSETS_PATH}${folder}/${coverFile}`;
            const exists = await checkImageExists(coverPath);
            if (exists) {
                // Preload the image before caching
                await preloadImage(coverPath);
                occasionCache.set(cacheKey, coverPath);
                return coverPath;
            }
        }
        
        // Priority 2: Use first image from the collection
        const images = await getImagesForOccasion(folder);
        if (images.length > 0) {
            const firstImageSrc = images[0].src;
            await preloadImage(firstImageSrc);
            occasionCache.set(cacheKey, firstImageSrc);
            return firstImageSrc;
        }
        
        // Priority 3: Default placeholder
        const placeholderPath = '/assets/occasions/default-cover.svg';
        occasionCache.set(cacheKey, placeholderPath);
        return placeholderPath;
        
    } catch (error) {
        console.warn(`Error getting front image for ${occasionId}:`, error);
        return '/assets/occasions/default-cover.svg';
    }
}

/**
 * Get all occasions with their basic data
 * Each occasion gets a unique ID to prevent React key conflicts
 */
async function getAllOccasions() {
    const cacheKey = 'all_occasions';
    
    // Return cached result if available
    if (occasionCache.has(cacheKey)) {
        return occasionCache.get(cacheKey);
    }
    
    const occasions = [];
    
    // Process each occasion configuration
    for (const config of DEFAULT_OCCASIONS) {
        try {
            const images = await getImagesForOccasion(config.folder);
            
            occasions.push({
                id: config.id, // Stable, unique ID for React keys
                title: config.title,
                folder: config.folder,
                imageCount: images.length,
                images: images, // Include images for gallery
                frontImageSrc: null // Will be loaded separately per card
            });
        } catch (error) {
            console.warn(`Error loading occasion ${config.title}:`, error);
        }
    }
    
    // Cache the result
    occasionCache.set(cacheKey, occasions);
    return occasions;
}

/**
 * Clear cache (useful for development or forced refresh)
 */
function clearCache() {
    occasionCache.clear();
    imagePreloadCache.clear();
}

/**
 * Sort occasions to show featured items first
 * @param {Array} occasions - Array of occasion objects
 * @param {Array} featuredOrder - Array of occasion IDs in preferred order
 * @returns {Array} Sorted occasions with featured items first
 */
function sortOccasionsByFeatured(occasions, featuredOrder = []) {
    // Create a map for O(1) lookup by ID
    const occasionMap = new Map();
    occasions.forEach(occasion => {
        occasionMap.set(occasion.id, occasion);
    });
    
    // Create a set for O(1) featured check
    const featuredSet = new Set(featuredOrder);
    
    // Get featured occasions in specified order (skip missing ones safely)
    const featuredOccasions = featuredOrder
        .map(id => occasionMap.get(id))
        .filter(Boolean); // Remove undefined entries if ID not found
    
    // Get remaining occasions preserving their original relative order
    const remainingOccasions = occasions.filter(occasion => 
        !featuredSet.has(occasion.id)
    );
    
    // Combine: featured first, then remaining
    const sortedOccasions = [...featuredOccasions, ...remainingOccasions];
    
    // Debug logging for testing
    console.log('Occasion sorting applied:');
    console.log('  Featured order:', featuredOrder);
    console.log('  Original occasions:', occasions.map(o => o.id));
    console.log('  Sorted occasions:', sortedOccasions.map(o => o.id));
    
    return sortedOccasions;
}

/**
 * Get images for a specific occasion (for gallery)
 * Returns the cached images if available, otherwise fetches them
 */
async function getOccasionImages(occasionId) {
    const occasionConfig = DEFAULT_OCCASIONS.find(occ => occ.id === occasionId);
    if (!occasionConfig) {
        return [];
    }
    
    return await getImagesForOccasion(occasionConfig.folder);
}

export {
    getAllOccasions,
    getFrontImage,
    getOccasionImages,
    sortOccasionsByFeatured,
    clearCache,
    preloadImage
};