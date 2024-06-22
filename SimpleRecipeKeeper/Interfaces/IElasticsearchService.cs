public interface IElasticsearchService
{
    Task IndexRecipeAsync(Recipe recipe);
    Task<IEnumerable<Recipe>> GetRecipesAsync(int page, int pageSize, string foodCategory);
    Task<Recipe> GetRecipeByIdAsync(string id);
    Task<Recipe> CreateRecipeAsync(Recipe recipe);
    Task<Recipe> UpdateRecipeAsync(Recipe recipe);
    Task<bool> DeleteRecipeAsync(string id);
}
