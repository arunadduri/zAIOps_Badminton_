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
    const tabs = document.querySelectorAll('.gallery-tab');
    const contents = document.querySelectorAll('.gallery-content');
    const targetId = tab === 'earlier' ? 'earlierGallery' : '2026Gallery';
    const targetPanel = document.getElementById(targetId);

    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));

    if (typeof event !== 'undefined' && event && event.target) {
        event.target.classList.add('active');
    } else {
        const matchingTab = Array.from(tabs).find(t => t.textContent.toLowerCase().includes(tab.toLowerCase()));
        if (matchingTab) {
            matchingTab.classList.add('active');
        }
    }

    if (targetPanel) {
        targetPanel.classList.add('active');
        return;
    }

    const fallbackPanel = document.getElementById('earlierGallery');
    if (fallbackPanel) {
        fallbackPanel.classList.add('active');
        const earlierTab = Array.from(tabs).find(t => t.textContent.toLowerCase().includes('earlier'));
        tabs.forEach(t => t.classList.remove('active'));
        if (earlierTab) {
            earlierTab.classList.add('active');
        }
    }
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
            .select('email', { count: 'exact' });
        
        if (!error && registrations) {
            // Count unique players
            const uniquePlayers = new Set(registrations.map(r => r.email)).size;
            const playerCountEl = document.getElementById('playerCount');
            if (playerCountEl) {
                playerCountEl.textContent = uniquePlayers;
            }
        }
    } catch (error) {
        console.log('Counter update error:', error);
    }
}

// Countdown timer
function updateCountdown() {
    const tournamentDate = new Date('2026-05-01T09:00:00+05:30'); // Adjust date as needed
    const now = new Date();
    const diff = tournamentDate - now;
    
    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        const countdownEl = document.getElementById('countdown');
        if (countdownEl) {
            countdownEl.textContent = `${days} days ${hours} hours`;
        }
    }
}

// Initialize counters
window.addEventListener('DOMContentLoaded', () => {
    updateLiveCounter();
    updateCountdown();
    setInterval(updateLiveCounter, 30000); // Update every 30 seconds
    setInterval(updateCountdown, 60000); // Update every minute
});

// Made with Bob
