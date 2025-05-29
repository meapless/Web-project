// scripts/main.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.main-nav .nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            // navToggle.classList.toggle('open'); // For hamburger animation
        });
    }

    // --- Smooth scrolling for nav links ---
    const internalNavLinks = document.querySelectorAll('.main-nav .nav-link[href^="#"]');
    internalNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId.length > 1 && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = document.querySelector('.site-header') ? document.querySelector('.site-header').offsetHeight : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (questionButton && answer) {
            questionButton.addEventListener('click', () => {
                const isOpen = answer.style.display === 'block';
                answer.style.display = isOpen ? 'none' : 'block';
                // Toggle aria-expanded attribute if you add it to the button
                // questionButton.setAttribute('aria-expanded', !isOpen);
            });
        }
    });

    // --- Basic Testimonial Slider (Placeholder - more complex logic needed for actual sliding) ---
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        // console.log('Testimonial slider found. Full implementation pending.');
        // For now, this just confirms the element is selectable.
        // Actual sliding logic would involve tracking current slide, handling next/prev buttons etc.
    }


    // --- Update current year in footer ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

});
