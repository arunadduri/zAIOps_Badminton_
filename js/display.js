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

// Gallery lightbox state
let galleryImages = [];
let currentLightboxIndex = 0;
let lightboxScale = 1;
let lightboxPosX = 0;
let lightboxPosY = 0;
let lightboxIsDragging = false;
let lightboxStartX = 0;
let lightboxStartY = 0;

// Load gallery images from JSON configuration file
async function loadGalleryImages() {
    const galleryGrid = document.querySelector('#earlierGallery .gallery-grid');
    
    if (!galleryGrid) return;
    
    galleryGrid.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-gray);"><div class="spinner"></div><p>Loading gallery...</p></div>';
    
    try {
        // Load image list from JSON file
        const response = await fetch('Photos/images.json');
        const imageFiles = await response.json();
        
        if (!imageFiles || imageFiles.length === 0) {
            throw new Error('No images in configuration');
        }
        
        galleryImages = imageFiles.map(fileName => `Photos/${fileName}`);
        displayGalleryImages(imageFiles);
        
    } catch (error) {
        console.error('Error loading gallery images:', error);
        // Fallback: Use a predefined list if JSON loading fails
        const fallbackImages = [
            'IMG_4687.jpg',
            'IMG_4101.jpg',
            'IMG_4105.jpg',
            '81c7b00f-a8b0-4782-af30-a54fdfe053e2.jpg'
        ];
        
        galleryImages = fallbackImages.map(fileName => `Photos/${fileName}`);
        displayGalleryImages(fallbackImages);
    }
}

function displayGalleryImages(imageFiles) {
    const galleryGrid = document.querySelector('#earlierGallery .gallery-grid');
    
    if (!galleryGrid) return;
    
    galleryGrid.innerHTML = '';
    
    if (imageFiles.length === 0) {
        galleryGrid.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-gray);">No images found</div>';
        return;
    }
    
    imageFiles.forEach((fileName, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('onclick', `openLightbox(${index})`);

        const imageElement = document.createElement('img');
        imageElement.src = `Photos/${fileName}`;
        imageElement.alt = `Tournament Photo ${index + 1}`;
        imageElement.loading = 'lazy';
        imageElement.dataset.index = String(index);
        imageElement.style.cursor = 'pointer';
        imageElement.setAttribute('onclick', `openLightbox(${index})`);

        imageElement.onerror = function() {
            this.parentElement.style.display = 'none';
        };

        imageElement.addEventListener('click', () => openLightbox(index));

        galleryItem.addEventListener('mousemove', (e) => {
            const rect = galleryItem.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = (y / rect.height - 0.5) * 10;
            const rotateY = (x / rect.width - 0.5) * -10;

            galleryItem.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.03)`;
        });

        galleryItem.addEventListener('mouseleave', () => {
            galleryItem.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
        });

        galleryItem.appendChild(imageElement);
        galleryGrid.appendChild(galleryItem);
    });
}

function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    if (!lightbox || !lightboxImg || galleryImages.length === 0) return;

    currentLightboxIndex = Math.max(0, Math.min(index, galleryImages.length - 1));
    resetLightboxTransform();
    lightboxImg.src = galleryImages[currentLightboxIndex];
    updateLightboxCounter();
    lightbox.style.display = 'flex';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        lightbox.style.display = 'none';
    }
    lightboxIsDragging = false;
    resetLightboxTransform();
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    if (galleryImages.length === 0) return;

    currentLightboxIndex = (currentLightboxIndex + direction + galleryImages.length) % galleryImages.length;
    const lightboxImg = document.getElementById('lightbox-img');

    if (lightboxImg) {
        resetLightboxTransform();
        lightboxImg.src = galleryImages[currentLightboxIndex];
        updateLightboxCounter();
    }
}

function updateLightboxCounter() {
    const counter = document.getElementById('lightboxCounter');
    if (counter && galleryImages.length > 0) {
        counter.textContent = `${currentLightboxIndex + 1} / ${galleryImages.length}`;
    }
}

function updateLightboxTransform() {
    const lightboxImg = document.getElementById('lightbox-img');
    if (!lightboxImg) return;

    lightboxImg.style.transform = `translate(${lightboxPosX}px, ${lightboxPosY}px) scale(${lightboxScale})`;
}

function resetLightboxTransform() {
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxScale = 1;
    lightboxPosX = 0;
    lightboxPosY = 0;

    if (!lightboxImg) return;

    lightboxImg.style.transform = 'translate(0px, 0px) scale(1)';
    lightboxImg.style.cursor = 'grab';
}

document.addEventListener('keydown', function(e) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || !lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowLeft') {
        navigateLightbox(-1);
    } else if (e.key === 'ArrowRight') {
        navigateLightbox(1);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    loadGalleryImages();

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    if (lightboxImg) {
        resetLightboxTransform();

        lightboxImg.addEventListener('wheel', function(e) {
            e.preventDefault();
            lightboxScale += e.deltaY * -0.0015;
            lightboxScale = Math.min(Math.max(1, lightboxScale), 3);
            updateLightboxTransform();
        });

        lightboxImg.addEventListener('mousedown', function(e) {
            e.preventDefault();
            lightboxIsDragging = true;
            lightboxStartX = e.clientX - lightboxPosX;
            lightboxStartY = e.clientY - lightboxPosY;
            lightboxImg.style.cursor = 'grabbing';
        });

        lightboxImg.addEventListener('dblclick', function(e) {
            e.preventDefault();
            if (lightboxScale > 1) {
                resetLightboxTransform();
            } else {
                lightboxScale = 2;
                lightboxPosX = 0;
                lightboxPosY = 0;
                updateLightboxTransform();
                lightboxImg.style.cursor = 'grab';
            }
        });

        document.addEventListener('mouseup', function() {
            if (!lightboxIsDragging) return;
            lightboxIsDragging = false;
            lightboxImg.style.cursor = 'grab';
        });

        document.addEventListener('mousemove', function(e) {
            if (!lightboxIsDragging) return;
            lightboxPosX = e.clientX - lightboxStartX;
            lightboxPosY = e.clientY - lightboxStartY;
            updateLightboxTransform();
        });
    }
});


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
                    ${hasPartner ? '<th class="col-partner">Partner Name</th>' : ''}
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
                        ${hasPartner ? `
                            <td class="col-partner">
                                <div class="player-info">
                                    <span class="player-avatar avatar-${(index + 1) % 3}">${getInitials(reg.partner_name || 'NA')}</span>
                                    <span class="player-name">${reg.partner_name || '-'}</span>
                                </div>
                            </td>
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
        const partnerName = row.querySelector('.col-partner .player-name')?.textContent.toLowerCase() || '';

        const matches = name.includes(term) || partnerName.includes(term);
        
        if (matches || term === '') {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}
