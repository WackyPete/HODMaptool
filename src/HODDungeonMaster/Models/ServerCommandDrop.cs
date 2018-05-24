using System;
using System.IO;
using ThePit.Data.Commands;

namespace HODDungeonMaster.Models
{
    public class ServerCommandDrop
    {
        private static int[] Servers = { 0 };
        private static PitToolsCommandSender sender = new PitToolsCommandSender(null, DmConfig.Settings.CommandPath);

        public static void Send(string command, int serverid)
        {            
            if (serverid == 99)
            {                
                foreach (var id in Servers)
                {
                    sender.SendCommand(id, command);
                }
            }
            else
            {
                sender.SendCommand(serverid, command);
            }
        }
    }
}
