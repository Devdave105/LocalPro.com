// ===================================
// GLOBAL VARIABLES
// ===================================
let allElectricians = [];
let editingId = null;

// ===================================
// INITIALIZE
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu
    setupMobileMenu();
    
    // Load electricians from localStorage or JSON
    loadElectricians();
    
    // Setup form submission
    setupFormHandlers();
    
    // Setup search
    setupSearch();
    
    // Setup delete modal
    setupDeleteModal();
});

// ===================================
// MOBILE MENU
// ===================================
function setupMobileMenu() {
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
}

// ===================================
// LOAD ELECTRICIANS
// ===================================
async function loadElectricians() {
    try {
        // Check localStorage first
        const storedData = localStorage.getItem('electricians');
        
        if (storedData) {
            allElectricians = JSON.parse(storedData);
        } else {
            // Load from JSON file
            const response = await fetch('tools.json');
            if (!response.ok) {
                throw new Error('Failed to load data');
            }
            allElectricians = await response.json();
            // Save to localStorage
            saveToLocalStorage();
        }
        
        displayElectricians();
        
    } catch (error) {
        console.error('Error loading electricians:', error);
        showError('Failed to load electricians data');
    }
}

// ===================================
// SAVE TO LOCALSTORAGE
// ===================================
function saveToLocalStorage() {
    localStorage.setItem('electricians', JSON.stringify(allElectricians));
}

// ===================================
// DISPLAY ELECTRICIANS LIST
// ===================================
function displayElectricians(searchTerm = '') {
    const listContainer = document.getElementById('electriciansList');
    const totalCount = document.getElementById('totalCount');
    
    if (!listContainer) return;
    
    // Filter by search term
    const filtered = searchTerm ? 
        allElectricians.filter(e => 
            e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.service.toLowerCase().includes(searchTerm.toLowerCase())
        ) : allElectricians;
    
    // Update count
    if (totalCount) {
        totalCount.textContent = filtered.length;
    }
    
    // Clear container
    listContainer.innerHTML = '';
    
    // Show empty state
    if (filtered.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <p>${searchTerm ? 'No electricians match your search' : 'No electricians added yet'}</p>
            </div>
        `;
        return;
    }
    
    // Create list items
    filtered.forEach(electrician => {
        const item = createListItem(electrician);
        listContainer.appendChild(item);
    });
}

// ===================================
// CREATE LIST ITEM
// ===================================
function createListItem(electrician) {
    const item = document.createElement('div');
    item.className = 'list-item';
    
    const verifiedIcon = electrician.verified ? 
        '<span class="verified-icon" title="Verified">✓</span>' : '';
    
    item.innerHTML = `
        <div class="list-item-info">
            <img src="${electrician.photo}" alt="${electrician.name}" class="list-item-avatar">
            <div class="list-item-details">
                <div class="list-item-name">
                    ${electrician.name}
                    ${verifiedIcon}
                </div>
                <div class="list-item-meta">
                    ${electrician.area} • ${electrician.experience} years exp
                </div>
            </div>
        </div>
        <div class="list-item-actions">
            <button class="icon-btn icon-btn-edit" onclick="editElectrician(${electrician.id})" title="Edit">
                ✏️
            </button>
            <button class="icon-btn icon-btn-delete" onclick="confirmDelete(${electrician.id})" title="Delete">
                🗑️
            </button>
        </div>
    `;
    
    return item;
}

// ===================================
// FORM HANDLERS
// ===================================
function setupFormHandlers() {
    const form = document.getElementById('electricianForm');
    const cancelBtn = document.getElementById('cancelBtn');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                id: editingId || Date.now(),
                name: document.getElementById('name').value.trim(),
                service: document.getElementById('service').value.trim(),
                city: document.getElementById('city').value.trim(),
                area: document.getElementById('area').value,
                phone: document.getElementById('phone').value.trim(),
                whatsapp: document.getElementById('whatsapp').value.trim(),
                experience: parseInt(document.getElementById('experience').value),
                verified: document.getElementById('verified').checked,
                photo: document.getElementById('photo').value.trim() || 
                       `https://ui-avatars.com/api/?name=${encodeURIComponent(document.getElementById('name').value.trim())}&background=0D3B66&color=F4D35E&size=200&bold=true`,
                description: document.getElementById('description').value.trim()
            };
            
            if (editingId) {
                // Update existing
                const index = allElectricians.findIndex(e => e.id === editingId);
                if (index !== -1) {
                    allElectricians[index] = formData;
                    showNotification('Electrician updated successfully', 'success');
                }
            } else {
                // Add new
                allElectricians.unshift(formData);
                showNotification('Electrician added successfully', 'success');
            }
            
            saveToLocalStorage();
            displayElectricians();
            resetForm();
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', resetForm);
    }
}

