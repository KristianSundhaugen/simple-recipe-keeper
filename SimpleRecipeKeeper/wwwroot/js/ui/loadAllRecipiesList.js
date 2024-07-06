import { getAllRecipes } from '../api/recipes.js';

let currentPage = 1;
const pageSize = 9;
let recipes = [];
let totalCount = 0;

async function loadRecipes(page = 1, foodCategory = null) {
    try {
        const result = await getAllRecipes(page, pageSize, foodCategory);
        recipes = result.recipes;
        const totalCount = result.totalCount;

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
                    htmlContent += `
                        <div class="col-4">
                            <div class="recipe-item" onclick="viewRecipe(${recipe.id})">
                                <img src="${recipe.pictureUrl || '/placeholder.jpg'}" alt="${recipe.title}" class="img-fluid">
                                <h5>${recipe.title}</h5>
                                <p><i class="fas fa-clock"></i> ${recipe.totalTimeInMinutes} mins</p>
                            </div>
                        </div>
                    `;
                }
            }

            htmlContent += '</div>';
        }

        recipeList.innerHTML = htmlContent;

        const totalCountElement = document.getElementById('totalCount');
        totalCountElement.innerText = `${totalCount} recipes found`;

        updatePaginationControls();
    } catch (error) {
        console.error('Error loading recipes:', error);
    }
}


function updatePaginationControls() {
    const paginationControls = document.getElementById('paginationControls');
    paginationControls.innerHTML = `
        ${currentPage != 1 ? `<button onclick="prevPage()">Previous</button>` : ''}
        <span>Page ${currentPage}</span>
        ${recipes.length >= pageSize ? `<button onclick="nextPage()">Next</button>` : ''}
    `;
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        loadRecipes(currentPage);
    }
}

function nextPage() {
    currentPage++;
    loadRecipes(currentPage);
}

function filterByCategory(category) {
    const clickedItem = document.querySelector(`.category-item[data-category="${category}"]`);

    if (!clickedItem) {
        console.warn(`Category item for ${category} not found`);
        return;
    }

    const isSelected = clickedItem.classList.contains('selected');
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.classList.remove('selected');
    });

    if (isSelected) {
        loadRecipes(currentPage);
    } else {
        clickedItem.classList.add('selected');
        loadRecipes(currentPage, category);
    }
}

function viewRecipe(id) {
    window.location.href = `http://localhost:5288/recipe/${id}`;
}

document.addEventListener('DOMContentLoaded', () => loadRecipes(currentPage));

window.prevPage = prevPage;
window.nextPage = nextPage;
window.filterByCategory = filterByCategory;
window.viewRecipe = viewRecipe;
