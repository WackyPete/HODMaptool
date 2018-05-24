using HODDungeonMaster.Models;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.OptionsModel;
using System.Linq;
using Microsoft.AspNet.Http;

namespace HODDungeonMaster.Controllers
{
    public class LoginController : Controller
    {
        private readonly HodAccounts[] _accounts;

        public LoginController(IOptions<HodAppSettings> appSettings)
        {
            _accounts = appSettings.Value.HodAccounts;                        
        }

        public IActionResult Index()
        {            
            return View();
        }

        [HttpPost]
        public IActionResult Index(Login login)
        {
            if (Authenticate(login))
            {                
                return Redirect("/hoddm/home");
            }
                        
            return View();
        }

        public bool Authenticate(Login login, bool redirect = true)
        {
            AccessLevel accessLevel;
            bool isAuth = TryAuthenticate(login.UserName, login.Password, out accessLevel);
            if (!isAuth)
            {
                SessionEnd();
                return false;
            }  
                     
            SessionSet(login.UserName,accessLevel);
            return true;            
        }

        public IActionResult LogOff()
        {
            SessionEnd();
            return RedirectToAction("Index", "Login");
        }

        private bool TryAuthenticate(string user, string password, out AccessLevel accessLevel)
        {
            accessLevel = AccessLevel.None;
            var account = _accounts.Where(n => n.UserName.ToLower() == user.ToLower().Trim()).FirstOrDefault();
            if (account == null) return false;
            accessLevel = account.AccessLevel;
            return account.Password == password.Trim();            
        }

        private void SessionSet(string username, AccessLevel accessLevel)
        {            
            HttpContext.Session.SetString("Login", "true");
            HttpContext.Session.SetString("User", username.ToLower());
            HttpContext.Session.SetString("AccessLevel", accessLevel.ToString());
            ActivityLog.Log(username + " logged into Dungeon Master");
        }

        private void SessionEnd()
        {
            HttpContext.Session.SetString("Login", "false");
            HttpContext.Session.SetString("User", "");
            HttpContext.Session.SetString("AccessLevel", "None");            
        }

    }
}
