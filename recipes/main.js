import recipes from './recipes.mjs';

function getRandomNumber(num) {
  return Math.floor(Math.random() * num);
}

function getRandomListEntry(list) {
  return list[getRandomNumber(list.length)];
}

function recipeTemplate(recipe) {
  return `<figure class="recipe">
    <img src="${recipe.image}" alt="image of ${recipe.name}" />
    <figcaption>
        ${tagsTemplate(recipe.tags)}
        <h2><a href="#">${recipe.name}</a></h2>
        <p class="recipe__ratings">
            ${ratingTemplate(recipe.rating)}
        </p>
        <p class="recipe__description">
            ${recipe.description}
        </p>
    </figcaption>
</figure>`;
}

function tagsTemplate(tags) {
  let html = `<ul class="recipe__tags">`;
  tags.forEach(tag => {
    html += `<li>${tag}</li>`;
  });
  html += `</ul>`;
  return html;
}

function ratingTemplate(rating) {
  let html = `<span
    class="rating"
    role="img"
    aria-label="Rating: ${rating} out of 5 stars"
>`;
  
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      html += `<span aria-hidden="true" class="icon-star">⭐</span>`;
    } else {
      html += `<span aria-hidden="true" class="icon-star-empty">☆</span>`;
    }
  }
  
  html += `</span>`;
  return html;
}

function renderRecipes(recipeList) {
  const recipesContainer = document.querySelector('.recipes');
  const recipeStrings = recipeList.map(recipe => recipeTemplate(recipe));
  recipesContainer.innerHTML = recipeStrings.join('');
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
  const sortedList = filteredList.sort((a, b) => a.name.localeCompare(b.name));
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
  const recipe = getRandomListEntry(recipes);
  renderRecipes([recipe]);

  const searchForm = document.querySelector('form.search-container');
  searchForm.addEventListener('submit', searchHandler);
}

init();
