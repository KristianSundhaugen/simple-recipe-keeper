import { FoodCategory } from '../enum/FoodCategory.js';

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
    document.getElementById('prep-time').textContent = recipe.preparationTimeInMinutes ? `${recipe.preparationTimeInMinutes} mins` : 'N/A';
    document.getElementById('cook-time').textContent = recipe.cookTimeInMinutes ? `${recipe.cookTimeInMinutes} mins` : 'N/A';
    document.getElementById('total-time').textContent = recipe.totalTimeInMinutes ? `${recipe.totalTimeInMinutes} mins` : 'N/A';

    let categoryText;
    if (typeof recipe.foodCategory === 'string') {
        categoryText = recipe.foodCategory;
    } else if (typeof recipe.foodCategory === 'number') {
        categoryText = Object.keys(FoodCategory).find(key => FoodCategory[key] === recipe.foodCategory) || 'Unknown';
    } else {
        categoryText = 'N/A';
    }

    document.getElementById('food-category').textContent = `${categoryText}`;


    const ingredientsList = document.getElementById('ingredients-list');
    ingredientsList.innerHTML = '';
    recipe.ingredients.forEach(ingredient => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.textContent = `${ingredient.quantity || ''} ${ingredient.name} ${ingredient.preparation || ''}`;
        ingredientsList.appendChild(listItem);
    });
    
    document.getElementById('instructions').textContent = recipe.instructions;
    
    document.getElementById('recipe-notes').textContent = recipe.notes || 'No additional notes.';
}


document.addEventListener('DOMContentLoaded', () => {
    const recipeId = window.location.pathname.split('/').pop();
    if (recipeId) {
        fetchRecipeData(recipeId);
    }

    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = '/home';
        });
    }
});
