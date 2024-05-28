public interface IElasticsearchService
{
    Task IndexRecipeAsync(Recipe recipe);
    Task<Recipe> GetRecipeAsync(string id);
    Task<IEnumerable<Recipe>> GetRecipesAsync();
    Task<Recipe> GetRecipeByIdAsync(string id);
    Task<Recipe> CreateRecipeAsync(Recipe recipe);
    Task<Recipe> UpdateRecipeAsync(Recipe recipe);
    Task<bool> DeleteRecipeAsync(string id);
}
