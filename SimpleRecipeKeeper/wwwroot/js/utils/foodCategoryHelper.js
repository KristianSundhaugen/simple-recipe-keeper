import { FoodCategory } from '../enum/FoodCategory.js';

export function findCategoryItem(category) {
    return document.querySelector(`.category-item[data-category="${category}"]`);
}

export function toggleCategorySelection(categoryItem) {
    categoryItem.classList.toggle('selected');
}

export function updateCategoryCheckbox(category, categoryItem) {
    const checkbox = document.getElementById(`foodCategory-${FoodCategory[category]}`);
    if (checkbox) {
        checkbox.checked = categoryItem.classList.contains('selected');
    }
}