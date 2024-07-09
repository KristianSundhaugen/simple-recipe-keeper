import { getAllRecipes } from '../api/recipes.js';
import { applyFilters } from './filters.js';
import { FoodCategory } from '../enum/FoodCategory.js';
import { findCategoryItem, toggleCategorySelection, updateCategoryCheckbox } from '../utils/foodCategoryHelper.js';
import config from '../../config.js';

let currentPage = 1;
const pageSize = 9;
let recipes = [];
let totalCount = 0;
let currentFilters = null;

export async function loadRecipes(page = 1, filter = null) {
    try {
        const { fetchedRecipes, totalCount } = await fetchRecipes(page, filter);

        recipes = fetchedRecipes;
        displayRecipes(recipes);
        displayTotalCount(totalCount);
        updatePaginationControls(filter);

    } catch (error) {
        console.error('Error loading recipes:', error);
    }
}

async function fetchRecipes(page, filter) {
    const result = await getAllRecipes(page, pageSize, filter);
    return {
        fetchedRecipes: result.recipes,
        totalCount: result.totalCount
    };
}

function displayRecipes(recipes) {
    const recipeList = document.getElementById('recipeList');
    recipeList.innerHTML = '';

    const rows = Math.ceil(recipes.length / 3);
    let htmlContent = '';

    for (let i = 0; i < rows; i++) {
        htmlContent += '<div class="row">';

        for (let j = 0; j < 3; j++) {
            const recipeIndex = i * 3 + j;
            if (recipeIndex < recipes.length) {
                const recipe = recipes[recipeIndex];
                htmlContent += renderRecipeCard(recipe);
            }
        }

        htmlContent += '</div>';
    }

    recipeList.innerHTML = htmlContent;
}

function renderRecipeCard(recipe) {
    return `
        <div class="col-4">
            <div class="recipe-item" onclick="viewRecipe(${recipe.id})">
                <img src="${recipe.pictureUrl || '/placeholder.jpg'}" alt="${recipe.title}" class="img-fluid">
                <h5>${recipe.title}</h5>
                <p><i class="fas fa-clock"></i> ${recipe.totalTimeInMinutes} mins</p>
            </div>
        </div>
    `;
}

function displayTotalCount(totalCount) {
    const totalCountElement = document.getElementById('totalCount');
    totalCountElement.innerText = `${totalCount} recipes found`;
}

export function resetPage() {
    currentPage = 1;
}

function updatePaginationControls(filters) {
    currentFilters = filters;
    const paginationControls = document.getElementById('paginationControls');
    const prevButton = currentPage > 1 ? `<button onclick="prevPage()">Previous</button>` : '';
    const nextButton = recipes.length >= pageSize ? `<button onclick="nextPage()">Next</button>` : '';
    paginationControls.innerHTML = `
        ${prevButton}
        <span>Page ${currentPage}</span>
        ${nextButton}
    `;
}

export function prevPage(filters = null) {
    if (currentPage > 1) {
        currentPage--;
        loadRecipes(currentPage, filters || currentFilters);
    }
}

export function nextPage(filters = null) {
    currentPage++;
    loadRecipes(currentPage, filters || currentFilters);
}

export function filterByCategory(category) {
    const categoryItem = findCategoryItem(category);

    if (!categoryItem) {
        console.warn(`Category item for ${category} not found`);
        return;
    }

    toggleCategorySelection(categoryItem);
    updateCategoryCheckbox(category, categoryItem);
    applyFilters();
}

export function viewRecipe(id) {
    window.location.href = `${config.mainUrl}${config.recipePage}${id}`;
}

document.addEventListener('DOMContentLoaded', () => loadRecipes(currentPage));

window.prevPage = prevPage;
window.nextPage = nextPage;
window.filterByCategory = filterByCategory;
window.viewRecipe = viewRecipe;
window.loadRecipes = loadRecipes;
window.resetPage = resetPage;
