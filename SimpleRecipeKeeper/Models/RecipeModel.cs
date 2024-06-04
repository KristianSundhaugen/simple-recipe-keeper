public class Recipe
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string PictureUrl { get; set; }
    public int? PreparationTimeInMinutes { get; set; } // Nullable integer
    public int? CookTimeInMinutes { get; set; }        // Nullable integer
    public int? TotalTimeInMinutes { get; set; }       // Nullable integer
    public List<Ingredient> Ingredients { get; set; }
    public string Instructions { get; set; }
}

public class Ingredient
{
    public string Name { get; set; }
    public double? Quantity { get; set; }    // Nullable double
    public string Preparation { get; set; }
}
