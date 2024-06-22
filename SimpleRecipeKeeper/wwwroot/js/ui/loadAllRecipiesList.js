import { getAllRecipes } from '../api/recipes.js';

let currentPage = 1;
const pageSize = 9;
let recipes = []; // Initialize recipes array

async function loadRecipes(page = 1, foodCategory = null) {
    try {
        recipes = await getAllRecipes(page, pageSize, foodCategory); // Assign fetched recipes to the global variable
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
                            <div class="recipe-item">
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
    const allCategoryItem = document.querySelector('.category-item[data-category="All"]');
    const clickedItem = document.querySelector(`.category-item[data-category="${category}"]`);

    if (clickedItem.classList.contains('selected')) {
        clickedItem.classList.remove('selected');
        loadRecipes(currentPage);
    } else {
        const categoryItems = document.querySelectorAll('.category-item');
        categoryItems.forEach(item => {
            item.classList.remove('selected');
        });

        clickedItem.classList.add('selected');
        loadRecipes(currentPage, category);
    }
    
    allCategoryItem.classList.remove('selected');
}



document.addEventListener('DOMContentLoaded', () => loadRecipes(currentPage));

window.prevPage = prevPage;
window.nextPage = nextPage;
window.filterByCategory = filterByCategory;
