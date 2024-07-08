export async function createRecipe(formData) {
    try {
        const response = await fetch('/api/recipes', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            console.log('Recipe created successfully!');
            return true;
        } else {
            console.log('Failed to create recipe.');
            return false;
        }
    } catch (error) {
        console.error('Error creating recipe:', error);
        return false;
    }
}

export async function updateRecipe(id, formData) {
    try {
        const response = await fetch(`/api/recipes/${id}`, {
            method: 'PUT',
            body: formData
        });

        if (response.ok) {
            console.log('Recipe updated successfully!');
            return true;
        } else {
            console.log('Failed to update recipe.');
            return false;
        }
    } catch (error) {
        console.error('Error updating recipe:', error);
        return false;
    }
}

export async function getAllRecipes(page = 1, pageSize = 10, foodCategory = null) {
    try {
        if(foodCategory != null){
            var query = `/api/recipes?page=${page}&pageSize=${pageSize}&foodCategory=${foodCategory}`;
        } else {
            var query = `/api/recipes?page=${page}&pageSize=${pageSize}`;
        }
        const response = await fetch(query, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Failed to fetch recipes.');
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
        throw error;
    }
}

export async function getRecipeById(id) {
    try {
        const response = await fetch(`/api/recipes/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Failed to fetch recipe.');
        }
    } catch (error) {
        console.error('Error fetching recipe:', error);
        throw error;
    }
}

export async function getRecipeByQuery(query) {
    try {
        const response = await fetch(`/api/recipes/search/${query}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Failed to fetch recipe.');
        }
    } catch (error) {
        console.error('Error fetching recipe:', error);
        throw error;
    }
}



