using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace SimpleRecipeKeeper.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet("/recipe-form")]
        public IActionResult CreateRecipeForm()
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/html/forms/recipe-form.html");
            return PhysicalFile(path, "text/html");
        }

        [HttpGet("/recipe-form/{id}")]
        public IActionResult UpdateRecipeForm()
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/html/forms/recipe-form.html");
            return PhysicalFile(path, "text/html");
        }

        [HttpGet("/home")]
        public IActionResult Home()
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/html/home.html");
            return PhysicalFile(path, "text/html");
        }


        [HttpGet("/recipe/{id}")]
        public IActionResult ViewRecipe()
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/html/recipe.html");
            return PhysicalFile(path, "text/html");

        }
    }
}
