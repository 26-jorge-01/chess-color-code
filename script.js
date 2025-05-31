// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden'); // Basic toggle
            mobileMenu.classList.toggle('menu-open'); // For advanced animation control
            
            // ARIA attribute for accessibility
            const isExpanded = menuButton.getAttribute('aria-expanded') === 'true' || false;
            menuButton.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.setAttribute('aria-hidden', isExpanded); // if hidden, aria-hidden is true

            if (mobileMenu.classList.contains('menu-open')) {
                 // Optional: Change icon to 'X'
                menuButton.innerHTML = `
                    <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>`;
            } else {
                // Restore burger icon
                menuButton.innerHTML = `
                    <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>`;
            }
        });

        // Close mobile menu when a link is clicked
        const mobileNavLinks = mobileMenu.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('menu-open');
                menuButton.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
                 menuButton.innerHTML = `
                    <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>`;
            });
        });
    }

    // Smooth Scroll for all anchor links (redundant if html.scroll-smooth is well-supported, but good fallback)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hrefAttribute = this.getAttribute('href');
            if (hrefAttribute && hrefAttribute !== '#' && document.querySelector(hrefAttribute)) {
                 e.preventDefault();
                 document.querySelector(hrefAttribute).scrollIntoView({
                     behavior: 'smooth'
                 });
            }
        });
    });
    
    // Intersection Observer for animations on scroll
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observerInstance.unobserve(entry.target); // Optional: Stop observing once animated
                }
            });
        }, { threshold: 0.1 }); // Trigger when 10% of the element is visible

        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        animatedElements.forEach(el => el.classList.add('is-visible'));
    }

    // Update current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Optional: Active Nav Link Styling on Scroll (more complex)
    // This requires careful calculation of section offsets.
    // For simplicity, a CSS class like .nav-link-active can be manually applied or based on #hash in URL.
    // Example of simple hash-based active link:
    const updateActiveNavLink = () => {
        const sections = document.querySelectorAll('main section[id]');
        const navLinks = document.querySelectorAll('.nav-link'); // For desktop
        const mobileNavLinks = document.querySelectorAll('.nav-link-mobile'); // For mobile

        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - (window.innerHeight / 2) ) { // Adjust offset as needed
                currentSectionId = section.getAttribute('id');
            }
        });
        
        const setActive = (links) => {
            links.forEach(link => {
                link.classList.remove('nav-link-active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('nav-link-active');
                }
            });
        }
        setActive(navLinks);
        setActive(mobileNavLinks);
    };
    
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Initial call

});