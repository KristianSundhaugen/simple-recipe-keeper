import { createRecipe } from '../api/recipes.js';
import { getRecipeData } from '../utils/recipe.js';

let ingredientCount = 1;

function addIngredient() {
    ingredientCount++;
    const ingredientDiv = document.createElement('div');
    ingredientDiv.classList.add('ingredient');
    ingredientDiv.innerHTML = `
        <label for="ingredientName${ingredientCount}">Name:</label>
        <input type="text" id="ingredientName${ingredientCount}" name="ingredientName[]" required>
        <label for="ingredientQuantity${ingredientCount}">Quantity:</label>
        <input type="number" step="any" id="ingredientQuantity${ingredientCount}" name="ingredientQuantity[]" required>
        <label for="ingredientPreparation${ingredientCount}">Preparation:</label>
        <input type="text" id="ingredientPreparation${ingredientCount}" name="ingredientPreparation[]">
        <button type="button" onclick="removeIngredient(this)">Remove</button>
    `;
    document.getElementById('ingredients').appendChild(ingredientDiv);
}

function removeIngredient(button) {
    button.parentElement.remove();
}

document.getElementById('recipeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const recipe = getRecipeData();

    const success = await createRecipe(recipe);

    if (success) {
        document.getElementById('recipeForm').reset();
    }
});

export { addIngredient, removeIngredient };
