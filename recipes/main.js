import recipes from './recipes.mjs';

function getRandomNum(num) {
  return Math.floor(Math.random() * num);
}

function getRandomRecipe() {
  return recipes[getRandomNum(recipes.length)];
}

function recipeTemplate(recipe) {
  return `
    <article class="recipe">
      <img src="${recipe.image}" alt="${recipe.name}">
      <div class="recipe-content">
        <div class="tags">
          ${tagsTemplate(recipe.tags)}
        </div>
        <h2>${recipe.name}</h2>
        ${ratingTemplate(recipe.rating)}
        <p class="recipe-description">${recipe.description}</p>
      </div>
    </article>
  `;
}

function tagsTemplate(tags) {
  return tags.map(tag => `<span class="tag">${tag}</span>`).join('');
}

function ratingTemplate(rating) {
  let stars = '';
  for (let i = 0; i < rating; i++) {
    stars += '⭐';
  }
  for (let i = 0; i < 5 - rating; i++) {
    stars += '☆';
  }
  return `<span class="rating" role="img" aria-label="Rating: ${rating} out of 5 stars">${stars}</span>`;
}

function renderRecipes(recipes) {
  const recipesContainer = document.querySelector('.recipes');
  recipesContainer.innerHTML = '';
  recipes.forEach(recipe => {
    const recipeElement = document.createElement('div');
    recipeElement.innerHTML = recipeTemplate(recipe);
    recipesContainer.appendChild(recipeElement);
  });
}

function filterRecipes(query) {
  const lowerCaseQuery = query.toLowerCase();
  const filteredList = recipes.filter(
    recipe =>  {
      return recipe.name.toLowerCase().includes(lowerCaseQuery) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)) ||
        recipe.description.toLowerCase().includes(lowerCaseQuery) ||
        recipe.recipeIngredient.some(ingredient => ingredient.toLowerCase().includes(lowerCaseQuery))
    }
  )
  const sortedList = filteredList.sort((a, b) => b.rating - a.rating);
  return sortedList;
}

function handleSearch() {
  const searchInput = document.querySelector('.search-container input');
  const query = searchInput.value;
  const filteredRecipes = filterRecipes(query);
  renderRecipes(filteredRecipes);
}

function searchHandler(e) {
  e.preventDefault();
  handleSearch();
}

function init() {
  const randomRecipe = getRandomRecipe();
  renderRecipes([randomRecipe]);

  const searchForm = document.querySelector('form.search-container');
  searchForm.addEventListener('submit', searchHandler);
}

init();
