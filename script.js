const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

document.querySelectorAll('.card').forEach(card => {
    card.classList.add('hidden'); // Initially hidden
    observer.observe(card);
});

// Photo slider images
const sliderImages = [
  'photo storage/latest edit zak gas station.jpg',
  'photo storage/000155730031 (1) (1).jpg',
  'photo storage/_MG_5632.jpg',
  'photo storage/img535-positive.jpg',
  'photo storage/000653920022.jpg'
];

let currentIndex = 0;
const sliderImage = document.getElementById('slider-image');
const prevBtn = document.getElementById('slider-prev');
const nextBtn = document.getElementById('slider-next');

function showImage(index) {
  sliderImage.classList.remove('fade-in');
  setTimeout(() => {
    sliderImage.src = sliderImages[index];
    sliderImage.alt = `Photo ${index + 1}`;
    sliderImage.classList.add('fade-in');
  }, 100);
}

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + sliderImages.length) % sliderImages.length;
  showImage(currentIndex);
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % sliderImages.length;
  showImage(currentIndex);
});

// Prevent right-click, drag, and context menu on the slider image
sliderImage.addEventListener('contextmenu', e => e.preventDefault());
sliderImage.addEventListener('dragstart', e => e.preventDefault());
sliderImage.addEventListener('mousedown', e => {
  if (e.button === 2) e.preventDefault();
});

// Optional: Keyboard navigation
window.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') prevBtn.click();
  if (e.key === 'ArrowRight') nextBtn.click();
});

// Initial fade-in class
sliderImage.classList.add('fade-in');
