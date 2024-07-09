using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/ingredients")]
public class IngredientsController : ControllerBase
{
    private readonly ElasticsearchService _elasticsearchService;

    public IngredientsController(ElasticsearchService elasticsearchService)
    {
        _elasticsearchService = elasticsearchService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<string>>> GetAllIngredients()
    {
        try
        {
            var ingredients = await _elasticsearchService.GetAllIngredientsAsync();
            return Ok(ingredients);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }
}
