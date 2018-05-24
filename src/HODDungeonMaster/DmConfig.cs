using System.IO;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace HODDungeonMaster
{
    public static class DmConfig
    {
        public static string GetJson => File.ReadAllText("DmConfig.json");

        public static DmSettings Settings
        {
            get
            {
                if (!File.Exists("DmConfig.json")) throw new FileNotFoundException("Could not find starting config file!");
                return JsonConvert.DeserializeObject<DmSettings>(GetJson);
            }
        }
    }

    public class DmSettings
    {
        public string SavePath;
        public string PublishPath;
        public string CommandPath;
        public string LogFilePath;
        public string SuperUser;
        public string SuperPassword;
        public Server Server;
    }

    public class Server
    {
        public IEnumerable<CDNSettings> AzureCDN;
        public string AzureAccountName;
        public string AzureAccountKey;
    }

    public class CDNSettings
    {
        public string Container;
        public string SourcePath;
        public string BlobPath;
    }
}