// Meal Details Page JavaScript Module

const mealDetailContent = document.getElementById('meal-detail-content');
const noMealSelected = document.getElementById('no-meal-selected');
const relatedMealsSection = document.getElementById('related-meals');
const relatedMealsList = document.getElementById('related-meals-list');

const editMealModal = document.getElementById('edit-meal-modal');
const closeModalBtn = document.getElementById('close-modal');
const cancelBtn = document.getElementById('cancel-btn');
const modalOverlay = document.querySelector('.modal-overlay');
const mealForm = document.getElementById('meal-form');

function init() {
    const selectedMealId = localStorage.getItem('selectedMealId');
    
    if (selectedMealId) {
        displayMealDetails(selectedMealId);
    } else {
        showNoMealSelected();
    }
    
    attachModalEventListeners();
}

function attachModalEventListeners() {
    closeModalBtn.addEventListener('click', closeEditModal);
    cancelBtn.addEventListener('click', closeEditModal);
    modalOverlay.addEventListener('click', closeEditModal);
    mealForm.addEventListener('submit', handleEditFormSubmit);
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !editMealModal.classList.contains('hidden')) {
            closeEditModal();
        }
    });
}

function displayMealDetails(mealId) {
    const storedMeals = JSON.parse(localStorage.getItem('foodJournalMeals')) || [];
    const meal = storedMeals.find(m => m.id == mealId);
    
    if (!meal) {
        showNoMealSelected();
        return;
    }
    
    noMealSelected.classList.add('hidden');
    
    const formattedDate = formatDate(meal.date);
    const formattedTime = formatTime(meal.time);
    const createdDate = new Date(meal.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
    
    mealDetailContent.innerHTML = `
        <div class="meal-detail-card">
            <div class="meal-detail-header">
                <h2 class="meal-detail-title">${escapeHtml(meal.title)}</h2>
                <div class="meal-detail-meta">
                    <div class="meta-item">
                        <strong>Date:</strong> ${formattedDate}
                    </div>
                    <div class="meta-item">
                        <strong>Time:</strong> ${formattedTime}
                    </div>
                    <div class="meta-item">
                        <strong>Added:</strong> ${createdDate}
                    </div>
                </div>
            </div>
            
            <div class="meal-detail-body">
                <h3>Description</h3>
                <div class="meal-detail-description">
                    ${meal.description ? escapeHtml(meal.description) : 'No description provided for this meal.'}
                </div>
                
                <div class="meal-stats">
                    <div class="stat-item">
                        <span class="stat-label">Meal ID:</span>
                        <span class="stat-value">#${meal.id.toString().slice(-6)}</span>
                    </div>
                </div>
            </div>
            
            <div class="meal-detail-actions">
                <button class="btn btn-secondary" onclick="editMeal(${meal.id})">Edit Meal</button>
                <button class="btn btn-danger" onclick="deleteMealFromDetails(${meal.id})">Delete Meal</button>
                <button class="btn btn-primary" onclick="shareMeal(${meal.id})">Share Details</button>
            </div>
        </div>
    `;
    
    showRelatedMeals(meal);
    
    mealDetailContent.classList.remove('hidden');
}

function showRelatedMeals(currentMeal) {
    const storedMeals = JSON.parse(localStorage.getItem('foodJournalMeals')) || [];
    const sameDayMeals = storedMeals.filter(meal => 
        meal.date === currentMeal.date && meal.id !== currentMeal.id
    );
    
    if (sameDayMeals.length === 0) {
        relatedMealsSection.classList.add('hidden');
        return;
    }
    
    sameDayMeals.sort((a, b) => a.time.localeCompare(b.time));
    
    relatedMealsList.innerHTML = '';
    
    sameDayMeals.forEach(meal => {
        const mealElement = createRelatedMealElement(meal);
        relatedMealsList.appendChild(mealElement);
    });
    
    relatedMealsSection.classList.remove('hidden');
}

function createRelatedMealElement(meal) {
    const mealDiv = document.createElement('div');
    mealDiv.className = 'related-meal-item';
    
    const formattedTime = formatTime(meal.time);
    
    mealDiv.innerHTML = `
        <div class="related-meal-content">
            <h4 class="related-meal-title">${escapeHtml(meal.title)}</h4>
            <div class="related-meal-time">${formattedTime}</div>
            <p class="related-meal-preview">${escapeHtml(meal.description).substring(0, 80)}${meal.description.length > 80 ? '...' : ''}</p>
        </div>
        <button class="btn btn-small btn-secondary" onclick="viewRelatedMeal(${meal.id})">View</button>
    `;
    
    return mealDiv;
}

function viewRelatedMeal(mealId) {
    localStorage.setItem('selectedMealId', mealId);
    location.reload();
}

function showNoMealSelected() {
    mealDetailContent.classList.add('hidden');
    relatedMealsSection.classList.add('hidden');
    noMealSelected.classList.remove('hidden');
}

function editMeal(mealId) {
    const storedMeals = JSON.parse(localStorage.getItem('foodJournalMeals')) || [];
    const meal = storedMeals.find(m => m.id == mealId);
    
    if (meal) {
        document.getElementById('meal-title').value = meal.title;
        document.getElementById('meal-date').value = meal.date;
        document.getElementById('meal-time').value = meal.time;
        document.getElementById('meal-description').value = meal.description || '';
        
        editMealModal.dataset.editingMealId = mealId;
        
        editMealModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        document.getElementById('meal-title').focus();
    }
}

function closeEditModal() {
    editMealModal.classList.add('hidden');
    document.body.style.overflow = '';
    mealForm.reset();
}

function handleEditFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(mealForm);
    const title = formData.get('meal-title').trim();
    const date = formData.get('meal-date');
    const time = formData.get('meal-time');
    const description = formData.get('meal-description').trim();
    const mealId = parseFloat(editMealModal.dataset.editingMealId);
    
    if (!title || !date || !time) {
        alert('Please fill in all required fields.');
        return;
    }
    
    let storedMeals = JSON.parse(localStorage.getItem('foodJournalMeals')) || [];
    const mealIndex = storedMeals.findIndex(meal => meal.id === mealId);
    
    if (mealIndex !== -1) {
        storedMeals[mealIndex] = {
            ...storedMeals[mealIndex],
            title: title,
            date: date,
            time: time,
            description: description
        };
        
        localStorage.setItem('foodJournalMeals', JSON.stringify(storedMeals));
        
        closeEditModal();
        
        displayMealDetails(mealId);
    }
}

function deleteMealFromDetails(mealId) {
    if (confirm('Are you sure you want to delete this meal entry?')) {
        let storedMeals = JSON.parse(localStorage.getItem('foodJournalMeals')) || [];
        storedMeals = storedMeals.filter(meal => meal.id !== mealId);
        localStorage.setItem('foodJournalMeals', JSON.stringify(storedMeals));
        
        localStorage.removeItem('selectedMealId');
        window.location.href = 'index.html';
    }
}

function shareMeal(mealId) {
    const storedMeals = JSON.parse(localStorage.getItem('foodJournalMeals')) || [];
    const meal = storedMeals.find(m => m.id == mealId);
    
    if (meal) {
        const shareText = `I ate ${meal.title} on ${formatDate(meal.date)} at ${formatTime(meal.time)}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Food Journal Entry',
                text: shareText
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Meal details copied to clipboard!');
            }).catch(() => {
                alert(`Share: ${shareText}`);
            });
        }
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

window.editMeal = editMeal;
window.deleteMealFromDetails = deleteMealFromDetails;
window.shareMeal = shareMeal;
window.viewRelatedMeal = viewRelatedMeal;

document.addEventListener('DOMContentLoaded', init);