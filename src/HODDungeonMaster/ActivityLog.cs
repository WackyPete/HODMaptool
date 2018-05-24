using System;
using System.IO;
using System.Text;

namespace HODDungeonMaster
{
    public static class ActivityLog
    {
        public static string AppPath => AppDomain.CurrentDomain.BaseDirectory;
        public static string FileName { get; set; }
        
        public static void Log(string message)
        {
            WriteFile(message);
        }

        public static void Log(Exception exception, string containingClass)
        {
            var sb = new StringBuilder();
            sb.AppendLine("Class Error in " + containingClass);
            sb.AppendLine("Exception " + exception.Message);
            if (exception.InnerException != null)
                sb.AppendLine("InnerEx " + exception.InnerException);
            sb.AppendLine(exception.StackTrace);
            WriteFile(sb.ToString());
        }

        public static void Log(Exception exception, object containingClass)
        {
            Log(exception, nameof(containingClass));
        }
                
        private static void WriteFile(string message)
        {
            File.AppendAllText(FileName, Environment.NewLine + DateTime.Now + @"  --  " + message);
        }
    }
}
