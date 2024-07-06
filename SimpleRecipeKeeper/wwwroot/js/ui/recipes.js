import { createRecipe } from '../api/recipes.js';

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
        <button type="button" onclick="removeIngredient(this)" class="remove-btn"><i class="fas fa-trash"></i></button>
    `;
    document.getElementById('ingredients').appendChild(ingredientDiv);
}

function removeIngredient(button) {
    button.parentElement.remove();
}

document.getElementById('recipeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(document.getElementById('recipeForm'));

    const success = await createRecipe(formData);

    if (success) {
        document.getElementById('recipeForm').reset();
    }
});

document.getElementById('back-button').addEventListener('click', () => {
    window.history.back();
});

window.addIngredient = addIngredient;
window.removeIngredient = removeIngredient;

export { addIngredient, removeIngredient };
