namespace SimpleRecipeKeeper.Models
{ 
public class RecipeFilter
    {
        public List<string> FoodCategories { get; set; }
        public List<string> Ingredients { get; set; }
        public int? MaxTime { get; set; }
    }
}