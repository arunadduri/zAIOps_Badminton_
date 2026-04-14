// Slideshow functionality
function startSlideshow() {
    const slides = document.querySelectorAll('.slide');
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 3000);
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
    window.scrollTo(0, 0);
}

// Show registration form
function showRegistrationForm() {
    document.getElementById('landingSection').classList.remove('active');
    document.getElementById('lookingForSection').classList.remove('active');
    document.getElementById('registrationSection').classList.add('active');
    window.scrollTo(0, 0);
}

// Back to landing page
function backToLanding() {
    showSection('landing');
}

// Search functionality
function handleSearch(query) {
    const results = document.getElementById('searchResults');
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
            `<div class="search-result-item" onclick="showSection('${item.section}')">${item.name}</div>`
        ).join('');
        results.classList.add('active');
    } else {
        results.classList.remove('active');
    }
}

// Gallery tab switching
function switchGalleryTab(tab) {
    document.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.gallery-content').forEach(c => c.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tab === 'earlier' ? 'earlierGallery' : '2026Gallery').classList.add('active');
}

// Made with Bob
