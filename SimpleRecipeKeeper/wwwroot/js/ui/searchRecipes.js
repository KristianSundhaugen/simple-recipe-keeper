import { getRecipeByQuery } from '../api/recipes.js';

document.addEventListener('DOMContentLoaded', () => {
    const searchField = document.getElementById('searchField');
    const searchDropdown = document.getElementById('searchDropdown');

    searchField.addEventListener('input', async () => {
        const query = searchField.value.trim();
        if (query !== '') {
            try {
                const recipes = await getRecipeByQuery(query);
                displayRecipesDropdown(recipes);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        } else {
            clearDropdown();
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchDropdown.contains(e.target)) {
            clearDropdown();
        }
    });
});

function displayRecipesDropdown(recipes) {
    const searchDropdown = document.getElementById('searchDropdown');
    searchDropdown.innerHTML = '';

    recipes.forEach(recipe => {
        const listItem = document.createElement('div');
        listItem.classList.add('dropdown-item');
        listItem.textContent = recipe.title;
        listItem.addEventListener('click', () => {
            selectRecipe(recipe);
        });
        searchDropdown.appendChild(listItem);
    });

    searchDropdown.style.display = 'block';
}

function selectRecipe(recipe) {
    const searchField = document.getElementById('searchField');
    searchField.value = recipe.title;
    clearDropdown();
    window.viewRecipe(recipe.id);
}

function clearDropdown() {
    const searchDropdown = document.getElementById('searchDropdown');
    searchDropdown.innerHTML = '';
    searchDropdown.style.display = 'none';
}
