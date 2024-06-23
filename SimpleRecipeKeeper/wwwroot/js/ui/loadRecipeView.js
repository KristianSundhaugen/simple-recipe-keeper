async function fetchRecipeData(recipeId) {
    try {
        const response = await fetch(`/api/recipes/${recipeId}`);
        if (response.ok) {
            const data = await response.json();
            displayRecipe(data);
        } else {
            throw new Error('Failed to fetch recipe data');
        }
    } catch (error) {
        console.error('Error fetching recipe data:', error);
    }
}

function displayRecipe(recipe) {
    document.getElementById('recipe-title').textContent = recipe.title;
    document.getElementById('recipe-image').src = recipe.pictureUrl || 'https://via.placeholder.com/600x400';
    document.getElementById('food-category').querySelector('span').textContent = recipe.foodCategory || 'N/A';
    document.getElementById('prep-time').querySelector('span').textContent = recipe.preparationTimeInMinutes ? `${recipe.preparationTimeInMinutes} mins` : 'N/A';
    document.getElementById('cook-time').querySelector('span').textContent = recipe.cookTimeInMinutes ? `${recipe.cookTimeInMinutes} mins` : 'N/A';
    document.getElementById('total-time').querySelector('span').textContent = recipe.totalTimeInMinutes ? `${recipe.totalTimeInMinutes} mins` : 'N/A';

    const ingredientsList = document.getElementById('ingredients-list');
    ingredientsList.innerHTML = '';
    recipe.ingredients.forEach(ingredient => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.textContent = `${ingredient.quantity || ''} ${ingredient.name} ${ingredient.preparation || ''}`;
        ingredientsList.appendChild(listItem);
    });

    document.getElementById('instructions').textContent = recipe.instructions;
}

document.addEventListener('DOMContentLoaded', () => {
    const recipeId = window.location.pathname.split('/').pop();
    if (recipeId) {
        fetchRecipeData(recipeId);
    }
});
