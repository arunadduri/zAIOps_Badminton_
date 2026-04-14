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

// Load gallery images dynamically from GitHub
async function loadGalleryImages() {
    const galleryGrid = document.querySelector('#earlierGallery .gallery-grid');
    
    if (!galleryGrid) return;
    
    // Show loading
    galleryGrid.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-gray);">Loading images...</div>';
    
    try {
        // Fetch from GitHub API
        const response = await fetch('https://api.github.com/repos/arunadduri/zAIOps_Badminton_/contents/images');
        const files = await response.json();
        
        // Filter image files
        const imageFiles = files.filter(file =>
            file.type === 'file' &&
            /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name) &&
            file.name !== '.gitkeep'
        );
        
        galleryGrid.innerHTML = '';
        
        if (imageFiles.length === 0) {
            galleryGrid.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-gray);">No images found</div>';
            return;
        }
        
        // Add images
        imageFiles.forEach((file, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `<img src="imgaes/${file.name}" alt="Tournament Photo ${index + 1}" loading="lazy" onerror="this.parentElement.style.display='none'">`;
            galleryGrid.appendChild(galleryItem);
        });
    } catch (error) {
        console.error('Error loading images:', error);
        galleryGrid.innerHTML = '<div style="text-align: center; padding: 40px; color: #ff4444;">Failed to load images</div>';
    }
}

// Load when page loads
document.addEventListener('DOMContentLoaded', loadGalleryImages);

// Made with Bob
