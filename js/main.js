
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.getElementById('prev-btn');
    const nextButton = document.getElementById('next-btn');
    const pageCounter = document.getElementById('page-counter');

    let currentSlide = 0;
    const totalSlides = slides.length;

    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Show the target slide
        if (slides[index]) {
            slides[index].classList.add('active');
        }

        // Update page counter
        if (pageCounter) {
            pageCounter.textContent = `第 ${index + 1} / ${totalSlides} 页`;
        }

        // Update button states
        if (prevButton) {
            prevButton.disabled = index === 0;
        }
        if (nextButton) {
            nextButton.disabled = index === totalSlides - 1;
        }
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
                showSlide(currentSlide);
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
                showSlide(currentSlide);
            }
        });
    }

    // Initial load
    showSlide(currentSlide);
});
