// ===================================
// GLOBAL VARIABLES
// ===================================
let allElectricians = [];
let filteredElectricians = [];

// ===================================
// MOBILE MENU FUNCTIONALITY
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
        
        const navLinks = mainNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });
    }
    
    // ===================================
    // LOAD ELECTRICIANS DATA
    // ===================================
    loadElectricians();
    
    // ===================================
    // SEARCH FUNCTIONALITY
    // ===================================
    const searchInput = document.getElementById('directorySearch');
    const searchExitBtn = document.getElementById('searchExitBtn');
    
    if (searchInput) {
        // Check if there's a search term from the home page
        const savedSearchTerm = sessionStorage.getItem('searchTerm');
        if (savedSearchTerm) {
            searchInput.value = savedSearchTerm;
            sessionStorage.removeItem('searchTerm');
            if (searchExitBtn) {
                searchExitBtn.classList.remove('hidden');
            }
        }
        
        searchInput.addEventListener('input', function() {
            // Show/hide exit button based on input
            if (searchExitBtn) {
                if (this.value.trim()) {
                    searchExitBtn.classList.remove('hidden');
                } else {
                    searchExitBtn.classList.add('hidden');
                }
            }
            applyFilters();
        });
    }
    
    // Exit button functionality
    if (searchExitBtn) {
        // Initially hide if no search term
        if (!searchInput.value.trim()) {
            searchExitBtn.classList.add('hidden');
        }
        
        searchExitBtn.addEventListener('click', function() {
            if (searchInput.value.trim()) {
                // Clear search
                searchInput.value = '';
                this.classList.add('hidden');
                applyFilters();
            } else {
                // Go back to home
                window.location.href = 'index.html';
            }
        });
    }
    
    // ===================================
    // FILTER FUNCTIONALITY
    // ===================================
    const areaFilter = document.getElementById('areaFilter');
    const verifiedFilter = document.getElementById('verifiedFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');
    
    if (areaFilter) {
        areaFilter.addEventListener('change', applyFilters);
    }
    
    if (verifiedFilter) {
        verifiedFilter.addEventListener('change', applyFilters);
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            searchInput.value = '';
            areaFilter.value = '';
            verifiedFilter.checked = false;
            if (searchExitBtn) {
                searchExitBtn.classList.add('hidden');
            }
            applyFilters();
        });
    }
    
    // Back to home button
    const backToHomeBtn = document.getElementById('backToHomeBtn');
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
    
    // ===================================
    // TOGGLE SEARCH SECTION
    // ===================================
    const toggleSearchBtn = document.getElementById('toggleSearchBtn');
    const searchFilterSection = document.getElementById('searchFilterSection');
    
    if (toggleSearchBtn && searchFilterSection) {
        toggleSearchBtn.addEventListener('click', function() {
            searchFilterSection.classList.toggle('collapsed');
            const isCollapsed = searchFilterSection.classList.contains('collapsed');
            const btnText = this.querySelector('span');
            btnText.textContent = isCollapsed ? 'Show Search' : 'Hide Search';
        });
        
        // Auto-collapse after first search/filter
        let hasSearched = false;
        const autoCollapse = function() {
            if (!hasSearched && (searchInput.value || areaFilter.value || verifiedFilter.checked)) {
                hasSearched = true;
                setTimeout(() => {
                    if (searchFilterSection && !searchFilterSection.classList.contains('collapsed')) {
                        searchFilterSection.classList.add('collapsed');
                        const btnText = toggleSearchBtn.querySelector('span');
                        if (btnText) btnText.textContent = 'Show Search';
                    }
                }, 1000);
            }
        };
        
        searchInput.addEventListener('input', autoCollapse);
        areaFilter.addEventListener('change', autoCollapse);
        verifiedFilter.addEventListener('change', autoCollapse);
    }
});

// ===================================
// LOAD ELECTRICIANS FROM JSON
// ===================================
async function loadElectricians() {
    try {
        const response = await fetch('tools.json');
        
        if (!response.ok) {
            throw new Error('Failed to load electricians data');
        }
        
        allElectricians = await response.json();
        filteredElectricians = [...allElectricians];
        
        // Hide loading skeletons
        const loadingSkeletons = document.getElementById('loadingSkeletons');
        if (loadingSkeletons) {
            loadingSkeletons.style.display = 'none';
        }
        
        // Display electricians
        displayElectricians();
        
        // Apply initial filters if search term exists
        applyFilters();
        
    } catch (error) {
        console.error('Error loading electricians:', error);
        showError();
    }
}

