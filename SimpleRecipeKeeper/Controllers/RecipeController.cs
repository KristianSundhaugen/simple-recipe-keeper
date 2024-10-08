using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;
using System.Linq;


[ApiController]
[Route("api/recipes")]
public class RecipeController : ControllerBase
{
    private readonly ElasticsearchService _elasticsearchService;
    private readonly IWebHostEnvironment _hostingEnvironment;


    public RecipeController(ElasticsearchService elasticsearchService, IWebHostEnvironment hostingEnvironment)
    {
        _elasticsearchService = elasticsearchService;
        _hostingEnvironment = hostingEnvironment;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Recipe>>> GetRecipes(int page = 1, int pageSize = 10, string filter = null, string orderBy = "id")
    {
        var recipes = await _elasticsearchService.GetRecipesAsync(page, pageSize, filter, orderBy);
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
    public async Task<ActionResult<Recipe>> CreateRecipe([FromForm] RecipeCreateModel model)
    {
        string pictureUrl = null;
        if (model.Picture != null && model.Picture.Length > 0)
        {
            var uploads = Path.Combine(_hostingEnvironment.WebRootPath, "img");
            if (!Directory.Exists(uploads))
            {
                Directory.CreateDirectory(uploads);
            }
            var filePath = Path.Combine(uploads, model.Picture.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await model.Picture.CopyToAsync(stream);
            }

            pictureUrl = $"/img/{model.Picture.FileName}";
        }

        var ingredients = new List<Ingredient>();
        for (int i = 0; i < model.IngredientName.Count; i++)
        {
            ingredients.Add(new Ingredient
            {
                Name = model.IngredientName[i],
                Quantity = model.IngredientQuantity[i],
                Preparation = model.IngredientPreparation[i]
            });
        }

        var recipe = new Recipe
        {
            Title = model.Title,
            FoodCategory = model.FoodCategory,
            PictureUrl = pictureUrl,
            PreparationTimeInMinutes = model.PreparationTimeInMinutes,
            CookTimeInMinutes = model.CookTimeInMinutes,
            TotalTimeInMinutes = model.TotalTimeInMinutes,
            Instructions = model.Instructions,
            Ingredients = ingredients
        };

        var createdRecipe = await _elasticsearchService.CreateRecipeAsync(recipe);
        return CreatedAtAction(nameof(GetRecipeById), new { id = createdRecipe.Id }, createdRecipe);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRecipe(int id, [FromForm] RecipeUpdateModel model)
    {
        if (id != model.Id)
        {
            return BadRequest();
        }

        var existingRecipe = await _elasticsearchService.GetRecipeByIdAsync(id.ToString());
        if (existingRecipe == null)
        {
            return NotFound();
        }

        string pictureUrl = existingRecipe.PictureUrl;
        if (model.Picture != null && model.Picture.Length > 0)
        {
            var uploads = Path.Combine(_hostingEnvironment.WebRootPath, "img");
            if (!Directory.Exists(uploads))
            {
                Directory.CreateDirectory(uploads);
            }
            var filePath = Path.Combine(uploads, model.Picture.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await model.Picture.CopyToAsync(stream);
            }

            pictureUrl = $"/img/{model.Picture.FileName}";
        }

        var ingredients = new List<Ingredient>();
        for (int i = 0; i < model.IngredientName.Count; i++)
        {
            ingredients.Add(new Ingredient
            {
                Name = model.IngredientName[i],
                Quantity = model.IngredientQuantity[i],
                Preparation = model.IngredientPreparation[i]
            });
        }

        if (!Enum.IsDefined(typeof(FoodCategory), model.FoodCategory))
        {
            return BadRequest("Invalid Food Category.");
        }

        existingRecipe.FoodCategory = (FoodCategory)model.FoodCategory;

        existingRecipe.Title = model.Title;
        existingRecipe.PictureUrl = pictureUrl;
        existingRecipe.PreparationTimeInMinutes = model.PreparationTimeInMinutes;
        existingRecipe.CookTimeInMinutes = model.CookTimeInMinutes;
        existingRecipe.TotalTimeInMinutes = model.TotalTimeInMinutes;
        existingRecipe.Instructions = model.Instructions;
        existingRecipe.Ingredients = ingredients;

        var updatedRecipe = await _elasticsearchService.UpdateRecipeAsync(existingRecipe);
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

    [HttpGet("search/{searchText}")]
    public async Task<ActionResult<RecipeSearchResult>> SearchRecipes([FromRoute] string searchText)
    {
        try
        {
            var result = await _elasticsearchService.SearchRecipesAsync(searchText);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }
}
