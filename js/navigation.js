// Hero Slideshow functionality
let currentSlide = 0;
let slideshowInterval;

function startSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;
    
    slideshowInterval = setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    
    if (slides.length === 0) return;
    
    // Remove active class
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    // Calculate new slide
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    
    // Add active class
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    // Reset interval
    clearInterval(slideshowInterval);
    startSlideshow();
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    
    if (slides.length === 0) return;
    
    // Remove active class
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    // Set new slide
    currentSlide = index;
    
    // Add active class
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    // Reset interval
    clearInterval(slideshowInterval);
    startSlideshow();
}

// Initialize slideshow on page load
window.addEventListener('DOMContentLoaded', startSlideshow);

// Sidebar toggle
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

// Section navigation
function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    // Close mobile menu if open
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.remove('active');
    }
    
    if (sectionName === 'landing') {
        document.getElementById('landingSection').classList.add('active');
        document.getElementById('lookingForSection').classList.add('active');
    } else if (sectionName === 'registration') {
        document.getElementById('registrationSection').classList.add('active');
    } else {
        document.getElementById(sectionName + 'Section').classList.add('active');
        if (sectionName === 'registrations') {
            loadAllRegistrations();
        }
    }
    
    document.getElementById('sidebar').classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show registration form
function showRegistrationForm() {
    // Close mobile menu if open
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.remove('active');
    }
    
    document.getElementById('landingSection').classList.remove('active');
    document.getElementById('lookingForSection').classList.remove('active');
    document.getElementById('registrationSection').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Back to landing page
function backToLanding() {
    showSection('landing');
}

// Search functionality
function handleSearch(query) {
    const results = document.getElementById('topSearchResults');
    if (!query) {
        results.classList.remove('active');
        return;
    }
    
    const items = [
        { name: 'Registration', section: 'registration' },
        { name: 'Fixtures', section: 'fixtures' },
        { name: 'Stats', section: 'stats' },
        { name: 'Gallery', section: 'gallery' },
        { name: 'Rules', section: 'rules' },
        { name: 'All Registrations', section: 'registrations' }
    ];
    
    const filtered = items.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
    );
    
    if (filtered.length > 0) {
        results.innerHTML = filtered.map(item =>
            `<div class="search-result-item" onclick="showSection('${item.section}'); document.getElementById('topSearchInput').value = ''; document.getElementById('topSearchResults').classList.remove('active');">${item.name}</div>`
        ).join('');
        results.classList.add('active');
    } else {
        results.innerHTML = '<div class="search-result-item">No results found</div>';
        results.classList.add('active');
    }
}

// Close search results when clicking outside
document.addEventListener('click', function(event) {
    const topSearch = document.querySelector('.top-search');
    const resultsDiv = document.getElementById('topSearchResults');
    
    if (topSearch && !topSearch.contains(event.target)) {
        resultsDiv.classList.remove('active');
    }
});

// Gallery tab switching
function switchGalleryTab(tab) {
    document.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.gallery-content').forEach(c => c.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tab === 'earlier' ? 'earlierGallery' : '2026Gallery').classList.add('active');
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Live counter functionality
async function updateLiveCounter() {
    try {
        const { data: registrations, error } = await supabaseClient
            .from('registrations')
            .select('email, created_at')
            .order('created_at', { ascending: false });
        
        if (!error && registrations) {
            const uniquePlayers = new Set(registrations.map(r => r.email)).size;
            const playerCountEl = document.getElementById('playerCount');
            if (playerCountEl) {
                playerCountEl.textContent = uniquePlayers;
            }

            const lastEntryEl = document.getElementById('lastEntryStatus');
            if (lastEntryEl) {
                if (registrations.length === 0) {
                    lastEntryEl.textContent = 'First registration coming soon';
                } else {
                    const lastEntry = new Date(registrations[0].created_at);
                    const now = new Date();
                    const diffMinutes = Math.max(1, Math.floor((now - lastEntry) / 60000));

                    if (diffMinutes < 60) {
                        lastEntryEl.textContent = `Last entry ${diffMinutes} min${diffMinutes > 1 ? 's' : ''} ago`;
                    } else {
                        const diffHours = Math.floor(diffMinutes / 60);
                        lastEntryEl.textContent = `Last entry ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
                    }
                }
            }
        }
    } catch (error) {
        console.log('Counter update error:', error);
    }
}

function updateNavbarOnScroll() {
    const navbar = document.querySelector('.main-nav');
    if (!navbar) return;

    if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', updateNavbarOnScroll);

// Initialize counters
window.addEventListener('DOMContentLoaded', () => {
    updateLiveCounter();
    updateNavbarOnScroll();
    setInterval(updateLiveCounter, 30000);
});

// Made with Bob
