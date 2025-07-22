import { formatDate, formatTime, escapeHtml, saveMeals, loadMeals } from './utils.js';

let meals = loadMeals();
let editingMealId = null;

function createMeal(title, date, time, description) {
    return {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        title,
        date,
        time,
        description,
        createdAt: new Date().toISOString()
    };
}

function init() {
    displayMeals(meals);
    updateNoMealsVisibility();
    
    const mealForm = document.getElementById('meal-form');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const addMealBtn = document.getElementById('add-meal-btn');
    const closeModalBtn = document.getElementById('close-modal');
    const cancelBtn = document.getElementById('cancel-btn');
    const modalOverlay = document.querySelector('.modal-overlay');
    const addMealModal = document.getElementById('add-meal-modal');
    
    mealForm.addEventListener('submit', handleFormSubmit);
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('input', handleSearch);
    
    filterButtons.forEach(button => {
        button.addEventListener('click', handleFilterClick);
    });
    
    addMealBtn.addEventListener('click', () => openModal());
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !addMealModal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const title = form['meal-title'].value.trim();
    const date = form['meal-date'].value;
    const time = form['meal-time'].value;
    const description = form['meal-description'].value.trim();
    
    // Enhanced conditional branching with multiple validation paths
    let validationError = null;
    
    if (!title && !date && !time) {
        validationError = 'All required fields are missing. Please fill in the meal title, date, and time.';
    } else if (!title) {
        validationError = 'Meal title is required. What did you eat?';
    } else if (!date) {
        validationError = 'Date is required. When did you eat this meal?';
    } else if (!time) {
        validationError = 'Time is required. What time did you eat?';
    } else if (title.length < 2) {
        validationError = 'Meal title must be at least 2 characters long.';
    } else if (title.length > 100) {
        validationError = 'Meal title is too long. Please keep it under 100 characters.';
    } else if (description && description.length > 1000) {
        validationError = 'Description is too long. Please keep it under 1000 characters.';
    } else {
        // Additional validation for date and time
        const selectedDate = new Date(date);
        const today = new Date();
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(today.getFullYear() + 1);
        
        if (selectedDate > oneYearFromNow) {
            validationError = 'Date cannot be more than a year in the future.';
        } else if (selectedDate < new Date('2020-01-01')) {
            validationError = 'Date cannot be before January 1, 2020.';
        }
    }
    
    if (validationError) {
        showFormError(validationError);
        return;
    }
    
    try {
        if (editingMealId) {
            const meal = meals.find(m => m.id === editingMealId);
            if (meal) {
                meal.title = title;
                meal.date = date;
                meal.time = time;
                meal.description = description;
            }
            editingMealId = null;
        } else {
            meals.push(createMeal(title, date, time, description));
        }
        
        saveMeals(meals);
        displayMeals(meals);
        updateNoMealsVisibility();
        closeModal();
        
    } catch (error) {
        showFormError('Error saving meal. Please try again.');
    }
}


function handleSearch() {
    const searchTerm = document.getElementById('search-input').value.trim().toLowerCase();
    if (!searchTerm) {
        displayMeals(meals);
        return;
    }
    
    const filtered = meals.filter(meal => 
        meal.title.toLowerCase().includes(searchTerm) ||
        meal.description.toLowerCase().includes(searchTerm)
    );
    displayMeals(filtered);
}

function handleFilterClick(e) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
    });
    e.target.classList.add('active');
    e.target.setAttribute('aria-pressed', 'true');
    
    const filterType = e.target.id.replace('filter-', '');
    const today = new Date().toISOString().split('T')[0];
    
    let filtered;
    if (filterType === 'today') {
        filtered = meals.filter(meal => meal.date === today);
    } else if (filterType === 'week') {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        filtered = meals.filter(meal => meal.date >= weekAgo && meal.date <= today);
    } else {
        filtered = meals;
    }
    
    displayMeals(filtered);
}

function displayMeals(mealsToShow) {
    const sorted = mealsToShow.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateB - dateA;
    });
    
    const mealsList = document.getElementById('meals-list');
    
    // Use map() to create meal elements array
    const mealElements = sorted.map(meal => createMealElement(meal));
    
    // Clear and append all elements
    mealsList.innerHTML = '';
    mealElements.forEach(element => mealsList.appendChild(element));
    
    updateNoMealsVisibility(mealsToShow.length === 0);
}

