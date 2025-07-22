// Food Journal - Shared Utilities Module

export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

export function formatDateLong(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

export function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export function saveMeals(meals) {
    try {
        localStorage.setItem('foodJournalMeals', JSON.stringify(meals));
        return true;
    } catch (error) {
        console.error('Error saving meals to localStorage:', error);
        alert('Unable to save meals. Your browser may have localStorage disabled or storage may be full.');
        return false;
    }
}

export function loadMeals() {
    try {
        const storedMeals = localStorage.getItem('foodJournalMeals');
        return storedMeals ? JSON.parse(storedMeals) : [];
    } catch (error) {
        console.error('Error loading meals from localStorage:', error);
        alert('Unable to load saved meals. Starting with empty meal list.');
        return [];
    }
}

