export function getRecipeData() {
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

    return {
        title,
        pictureUrl,
        preparationTimeInMinutes: preparationTimeInMinutes ? parseInt(preparationTimeInMinutes) : null,
        cookTimeInMinutes: cookTimeInMinutes ? parseInt(cookTimeInMinutes) : null,
        totalTimeInMinutes: totalTimeInMinutes ? parseInt(totalTimeInMinutes) : null,
        ingredients,
        instructions
    };
}
