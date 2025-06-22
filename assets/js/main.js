// Performance and security optimized JavaScript

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Back to Top Button
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
    // Debounced scroll handler
    const handleScroll = debounce(() => {
        backToTop.classList.toggle('show', window.pageYOffset > 300);
    }, 150);

    window.addEventListener('scroll', handleScroll, { passive: true });

    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        // Use requestAnimationFrame for smooth scrolling
        window.requestAnimationFrame(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
}



// Cleanup event listeners on unload
window.addEventListener('unload', () => {
    if (backToTop) {
        window.removeEventListener('scroll', handleScroll);
        backToTop.removeEventListener('click', () => {});
    }
});

// Error handling
window.onerror = (msg, url, lineNo, columnNo, error) => {
    console.error('Error:', msg);
    return false;
};

// Performance monitoring
if (performance && performance.mark) {
    performance.mark('js-loaded');
}

// Initialize hero section animations
function initHeroAnimations() {
    // Add animation class when hero section is in view
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(heroSection);
}

// Initialize particles effect
function initParticles() {
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#ffffff' },
                shape: { type: 'circle' },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: { enable: true, speed: 2, size_min: 0.3, sync: false }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#3b82f6',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'grab' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 1 } },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }
}

// Smooth scrolling for navigation links (مُوحّد)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || !targetId.startsWith('#')) return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            // إغلاق قائمة الجوال إذا كانت مفتوحة
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                new bootstrap.Collapse(navbarCollapse, {toggle: false}).hide();
            }
        }
        // إذا لم يوجد العنصر المستهدف، اسمح بالسلوك الافتراضي للمتصفح
    });
});

