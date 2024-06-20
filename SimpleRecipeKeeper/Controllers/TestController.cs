using Microsoft.AspNetCore.Mvc;

namespace SimpleRecipeKeeper.Controllers
{
    public class TestController : Controller
    {
        [HttpGet("/test")]
        public IActionResult Test()
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/html/test.html");
            return PhysicalFile(path, "text/html");
        }
    }
}
