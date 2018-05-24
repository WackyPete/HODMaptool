namespace HODDungeonMaster
{
    public class HodAppSettings
    {
        public HodAccounts[] HodAccounts { get; set; }
    }
    
    public class HodAccounts
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public AccessLevel AccessLevel { get; set; }
    }

    public enum AccessLevel
    {
        Administrator,
        Author,
        None
    }
}