// ===================================
// APPLY FILTERS AND SEARCH
// ===================================
function applyFilters() {
    const searchTerm = document.getElementById('directorySearch').value.toLowerCase().trim();
    const selectedArea = document.getElementById('areaFilter').value;
    const verifiedOnly = document.getElementById('verifiedFilter').checked;
    
    filteredElectricians = allElectricians.filter(electrician => {
        // Search filter
        const matchesSearch = searchTerm === '' || 
            electrician.name.toLowerCase().includes(searchTerm) ||
            electrician.area.toLowerCase().includes(searchTerm) ||
            electrician.service.toLowerCase().includes(searchTerm) ||
            electrician.description.toLowerCase().includes(searchTerm);
        
        // Area filter
        const matchesArea = selectedArea === '' || electrician.area === selectedArea;
        
        // Verified filter
        const matchesVerified = !verifiedOnly || electrician.verified === true;
        
        return matchesSearch && matchesArea && matchesVerified;
    });
    
    displayElectricians();
}

// ===================================
// DISPLAY ELECTRICIANS
// ===================================
function displayElectricians() {
    const grid = document.getElementById('electriciansGrid');
    const noResults = document.getElementById('noResults');
    const resultsCount = document.getElementById('resultsCount');
    
    if (!grid) return;
    
    // Clear grid
    grid.innerHTML = '';
    
    // Update results count
    if (resultsCount) {
        const count = filteredElectricians.length;
        resultsCount.textContent = count === 0 ? 
            'No electricians found' : 
            `Showing ${count} electrician${count !== 1 ? 's' : ''}`;
    }
    
    // Show/hide no results message
    if (filteredElectricians.length === 0) {
        grid.style.display = 'none';
        if (noResults) {
            noResults.style.display = 'block';
        }
        return;
    }
    
    // Hide no results and show grid
    grid.style.display = 'grid';
    if (noResults) {
        noResults.style.display = 'none';
    }
    
    // Create cards for each electrician
    filteredElectricians.forEach((electrician, index) => {
        const card = createElectricianCard(electrician, index);
        grid.appendChild(card);
    });
}

// ===================================
// CREATE ELECTRICIAN CARD
// ===================================
function createElectricianCard(electrician, index) {
    const card = document.createElement('div');
    card.className = 'profile-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    // Verified badge HTML
    const verifiedBadgeHTML = electrician.verified ? 
        '<span class="verified-badge">✓ Verified</span>' : '';
    
    // Format phone numbers for links
    const phoneLink = `tel:${electrician.phone}`;
    const whatsappLink = `https://wa.me/${electrician.whatsapp.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(electrician.name)},%20I%20found%20you%20on%20LocalPro%20and%20need%20electrical%20services.`;
    
    card.innerHTML = `
        <div class="profile-header">
            <img src="${electrician.photo}" alt="${electrician.name}" class="profile-photo">
            <h3 class="profile-name">${electrician.name}</h3>
            <p class="profile-service">${electrician.service}</p>
            ${verifiedBadgeHTML}
        </div>
        
        <div class="profile-info">
            <div class="info-item">
                <span class="info-icon">📍</span>
                <span>${electrician.area}, ${electrician.city}</span>
            </div>
            <div class="info-item">
                <span class="info-icon">💼</span>
                <span>${electrician.experience} years experience</span>
            </div>
        </div>
        
        <p class="profile-description">${electrician.description}</p>
        
        <div class="profile-actions">
            <a href="${phoneLink}" class="action-btn btn-call">
                📞 Call
            </a>
            <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" class="action-btn btn-whatsapp">
                💬 WhatsApp
            </a>
        </div>
    `;
    
    return card;
}

// ===================================
// ERROR HANDLING
// ===================================
function showError() {
    const loadingSkeletons = document.getElementById('loadingSkeletons');
    const electriciansGrid = document.getElementById('electriciansGrid');
    const resultsCount = document.getElementById('resultsCount');
    
    if (loadingSkeletons) {
        loadingSkeletons.style.display = 'none';
    }
    
    if (resultsCount) {
        resultsCount.textContent = 'Error loading electricians. Please refresh the page.';
        resultsCount.style.color = 'var(--error)';
    }
    
    if (electriciansGrid) {
        electriciansGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <p style="color: var(--error); font-size: 1.125rem; margin-bottom: 1rem;">
                    Failed to load electricians data
                </p>
                <button class="btn btn-primary" onclick="window.location.reload()">
                    Try Again
                </button>
            </div>
        `;
        electriciansGrid.style.display = 'grid';
    }
}