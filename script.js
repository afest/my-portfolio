/* ============================================
   PAVEL YUNUSOV — PORTFOLIO SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initImageErrorHandlers();
    initScrollToTop();
    initBurgerMenu();
    initLightbox();
    initProjectCounters();
});

// --- PAGE NAVIGATION ---
function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) {
        window.scrollTo({ top: 0, behavior: 'instant' });
        target.classList.add('active');
        target.classList.remove('fade-in');
        void target.offsetWidth; // trigger reflow
        target.classList.add('fade-in');
    }

    // Update nav active state
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    if (pageId === 'home') document.getElementById('nav-home').classList.add('active');
    if (pageId === 'about') document.getElementById('nav-about').classList.add('active');

    // Close mobile menu if open
    closeMobileMenu();

    // Track page view in Yandex.Metrika
    if (typeof ym === 'function') {
        ym(106890162, 'hit', window.location.href);
    }
}

// --- PROJECT COUNTERS ---
function initProjectCounters() {
    const sections = document.querySelectorAll('.page-section[id^="project-"]');
    const projectIds = Array.from(sections).map(s => s.id);
    const total = projectIds.length;

    document.querySelectorAll('.project-navigation').forEach(nav => {
        const section = nav.closest('.page-section');
        if (!section) return;
        const idx = projectIds.indexOf(section.id);
        if (idx === -1) return;

        const counter = document.createElement('div');
        counter.className = 'project-counter';
        counter.textContent = (idx + 1) + ' / ' + total;

        // Insert between prev and next
        const nextBtn = nav.querySelector('.nav-btn.next');
        if (nextBtn) {
            nav.insertBefore(counter, nextBtn);
        } else {
            nav.appendChild(counter);
        }
    });
}

// --- PROJECT FILTER ---
function filterProjects(category, btn) {
    const cards = document.querySelectorAll('.project-card');
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// --- GLOBAL IMAGE ERROR HANDLER ---
function initImageErrorHandlers() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function () {
            if (this.dataset.errorHandled) return;
            this.dataset.errorHandled = 'true';
            // Use inline SVG data-URI instead of external service
            this.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23eee' width='800' height='600'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%23999'%3EImage%3C/text%3E%3C/svg%3E";
        });
    });
}

// --- SCROLL TO TOP ---
function initScrollToTop() {
    const btn = document.getElementById('scroll-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// --- BURGER MENU ---
function initBurgerMenu() {
    const burger = document.getElementById('burger-btn');
    if (!burger) return;

    burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        document.getElementById('mobile-menu').classList.toggle('open');
        document.body.style.overflow = burger.classList.contains('open') ? 'hidden' : '';
    });
}

function closeMobileMenu() {
    const burger = document.getElementById('burger-btn');
    const menu = document.getElementById('mobile-menu');
    if (burger && menu) {
        burger.classList.remove('open');
        menu.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// --- SCROLL TO FOOTER (Contacts) ---
function scrollToFooter() {
    closeMobileMenu();
    document.querySelector('footer').scrollIntoView({ behavior: 'smooth' });
}

// --- LIGHTBOX ---
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxCounter = document.getElementById('lightbox-counter');
    if (!lightbox) return;

    let images = [];
    let currentIndex = 0;

    function updateCounter() {
        lightboxCounter.textContent = (currentIndex + 1) + ' / ' + images.length;
    }

    function showImage(index) {
        currentIndex = index;
        lightboxImg.src = images[currentIndex].src;
        lightboxImg.alt = images[currentIndex].alt;
        updateCounter();
    }

    function goNext() {
        if (images.length > 0) {
            showImage((currentIndex + 1) % images.length);
        }
    }

    function goPrev() {
        if (images.length > 0) {
            showImage((currentIndex - 1 + images.length) % images.length);
        }
    }

    // Click on any case image to open
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('full-width-image')) {
            // Find the parent case section
            const section = e.target.closest('.page-section');
            if (section) {
                images = Array.from(section.querySelectorAll('.full-width-image'));
            } else {
                images = [e.target];
            }
            currentIndex = images.indexOf(e.target);
            if (currentIndex === -1) currentIndex = 0;
            showImage(currentIndex);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });

    // Navigation
    lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); goPrev(); });
    lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); goNext(); });

    // Close on button click
    lightboxClose.addEventListener('click', closeLightbox);

    // Close on overlay click (but not on image or arrows)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard: Escape, Left, Right
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') goPrev();
        if (e.key === 'ArrowRight') goNext();
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}