function createMealElement(meal) {
    const div = document.createElement('div');
    div.className = 'meal-item';
    div.onclick = () => viewMeal(meal.id);
    
    div.innerHTML = `
        <div class="meal-header">
            <h3 class="meal-title">${escapeHtml(meal.title)}</h3>
            <div class="meal-datetime">
                <div>${formatDate(meal.date)}</div>
                <div>${formatTime(meal.time)}</div>
            </div>
        </div>
        <p class="meal-description">${escapeHtml(meal.description) || 'No description provided'}</p>
        <div class="meal-actions">
            <button class="btn btn-secondary btn-small" onclick="event.stopPropagation(); viewMeal('${meal.id}')">View Details</button>
            <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); editMeal('${meal.id}')">Edit</button>
            <button class="btn btn-danger btn-small" onclick="event.stopPropagation(); deleteMeal('${meal.id}')">Delete</button>
        </div>
    `;
    
    return div;
}

function viewMeal(mealId) {
    localStorage.setItem('selectedMealId', mealId);
    window.location.href = 'meal-details.html';
}

function deleteMeal(mealId) {
    if (confirm('Are you sure you want to delete this meal?')) {
        meals = meals.filter(meal => meal.id !== mealId);
        saveMeals(meals);
        displayMeals(meals);
        updateNoMealsVisibility();
    }
}

function updateNoMealsVisibility(forceShow = false) {
    const shouldShow = forceShow || meals.length === 0;
    document.getElementById('no-meals').classList.toggle('hidden', !shouldShow);
    document.getElementById('meals-list').classList.toggle('hidden', shouldShow);
}




function openModal(mealToEdit = null) {
    const modal = document.getElementById('add-meal-modal');
    const form = document.getElementById('meal-form');
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    if (mealToEdit) {
        editingMealId = mealToEdit.id;
        document.getElementById('modal-title').textContent = 'Edit Meal';
        document.getElementById('submit-btn').textContent = 'Update Meal';
        
        form['meal-title'].value = mealToEdit.title;
        form['meal-date'].value = mealToEdit.date;
        form['meal-time'].value = mealToEdit.time;
        form['meal-description'].value = mealToEdit.description || '';
    } else {
        editingMealId = null;
        document.getElementById('modal-title').textContent = 'Add New Meal';
        document.getElementById('submit-btn').textContent = 'Add Meal';
        
        form['meal-date'].value = new Date().toISOString().split('T')[0];
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        form['meal-time'].value = timeString;
    }
    
    form['meal-title'].focus();
}

function closeModal() {
    document.getElementById('add-meal-modal').classList.add('hidden');
    document.body.style.overflow = '';
    
    editingMealId = null;
    document.getElementById('modal-title').textContent = 'Add New Meal';
    document.getElementById('submit-btn').textContent = 'Add Meal';
    
    document.getElementById('meal-form').reset();
    clearFormError();
}

function showFormError(message) {
    let errorDiv = document.querySelector('.form-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.style.cssText = 'color: var(--danger-color); padding: 0.5rem; margin-bottom: 1rem; border: 1px solid var(--danger-color); border-radius: 4px; background-color: #f8d7da;';
        mealForm.insertBefore(errorDiv, mealForm.firstChild);
    }
    errorDiv.textContent = message;
}

function clearFormError() {
    const errorDiv = document.querySelector('.form-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function editMeal(mealId) {
    const meal = meals.find(m => m.id === mealId);
    if (meal) {
        openModal(meal);
    }
}

// Clear old data function (can be called from browser console)
function clearFoodJournalData() {
    localStorage.removeItem('foodJournalMeals');
    localStorage.removeItem('selectedMealId');
    location.reload();
}

window.viewMeal = viewMeal;
window.editMeal = editMeal;
window.deleteMeal = deleteMeal;
window.clearFoodJournalData = clearFoodJournalData;

document.addEventListener('DOMContentLoaded', init);