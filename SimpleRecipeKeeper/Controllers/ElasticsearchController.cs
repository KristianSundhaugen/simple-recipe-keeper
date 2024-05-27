using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ElasticsearchController : ControllerBase
{
    private readonly ElasticsearchService _elasticsearchService;

    public ElasticsearchController(ElasticsearchService elasticsearchService)
    {
        _elasticsearchService = elasticsearchService;
    }

    // Get all recipes
    [HttpGet]
    public async Task<IActionResult> GetRecipes()
    {
        var recipes = await _elasticsearchService.GetRecipesAsync();
        return Ok(recipes);
    }

    // Get a recipe by ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetRecipeById(string id)
    {
        try
        {
            var recipe = await _elasticsearchService.GetRecipeByIdAsync(id);
            return Ok(recipe);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // Create a new recipe
    [HttpPost]
    public async Task<IActionResult> CreateRecipe([FromBody] Recipe recipe)
    {
        if (recipe == null)
        {
            return BadRequest(new { message = "Recipe cannot be null" });
        }

        try
        {
            var createdRecipe = await _elasticsearchService.CreateRecipeAsync(recipe);
            return CreatedAtAction(nameof(GetRecipeById), new { id = createdRecipe.Id }, createdRecipe);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    // Update an existing recipe
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRecipe(string id, [FromBody] Recipe recipe)
    {
        if (recipe == null || recipe.Id != int.Parse(id))
        {
            return BadRequest(new { message = "Invalid recipe data" });
        }

        try
        {
            var updatedRecipe = await _elasticsearchService.UpdateRecipeAsync(recipe);
            return Ok(updatedRecipe);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    // Delete a recipe by ID
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRecipe(string id)
    {
        try
        {
            var deleted = await _elasticsearchService.DeleteRecipeAsync(id);
            if (deleted)
            {
                return NoContent();
            }
            else
            {
                return NotFound(new { message = "Recipe not found" });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }
}
