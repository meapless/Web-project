// scripts/main.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            navToggle.classList.toggle('open'); // For hamburger animation
            // Toggle aria-expanded attribute for accessibility
            const isExpanded = navLinks.classList.contains('open');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (questionButton && answer) {
            questionButton.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');

                // Close all other FAQ items (optional, for one-at-a-time accordion)
                // faqItems.forEach(otherItem => {
                //     if (otherItem !== item && otherItem.classList.contains('active')) {
                //         otherItem.classList.remove('active');
                //         otherItem.querySelector('.faq-answer').style.maxHeight = null;
                //         otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                //     }
                // });

                item.classList.toggle('active');
                questionButton.setAttribute('aria-expanded', !isOpen);

                if (item.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = null;
                }
            });
        }
    });

    // --- Testimonial Slider (Basic Example - more complex sliders might need a library) ---
    const testimonialCardsContainer = document.querySelector('.testimonial-cards');
    const prevArrow = document.querySelector('.slider-arrow.prev-arrow');
    const nextArrow = document.querySelector('.slider-arrow.next-arrow');
    const dotsContainer = document.querySelector('.slider-dots');

    if (testimonialCardsContainer && prevArrow && nextArrow && dotsContainer) {
        const testimonials = Array.from(testimonialCardsContainer.children);
        let currentIndex = 0;
        const itemsPerPage = window.innerWidth < 992 ? 1 : 2; // Show 1 on tablet/mobile, 2 on desktop

        function updateSlider() {
            const cardWidth = testimonials[0].offsetWidth + parseFloat(getComputedStyle(testimonials[0]).marginRight || 0); // include margin
            const offset = -currentIndex * (cardWidth * (itemsPerPage === 1 ? 1 : 0.5) ); // Adjust offset logic for 2 per page
            testimonialCardsContainer.style.transform = `translateX(${offset}px)`;

            // Update dots
            Array.from(dotsContainer.children).forEach((dot, index) => {
                dot.classList.toggle('active', index === Math.floor(currentIndex / itemsPerPage));
            });
        }

        function createDots() {
            dotsContainer.innerHTML = ''; // Clear existing dots
            const numDots = Math.ceil(testimonials.length / itemsPerPage);
            for (let i = 0; i < numDots; i++) {
                const button = document.createElement('button');
                button.classList.add('dot');
                if (i === 0) button.classList.add('active');
                button.setAttribute('aria-label', `Go to slide ${i + 1}`);
                button.addEventListener('click', () => {
                    currentIndex = i * itemsPerPage;
                    if (currentIndex >= testimonials.length) { // Ensure currentIndex is within bounds
                        currentIndex = testimonials.length - itemsPerPage;
                        if (currentIndex < 0) currentIndex = 0;
                    }
                    updateSlider();
                });
                dotsContainer.appendChild(button);
            }
        }


        if (testimonials.length > 0) {
            testimonialCardsContainer.style.display = 'flex'; // Ensure flex for transform to work
            testimonialCardsContainer.style.transition = 'transform 0.5s ease-in-out';

            createDots(); // Create initial dots

            nextArrow.addEventListener('click', () => {
                currentIndex += itemsPerPage;
                if (currentIndex >= testimonials.length) {
                    currentIndex = 0; // Loop back to start
                }
                updateSlider();
            });

            prevArrow.addEventListener('click', () => {
                currentIndex -= itemsPerPage;
                if (currentIndex < 0) {
                    // Loop to end, considering items per page
                    currentIndex = Math.floor((testimonials.length - 1) / itemsPerPage) * itemsPerPage;
                }
                updateSlider();
            });

            // Optional: Auto-slide
            // setInterval(() => {
            //     nextArrow.click();
            // }, 5000);

            // Re-initialize on resize if itemsPerPage logic changes
            window.addEventListener('resize', () => {
                // Debounce this for performance if needed
                const newItemsPerPage = window.innerWidth < 992 ? 1 : 2;
                if (itemsPerPage !== newItemsPerPage) {
                    // itemsPerPage = newItemsPerPage; // This line was missing, causing issues
                    // currentIndex = 0; // Reset to first slide
                    // createDots();
                    // updateSlider();
                    // For simplicity, you might just reload or re-evaluate a simpler slider on resize
                    // Or a more robust slider would handle this gracefully
                }
            });

            updateSlider(); // Initial call
        }
    }


    // --- Update current year in footer ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Early Access Modal ---
    const earlyAccessModal = document.getElementById('earlyAccessModal');
    const earlyAccessForm = document.getElementById('earlyAccessForm');
    const modalNameInput = document.getElementById('modalName');
    const modalEmailInput = document.getElementById('modalEmail');
    const formStatusMessage = document.getElementById('formStatusMessage');
    
    // Specific triggers for the modal
    const openModalTriggers = document.querySelectorAll(
        '.nav-signup, .hero-actions a.button[href="#early-access-cta"], .cta-actions a.button[href="#"]'
    );
    const closeModalButton = earlyAccessModal ? earlyAccessModal.querySelector('.modal-close') : null;

    function openModal() {
        if (!earlyAccessModal) return;
        earlyAccessModal.classList.add('active');
        earlyAccessModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        if (modalNameInput) modalNameInput.focus(); // Focus on the first input field
    }

    function closeModal() {
        if (!earlyAccessModal) return;
        earlyAccessModal.classList.remove('active');
        earlyAccessModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore background scrolling
        if (earlyAccessForm) earlyAccessForm.reset();
        clearAllErrorMessages();
        if (formStatusMessage) {
            formStatusMessage.textContent = '';
            formStatusMessage.className = 'form-status-message';
        }
    }

    // Event listeners for modal triggers
    if (openModalTriggers.length > 0) {
        openModalTriggers.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault(); // Always prevent default for modal triggers
                openModal();
            });
        });
    }

    // Event listener for close button
    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);
    }

    // Event listener for clicking on the overlay to close modal
    if (earlyAccessModal) {
        earlyAccessModal.addEventListener('click', (e) => {
            if (e.target === earlyAccessModal) { // Click on overlay itself
                closeModal();
            }
        });
    }

    // --- Smooth scrolling for internal links (excluding modal triggers) ---
    const allAnchorLinks = document.querySelectorAll('a[href^="#"]');
    allAnchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            let isModalTrigger = false;
            openModalTriggers.forEach(trigger => {
                if (trigger === link) {
                    isModalTrigger = true;
                }
            });

            if (isModalTrigger) {
                // Modal trigger listener already handled this (including preventDefault)
                return;
            }

            const targetId = this.getAttribute('href');
            if (targetId && targetId.length > 1 && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault(); // Prevent default for actual scroll actions

                    if (navLinks && navLinks.classList.contains('open')) {
                        navLinks.classList.remove('open');
                        if (navToggle) {
                            navToggle.classList.remove('open');
                            navToggle.setAttribute('aria-expanded', 'false');
                        }
                    }

                    const headerOffset = document.querySelector('.site-header') ? document.querySelector('.site-header').offsetHeight : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            } else if (targetId === "#") {
                // For href="#" links that are not modal triggers, just prevent default jump.
                e.preventDefault();
            }
        });
    });

    // --- Form validation and submission ---
    function showErrorMessage(inputElement, message) {
        const errorElement = inputElement.nextElementSibling; // Assumes <small> is right after <input>
        if (errorElement && errorElement.classList.contains('form-error-message')) {
            errorElement.textContent = message;
            inputElement.setAttribute('aria-invalid', 'true');
        }
    }

    function clearErrorMessage(inputElement) {
        const errorElement = inputElement.nextElementSibling;
        if (errorElement && errorElement.classList.contains('form-error-message')) {
            errorElement.textContent = '';
            inputElement.removeAttribute('aria-invalid');
        }
    }
    
    function clearAllErrorMessages() {
        if (modalNameInput) clearErrorMessage(modalNameInput);
        if (modalEmailInput) clearErrorMessage(modalEmailInput);
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    if (earlyAccessForm) {
        earlyAccessForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearAllErrorMessages();
            formStatusMessage.textContent = '';
            formStatusMessage.className = 'form-status-message';

            let isValid = true;

            // Validate Name
            if (!modalNameInput.value.trim()) {
                showErrorMessage(modalNameInput, 'Full name is required.');
                isValid = false;
            }

            // Validate Email
            if (!modalEmailInput.value.trim()) {
                showErrorMessage(modalEmailInput, 'Email address is required.');
                isValid = false;
            } else if (!validateEmail(modalEmailInput.value.trim())) {
                showErrorMessage(modalEmailInput, 'Please enter a valid email address.');
                isValid = false;
            }

            if (isValid) {
                // Simulate form submission
                console.log('Form submitted successfully:');
                console.log('Name:', modalNameInput.value.trim());
                console.log('Email:', modalEmailInput.value.trim());

                formStatusMessage.textContent = 'Thank you! Your submission was successful. We\'ll be in touch!';
                formStatusMessage.classList.add('success');
                earlyAccessForm.reset();

                // Optional: Close modal after a delay
                setTimeout(() => {
                    // Check if modal is still open before trying to close
                    if (earlyAccessModal.classList.contains('active')) {
                        closeModal();
                    }
                }, 3000); // Close after 3 seconds
            } else {
                formStatusMessage.textContent = 'Please correct the errors above.';
                formStatusMessage.classList.add('error');
            }
        });
    }

});
