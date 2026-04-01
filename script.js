document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li a');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Toggle hamburger icon between bars and times
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile nav when clicking a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.querySelector('i').classList.remove('fa-times');
            hamburger.querySelector('i').classList.add('fa-bars');
        });
    });

    // 2. Sticky Navbar, Active Link & Smooth Scroll
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');

    // Smooth Scroll for Navbar Links
    navLinksItems.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Only handle internal links
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Close mobile nav first
                    navLinks.classList.remove('active');
                    hamburger.querySelector('i').classList.remove('fa-times');
                    hamburger.querySelector('i').classList.add('fa-bars');
                    
                    // Smooth Scroll
                    window.scrollTo({
                        top: targetElement.offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    window.addEventListener('scroll', () => {
        // Sticky nav styling
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Adjusted threshold for better active link detection
            if (window.pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinksItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 3. Scroll Animations using Intersection Observer
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Trigger hero animations immediately
    const heroContent = document.querySelector('.hero-content');
    const heroGraphic = document.querySelector('.hero-graphic');
    if (heroContent) heroContent.classList.add('appear');
    if (heroGraphic) heroGraphic.classList.add('appear');

    // 4. Project Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.classList.remove('hide');
                    // slight timeout to allow display property to apply before opacity animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.classList.add('hide');
                    }, 300); // match transition duration
                }
            });
        });
    });



    // 6. Form Submission to Google Apps Script
    const contactForm = document.getElementById('contact-form');
    const scriptURL = 'https://script.google.com/macros/s/AKfycbw3aUdPfrKwP6-SW61F5FXZntVZuXmUumLL_y7yxAIrtTbNnFeLdfzlzSHuzPtwQwhp/exec';

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            // Remove any existing messages
            const existingMsg = contactForm.querySelector('.form-message');
            if (existingMsg) existingMsg.remove();

            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors', // Important for Google Apps Script
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                // Since we use no-cors, we can't reliably read the response body or status.
                // However, if the fetch doesn't throw, it's usually successful for this setup.
                
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.className = 'form-message success';
                successMsg.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully!';
                contactForm.appendChild(successMsg);

                // Reset form and button
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
                
                // Remove message after 5 seconds
                setTimeout(() => successMsg.remove(), 5000);
            })
            .catch(error => {
                console.error('Error!', error.message);
                
                // Show error message
                const errorMsg = document.createElement('div');
                errorMsg.className = 'form-message error';
                errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error sending message. Please try again.';
                contactForm.appendChild(errorMsg);
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            });
        });
    }
});
