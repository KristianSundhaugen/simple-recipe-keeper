import { FoodCategory } from '../enum/FoodCategory.js';
import { getAllIngredients } from '../api/ingredients.js';
import { loadRecipes,resetPage } from './loadAllRecipiesList.js';

// Populate Food Category checkboxes
function populateFoodCategoryFilter() {
    const foodCategoryFilter = document.getElementById('foodCategoryFilter');
    Object.keys(FoodCategory).forEach(key => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `foodCategory-${FoodCategory[key]}`;
        checkbox.name = 'foodCategory';
        checkbox.value = FoodCategory[key];
        
        const label = document.createElement('label');
        label.htmlFor = `foodCategory-${FoodCategory[key]}`;
        label.textContent = key;
        
        foodCategoryFilter.appendChild(checkbox);
        foodCategoryFilter.appendChild(label);
        foodCategoryFilter.appendChild(document.createElement('br'));

        checkbox.addEventListener('change', applyFiltersAndSyncCarousel);
    });
}

// Populate Ingredients checkboxes
async function populateIngredientsFilter() {
    try {
        const ingredients = await getAllIngredients();
        const ingredientsFilter = document.getElementById('ingredientsFilter');

        ingredients.forEach(ingredient => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `ingredient-${ingredient}`;
            checkbox.name = 'ingredient';
            checkbox.value = ingredient;
            
            const label = document.createElement('label');
            label.htmlFor = `ingredient-${ingredient}`;
            label.textContent = ingredient;
            
            ingredientsFilter.appendChild(checkbox);
            ingredientsFilter.appendChild(label);
            ingredientsFilter.appendChild(document.createElement('br'));

            checkbox.addEventListener('change', applyFilters);
        });
    } catch (error) {
        console.error('Error populating ingredients filter:', error);
    }
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

// Event listener for time slider
document.getElementById('timeSlider').addEventListener('input', (e) => {
    document.getElementById('timeSliderValue').textContent = `${e.target.value} min`;
});

document.getElementById('timeSlider').addEventListener('change', applyFilters);

function applyFilters() {
    const selectedFoodCategories = Array.from(document.querySelectorAll('input[name="foodCategory"]:checked'))
        .map(cb => getKeyByValue(FoodCategory, parseInt(cb.value)));
    let maxTime = parseInt(document.getElementById('timeSlider').value);
    maxTime = maxTime === 0 ? null : maxTime; // Set maxTime to null if it is 0
    const selectedIngredients = Array.from(document.querySelectorAll('input[name="ingredient"]:checked')).map(cb => cb.value);
    
    const filters = {
        foodCategories: selectedFoodCategories,
        maxTime: maxTime,
        ingredients: selectedIngredients
    };

    resetPage(); // Reset currentPage to 1 when filters are applied
    loadRecipes(1, filters); // Call loadRecipes with the filters
}

function applyFiltersAndSyncCarousel() {
    applyFilters();
    syncCarouselWithFilters();
}

function syncCarouselWithFilters() {
    const selectedFoodCategories = Array.from(document.querySelectorAll('input[name="foodCategory"]:checked'))
        .map(cb => getKeyByValue(FoodCategory, parseInt(cb.value)));
    
    document.querySelectorAll('.category-item').forEach(item => {
        const category = item.getAttribute('data-category');
        if (selectedFoodCategories.includes(category)) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

// Initial population of filters
document.addEventListener('DOMContentLoaded', () => {
    populateFoodCategoryFilter();
    populateIngredientsFilter();
});

export { applyFilters, syncCarouselWithFilters };
