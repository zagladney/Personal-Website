// Gallery functionality
let currentCarouselIndex = 0;
let shuffledImages = []; // Store shuffled order for carousel

// Get gallery images from global scope (defined in gallery-data.js)
function getGalleryImages() {
    if (typeof galleryImages !== 'undefined') {
        return galleryImages;
    }
    return [];
}

// Shuffle array function (Fisher-Yates)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Initialize gallery from external data file
function initGallery() {
    const galleryContainer = document.getElementById('gallery-container');
    if (!galleryContainer) return;
    
    let images = getGalleryImages();
    if (images.length === 0) return;
    
    // Randomize order once and store it
    shuffledImages = shuffleArray(images);
    
    galleryContainer.innerHTML = '';
    
    shuffledImages.forEach((image, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.dataset.index = index;
        
        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.alt || `Image ${index + 1}`;
        img.loading = 'lazy';
        
        galleryItem.appendChild(img);
        galleryItem.addEventListener('click', () => openCarousel(index));
        
        galleryContainer.appendChild(galleryItem);
    });
}

// Open carousel modal
function openCarousel(index) {
    currentCarouselIndex = index;
    const modal = document.getElementById('carousel-modal');
    const overlay = document.getElementById('carousel-overlay');
    
    if (modal && overlay) {
        modal.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateCarouselImage();
        updateURL();
    }
}

// Close carousel modal
function closeCarousel() {
    const modal = document.getElementById('carousel-modal');
    const overlay = document.getElementById('carousel-overlay');
    
    if (modal && overlay) {
        modal.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        // Remove hash from URL
        if (history.pushState) {
            history.pushState('', document.title, window.location.pathname);
        } else {
            window.location.hash = '';
        }
    }
}

// Update carousel image
function updateCarouselImage() {
    const images = shuffledImages.length > 0 ? shuffledImages : getGalleryImages();
    if (images.length === 0) return;
    
    const carouselImage = document.getElementById('carousel-image');
    const currentIndexSpan = document.getElementById('current-index');
    const totalCountSpan = document.getElementById('total-count');
    
    if (carouselImage) {
        carouselImage.classList.remove('fade-in');
        const img = new Image();
        img.src = images[currentCarouselIndex].src;
        img.onload = () => {
            carouselImage.src = img.src;
            carouselImage.alt = images[currentCarouselIndex].alt || `Image ${currentCarouselIndex + 1}`;
            carouselImage.classList.add('fade-in');
        };
    }
    
    if (currentIndexSpan) {
        currentIndexSpan.textContent = currentCarouselIndex + 1;
    }
    
    if (totalCountSpan) {
        totalCountSpan.textContent = images.length;
    }
}

// Navigate carousel
function navigateCarousel(direction) {
    const images = shuffledImages.length > 0 ? shuffledImages : getGalleryImages();
    if (images.length === 0) return;
    
    if (direction === 'next') {
        currentCarouselIndex = (currentCarouselIndex + 1) % images.length;
    } else {
        currentCarouselIndex = (currentCarouselIndex - 1 + images.length) % images.length;
    }
    
    updateCarouselImage();
    updateURL();
}

// Update URL hash for shareable links
function updateURL() {
    if (history.pushState) {
        history.pushState('', document.title, `#image-${currentCarouselIndex + 1}`);
    } else {
        window.location.hash = `image-${currentCarouselIndex + 1}`;
    }
}

// Share current image link
function shareImage() {
    const url = window.location.origin + window.location.pathname + `#image-${currentCarouselIndex + 1}`;
    
    // Try to use the Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            showShareFeedback();
        }).catch(() => {
            // Fallback to manual copy
            fallbackCopy(url);
        });
    } else {
        // Fallback for older browsers
        fallbackCopy(url);
    }
}

// Fallback copy method
function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showShareFeedback();
    } catch (err) {
        console.error('Failed to copy:', err);
    }
    document.body.removeChild(textArea);
}

// Show share feedback message
function showShareFeedback() {
    const feedback = document.getElementById('share-feedback');
    if (feedback) {
        feedback.classList.add('show');
        setTimeout(() => {
            feedback.classList.remove('show');
        }, 2000);
    }
}

// Check URL hash on load
function checkURLHash() {
    const images = shuffledImages.length > 0 ? shuffledImages : getGalleryImages();
    const hash = window.location.hash;
    if (hash && hash.startsWith('#image-')) {
        const index = parseInt(hash.replace('#image-', '')) - 1;
        if (index >= 0 && index < images.length) {
            // Small delay to ensure gallery is initialized
            setTimeout(() => openCarousel(index), 100);
        }
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize gallery - will retry if gallery-data.js hasn't loaded yet
    function tryInit() {
        const images = getGalleryImages();
        if (images.length > 0) {
            initGallery();
            checkURLHash();
        } else {
            // Retry after a short delay if gallery data hasn't loaded
            setTimeout(tryInit, 50);
        }
    }
    
    tryInit();
    
    const carouselClose = document.getElementById('carousel-close');
    const carouselOverlay = document.getElementById('carousel-overlay');
    const carouselPrev = document.getElementById('carousel-prev');
    const carouselNext = document.getElementById('carousel-next');
    const carouselShare = document.getElementById('carousel-share');
    
    if (carouselClose) {
        carouselClose.addEventListener('click', closeCarousel);
    }
    
    if (carouselOverlay) {
        carouselOverlay.addEventListener('click', closeCarousel);
    }
    
    if (carouselPrev) {
        carouselPrev.addEventListener('click', () => navigateCarousel('prev'));
    }
    
    if (carouselNext) {
        carouselNext.addEventListener('click', () => navigateCarousel('next'));
    }
    
    if (carouselShare) {
        carouselShare.addEventListener('click', shareImage);
    }
    
    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
        const modal = document.getElementById('carousel-modal');
        if (modal && modal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeCarousel();
            } else if (e.key === 'ArrowLeft') {
                navigateCarousel('prev');
            } else if (e.key === 'ArrowRight') {
                navigateCarousel('next');
            }
        }
    });
    
    // Prevent right-click and drag on carousel image
    const carouselImage = document.getElementById('carousel-image');
    if (carouselImage) {
        carouselImage.addEventListener('contextmenu', e => e.preventDefault());
        carouselImage.addEventListener('dragstart', e => e.preventDefault());
    }
});

// Listen for hash changes (back/forward buttons)
window.addEventListener('hashchange', () => {
    checkURLHash();
});
