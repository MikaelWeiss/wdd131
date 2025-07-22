// Food Journal Application - Main JavaScript Module

let meals = JSON.parse(localStorage.getItem('foodJournalMeals')) || [];

let currentEditingMealId = null;

const mealForm = document.getElementById('meal-form');
const mealsList = document.getElementById('meals-list');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const noMealsDiv = document.getElementById('no-meals');
const filterButtons = document.querySelectorAll('.filter-btn');
const addMealBtn = document.getElementById('add-meal-btn');
const addMealModal = document.getElementById('add-meal-modal');
const closeModalBtn = document.getElementById('close-modal');
const cancelBtn = document.getElementById('cancel-btn');
const modalOverlay = document.querySelector('.modal-overlay');
const modalTitle = document.getElementById('modal-title');
const submitBtn = document.getElementById('submit-btn');

class Meal {
    constructor(title, date, time, description) {
        this.id = Date.now() + Math.random(); // Simple unique ID
        this.title = title;
        this.date = date;
        this.time = time;
        this.description = description;
        this.createdAt = new Date().toISOString();
    }
}

function init() {
    displayMeals(meals);
    attachEventListeners();
    updateNoMealsVisibility();
}

function attachEventListeners() {
    mealForm.addEventListener('submit', handleFormSubmit);
    
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    filterButtons.forEach(button => {
        button.addEventListener('click', handleFilterClick);
    });
    
    addMealBtn.addEventListener('click', openModal);
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
    
    const formData = new FormData(mealForm);
    const title = formData.get('meal-title').trim();
    const date = formData.get('meal-date');
    const time = formData.get('meal-time');
    const description = formData.get('meal-description').trim();
    
    if (!title || !date || !time) {
        alert('Please fill in all required fields.');
        return;
    }
    
    if (currentEditingMealId) {
        const mealIndex = meals.findIndex(meal => meal.id === currentEditingMealId);
        if (mealIndex !== -1) {
            meals[mealIndex] = {
                ...meals[mealIndex],
                title: title,
                date: date,
                time: time,
                description: description
            };
        }
        currentEditingMealId = null;
    } else {
        const newMeal = new Meal(title, date, time, description);
        meals.push(newMeal);
    }
    
    saveMeals();
    
    displayMeals(meals);
    updateNoMealsVisibility();
    
    mealForm.reset();
    
    document.getElementById('meal-date').value = new Date().toISOString().split('T')[0];
    
    closeModal();
}

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        displayMeals(meals);
        return;
    }
    
    const filteredMeals = meals.filter(meal => 
        meal.title.toLowerCase().includes(searchTerm) ||
        meal.description.toLowerCase().includes(searchTerm)
    );
    
    displayMeals(filteredMeals);
}

function handleFilterClick(e) {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    e.target.classList.add('active');
    
    const filterType = e.target.id.replace('filter-', '');
    let filteredMeals = [];
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    switch (filterType) {
        case 'all':
            filteredMeals = meals;
            break;
        case 'today':
            filteredMeals = meals.filter(meal => meal.date === today);
            break;
        case 'week':
            filteredMeals = meals.filter(meal => meal.date >= weekAgo && meal.date <= today);
            break;
        default:
            filteredMeals = meals;
    }
    
    displayMeals(filteredMeals);
}

function displayMeals(mealsToShow) {
    const sortedMeals = mealsToShow.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateB - dateA;
    });
    
    mealsList.innerHTML = '';
    
    sortedMeals.forEach(meal => {
        const mealElement = createMealElement(meal);
        mealsList.appendChild(mealElement);
    });
    
    updateNoMealsVisibility(mealsToShow.length === 0);
}

function createMealElement(meal) {
    const mealDiv = document.createElement('div');
    mealDiv.className = 'meal-item';
    mealDiv.dataset.mealId = meal.id;
    
    const formattedDate = formatDate(meal.date);
    const formattedTime = formatTime(meal.time);
    
    mealDiv.innerHTML = `
        <div class="meal-header">
            <h3 class="meal-title">${escapeHtml(meal.title)}</h3>
            <div class="meal-datetime">
                <div>${formattedDate}</div>
                <div>${formattedTime}</div>
            </div>
        </div>
        <p class="meal-description">${escapeHtml(meal.description) || 'No description provided'}</p>
        <div class="meal-actions">
            <button class="btn btn-secondary btn-small" onclick="viewMealDetails(${meal.id})">View Details</button>
            <button class="btn btn-primary btn-small" onclick="editMeal(${meal.id})">Edit</button>
            <button class="btn btn-danger btn-small" onclick="deleteMeal(${meal.id})">Delete</button>
        </div>
    `;
    
    mealDiv.addEventListener('click', function(e) {
        if (!e.target.classList.contains('btn')) {
            viewMealDetails(meal.id);
        }
    });
    
    return mealDiv;
}

function viewMealDetails(mealId) {
    localStorage.setItem('selectedMealId', mealId);
    window.location.href = 'meal-details.html';
}

function deleteMeal(mealId) {
    if (confirm('Are you sure you want to delete this meal entry?')) {
        meals = meals.filter(meal => meal.id !== mealId);
        saveMeals();
        displayMeals(meals);
        updateNoMealsVisibility();
    }
}

function saveMeals() {
    localStorage.setItem('foodJournalMeals', JSON.stringify(meals));
}

function updateNoMealsVisibility(forceShow = false) {
    const shouldShow = forceShow || meals.length === 0;
    noMealsDiv.classList.toggle('hidden', !shouldShow);
    mealsList.classList.toggle('hidden', shouldShow);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
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

function openModal(mealToEdit = null) {
    addMealModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    if (mealToEdit) {
        currentEditingMealId = mealToEdit.id;
        modalTitle.textContent = 'Edit Meal';
        submitBtn.textContent = 'Update Meal';
        
        document.getElementById('meal-title').value = mealToEdit.title;
        document.getElementById('meal-date').value = mealToEdit.date;
        document.getElementById('meal-time').value = mealToEdit.time;
        document.getElementById('meal-description').value = mealToEdit.description || '';
    } else {
        currentEditingMealId = null;
        modalTitle.textContent = 'Add New Meal';
        submitBtn.textContent = 'Add Meal';
        
        document.getElementById('meal-date').value = new Date().toISOString().split('T')[0];
        
        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        document.getElementById('meal-time').value = timeString;
    }
    
    document.getElementById('meal-title').focus();
}

function closeModal() {
    addMealModal.classList.add('hidden');
    document.body.style.overflow = '';
    
    currentEditingMealId = null;
    modalTitle.textContent = 'Add New Meal';
    submitBtn.textContent = 'Add Meal';
    
    mealForm.reset();
}

function editMeal(mealId) {
    const meal = meals.find(m => m.id === mealId);
    if (meal) {
        openModal(meal);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('meal-date');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
});

window.deleteMeal = deleteMeal;
window.viewMealDetails = viewMealDetails;
window.editMeal = editMeal;

document.addEventListener('DOMContentLoaded', init);

export { meals, Meal, displayMeals, saveMeals };