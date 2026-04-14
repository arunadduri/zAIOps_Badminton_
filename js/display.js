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
            .order('timestamp', { ascending: false });
        
        if (error) throw error;
        
        const categoryMap = {
            'mensSingles': "Men's Singles",
            'mensDoubles': "Men's Doubles",
            'womensSingles': "Women's Singles",
            'womensDoubles': "Women's Doubles",
            'mixedDoubles': "Mixed Doubles"
        };
        
        // Group registrations by category
        const groupedByCategory = {};
        registrations.forEach(reg => {
            if (!groupedByCategory[reg.category]) {
                groupedByCategory[reg.category] = [];
            }
            groupedByCategory[reg.category].push(reg);
        });
        
        container.innerHTML = '';
        
        // Create tables for each category
        Object.keys(categoryMap).forEach(categoryKey => {
            if (groupedByCategory[categoryKey] && groupedByCategory[categoryKey].length > 0) {
                const section = document.createElement('div');
                section.className = 'category-section';
                
                const header = document.createElement('div');
                header.className = 'category-header';
                header.innerHTML = `<h3>${categoryMap[categoryKey]} (${groupedByCategory[categoryKey].length})</h3>`;
                section.appendChild(header);
                
                const table = document.createElement('table');
                table.className = 'registrations-table';
                
                const hasPartner = categoryKey.includes('Doubles');
                
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            ${hasPartner ? '<th>Partner Name</th><th>Partner Email</th>' : ''}
                            <th>Registered On</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${groupedByCategory[categoryKey].map((reg, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${reg.name}</td>
                                <td>${reg.email}</td>
                                ${hasPartner ? `<td>${reg.partner_name || '-'}</td><td>${reg.partner_email || '-'}</td>` : ''}
                                <td>${new Date(reg.timestamp).toLocaleDateString('en-IN', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                `;
                
                section.appendChild(table);
                container.appendChild(section);
            }
        });
        
        if (Object.keys(groupedByCategory).length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-gray); padding: 40px;">No registrations yet. Be the first to register!</p>';
        }
        
    } catch (error) {
        console.error('Error loading registrations:', error);
        container.innerHTML = '<p style="text-align: center; color: #ff4444; padding: 40px;">Failed to load registrations. Please try again.</p>';
    }
}

// Gallery image configuration - Add all your image filenames here
const earlierTournamentImages = [
    'IMG_4687.jpg',
    'IMG_4101.jpg',
    'IMG_4105.jpg',
    'IMG_4106.jpg',
    'IMG_4107.jpg',
    'IMG_4108.jpg',
    'IMG_4109.jpg',
    'IMG_4110.jpg',
    'IMG_4111.jpg',
    'IMG_4112.jpg',
    'IMG_4113.jpg',
    'IMG_4114.jpg',
    'IMG_4115.jpg',
    'IMG_4116.jpg',
    'IMG_4117.jpg',
    'IMG_4118.jpg',
    'IMG_4119.jpg',
    'IMG_4120.jpg'
    // Add more image filenames here as you upload them to imgaes folder
];

// Load gallery images dynamically
function loadGalleryImages() {
    const galleryGrid = document.querySelector('#earlierGallery .gallery-grid');
    
    if (!galleryGrid) return;
    
    // Clear existing content
    galleryGrid.innerHTML = '';
    
    // Add each image without caption
    earlierTournamentImages.forEach((imageName, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        galleryItem.innerHTML = `
            <img src="imgaes/${imageName}" alt="Tournament Photo ${index + 1}" loading="lazy" onerror="this.parentElement.style.display='none'">
        `;
        
        galleryGrid.appendChild(galleryItem);
    });
}

// Load gallery when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadGalleryImages();
});

// Made with Bob
