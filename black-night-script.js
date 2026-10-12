// Black Hermeneutics gallery functionality (similar to Tunisia)
let currentCarouselIndex = 0;

// Get gallery images from global scope (defined in black-night-data.js)
function getBlackNightImages() {
    if (typeof blackNightImages !== 'undefined') {
        return blackNightImages;
    }
    return [];
}

// Initialize gallery
function initBlackNightGallery() {
    const galleryContainer = document.getElementById('black-night-container');
    if (!galleryContainer) return;
    
    const images = getBlackNightImages();
    if (images.length === 0) return;
    
    galleryContainer.innerHTML = '';
    
    images.forEach((image, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'tunisia-item';
        galleryItem.dataset.index = index;
        
        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.alt || `Black Hermeneutics photo ${index + 1}`;
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
        if (history.pushState) {
            history.pushState('', document.title, window.location.pathname);
        } else {
            window.location.hash = '';
        }
    }
}

// Update carousel image
function updateCarouselImage() {
    const images = getBlackNightImages();
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
            carouselImage.alt = images[currentCarouselIndex].alt || `Black Hermeneutics photo ${currentCarouselIndex + 1}`;
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
    const images = getBlackNightImages();
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
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            showShareFeedback();
        }).catch(() => {
            fallbackCopy(url);
        });
    } else {
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
    const images = getBlackNightImages();
    const hash = window.location.hash;
    if (hash && hash.startsWith('#image-')) {
        const index = parseInt(hash.replace('#image-', '')) - 1;
        if (index >= 0 && index < images.length) {
            setTimeout(() => openCarousel(index), 100);
        }
    }
}

// Handle scroll indicator
function updateScrollIndicator() {
    const indicator = document.getElementById('scroll-indicator');
    if (!indicator) return;
    
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100 || windowHeight + scrollTop >= documentHeight - 50) {
        indicator.classList.add('hidden');
    } else {
        indicator.classList.remove('hidden');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    function tryInit() {
        const images = getBlackNightImages();
        if (images.length > 0) {
            initBlackNightGallery();
            checkURLHash();
            setTimeout(updateScrollIndicator, 100);
        } else {
            setTimeout(tryInit, 50);
        }
    }
    
    tryInit();
    
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateScrollIndicator, 100);
    });
    
    updateScrollIndicator();
    
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

// Listen for hash changes
window.addEventListener('hashchange', () => {
    checkURLHash();
});