// Update active link on scroll
function updateActiveLink() {
    const scrollPosition = window.scrollY + 100;
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');
function handleScroll() {
    const currentScroll = window.pageYOffset;
    if (currentScroll <= 0) {
        navbar.classList.remove('scrolled');
        return;
    }
    navbar.style.transform = 'translateY(0)';
    navbar.classList.add('scrolled');
    lastScroll = currentScroll;
}

// Mobile Menu Functionality
function initMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.nav-link');
    let isMenuOpen = false;

    // Toggle mobile menu
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        navbarCollapse.classList.toggle('show');
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        
        // Toggle aria-expanded attribute
        navbarToggler.setAttribute('aria-expanded', isMenuOpen);
    }

    // Close menu when clicking outside
    function closeMenuOnClickOutside(event) {
        if (isMenuOpen && !navbarCollapse.contains(event.target) && !navbarToggler.contains(event.target)) {
            toggleMenu();
        }
    }

    // Close menu when clicking a nav link
    function closeMenuOnNavLink() {
        if (isMenuOpen) {
            toggleMenu();
        }
    }

    // Add event listeners
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', toggleMenu);
        document.addEventListener('click', closeMenuOnClickOutside);
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenuOnNavLink);
        });
    }

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        document.body.style.overflow = '';
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 991.98) {
                navbarCollapse.classList.remove('show');
                isMenuOpen = false;
                navbarToggler.setAttribute('aria-expanded', 'false');
            }
        }, 250);
    });
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();
    // Initialize particles effect
    initParticles();
    
    // Add scroll event listeners
    window.addEventListener('scroll', () => {
        updateActiveLink();
        handleScroll();
    });
    
    // Initialize active link on page load
    updateActiveLink();
    
    // Initialize hero animations
    initHeroAnimations();
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    const backToTopBtn = document.querySelector('.back-to-top');
    
    // Add hover effect to buttons
    // (تم الإبقاء على التأثير كما هو، إذا لم يكن مستخدماً يمكنك حذفه لاحقاً)
    const buttons = document.querySelectorAll('.hover-effect');
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            button.style.setProperty('--x', `${x}px`);
            button.style.setProperty('--y', `${y}px`);
        });
    });
    
    window.addEventListener('scroll', function() {
        // Add/remove navbar background on scroll
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
            backToTopBtn.classList.add('active');
        } else {
            navbar.classList.remove('scrolled');
            backToTopBtn.classList.remove('active');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {toggle: false});
                    bsCollapse.hide();
                }
            }
        });
    });

    // Back to top button
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Counter animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the faster
    
    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count') || counter.textContent);
            const count = +counter.innerText;
            const increment = target / speed;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(animateCounters, 1);
            } else {
                counter.innerText = target.toLocaleString();
            }
        });
    }
    
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
    
    // Start counter animation when scrolled to the section
    const aboutSection = document.getElementById('about');
    let counted = false;
    
    function checkIfInView() {
        const rect = aboutSection.getBoundingClientRect();
        const isInView = (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
        
        if (isInView && !counted) {
            counted = true;
            animateCounters();
        }
    }
    
    window.addEventListener('scroll', checkIfInView);
    checkIfInView(); // Check on page load
    
    // Testimonials data
    const testimonials = [
        {
            name: 'أحمد محمد',
            position: 'مدير شركة التقنية المتطورة',
            text: 'تعاملت مع شركة السراج المنير في تطوير موقعنا الإلكتروني، وكانت النتيجة رائعة. فريق محترف ويقدم عملًا مميزًا في الوقت المحدد.',
            image: 'img/testimonial1.jpg'
        },
        {
            name: 'سارة أحمد',
            position: 'مالكة متجر إلكتروني',
            'text': 'سعدت بالتعامل مع فريق السراج المنير في إنشاء متجري الإلكتروني. الخدمة ممتازة والدعم الفني سريع وفعال.',
            image: 'img/testimonial2.jpg'
        },
        {
            name: 'خالد عبدالله',
            position: 'مدير تسويق',
            text: 'شركة محترفة تقدم حلولاً تقنية مبتكرة. أنصح بالتعامل معهم لكل من يرغب في تطوير أعماله الرقمية.',
            image: 'img/testimonial3.jpg'
        }
    ];
    
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })

    // Initialize testimonials
    const testimonialSlider = document.querySelector('.testimonial-slider');
    
    if (testimonialSlider) {
        let testimonialHTML = '';
        
        testimonials.forEach((testimonial, index) => {
            const activeClass = index === 0 ? 'active' : '';
            testimonialHTML += `
                <div class="testimonial-item ${activeClass}">
                    <div class="testimonial-img">
                        <img src="${testimonial.image}" alt="${testimonial.name}">
                    </div>
                    <p class="testimonial-text">"${testimonial.text}"</p>
                    <div class="testimonial-author">
                        <h5>${testimonial.name}</h5>
                        <p>${testimonial.position}</p>
                    </div>
                </div>
            `;
        });
        
        testimonialSlider.innerHTML = testimonialHTML;
        
        // Simple testimonial slider
        let currentTestimonial = 0;
        const testimonialItems = document.querySelectorAll('.testimonial-item');
        
        function showTestimonial(index) {
            testimonialItems.forEach(item => item.classList.remove('active'));
            testimonialItems[index].classList.add('fadeInUp');
            testimonialItems[index].classList.add('active');
            
            // Remove animation class after it completes
            setTimeout(() => {
                testimonialItems[index].classList.remove('fadeInUp');
            }, 800);
        }
        
        // Auto slide testimonials
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
            showTestimonial(currentTestimonial);
        }, 5000);
        
        // Manual navigation for testimonials (optional)
        testimonialItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentTestimonial = index;
                showTestimonial(currentTestimonial);
            });
        });
    }

    
    
// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    const contactForm = document.getElementById('contactForm');
    const modalElement = document.getElementById('thankYouModal');
    
    if (!contactForm || !modalElement) {
        console.error('Form or modal element not found');
        return;
    }
    
    console.log('Form and modal elements found');
    
    // Initialize modal
    let modal = null;
    try {
        // Check if Bootstrap is loaded
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            modal = new bootstrap.Modal(modalElement, {
                backdrop: 'static',
                keyboard: false
            });
            console.log('Modal initialized successfully');
        } else {
            console.error('Bootstrap Modal is not loaded');
            // Fallback to show alert if modal fails
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('شكراً لتواصلك معنا! سنرد عليك في أقرب وقت ممكن.');
                this.reset();
            });
            return;
        }
    } catch (error) {
        console.error('Error initializing modal:', error);
        return;
    }
    
    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    console.log('Form inputs:', formInputs.length);
    
    // Function to validate form
    function validateForm() {
        console.log('Validating form...');
        let isValid = true;
        contactForm.classList.add('was-validated');
        
        formInputs.forEach(input => {
            if (!input.checkValidity()) {
                console.log('Invalid input:', input.name);
                isValid = false;
                input.classList.add('is-invalid');
                input.classList.remove('is-valid');
            } else {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
            }
        });
        
        console.log('Form validation result:', isValid);
        return isValid;
    }
    
    // Add input event listeners for real-time validation
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
            }
        });
    });
    
    // Function to handle modal close
    function setupModalCloseHandlers() {
        console.log('Setting up modal close handlers');
        
        // Get the confirm button
        const confirmBtn = document.getElementById('confirmBtn');
        
        // Add event listener for when modal is completely hidden
        const onModalHidden = () => {
            console.log('Modal hidden, refreshing page...');
            // Use a small timeout to ensure the modal is fully hidden
            setTimeout(() => {
                window.location.reload();
            }, 100);
        };

        // Add event listener for modal hidden event
        modalElement.addEventListener('hidden.bs.modal', onModalHidden);
        
        // Add click handler for the confirm button
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function() {
                console.log('Confirm button clicked');
                // The modal will be hidden by the data-bs-dismiss="modal" attribute
            });
        }
        
        // Close button handler
        const closeButton = modalElement.querySelector('.btn-close');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                console.log('Close button clicked');
                // The modal will be hidden by the data-bs-dismiss="modal" attribute
            });
        }
        
        // Close when clicking outside the modal content
        modalElement.addEventListener('click', function(event) {
            if (event.target === modalElement) {
                console.log('Clicked outside modal');
                modal.hide();
            }
        });
        
        // Add a one-time event listener for the shown event to debug
        modalElement.addEventListener('shown.bs.modal', function() {
            console.log('Modal is now shown');
        }, { once: true });
    }
    
    // Form submission handler
    contactForm.addEventListener('submit', function(e) {
        console.log('Form submission started');
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            console.log('Form validation failed');
            return; // Stop if form is not valid
        }
        
        console.log('Form validation passed');
        
        // Get form data
        const formData = new FormData(this);
        const formValues = Object.fromEntries(formData.entries());
        
        // Here you would typically send the form data to a server
        console.log('Form submitted:', formValues);
        
        try {
            // Reset form
            this.reset();
            contactForm.classList.remove('was-validated');
            formInputs.forEach(input => {
                input.classList.remove('is-invalid', 'is-valid');
            });
            
            // Show success message
            console.log('Showing success message...');
            alert('شكراً لتواصلك معنا! سيتم تحديث الصفحة الآن.');
            
            // Refresh the page after a short delay
            setTimeout(() => {
                window.location.reload();
            }, 500);
            
        } catch (error) {
            console.error('Error:', error);
            // Fallback: Show alert and refresh
            alert('شكراً لتواصلك معنا! سيتم تحديث الصفحة الآن.');
            window.location.reload();
        }
    });
});
    
    // Add animation to elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('fadeInUp');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Trigger on page load
    
    // Team Counter Animation
    function animateCounter() {
        const counters = document.querySelectorAll('.counter');
        const speed = 200; // The lower the faster
        
        const startCounting = (counter) => {
            const target = +counter.getAttribute('data-count');
            const count = +counter.innerText;
            const increment = target / speed;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(() => startCounting(counter), 1);
            } else {
                counter.innerText = target;
            }
        };
        
        const startCountersWhenVisible = () => {
            const teamSection = document.getElementById('team');
            if (!teamSection) return;
            
            const teamSectionTop = teamSection.offsetTop;
            const teamSectionHeight = teamSection.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollPosition = window.scrollY;
            
            if (scrollPosition > (teamSectionTop + teamSectionHeight - windowHeight)) {
                counters.forEach(counter => {
                    if (!counter.classList.contains('counting')) {
                        counter.classList.add('counting');
                        startCounting(counter);
                    }
                });
                // Remove the event listener after first trigger
                window.removeEventListener('scroll', startCountersWhenVisible);
            }
        };
        
        // Start counters when team section is in view
        window.addEventListener('scroll', startCountersWhenVisible);
        startCountersWhenVisible(); // Check on page load
    }
    
    // Initialize counter animation
    animateCounter();
    
    // Initialize Testimonials Slider
    function initTestimonialsSlider() {
        const slider = document.querySelector('.testimonials-slider');
        if (!slider) return;

        // Initialize Testimonials Swiper
        const testimonialsSwiper = new Swiper('.testimonials-slider', {
            loop: true,
            spaceBetween: 25,
            slidesPerView: 1,
            centeredSlides: true,
            watchSlidesProgress: true,
            grabCursor: true,
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true,
                renderBullet: function (index, className) {
                    return '<span class="' + className + '"></span>';
                }
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                576: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    centeredSlides: true
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 25,
                    centeredSlides: false,
                },
                992: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                    centeredSlides: false,
                },
                1200: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                    centeredSlides: false,
                }
            },
            on: {
                init: function() {
                    this.slides.forEach(slide => {
                        slide.classList.remove('swiper-slide-active');
                    });
                    this.slides[this.activeIndex].classList.add('swiper-slide-active');
                    
                    // Add accessibility attributes
                    this.pagination.bullets.forEach((bullet, bulletIndex) => {
                        bullet.setAttribute('aria-label', `Go to slide ${bulletIndex + 1}`);
                    });
                },
                slideChange: function() {
                    this.slides.forEach(slide => {
                        slide.classList.remove('swiper-slide-active');
                    });
                    this.slides[this.activeIndex].classList.add('swiper-slide-active');
                },
                slideChangeTransitionStart: function() {
                    // Smooth transition for active slide
                    this.slides.forEach(slide => {
                        slide.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    });
                },
                resize: function() {
                    this.update();
                }
            },
            // Add keyboard control
            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },
            // Add a11y
            a11y: {
                prevSlideMessage: 'Previous testimonial',
                nextSlideMessage: 'Next testimonial',
                paginationBulletMessage: 'Go to testimonial {{index}}',
            },
        });

        // Pause autoplay when hovering over slider
        slider.addEventListener('mouseenter', function() {
            testimonialsSwiper.autoplay.stop();
        });

        slider.addEventListener('mouseleave', function() {
            testimonialsSwiper.autoplay.start();
        });


        // Initialize Brands Slider if exists
        const brandsSlider = document.querySelector('.brands-slider');
        if (brandsSlider) {
            const brandsSwiper = new Swiper('.brands-slider', {
                loop: true,
                slidesPerView: 2,
                spaceBetween: 20,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
                breakpoints: {
                    400: {
                        slidesPerView: 2,
                    },
                    576: {
                        slidesPerView: 3,
                    },
                    768: {
                        slidesPerView: 4,
                    },
                    992: {
                        slidesPerView: 5,
                    }
                }
            });

            // Make brandsSwiper available globally if needed
            window.brandsSwiper = brandsSwiper;
        }


        // Pause autoplay on hover for testimonials
        slider.addEventListener('mouseenter', () => {
            testimonialsSwiper.autoplay.stop();
        });
        slider.addEventListener('mouseleave', () => {
            testimonialsSwiper.autoplay.start();
        });

        // Make testimonialsSwiper available globally if needed
        window.testimonialsSwiper = testimonialsSwiper;
    }
    
    // Initialize the sliders when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        initTestimonialsSlider();
        
        // Initialize back to top button
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 200) {
                    backToTop.classList.add('show');
                } else {
                    backToTop.classList.remove('show');
                }
            });
            
            backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
        
        // Contact form handling is now done in the main form submission handler above
    });
    
    // Portfolio Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Initialize Isotope if available
    if (document.querySelector('.portfolio-grid')) {
        // Filter portfolio items
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-category');
                
                // Show all items first
                portfolioItems.forEach(item => {
                    item.classList.remove('hide');
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                });
                
                // If not 'all', hide items that don't match the filter
                if (filterValue !== 'all') {
                    portfolioItems.forEach(item => {
                        if (item.getAttribute('data-category') !== filterValue) {
                            item.classList.add('hide');
                        }
                    });
                }
                
                // Animate visible items
                setTimeout(() => {
                    portfolioItems.forEach(item => {
                        if (!item.classList.contains('hide')) {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                            item.style.transition = 'all 0.5s ease';
                        }
                    });
                }, 50);
            });
        });
    }
    
    // Initialize lightbox for portfolio previews
    const portfolioPreviews = document.querySelectorAll('.portfolio-preview');
    if (portfolioPreviews.length > 0) {
        // Using GLightbox if available
        if (typeof GLightbox !== 'undefined') {
            const lightbox = GLightbox({
                selector: '.portfolio-preview',
                touchNavigation: true,
                loop: true,
                autoplayVideos: false
            });
        } else {
            // Fallback to basic lightbox
            portfolioPreviews.forEach(preview => {
                preview.addEventListener('click', function(e) {
                    e.preventDefault();
                    const imgSrc = this.getAttribute('href');
                    const lightbox = document.createElement('div');
                    lightbox.className = 'portfolio-lightbox';
                    lightbox.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0,0,0,0.9);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 9999;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                    `;
                    
                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.style.maxWidth = '90%';
                    img.style.maxHeight = '90%';
                    img.style.borderRadius = '5px';
                    
                    lightbox.appendChild(img);
                    document.body.appendChild(lightbox);
                    
                    // Trigger reflow
                    lightbox.offsetHeight;
                    lightbox.style.opacity = '1';
                    
                    // Close on click
                    lightbox.addEventListener('click', function() {
                        lightbox.style.opacity = '0';
                        setTimeout(() => {
                            document.body.removeChild(lightbox);
                        }, 300);
                    });
                });
            });
        }
    }
});

    // Contact Form Handling
    document.addEventListener('DOMContentLoaded', function() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;
        
        const thankYouModal = new bootstrap.Modal(document.getElementById('thankYouModal'));
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        const confirmBtn = document.getElementById('confirmBtn');

        // Function to reset the form
        function resetContactForm() {
            contactForm.reset();
            contactForm.classList.remove('was-validated');
            // Remove all validation classes
            contactForm.querySelectorAll('.form-control').forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });
        }

        // Handle modal confirm button click
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function() {
                console.log('Modal confirm button clicked');
                resetContactForm();
            });
        }

        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            // Validate form
            if (!contactForm.checkValidity()) {
                event.stopPropagation();
                contactForm.classList.add('was-validated');
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> جاري الإرسال...';

            try {
                // Simulate API call (replace with actual fetch/AJAX call)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success modal
                thankYouModal.show();
                
            } catch (error) {
                console.error('Error submitting form:', error);
                // Show error message
                alert('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });

        // Add input validation feedback
        contactForm.querySelectorAll('.form-control').forEach(input => {
            input.addEventListener('input', function() {
                if (this.checkValidity()) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                } else {
                    this.classList.remove('is-valid');
                    this.classList.add('is-invalid');
                }
            });
        });
    });
