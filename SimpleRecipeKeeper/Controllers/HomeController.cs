using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace SimpleRecipeKeeper.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet("/create-recipe")]
        public IActionResult CreateRecipeForm()
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/html/forms/createRecipe.html");
            return PhysicalFile(path, "text/html");
        }

        [HttpGet("/home")]
        public IActionResult Home()
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/html/home.html");
            return PhysicalFile(path, "text/html");
        }
    }
}
