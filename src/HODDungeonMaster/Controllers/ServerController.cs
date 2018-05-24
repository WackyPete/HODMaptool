using Microsoft.AspNet.Mvc;
using HODDungeonMaster.ViewModels.ServerViews;
using System.Linq;

namespace HODDungeonMaster.Controllers
{
    public class ServerController : Controller
    {
        public AzureViewModel AzureCDN = new AzureViewModel();

        public IActionResult Index()
        {              
            return View();            
        }

        [HttpGet]
        public void PushHodAssets()
        {            
            var asset = DmConfig.Settings.Server.AzureCDN;
            var assetValues = asset.First(x => x.Container == "test"); //test for now
            AzureCDN.UploadBlob(assetValues.SourcePath, assetValues.Container);
        }

        [HttpGet]
        public void PushHodTestAssets()
        {

        }


    }
}
