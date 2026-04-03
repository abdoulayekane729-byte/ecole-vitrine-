/* ================================================================
   ÉCOLE LA SAGESSE — main.js
   Script pour animations, interactions et fonctionnalités
   ================================================================ */

// ─────────────────────────────────────────────────────────────
// 1. MENU HAMBURGER MOBILE
// ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.nav-hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('open');
        });

        // Fermer le menu quand on clique sur un lien
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });

        // Fermer le menu en cliquant en dehors
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                navLinks.classList.remove('open');
            }
        });
    }

    // ─────────────────────────────────────────────────────────────
    // 2. ANIMATION DES STATISTIQUES (compteur)
    // ─────────────────────────────────────────────────────────────
    const statNumbers = document.querySelectorAll('.stat-number');
    let animationTriggered = false;

    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const suffix = stat.getAttribute('data-suffix') || '';
            const duration = 2500; // 2.5 secondes
            const steps = 60;
            const increment = target / steps;
            let current = 0;

            const interval = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(interval);
                }
                stat.textContent = Math.floor(current) + suffix;
            }, duration / steps);
        });
    };

    // Déclencher l'animation seulement si les stats sont visibles
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animationTriggered) {
                    animationTriggered = true;
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    // ─────────────────────────────────────────────────────────────
    // 3. EFFET REVEAL AU SCROLL (intersection observer)
    // ─────────────────────────────────────────────────────────────
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ─────────────────────────────────────────────────────────────
    // 4. ACCORDION (questions fréquentes, règlement)
    // ─────────────────────────────────────────────────────────────
    const accordionButtons = document.querySelectorAll('.accordion-btn');

    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const item = button.closest('.accordion-item');
            const isOpen = item.classList.contains('open');

            // Fermer tous les autres éléments
            document.querySelectorAll('.accordion-item.open').forEach(openItem => {
                if (openItem !== item) {
                    openItem.classList.remove('open');
                }
            });

            // Toggle l'élément courant
            item.classList.toggle('open');
        });
    });

    // ─────────────────────────────────────────────────────────────
    // 5. VALIDATION FORMULAIRE DE CONTACT
    // ─────────────────────────────────────────────────────────────
    const contactForm = document.querySelector('.contact-form-card form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Récupérer les valeurs
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Validation basique
            if (!data.nom || !data.email || !data.message) {
                alert('⚠️ Veuillez remplir tous les champs obligatoires');
                return;
            }

            // Validation email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('⚠️ Veuillez entrer une adresse email valide');
                return;
            }

            // Afficher un message de succès
            alert('✓ Votre message a été envoyé avec succès!\nNous vous répondrons dans les 24 heures.');
            contactForm.reset();
        });
    }

    // ─────────────────────────────────────────────────────────────
    // 6. GALLERY LIGHTBOX (optionnel - si galerie présente)
    // ─────────────────────────────────────────────────────────────
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgSrc = item.querySelector('img')?.src;
                if (imgSrc) {
                    openLightbox(imgSrc);
                }
            });
        });
    }

    function openLightbox(src) {
        const lightbox = document.createElement('div');
        lightbox.style.cssText = `
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            cursor: pointer;
        `;

        const img = document.createElement('img');
        img.src = src;
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
        `;

        lightbox.appendChild(img);
        document.body.appendChild(lightbox);

        lightbox.addEventListener('click', () => {
            lightbox.remove();
        });
    }

    // ─────────────────────────────────────────────────────────────
    // 7. SCROLL SPY - Highlight menu actif en fonction de la section
    // ─────────────────────────────────────────────────────────────
    const navLinks2 = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = document.querySelectorAll('section[id], div[id]');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks2.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // ─────────────────────────────────────────────────────────────
    // 8. SMOOTH SCROLL
    // ─────────────────────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// ─────────────────────────────────────────────────────────────
// 9. FONCTION UTILE - Détecter la hauteur du viewport
// ─────────────────────────────────────────────────────────────
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ─────────────────────────────────────────────────────────────
// 10. ANIMATION PARALLAXE LÉGÈRE (optionnel)
// ─────────────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrollPosition = window.scrollY;
        hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
    }
});
