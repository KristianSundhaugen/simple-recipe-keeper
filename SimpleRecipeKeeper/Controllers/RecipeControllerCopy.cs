using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/recipes/copy")]
public class RecipeControllerCopy : ControllerBase
{
    private readonly List<Recipe> _recipes = new List<Recipe>();

    [HttpGet]
    public ActionResult<IEnumerable<Recipe>> GetRecipes()
    {
        return Ok(_recipes);
    }

    [HttpGet("{id}")]
    public ActionResult<Recipe> GetRecipeById(int id)
    {
        var recipe = _recipes.FirstOrDefault( r => r.Id == id);
        if (recipe == null){
            return NotFound();
        }
        return Ok(recipe);
    }

    [HttpPost]
    public ActionResult<Recipe> CreateRecipe(Recipe recipe)
    {
        _recipes.Add(recipe);
        return CreatedAtAction(nameof(GetRecipeById), new { id = recipe.Id}, recipe);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateRecipe(int id, Recipe recipe)
    {
        if (id != recipe.Id)
        {
            return BadRequest();
        }

        var exstistingRecipeIndex = _recipes.FindIndex( r => r.Id == id );
        if (exstistingRecipeIndex == -1)
        {
            return NotFound();
        }

        _recipes[exstistingRecipeIndex] = recipe;
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteRecipe(int id)
    {
        var recipeToRemove = _recipes.FirstOrDefault(r => r.Id == id);
        if (recipeToRemove == null)
        {
            return NotFound();
        }

        _recipes.Remove(recipeToRemove);
        return NoContent();
    }
}