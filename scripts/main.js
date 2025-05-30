// scripts/main.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            navToggle.classList.toggle('open'); // For hamburger animation
            const isExpanded = navLinks.classList.contains('open');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const plusIcon = questionButton.querySelector('.faq-icon.plus');
        const minusIcon = questionButton.querySelector('.faq-icon.minus');


        if (questionButton && answer) {
            questionButton.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');

                item.classList.toggle('active');
                questionButton.setAttribute('aria-expanded', !isOpen);

                if (item.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    if(plusIcon) plusIcon.style.display = 'none';
                    if(minusIcon) minusIcon.style.display = 'block';
                } else {
                    answer.style.maxHeight = null;
                    if(plusIcon) plusIcon.style.display = 'block';
                    if(minusIcon) minusIcon.style.display = 'none';
                }
            });
        }
    });

    // --- Testimonial Slider ---
    const testimonialCardsContainer = document.querySelector('.testimonial-cards');
    const prevArrow = document.querySelector('.slider-arrow.prev-arrow');
    const nextArrow = document.querySelector('.slider-arrow.next-arrow');
    const dotsContainer = document.querySelector('.slider-dots');

    if (testimonialCardsContainer && prevArrow && nextArrow && dotsContainer) {
        const testimonials = Array.from(testimonialCardsContainer.children);
        let currentIndex = 0;
        let itemsPerPage = window.innerWidth < 992 ? 1 : 2;

        function updateSlider() {
            if (testimonials.length === 0) return;
            const cardWidth = testimonials[0].offsetWidth + parseFloat(getComputedStyle(testimonials[0]).marginRight || 0);
            const offset = -currentIndex * (cardWidth * (itemsPerPage === 1 ? 1 : 0.5) );
            testimonialCardsContainer.style.transform = `translateX(${offset}px)`;

            Array.from(dotsContainer.children).forEach((dot, index) => {
                dot.classList.toggle('active', index === Math.floor(currentIndex / itemsPerPage));
            });
        }

        function createDots() {
            dotsContainer.innerHTML = '';
            if (testimonials.length === 0) return;
            const numDots = Math.ceil(testimonials.length / itemsPerPage);
            for (let i = 0; i < numDots; i++) {
                const button = document.createElement('button');
                button.classList.add('dot');
                if (i === 0) button.classList.add('active');
                button.setAttribute('aria-label', `Go to slide ${i + 1}`);
                button.addEventListener('click', () => {
                    currentIndex = i * itemsPerPage;
                    if (currentIndex >= testimonials.length) {
                        currentIndex = testimonials.length - itemsPerPage;
                        if (currentIndex < 0) currentIndex = 0;
                    }
                    updateSlider();
                });
                dotsContainer.appendChild(button);
            }
        }


        if (testimonials.length > 0) {
            testimonialCardsContainer.style.display = 'flex';
            testimonialCardsContainer.style.transition = 'transform 0.5s ease-in-out';

            createDots();

            nextArrow.addEventListener('click', () => {
                currentIndex += itemsPerPage;
                if (currentIndex >= testimonials.length) {
                    currentIndex = 0;
                }
                updateSlider();
            });

            prevArrow.addEventListener('click', () => {
                currentIndex -= itemsPerPage;
                if (currentIndex < 0) {
                    currentIndex = Math.floor((testimonials.length - 1) / itemsPerPage) * itemsPerPage;
                     if (currentIndex < 0) currentIndex = 0; // Ensure it's not negative
                }
                updateSlider();
            });
            
            window.addEventListener('resize', () => {
                const newItemsPerPage = window.innerWidth < 992 ? 1 : 2;
                if (itemsPerPage !== newItemsPerPage) {
                    itemsPerPage = newItemsPerPage;
                    currentIndex = 0; 
                    createDots();
                    updateSlider();
                }
            });

            updateSlider();
        }
    }


    // --- Smooth scrolling for nav links ---
    const allAnchorLinks = document.querySelectorAll('a[href^="#"]');
    const earlyAccessModal = document.getElementById('earlyAccessModal'); // Defined for modal logic too

    // Specific triggers for the modal
    const openModalTriggers = document.querySelectorAll(
        '.nav-signup, .hero-actions a.button[href="#early-access-cta"], .cta-actions a.button[href="#"]' // Assuming CTA buttons use href="#"
    );


    allAnchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            let isModalTrigger = false;
            openModalTriggers.forEach(trigger => {
                if (trigger === link) {
                    isModalTrigger = true;
                }
            });

            const targetId = this.getAttribute('href');

            if (isModalTrigger) {
                e.preventDefault();
                if (earlyAccessModal) openEarlyAccessModal(); // Call the modal open function
                return;
            }

            if (targetId && targetId.length > 1 && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault(); 

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
            } else if (targetId === "#" && !isModalTrigger) { // For non-modal href="#" links
                e.preventDefault();
            }
        });
    });

    // --- Update current year in footer ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Early Access Modal ---
    // const earlyAccessModal = document.getElementById('earlyAccessModal'); // Already defined above
    const earlyAccessForm = document.getElementById('earlyAccessForm');
    const modalNameInput = document.getElementById('modalName');
    const modalEmailInput = document.getElementById('modalEmail');
    const formStatusMessage = document.getElementById('formStatusMessage');
    const closeModalButton = earlyAccessModal ? earlyAccessModal.querySelector('.modal-close') : null;

    function openEarlyAccessModal() { // Renamed to avoid conflict if any
        if (!earlyAccessModal) return;
        earlyAccessModal.classList.add('active');
        earlyAccessModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (modalNameInput) modalNameInput.focus();
    }

    function closeEarlyAccessModal() { // Renamed
        if (!earlyAccessModal) return;
        earlyAccessModal.classList.remove('active');
        earlyAccessModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (earlyAccessForm) earlyAccessForm.reset();
        clearAllErrorMessages();
        if (formStatusMessage) {
            formStatusMessage.textContent = '';
            formStatusMessage.className = 'form-status-message';
        }
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeEarlyAccessModal);
    }

    if (earlyAccessModal) {
        earlyAccessModal.addEventListener('click', (e) => {
            if (e.target === earlyAccessModal) {
                closeEarlyAccessModal();
            }
        });
    }

    function showErrorMessage(inputElement, message) {
        const errorElement = inputElement.nextElementSibling;
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
            if(formStatusMessage) {
                formStatusMessage.textContent = '';
                formStatusMessage.className = 'form-status-message';
            }

            let isValid = true;

            if (!modalNameInput.value.trim()) {
                showErrorMessage(modalNameInput, 'Full name is required.');
                isValid = false;
            }

            if (!modalEmailInput.value.trim()) {
                showErrorMessage(modalEmailInput, 'Email address is required.');
                isValid = false;
            } else if (!validateEmail(modalEmailInput.value.trim())) {
                showErrorMessage(modalEmailInput, 'Please enter a valid email address.');
                isValid = false;
            }

            if (isValid) {
                console.log('Form submitted successfully:');
                console.log('Name:', modalNameInput.value.trim());
                console.log('Email:', modalEmailInput.value.trim());

                if(formStatusMessage){
                    formStatusMessage.textContent = 'Thank you! Your submission was successful. We\'ll be in touch!';
                    formStatusMessage.classList.add('success');
                }
                earlyAccessForm.reset();

                setTimeout(() => {
                    if (earlyAccessModal.classList.contains('active')) {
                        closeEarlyAccessModal();
                    }
                }, 3000);
            } else {
                 if(formStatusMessage){
                    formStatusMessage.textContent = 'Please correct the errors above.';
                    formStatusMessage.classList.add('error');
                 }
            }
        });
    }

});
