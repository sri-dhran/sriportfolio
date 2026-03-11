document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li a');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Toggle hamburger icon between bars and times
        const icon = hamburger.querySelector('i');
        if(navLinks.classList.contains('active')){
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

    // 2. Sticky Navbar & Active Link Update on Scroll
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');

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
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinksItems.forEach(link => {
            link.style.color = ''; // reset
            if (link.getAttribute('href').includes(current)) {
                link.style.color = 'var(--accent-color)';
            }
        });
    });

    // 3. Scroll Animations using Intersection Observer
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
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

    // 5. Fetch GitHub Repositories Dynamically
    const githubContainer = document.getElementById('github-container');
    const githubUsername = 'SridharanK'; // Change to actual GitHub username if different
    
    // Fallback data in case the API call fails or rate limits
    const fallbackRepos = [
        {
            name: 'java-microservices-demo',
            description: 'A comprehensive demonstration of Spring Boot microservices with Eureka, Gateway, and Config Server.',
            language: 'Java',
            html_url: '#'
        },
        {
            name: 'ecommerce-backend-api',
            description: 'RESTful API for e-commerce platforms using Spring MVC, Hibernate, and JWT authentication.',
            language: 'Java',
            html_url: '#'
        },
        {
            name: 'react-portfolio-v1',
            description: 'Previous iteration of my developer portfolio built with React and Tailwind CSS.',
            language: 'JavaScript',
            html_url: '#'
        }
    ];

    function renderRepos(repos) {
        githubContainer.innerHTML = '';
        repos.forEach(repo => {
            const repoElement = document.createElement('div');
            repoElement.className = 'project-card';
            // Use similar styling to projects
            repoElement.innerHTML = `
                <div class="project-content">
                    <div class="project-header">
                        <i class="far fa-bookmark folder-icon" style="font-size: 30px;"></i>
                        <div class="project-links">
                            <a href="${repo.html_url}" target="_blank" aria-label="GitHub Link"><i class="fab fa-github"></i></a>
                        </div>
                    </div>
                    <h3 class="project-title" style="font-size: 18px;">${repo.name}</h3>
                    <div class="project-description">
                        <p>${repo.description || 'No description provided.'}</p>
                    </div>
                    <ul class="project-tech">
                        <li>${repo.language || 'Unknown'}</li>
                    </ul>
                </div>
            `;
            githubContainer.appendChild(repoElement);
        });
    }

    // Try fetching from real API
    fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&direction=desc&per_page=3`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.length > 0) {
                renderRepos(data);
            } else {
                renderRepos(fallbackRepos);
            }
        })
        .catch(error => {
            console.error('Error fetching GitHub repos:', error);
            // Render fallback repos if API fails (e.g., rate limit, fake username)
            renderRepos(fallbackRepos);
        });

    // 6. Form Submission (Prevent default for UI demo)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            btn.style.backgroundColor = 'var(--text-highlight)';
            btn.style.color = 'var(--bg-primary)';
            
            contactForm.reset();
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = '';
                btn.style.color = '';
            }, 3000);
        });
    }
});