// ===================================
// EDIT ELECTRICIAN
// ===================================
function editElectrician(id) {
    const electrician = allElectricians.find(e => e.id === id);
    if (!electrician) return;
    
    editingId = id;
    
    // Populate form
    document.getElementById('name').value = electrician.name;
    document.getElementById('service').value = electrician.service;
    document.getElementById('city').value = electrician.city;
    document.getElementById('area').value = electrician.area;
    document.getElementById('phone').value = electrician.phone;
    document.getElementById('whatsapp').value = electrician.whatsapp;
    document.getElementById('experience').value = electrician.experience;
    document.getElementById('verified').checked = electrician.verified;
    document.getElementById('photo').value = electrician.photo.includes('ui-avatars.com') ? '' : electrician.photo;
    document.getElementById('description').value = electrician.description;
    
    // Update UI
    document.getElementById('formTitle').textContent = 'Edit Electrician';
    document.getElementById('submitText').textContent = 'Update Electrician';
    document.getElementById('cancelBtn').style.display = 'block';
    
    // Scroll to form
    document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===================================
// DELETE MODAL
// ===================================
let deleteId = null;

function setupDeleteModal() {
    const modal = document.getElementById('deleteModal');
    const cancelBtn = document.getElementById('cancelDelete');
    const confirmBtn = document.getElementById('confirmDelete');
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            deleteId = null;
        });
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', deleteElectrician);
    }
}

function confirmDelete(id) {
    const electrician = allElectricians.find(e => e.id === id);
    if (!electrician) return;
    
    deleteId = id;
    document.getElementById('deleteElectricianName').textContent = electrician.name;
    document.getElementById('deleteModal').classList.add('active');
}

function deleteElectrician() {
    if (!deleteId) return;
    
    allElectricians = allElectricians.filter(e => e.id !== deleteId);
    saveToLocalStorage();
    displayElectricians();
    
    document.getElementById('deleteModal').classList.remove('active');
    showNotification('Electrician deleted successfully', 'success');
    deleteId = null;
}

// ===================================
// RESET FORM
// ===================================
function resetForm() {
    document.getElementById('electricianForm').reset();
    document.getElementById('city').value = 'Uyo';
    editingId = null;
    
    document.getElementById('formTitle').textContent = 'Add New Electrician';
    document.getElementById('submitText').textContent = 'Add Electrician';
    document.getElementById('cancelBtn').style.display = 'none';
}

// ===================================
// SEARCH
// ===================================
function setupSearch() {
    const searchInput = document.getElementById('adminSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            displayElectricians(e.target.value);
        });
    }
}

// ===================================
// NOTIFICATIONS
// ===================================
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : '#EF4444'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10001;
        animation: slideIn 0.3s ease;
        font-family: var(--font-family);
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showError(message) {
    const listContainer = document.getElementById('electriciansList');
    if (listContainer) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <p style="color: var(--error);">${message}</p>
                <button class="btn btn-primary" onclick="window.location.reload()" style="margin-top: 1rem;">
                    Retry
                </button>
            </div>
        `;
    }
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);