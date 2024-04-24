public class Recipe
{
    public int Id { get; set; } // Unique identifier for the recipe (can be generated)
    public string Title { get; set; } // Required field
    public string? PictureUrl { get; set; } // Optional image URL
    public int? PreparationTimeInMinutes { get; set; } // Optional preparation time
    public int? CookTimeInMinutes { get; set; } // Optional cook time
    public int? TotalTimeInMinutes { get; set; } // Optional total time

    public List<Ingredient> Ingredients { get; set; } = new List<Ingredient>(); // Required, initialized with an empty list
    public string Instructions { get; set; } // Required field
}

public class Ingredient
{
    public string Name { get; set; } // Required field
    public double Quantity { get; set; } // Required field
    public string? Preparation { get; set; } // Optional preparation instruction
}
