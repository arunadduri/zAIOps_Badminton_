// Gender selection handler
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('input[name="gender"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const categorySection = document.getElementById('categorySection');
            const categoryOptions = document.getElementById('categoryOptions');
            const partnerSection = document.getElementById('partnerSection');
            const gender = this.value.toLowerCase();
            
            categoryOptions.innerHTML = '';
            partnerSection.innerHTML = '';
            partnerSection.classList.add('hidden');
            
            categories[gender].forEach(cat => {
                const div = document.createElement('div');
                div.className = 'checkbox-option';
                div.innerHTML = `
                    <input type="checkbox" id="${cat.id}" name="category" value="${cat.id}" 
                           data-has-partner="${cat.hasPartner}" data-label="${cat.label}">
                    <label for="${cat.id}">${cat.label}</label>
                `;
                categoryOptions.appendChild(div);
            });
            
            categorySection.classList.remove('hidden');
            
            document.querySelectorAll('input[name="category"]').forEach(checkbox => {
                checkbox.addEventListener('change', updatePartnerSection);
            });
        });
    });
});

// Update partner section based on selected categories
function updatePartnerSection() {
    const partnerSection = document.getElementById('partnerSection');
    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'));
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    
    // Save existing values before clearing
    const savedValues = {};
    selectedCategories.forEach(checkbox => {
        if (checkbox.dataset.hasPartner === 'true') {
            const category = checkbox.value;
            const nameField = document.getElementById(`${category}PartnerName`);
            const emailField = document.getElementById(`${category}PartnerEmail`);
            if (nameField && emailField) {
                savedValues[category] = {
                    name: nameField.value,
                    email: emailField.value
                };
            }
        }
    });
    
    partnerSection.innerHTML = '';
    
    if (selectedCategories.length > 0) {
        selectedCategories.forEach(checkbox => {
            if (checkbox.dataset.hasPartner === 'true') {
                const category = checkbox.value;
                const categoryLabel = checkbox.dataset.label;
                const partnerGender = category === 'mixedDoubles' 
                    ? (gender === 'Male' ? 'Female' : 'Male') 
                    : '';
                
                const div = document.createElement('div');
                div.className = 'partner-fields';
                div.innerHTML = `
                    <h3>${categoryLabel} - Partner Details</h3>
                    <div class="form-group">
                        <label for="${category}PartnerName">Partner Name *</label>
                        <input type="text" id="${category}PartnerName" 
                               placeholder="${partnerGender ? partnerGender + ' ' : ''}Partner's full name"
                               value="${savedValues[category]?.name || ''}">
                    </div>
                    <div class="form-group">
                        <label for="${category}PartnerEmail">Partner IBM Email ID *</label>
                        <input type="email" id="${category}PartnerEmail" 
                               placeholder="partner.name@ibm.com"
                               value="${savedValues[category]?.email || ''}">
                    </div>
                `;
                partnerSection.appendChild(div);
            }
        });
        
        if (partnerSection.children.length > 0) {
            partnerSection.classList.remove('hidden');
        } else {
            partnerSection.classList.add('hidden');
        }
    } else {
        partnerSection.classList.add('hidden');
    }
}

// Error handling
function showError(message, fieldId = null) {
    clearTimeout(errorTimeout);
    
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    if (fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.classList.add('error');
            field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    errorTimeout = setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 15000);
}

function clearError() {
    clearTimeout(errorTimeout);
    document.getElementById('errorMessage').style.display = 'none';
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

// Clear errors on form interaction
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    if (form) {
        form.addEventListener('input', clearError);
        form.addEventListener('change', clearError);
    }
});

// Close success overlay
function closeSuccessOverlay() {
    document.getElementById('successOverlay').classList.remove('show');
    document.getElementById('registrationForm').reset();
    document.getElementById('categorySection').classList.add('hidden');
    document.getElementById('partnerSection').classList.add('hidden');
    clearError();
}

