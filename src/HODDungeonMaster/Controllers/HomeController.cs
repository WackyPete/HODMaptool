using System;
using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Http;

namespace HODDungeonMaster.Controllers
{
    public partial class HomeController : Controller
    {
        public IActionResult Index()
        {
            string callback = HttpContext.Session.GetString("Login");
            if (string.IsNullOrEmpty(callback) || callback == "false")
                return RedirectToAction("Index","Login");
            ViewData["DungeonWorld"] = _dungeon;
            ViewData["DungeonMap"] = _dungeon.SelectedDungeon;
            return View();            
        }

        public IActionResult ForceSave()
        {
            ActivityLog.Log(GetUser() + " Force Save Initiated!");
            _dungeon.Save(true);
            return Content("Force Save Complete!");
        }

        public IActionResult Stats(string id, string value)
        {
            ViewData["DungeonWorldLoad"] = _dungeon.World;
            if (!string.IsNullOrEmpty(id))
                ViewData["DungeonMap"] = _dungeon.GetDungeon(id);
            if (!string.IsNullOrEmpty(value))
            {
                if (value.ToLower().Contains("spawns"))
                {
                    string[] splitCoord = value.Split('_');
                    ViewData["DataView"] = "Spawns";
                    ViewData["DataX"] = Convert.ToInt32(splitCoord[1]);
                    ViewData["DataY"] = Convert.ToInt32(splitCoord[2]);
                }
            }
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
