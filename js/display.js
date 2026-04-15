// Load and display all registrations
async function loadAllRegistrations() {
    const container = document.getElementById('registrationsContainer');
    const loading = document.getElementById('registrationsLoading');
    
    loading.style.display = 'block';
    container.innerHTML = '<div class="loading-spinner" id="registrationsLoading" style="display: block;"><div class="spinner"></div><p>Loading registrations...</p></div>';
    
    try {
        const { data: registrations, error } = await supabaseClient
            .from('registrations')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Store data globally for tab filtering
        allRegistrationsData = registrations || [];
        
        // Set default tab to Men's Singles if not already set
        if (!currentRegistrationTab || currentRegistrationTab === 'all') {
            currentRegistrationTab = 'mensSingles';
        }
        
        // Display with current filter
        displayFilteredRegistrations();
        
    } catch (error) {
        console.error('Error loading registrations:', error);
        container.innerHTML = '<p style="text-align: center; color: #ff4444; padding: 40px;">Failed to load registrations. Please try again.</p>';
    }
}

// Fallback image list for local viewing
const fallbackImages = [
    'IMG_4687.jpg',
    'IMG_4101.jpg',
    'IMG_4105.jpg',
    '81c7b00f-a8b0-4782-af30-a54fdfe053e2.jpg'
];

// Load gallery images dynamically from GitHub or fallback
async function loadGalleryImages() {
    const galleryGrid = document.querySelector('#earlierGallery .gallery-grid');
    
    if (!galleryGrid) return;
    
    // Show loading
    galleryGrid.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-gray);">Loading images...</div>';
    
    let imageFiles = [];
    
    try {
        // Try to fetch from GitHub API
        const response = await fetch('https://api.github.com/repos/arunadduri/zAIOps_Badminton_/contents/Photos');
        const files = await response.json();
        
        // Filter image files
        imageFiles = files.filter(file =>
            file.type === 'file' &&
            /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name) &&
            file.name !== '.gitkeep'
        ).map(file => file.name);
    } catch (error) {
        console.log('Using fallback images for local viewing');
        imageFiles = fallbackImages;
    }
    
    galleryGrid.innerHTML = '';
    
    if (imageFiles.length === 0) {
        galleryGrid.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-gray);">No images found</div>';
        return;
    }
    
    // Add images with click to expand
    imageFiles.forEach((fileName, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `<img src="Photos/${fileName}" alt="Tournament Photo ${index + 1}" loading="lazy" onclick="expandImage(this.src)" onerror="this.parentElement.style.display='none'">`;
        galleryGrid.appendChild(galleryItem);
    });
}

// Image lightbox/expand functionality
let currentLightboxIndex = 0;
let lightboxImages = [];

function expandImage(src) {
    // Get all gallery images
    const galleryImgs = document.querySelectorAll('#earlierGallery .gallery-item img');
    lightboxImages = Array.from(galleryImgs).map(img => img.src);
    currentLightboxIndex = lightboxImages.indexOf(src);
    
    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.id = 'imageLightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
            <button class="lightbox-arrow lightbox-arrow-left" onclick="navigateLightbox(-1)">❮</button>
            <img src="${src}" alt="Expanded Image" id="lightboxImage">
            <button class="lightbox-arrow lightbox-arrow-right" onclick="navigateLightbox(1)">❯</button>
            <div class="lightbox-counter">${currentLightboxIndex + 1} / ${lightboxImages.length}</div>
        </div>
    `;
    document.body.appendChild(lightbox);
    
    // Close on click outside image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

function navigateLightbox(direction) {
    currentLightboxIndex = (currentLightboxIndex + direction + lightboxImages.length) % lightboxImages.length;
    const lightboxImg = document.getElementById('lightboxImage');
    const counter = document.querySelector('.lightbox-counter');
    
    if (lightboxImg) {
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = lightboxImages[currentLightboxIndex];
            lightboxImg.style.opacity = '1';
            if (counter) {
                counter.textContent = `${currentLightboxIndex + 1} / ${lightboxImages.length}`;
            }
        }, 200);
    }
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        lightbox.remove();
    }
}

// Close lightbox with Escape key and navigate with arrow keys
document.addEventListener('keydown', function(e) {
    const lightbox = document.getElementById('imageLightbox');
    if (!lightbox) return;
    
    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowLeft') {
        navigateLightbox(-1);
    } else if (e.key === 'ArrowRight') {
        navigateLightbox(1);
    }
});

// Load when page loads
document.addEventListener('DOMContentLoaded', loadGalleryImages);


// Registration tab switching
let currentRegistrationTab = 'mensSingles';
let allRegistrationsData = [];

function switchRegistrationTab(tab) {
    currentRegistrationTab = tab;
    
    // Update tab buttons
    document.querySelectorAll('.registration-tab').forEach(t => t.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Filter and display registrations
    displayFilteredRegistrations();
}

// Initialize first tab as active on page load
document.addEventListener('DOMContentLoaded', function() {
    const firstTab = document.querySelector('.registration-tab');
    if (firstTab) {
        firstTab.classList.add('active');
    }
});

// Helper function to get initials
function getInitials(name) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

// Helper function to format relative time with exact time
function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    const exactTime = date.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    let relativeTime;
    if (diffMins < 60) {
        relativeTime = diffMins <= 1 ? 'Just now' : `${diffMins} mins ago`;
    } else if (diffHours < 24) {
        relativeTime = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
        relativeTime = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
        return exactTime;
    }
    
    return `<div class="time-display"><span class="relative-time">${relativeTime}</span><span class="exact-time">(${exactTime})</span></div>`;
}

// Helper function to get last entry time
function getLastEntryTime(registrations) {
    if (!registrations || registrations.length === 0) return 'No entries yet';
    
    const latest = registrations[0];
    const date = new Date(latest.created_at);
    const now = new Date();
    const diffHours = Math.floor((now - date) / 3600000);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffHours / 24)} day${Math.floor(diffHours / 24) > 1 ? 's' : ''} ago`;
}

