using System.Collections.Generic;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System.IO;
using System.Web;

namespace HODDungeonMaster.ViewModels.ServerViews
{
    public class AzureViewModel
    {
        private CloudStorageAccount _cloudStorage;        

        public AzureViewModel()
        {
            var settings = DmConfig.Settings.Server;
            string connString = string.Format("DefaultEndpointsProtocol={0};AccountName={1};AccountKey={2}", "https", settings.AzureAccountName, settings.AzureAccountKey);
            _cloudStorage = CloudStorageAccount.Parse(connString);
            AzureCDNBlobs = settings.AzureCDN;
            BlobClient = _cloudStorage.CreateCloudBlobClient();
        }

        public CloudBlobClient BlobClient { get; private set; }
        public IEnumerable<CDNSettings> AzureCDNBlobs { get; private set; }

        public CloudBlobContainer GetContainer(string container)
        {
            var client = BlobClient.GetContainerReference(container);
            client.CreateIfNotExists();
            return client;
        }
        
        public void CreateBlobClient()
        {            
            BlobClient = _cloudStorage.CreateCloudBlobClient();
        }

        public void UploadBlob(string filepath, string container)
        {
            CloudBlobContainer blobContainer = GetContainer(container);
            CloudBlockBlob blockBlob;            

            foreach(var files in Directory.GetFiles(filepath,"*.*",SearchOption.AllDirectories))
            {
                string s_file = files.Replace(filepath, "").ToLower();
                blockBlob = blobContainer.GetBlockBlobReference(container+"/"+s_file);
                blockBlob.Properties.ContentType = MimeMapping.GetMimeMapping(files);
                blockBlob.UploadFromFileAsync(files);                
            }            
        }
        
        public IEnumerable<IListBlobItem> GetAllFiles(string container)
        {
            return GetContainer(container).ListBlobs(null, false);            
        }       

    }
}
