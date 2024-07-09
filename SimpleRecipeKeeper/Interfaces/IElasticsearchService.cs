public interface IElasticsearchService
{
    Task IndexRecipeAsync(Recipe recipe);
    Task<RecipeSearchResult> GetRecipesAsync(int page, int pageSize, string filter, string orderBy);
    Task<Recipe> GetRecipeByIdAsync(string id);
    Task<Recipe> CreateRecipeAsync(Recipe recipe);
    Task<Recipe> UpdateRecipeAsync(Recipe recipe);
    Task<bool> DeleteRecipeAsync(string id);
    Task<List<Recipe>> SearchRecipesAsync(string searchText);
    Task<List<string>> GetAllIngredientsAsync();
}
