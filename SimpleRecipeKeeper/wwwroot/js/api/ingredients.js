export async function getAllIngredients() {
    try {
        var query = `/api/ingredients`;

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
            throw new Error('Failed to fetch ingredients.');
        }
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        throw error;
    }
}