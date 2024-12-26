document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').slice(1);
        document.getElementById(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

document.querySelectorAll('.card, section').forEach(section => {
    section.classList.add('hidden'); // Initially hidden
    observer.observe(section);
});

.hidden {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}

.show {
    opacity: 1;
    transform: translateY(0);
}