// Form submission
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('registrationForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'));
        
        // Validation
        const emailLower = email.toLowerCase();
        if (!emailLower.endsWith('@ibm.com') && !emailLower.endsWith('@in.ibm.com')) {
            showError('Email must be an IBM email address (@ibm.com or @in.ibm.com)', 'email');
            return;
        }
        
        if (selectedCategories.length === 0) {
            showError('Please select at least one category.');
            return;
        }
        
        // Validate partner fields
        for (const checkbox of selectedCategories) {
            if (checkbox.dataset.hasPartner === 'true') {
                const category = checkbox.value;
                const partnerName = document.getElementById(`${category}PartnerName`)?.value.trim();
                const partnerEmail = document.getElementById(`${category}PartnerEmail`)?.value.trim();
                
                if (!partnerName) {
                    showError(`Please provide partner name for ${checkbox.dataset.label}.`, `${category}PartnerName`);
                    return;
                }
                if (!partnerEmail) {
                    showError(`Please provide partner email for ${checkbox.dataset.label}.`, `${category}PartnerEmail`);
                    return;
                }
                const partnerEmailLower = partnerEmail.toLowerCase();
                if (!partnerEmailLower.endsWith('@ibm.com') && !partnerEmailLower.endsWith('@in.ibm.com')) {
                    showError('Partner email must be an IBM email address (@ibm.com or @in.ibm.com)', `${category}PartnerEmail`);
                    return;
                }
                if (partnerEmail.toLowerCase() === email.toLowerCase()) {
                    showError('Partner email cannot be the same as your email address.', `${category}PartnerEmail`);
                    return;
                }
            }
        }
        
        // Show loading
        document.getElementById('loadingSpinner').style.display = 'block';
        document.getElementById('submitBtn').disabled = true;
        
        try {
            // Get all partner emails we're trying to register with
            const partnerEmails = selectedCategories
                .filter(cb => cb.dataset.hasPartner === 'true')
                .map(cb => document.getElementById(`${cb.value}PartnerEmail`)?.value.trim().toLowerCase())
                .filter(e => e);
            
            // Build query to check current user AND all partners
            const emailsToCheck = [email.toLowerCase(), ...partnerEmails];
            const orConditions = emailsToCheck.map(e => `email.eq.${e},partner_email.eq.${e}`).join(',');
            
            // Check existing registrations for current user and all partners
            const { data: existingRegistrations, error: checkError } = await supabaseClient
                .from('registrations')
                .select('category, email, partner_email, gender, name, partner_name')
                .or(orConditions);
            
            if (checkError) throw checkError;
            
            console.log('Existing registrations found:', existingRegistrations);
            
            // Gender validation
            const userRegistrations = existingRegistrations?.filter(reg => reg.email === email.toLowerCase()) || [];
            if (userRegistrations.length > 0) {
                const existingGender = userRegistrations[0].gender;
                if (existingGender !== gender) {
                    showError(`You have already registered as ${existingGender}. You cannot register as ${gender}.`);
                    document.getElementById('loadingSpinner').style.display = 'none';
                    document.getElementById('submitBtn').disabled = false;
                    return;
                }
            }
            
            // Check for duplicate categories
            const existingCategories = userRegistrations.map(reg => reg.category) || [];
            const duplicateCategories = selectedCategories
                .filter(cb => existingCategories.includes(cb.value))
                .map(cb => cb.dataset.label);
            
            if (duplicateCategories.length > 0) {
                showError(`You have already registered for: ${duplicateCategories.join(', ')}`);
                document.getElementById('loadingSpinner').style.display = 'none';
                document.getElementById('submitBtn').disabled = false;
                return;
            }
            
            const successful = [];
            
            // Register for each category
            for (const checkbox of selectedCategories) {
                const category = checkbox.value;
                const categoryLabel = checkbox.dataset.label;
                const partnerEmail = checkbox.dataset.hasPartner === 'true' 
                    ? document.getElementById(`${category}PartnerEmail`).value.trim().toLowerCase() 
                    : null;
                
                // Check for partner-related conflicts
                if (partnerEmail) {
                    // Check if partner has already registered you
                    const reverseExists = existingRegistrations?.some(reg =>
                        reg.category === category &&
                        reg.email === partnerEmail &&
                        reg.partner_email === email.toLowerCase()
                    );
                    
                    if (reverseExists) {
                        showError(`Your partner has already registered you for ${categoryLabel}.`);
                        continue;
                    }
                    
                    // Check if current user is already registered in this category with someone else
                    const userAlreadyInCategory = existingRegistrations?.some(reg =>
                        reg.category === category &&
                        reg.email === email.toLowerCase() &&
                        reg.partner_email !== partnerEmail
                    );
                    
                    if (userAlreadyInCategory) {
                        showError(`You are already registered for ${categoryLabel} with a different partner.`);
                        continue;
                    }
                    
                    // Check if partner is already registered in this category with someone else
                    const partnerAlreadyInCategory = existingRegistrations?.some(reg => {
                        if (reg.category !== category) return false;
                        
                        // Check if partner is the primary registrant with a different partner
                        if (reg.email === partnerEmail && reg.partner_email !== email.toLowerCase()) {
                            return true;
                        }
                        
                        // Check if partner is listed as someone else's partner
                        if (reg.partner_email === partnerEmail && reg.email !== email.toLowerCase()) {
                            return true;
                        }
                        
                        return false;
                    });
                    
                    if (partnerAlreadyInCategory) {
                        const partnerName = document.getElementById(`${category}PartnerName`).value.trim();
                        showError(`${partnerName} is already registered for ${categoryLabel} with another partner.`);
                        continue;
                    }
                }
                
                const registration = {
                    name: name,
                    email: email.toLowerCase(),
                    gender: gender,
                    category: category,
                    category_label: categoryLabel,
                    partner_name: checkbox.dataset.hasPartner === 'true'
                        ? document.getElementById(`${category}PartnerName`).value.trim()
                        : null,
                    partner_email: partnerEmail
                };
                
                const { error: insertError } = await supabaseClient
                    .from('registrations')
                    .insert([registration]);
                
                if (insertError) {
                    console.error('Insert error:', insertError);
                    showError(`Failed to register for ${categoryLabel}: ${insertError.message}`);
                } else {
                    successful.push(categoryLabel);
                }
            }
            
            // Hide loading
            document.getElementById('loadingSpinner').style.display = 'none';
            document.getElementById('submitBtn').disabled = false;
            
            // Show success overlay
            if (successful.length > 0) {
                // Format categories as chips
                const categoryIcons = {
                    "Men's Singles": "👨",
                    "Men's Doubles": "👨👨",
                    "Women's Singles": "👩",
                    "Women's Doubles": "👩👩",
                    "Mixed Doubles": "👨👩"
                };
                document.getElementById('registeredCategories').innerHTML =
                    successful.map(cat => `<span class="chip">${categoryIcons[cat] || '🏸'} ${cat}</span>`).join('');
                
                // Add registration info with timestamp
                const now = new Date();
                const timestamp = now.toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                document.getElementById('registrationInfo').innerHTML =
                    `Registered on: ${timestamp}`;
                
                document.getElementById('successOverlay').classList.add('show');
            }
            
        } catch (error) {
            console.error('Error:', error);
            showError('An error occurred. Please try again.');
            document.getElementById('loadingSpinner').style.display = 'none';
            document.getElementById('submitBtn').disabled = false;
        }
    });
});

// Made with Bob
