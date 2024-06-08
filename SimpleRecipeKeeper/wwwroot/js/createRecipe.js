/* createRecipe.js */
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

    const title = document.getElementById('title').value;
    const pictureUrl = document.getElementById('pictureUrl').value;
    const preparationTimeInMinutes = document.getElementById('preparationTimeInMinutes').value;
    const cookTimeInMinutes = document.getElementById('cookTimeInMinutes').value;
    const totalTimeInMinutes = document.getElementById('totalTimeInMinutes').value;
    const instructions = document.getElementById('instructions').value;

    const ingredientNames = document.querySelectorAll('input[name="ingredientName[]"]');
    const ingredientQuantities = document.querySelectorAll('input[name="ingredientQuantity[]"]');
    const ingredientPreparations = document.querySelectorAll('input[name="ingredientPreparation[]"]');

    const ingredients = [];
    for (let i = 0; i < ingredientNames.length; i++) {
        ingredients.push({
            name: ingredientNames[i].value,
            quantity: ingredientQuantities[i].value,
            preparation: ingredientPreparations[i].value
        });
    }

    const recipe = {
        title,
        pictureUrl,
        preparationTimeInMinutes: preparationTimeInMinutes ? parseInt(preparationTimeInMinutes) : null,
        cookTimeInMinutes: cookTimeInMinutes ? parseInt(cookTimeInMinutes) : null,
        totalTimeInMinutes: totalTimeInMinutes ? parseInt(totalTimeInMinutes) : null,
        ingredients,
        instructions
    };

    const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipe)
    });

    if (response.ok) {
        alert('Recipe created successfully!');
        document.getElementById('recipeForm').reset();
    } else {
        alert('Failed to create recipe.');
    }
});
