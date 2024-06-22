using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/recipes")]
public class RecipeController : ControllerBase
{
    private readonly ElasticsearchService _elasticsearchService;

    public RecipeController(ElasticsearchService elasticsearchService)
    {
        _elasticsearchService = elasticsearchService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Recipe>>> GetRecipes(int page = 1, int pageSize = 10, string foodCategory = null)
    {
        var recipes = await _elasticsearchService.GetRecipesAsync(page, pageSize, foodCategory);
        return Ok(recipes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Recipe>> GetRecipeById(string id)
    {
        var recipe = await _elasticsearchService.GetRecipeByIdAsync(id);
        if (recipe == null)
        {
            return NotFound();
        }
        return Ok(recipe);
    }

    [HttpPost]
    public async Task<ActionResult<Recipe>> CreateRecipe(Recipe recipe)
    {
        var createdRecipe = await _elasticsearchService.CreateRecipeAsync(recipe);
        return CreatedAtAction(nameof(GetRecipeById), new { id = createdRecipe.Id }, createdRecipe);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRecipe(int id, Recipe recipe)
    {
        if (id != recipe.Id)
        {
            return BadRequest();
        }

        var updatedRecipe = await _elasticsearchService.UpdateRecipeAsync(recipe);
        if (updatedRecipe == null)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRecipe(string id)
    {
        var deleted = await _elasticsearchService.DeleteRecipeAsync(id);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
