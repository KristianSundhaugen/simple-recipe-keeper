public class RecipeCreateModel
{
    public string Title { get; set; }
    public IFormFile Picture { get; set; }
    public int? PreparationTimeInMinutes { get; set; }
    public int? CookTimeInMinutes { get; set; }
    public int? TotalTimeInMinutes { get; set; }
    public List<string> IngredientName { get; set; }
    public List<double?> IngredientQuantity { get; set; }
    public List<string> IngredientPreparation { get; set; }
    public string Instructions { get; set; }
}