function displayFilteredRegistrations() {
    const container = document.getElementById('registrationsContainer');
    
    if (allRegistrationsData.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-gray); padding: 40px;">No registrations yet. Be the first to register!</p>';
        return;
    }
    
    const categoryMap = {
        'mensSingles': "Men's Singles",
        'mensDoubles': "Men's Doubles",
        'womensSingles': "Women's Singles",
        'womensDoubles': "Women's Doubles",
        'mixedDoubles': "Mixed Doubles"
    };
    
    // Filter registrations for selected category only
    let filteredData = allRegistrationsData.filter(reg => reg.category === currentRegistrationTab);
    
    // Group by category
    const groupedByCategory = {};
    filteredData.forEach(reg => {
        if (!groupedByCategory[reg.category]) {
            groupedByCategory[reg.category] = [];
        }
        groupedByCategory[reg.category].push(reg);
    });
    
    container.innerHTML = '';
    
    // Display selected category
    const categoryKey = currentRegistrationTab;
    
    if (groupedByCategory[categoryKey] && groupedByCategory[categoryKey].length > 0) {
        const section = document.createElement('div');
        section.className = 'category-section';
        
        const registrations = groupedByCategory[categoryKey];
        const count = registrations.length;
        const lastEntry = getLastEntryTime(registrations);
        const maxSlots = 16;
        const slotsLeft = Math.max(0, maxSlots - count);
        
        const header = document.createElement('div');
        header.className = 'category-header-enhanced';
        const teamLabel = categoryKey.includes('Doubles') ? 'Teams' : 'Players';
        header.innerHTML = `
            <div class="header-content">
                <div class="header-title">
                    <h2>${categoryMap[categoryKey]}</h2>
                    <span class="player-count-badge">${count} ${teamLabel}</span>
                </div>
                <div class="header-stats-compact">
                    <span class="stat-text"><strong>${count}</strong> ${teamLabel}</span>
                    <span class="stat-separator">•</span>
                    <span class="stat-text">Last entry <strong>${lastEntry}</strong></span>
                </div>
            </div>
        `;
        section.appendChild(header);
        
        const table = document.createElement('table');
        table.className = 'registrations-table';
        
        const hasPartner = categoryKey.includes('Doubles');
        
        table.innerHTML = `
            <thead class="sticky-header">
                <tr>
                    <th class="col-name">Name</th>
                    <th class="col-email">Email</th>
                    ${hasPartner ? '<th class="col-partner">Partner Name</th><th class="col-partner-email">Partner Email</th>' : ''}
                    <th class="col-time">Registered</th>
                    <th class="col-status">Status</th>
                </tr>
            </thead>
            <tbody>
                ${registrations.map((reg, index) => `
                    <tr class="table-row">
                        <td class="col-name">
                            <div class="player-info">
                                <span class="player-avatar avatar-${index % 3}">${getInitials(reg.name)}</span>
                                <span class="player-name">${reg.name}</span>
                            </div>
                        </td>
                        <td class="col-email">${reg.email}</td>
                        ${hasPartner ? `
                            <td class="col-partner">
                                <div class="player-info">
                                    <span class="player-avatar avatar-${(index + 1) % 3}">${getInitials(reg.partner_name || 'NA')}</span>
                                    <span class="player-name">${reg.partner_name || '-'}</span>
                                </div>
                            </td>
                            <td class="col-partner-email">${reg.partner_email || '-'}</td>
                        ` : ''}
                        <td class="col-time">${formatRelativeTime(reg.created_at)}</td>
                        <td class="col-status">
                            <span class="status-badge status-confirmed">✓ Confirmed</span>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        
        section.appendChild(table);
        container.appendChild(section);
    } else {
        // Show premium empty state
        const categoryName = categoryMap[categoryKey];
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🏸</div>
                <h2>No registrations yet for ${categoryName}</h2>
                <p>Be the first to register and secure your spot!</p>
                <button class="empty-state-cta" onclick="showRegistrationForm()">Register Now</button>
                <p class="empty-state-subtitle">Join the tournament and compete with the best</p>
            </div>
        `;
    }
}
// Made with Bob

// Filter registrations by search term
function filterRegistrations(searchTerm) {
    const rows = document.querySelectorAll('.registrations-table tbody tr.table-row');
    const term = searchTerm.toLowerCase().trim();
    
    rows.forEach(row => {
        const name = row.querySelector('.player-name')?.textContent.toLowerCase() || '';
        const email = row.querySelector('.col-email')?.textContent.toLowerCase() || '';
        const partnerName = row.querySelector('.col-partner .player-name')?.textContent.toLowerCase() || '';
        const partnerEmail = row.querySelector('.col-partner-email')?.textContent.toLowerCase() || '';
        
        const matches = name.includes(term) || email.includes(term) || 
                       partnerName.includes(term) || partnerEmail.includes(term);
        
        if (matches || term === '') {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}
