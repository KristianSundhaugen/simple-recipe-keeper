import { getAllRecipes } from '../api/recipes.js';

document.getElementById('fetchRecipesBtn').addEventListener('click', async () => {
    try {
        const resultsElement = document.getElementById('results');
        resultsElement.textContent = 'Fetching recipes...';

        const recipes = await getAllRecipes();
        resultsElement.textContent = JSON.stringify(recipes, null, 2);
    } catch (error) {
        document.getElementById('results').textContent = 'Error fetching recipes: ' + error.message;
    }
});
