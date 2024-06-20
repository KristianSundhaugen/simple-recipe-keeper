export async function createRecipe(recipe) {
    try {
        const response = await fetch('/api/recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipe)
        });

        if (response.ok) {
            alert('Recipe created successfully!');
            return true;
        } else {
            alert('Failed to create recipe.');
            return false;
        }
    } catch (error) {
        console.error('Error creating recipe:', error);
        alert('Failed to create recipe. Please try again later.');
        return false;
    }
}

export async function getAllRecipes() {
    try {
        const response = await fetch('/api/recipes', {
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
