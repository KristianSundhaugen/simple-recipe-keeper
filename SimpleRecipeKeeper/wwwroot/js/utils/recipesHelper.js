import { createRecipe, getRecipeById, updateRecipe } from '../api/recipes.js';
import { FoodCategory } from '../enum/FoodCategory.js';
import config from '../../config.js';

let ingredientCount = 1;

function addIngredient() {
    ingredientCount++;
    const ingredientDiv = document.createElement('div');
    ingredientDiv.classList.add('ingredient');
    ingredientDiv.innerHTML = `
        <label for="ingredientName${ingredientCount}">Name:</label>
        <input type="text" id="ingredientName${ingredientCount}" name="ingredientName[]" required>
        <label for="ingredientQuantity${ingredientCount}">Quantity:</label>
        <input type="text" step="any" id="ingredientQuantity${ingredientCount}" name="ingredientQuantity[]" required>
        <label for="ingredientPreparation${ingredientCount}">Preparation:</label>
        <input type="text" id="ingredientPreparation${ingredientCount}" name="ingredientPreparation[]">
        <button type="button" onclick="removeIngredient(this)" class="remove-btn"><i class="fas fa-trash"></i></button>
    `;
    document.getElementById('ingredients').appendChild(ingredientDiv);
}

function addExistingIngredient(index, ingredient = {}) {
    const ingredientDiv = document.createElement('div');
    ingredientDiv.classList.add('ingredient');
    ingredientDiv.innerHTML = `
        <label for="ingredientName${index}">Name:</label>
        <input type="text" id="ingredientName${index}" name="ingredientName[]" value="${ingredient.name || ''}" required>
        <label for="ingredientQuantity${index}">Quantity:</label>
        <input type="text" step="any" id="ingredientQuantity${index}" name="ingredientQuantity[]" value="${ingredient.quantity || ''}" required>
        <label for="ingredientPreparation${index}">Preparation:</label>
        <input type="text" id="ingredientPreparation${index}" name="ingredientPreparation[]" value="${ingredient.preparation || ''}">
        <button type="button" onclick="removeIngredient(this)" class="remove-btn"><i class="fas fa-trash"></i></button>
    `;
    document.getElementById('ingredients').appendChild(ingredientDiv);
}

function removeIngredient(button) {
    button.parentElement.remove();
}

function populateForm(recipe) {
    document.getElementById('recipeId').value = recipe.id;
    document.getElementById('title').value = recipe.title;
    document.getElementById('preparationTimeInMinutes').value = recipe.preparationTimeInMinutes;
    document.getElementById('cookTimeInMinutes').value = recipe.cookTimeInMinutes;
    document.getElementById('totalTimeInMinutes').value = recipe.totalTimeInMinutes;
    document.getElementById('instructions').value = recipe.instructions;

    const foodCategorySelect = document.getElementById('foodCategory');
    foodCategorySelect.innerHTML = '';

    Object.keys(FoodCategory).forEach(key => {
        const option = document.createElement('option');
        option.value = FoodCategory[key];
        option.textContent = key;
        foodCategorySelect.appendChild(option);
    });

    if (recipe.foodCategory !== undefined && recipe.foodCategory !== null) {
        // foodCategorySelect.value = recipe.foodCategory.toString();
        foodCategorySelect.value = 2;
    } else {
        foodCategorySelect.value = '';
    }
    
    const existingPicture = document.getElementById('existing-picture');
    const fileInputContent = document.querySelector('.file-input-content');
    existingPicture.src = recipe.pictureUrl;
    existingPicture.style.display = 'block';
    fileInputContent.style.display = 'none';

    const ingredientsContainer = document.getElementById('ingredients');
    ingredientsContainer.innerHTML = '';

    recipe.ingredients.forEach((ingredient, index) => {
        addExistingIngredient(index + 1, ingredient);
    });
}

function getRecipeIdFromPath() {
    const pathParts = window.location.pathname.split('/');
    const pathPart = pathParts[pathParts.length - 1];
    if(pathPart == "recipe-form"){
        return null;
    }
    return pathPart;
}

document.addEventListener('DOMContentLoaded', async () => {
    const recipeId = getRecipeIdFromPath();

    const foodCategoryDropdown = document.getElementById('foodCategory');

    Object.keys(FoodCategory).forEach(key => {
        const option = document.createElement('option');
        option.value = FoodCategory[key];
        option.textContent = key;
        foodCategoryDropdown.appendChild(option);
    });

    if (recipeId) {
        try {
            const recipe = await getRecipeById(recipeId);
            populateForm(recipe);
            document.getElementById('formTitle').textContent = 'Update Recipe';
            document.getElementById('submitButton').value = 'Update Recipe';
        } catch (error) {
            console.error('Error fetching recipe:', error);
            alert('Failed to load recipe for editing.');
        }
    }
});

document.getElementById('recipeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const recipeId = getRecipeIdFromPath();
    const formData = new FormData(document.getElementById('recipeForm'));

    let success;
    if (recipeId) {
        success = await updateRecipe(recipeId, formData);
        if (success) {
            document.getElementById('recipeForm').reset();
            const recipePageUrl = `${config.mainUrl}${config.recipePage}${recipeId}`;
            window.location.href = recipePageUrl;
        } else {
            alert('Failed to update recipe.');
        }
    } else {
        success = await createRecipe(formData);
        if (success) {
            alert('New recipe created!');
            document.getElementById('recipeForm').reset();
            document.getElementById('existing-picture').reset();
        } else {
            alert('Failed to save recipe.');
        }
    }
});

document.getElementById('back-button').addEventListener('click', () => {
    window.history.back();
});

document.addEventListener('DOMContentLoaded', () => {
    const pictureInput = document.getElementById('picture');
    const existingPicture = document.getElementById('existing-picture');
    const fileInputContent = document.querySelector('.file-input-content');

    pictureInput.addEventListener('change', () => {
        const file = pictureInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                existingPicture.src = e.target.result;
                existingPicture.style.display = 'block';
                fileInputContent.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // Function to handle drag and drop
    const fileInputWrapper = document.querySelector('.file-input-wrapper');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileInputWrapper.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        fileInputWrapper.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        fileInputWrapper.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        fileInputWrapper.classList.add('highlight');
    }

    function unhighlight() {
        fileInputWrapper.classList.remove('highlight');
    }

    fileInputWrapper.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];

        pictureInput.files = dt.files;
        handleFiles(file);
    }

    function handleFiles(file) {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                existingPicture.src = e.target.result;
                existingPicture.style.display = 'block';
                fileInputContent.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    }
});

window.addIngredient = addIngredient;
window.removeIngredient = removeIngredient;

export { addIngredient, removeIngredient };
