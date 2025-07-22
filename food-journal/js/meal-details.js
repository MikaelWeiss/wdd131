import { formatDateLong, formatTime, escapeHtml, saveMeals, loadMeals } from './utils.js';

function init() {
    const selectedMealId = localStorage.getItem('selectedMealId');
    
    if (selectedMealId) {
        displayMealDetails(selectedMealId);
    } else {
        showNoMealSelected();
    }
    
    const closeModalBtn = document.getElementById('close-modal');
    const cancelBtn = document.getElementById('cancel-btn');
    const modalOverlay = document.querySelector('.modal-overlay');
    const mealForm = document.getElementById('meal-form');
    const editMealModal = document.getElementById('edit-meal-modal');
    
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeEditModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeEditModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeEditModal);
    if (mealForm) mealForm.addEventListener('submit', handleEditFormSubmit);
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && editMealModal && !editMealModal.classList.contains('hidden')) {
            closeEditModal();
        }
    });
}

function displayMealDetails(mealId) {
    const meals = loadMeals();
    const meal = meals.find(m => m.id === mealId);
    
    const mealDetailContent = document.getElementById('meal-detail-content');
    const noMealSelected = document.getElementById('no-meal-selected');
    
    if (!meal) {
        showNoMealSelected();
        return;
    }
    
    noMealSelected.classList.add('hidden');
    
    mealDetailContent.innerHTML = `
        <div class="meal-detail-card">
            <div class="meal-header">
                <h2 class="meal-title">${escapeHtml(meal.title)}</h2>
                <div class="meal-meta">
                    <span class="meal-date">${formatDateLong(meal.date)}</span>
                    <span class="meal-time">${formatTime(meal.time)}</span>
                </div>
            </div>
            
            <div class="meal-description">
                ${meal.description ? escapeHtml(meal.description) : 'No description provided for this meal.'}
            </div>
            
            <div class="meal-actions">
                <button class="btn btn-secondary" onclick="editMeal('${meal.id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteMeal('${meal.id}')">Delete</button>
            </div>
        </div>
    `;
    
    showRelatedMeals(meal);
    mealDetailContent.classList.remove('hidden');
}

function showRelatedMeals(currentMeal) {
    const meals = loadMeals();
    const sameDayMeals = meals.filter(meal => 
        meal.date === currentMeal.date && meal.id !== currentMeal.id
    ).sort((a, b) => a.time.localeCompare(b.time));
    
    const relatedMealsSection = document.getElementById('related-meals');
    const relatedMealsList = document.getElementById('related-meals-list');
    
    if (sameDayMeals.length === 0) {
        relatedMealsSection.classList.add('hidden');
        return;
    }
    
    relatedMealsList.innerHTML = sameDayMeals.map(meal => 
        `<div class="related-meal-item">
            <div class="related-meal-content">
                <h4 class="related-meal-title">${escapeHtml(meal.title)}</h4>
                <div class="related-meal-time">${formatTime(meal.time)}</div>
                <p class="related-meal-preview">${escapeHtml(meal.description || '').substring(0, 80)}${meal.description && meal.description.length > 80 ? '...' : ''}</p>
            </div>
            <button class="btn btn-small btn-secondary" onclick="viewRelatedMeal('${meal.id}')">View</button>
        </div>`
    ).join('');
    
    relatedMealsSection.classList.remove('hidden');
}

function viewRelatedMeal(mealId) {
    localStorage.setItem('selectedMealId', mealId);
    location.reload();
}

function showNoMealSelected() {
    document.getElementById('meal-detail-content').classList.add('hidden');
    document.getElementById('related-meals').classList.add('hidden');
    document.getElementById('no-meal-selected').classList.remove('hidden');
}

function editMeal(mealId) {
    const meals = loadMeals();
    const meal = meals.find(m => m.id === mealId);
    
    if (meal) {
        const form = document.getElementById('meal-form');
        form['meal-title'].value = meal.title;
        form['meal-date'].value = meal.date;
        form['meal-time'].value = meal.time;
        form['meal-description'].value = meal.description || '';
        
        const editMealModal = document.getElementById('edit-meal-modal');
        editMealModal.dataset.editingMealId = mealId;
        editMealModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        form['meal-title'].focus();
    }
}

function closeEditModal() {
    const editMealModal = document.getElementById('edit-meal-modal');
    const mealForm = document.getElementById('meal-form');
    
    editMealModal.classList.add('hidden');
    document.body.style.overflow = '';
    mealForm.reset();
    clearFormError();
}

function showFormError(message) {
    let errorDiv = document.querySelector('.form-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.style.cssText = 'color: var(--danger-color); padding: 0.5rem; margin-bottom: 1rem; border: 1px solid var(--danger-color); border-radius: 4px; background-color: #f8d7da;';
        document.getElementById('meal-form').insertBefore(errorDiv, document.getElementById('meal-form').firstChild);
    }
    errorDiv.textContent = message;
}

function clearFormError() {
    const errorDiv = document.querySelector('.form-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function handleEditFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const title = form['meal-title'].value.trim();
    const date = form['meal-date'].value;
    const time = form['meal-time'].value;
    const description = form['meal-description'].value.trim();
    const mealId = document.getElementById('edit-meal-modal').dataset.editingMealId;
    
    if (!title || !date || !time) {
        showFormError('Please fill in all required fields.');
        return;
    }
    
    const meals = loadMeals();
    const meal = meals.find(m => m.id === mealId);
    
    if (meal) {
        meal.title = title;
        meal.date = date;
        meal.time = time;
        meal.description = description;
        
        saveMeals(meals);
        closeEditModal();
        displayMealDetails(mealId);
    }
}

function deleteMeal(mealId) {
    if (confirm('Are you sure you want to delete this meal?')) {
        const meals = loadMeals().filter(meal => meal.id !== mealId);
        saveMeals(meals);
        
        localStorage.removeItem('selectedMealId');
        window.location.href = 'index.html';
    }
}

window.editMeal = editMeal;
window.deleteMeal = deleteMeal;
window.viewRelatedMeal = viewRelatedMeal;

document.addEventListener('DOMContentLoaded', init);