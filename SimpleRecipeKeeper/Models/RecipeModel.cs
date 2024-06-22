public class Recipe
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string PictureUrl { get; set; }
    public FoodCategory? FoodCategory { get; set; }
    public int? PreparationTimeInMinutes { get; set; }
    public int? CookTimeInMinutes { get; set; }
    public int? TotalTimeInMinutes { get; set; }
    public List<Ingredient> Ingredients { get; set; }
    public string Instructions { get; set; }
}

public class Ingredient
{
    public string Name { get; set; }
    public double? Quantity { get; set; }
    public string Preparation { get; set; }
}
