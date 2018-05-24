using System;
using System.Net;
using HODDungeonMaster.Mappings;
using HODDungeonMaster.ViewModels.DungeonViews;
using Microsoft.AspNet.Mvc;
using ThePit.Data.Tools;
using Newtonsoft.Json;
using ThePit.Logic.Battles;
using ThePit.NameGenerator;
using HODDungeonMaster.Models;
using Microsoft.AspNet.Http;

namespace HODDungeonMaster.Controllers
{
    public partial class HomeController
    {
        private readonly DungeonViewModel _dungeon = new DungeonViewModel(Startup.World);              
        
        [HttpPost]
        public string SelectDungeon(string id)
        {
            var dungeon = _dungeon.GetDungeon(id);
            _dungeon.SelectedDungeon = dungeon;
            ViewData["DungeonMap"] = dungeon;
            return JsonConvert.SerializeObject(dungeon);
        }

        [HttpPost]
        public string SaveDungeon(PitDungeonTemplate jsonObj)
        {
            lock (Startup.World)
            {
                try
                {                    
                    _dungeon.World.EditDungeon(jsonObj.TemplateId,
                    jsonObj.Name, jsonObj.Level, jsonObj.IsLocked,
                    jsonObj.IsStartingDungeon, jsonObj.AccessWhitelist,jsonObj.GuildWhitelist, jsonObj.RequiredGateKey,jsonObj.Notes,
                    jsonObj.Author,jsonObj.Region,jsonObj.AlwaysQuickTravel,jsonObj.ArenaMode,jsonObj.MapX,jsonObj.MapY);
                    var nodes = jsonObj.Nodes;
                    for (int nodeX = DungeonViewModel.DungeonMaxNodes; nodeX >= 0; nodeX--)
                    {
                        var node = nodes[nodeX];
                        for (int nodeY = 0; nodeY < node.Length; nodeY++)
                        {
                            var n = node[nodeY];                            
                            _dungeon.World.EditNode(jsonObj.TemplateId, nodeX, nodeY,
                                n.Name, n.Map, n.Weather, n.Checkpoint,n.TreasureRoom,n.N, n.S, n.E, n.W, n.DefaultPortalType);                            
                        }
                    }
                    _dungeon.World.CommitPendingChanges();
                    ActivityLog.Log(GetUser() + " saved dungeon map " + jsonObj.Name + "(" + jsonObj.TemplateId + ")");
                    _dungeon.Save();                    
                    return SelectDungeon(jsonObj.TemplateId);
                }
                catch (Exception ex)
                {
                    return ResponseError("Saving Dungeon Failed", ex);
                }
            }
        }
        
        [HttpPost]
        public string NewDungeon(PitDungeonTemplate dungeon, int nodeX, int nodeY)
        {
            try
            {
                var newdungeon = _dungeon.World.CreateNewDungeon(dungeon.TemplateId, nodeX, nodeY);
                newdungeon.Name = "New Dungeon";
                newdungeon.Level = 2;
                newdungeon.IsLocked = true;
                _dungeon.World.CommitPendingChanges();
                ActivityLog.Log(GetUser() + " created new dungeon map with id " + newdungeon.TemplateId);
                _dungeon.Save();                
                return SelectDungeon(newdungeon.TemplateId);
            }
            catch (Exception ex)
            {
                ActivityLog.Log(ex, this);
                return ResponseError("Could Not Create New Dungeon", ex);
            }
        }

        [HttpPost]
        public string CopyDungeon(PitDungeonTemplate dungeon,int nodeX, int nodeY)
        {
            try
            {
                var newdungeon = _dungeon.World.CreateNewDungeon(dungeon.TemplateId, nodeX, nodeY);                
                for (int nx = DungeonViewModel.DungeonMaxNodes; nx >= 0; nx--)
                {                    
                    for (int ny = 0; ny < dungeon.Nodes[nx].Length; ny++)
                    {
                        dungeon.Nodes[nx][ny].Portal = null;
                        dungeon.Nodes[nx][ny].Spawn = null;
                    }
                }
                newdungeon.Nodes = dungeon.Nodes;
                newdungeon.Name = "Copy " + dungeon.Name.Substring(0,dungeon.Name.Length - 6);
                newdungeon.Level = dungeon.Level;
                newdungeon.Author = dungeon.Author;
                newdungeon.Notes = dungeon.Notes;                
                newdungeon.GuildWhitelist = dungeon.GuildWhitelist;
                newdungeon.Region = dungeon.Region;
                newdungeon.AccessWhitelist = dungeon.AccessWhitelist;                      
                newdungeon.IsLocked = true;
                _dungeon.World.CommitPendingChanges();
                ActivityLog.Log(GetUser() + " created duplicate dungeon map with id " + newdungeon.TemplateId + "from dungeon id " + dungeon.TemplateId);
                _dungeon.Save();
                return SelectDungeon(newdungeon.TemplateId);
            }
            catch(Exception ex)
            {
                ActivityLog.Log(ex, this);
                return ResponseError("Could Not Duplicate Dungeon", ex);
            }            
        }

        [HttpPost]
        public string DeleteDungeon(string dungeonid)
        {
            try
            {
                _dungeon.World.DeleteDungeon(dungeonid);
                _dungeon.World.CommitPendingChanges();
                ActivityLog.Log(GetUser() + " deleted dungeon map with id " + dungeonid);
                _dungeon.Save();                
                return SelectDungeon(DungeonViewModel.DefaultDungeonId);
            }
            catch (Exception ex)
            {
                ActivityLog.Log(ex, this);
                return ResponseError("Could not delete dungeon", ex);
            }
        }

        [HttpGet]
        public void Publish()
        {
            ActivityLog.Log(GetUser() + " published to the server");
            _dungeon.Publish();
        }
        
        [HttpPost]
        public string CreatePortal(PitDungeonTemplate dungeon, Portal portaldrop)
        {
            try
            {
                SaveDungeon(dungeon);
                portaldrop.Clean();
                _dungeon.World.EditPortal(portaldrop.SourceNode.DungeonId,
                    portaldrop.SourceNode.X, portaldrop.SourceNode.Y,
                    portaldrop.TargetDungeonId, portaldrop.TargetNodeX, portaldrop.TargetNodeY);
                _dungeon.World.CommitPendingChanges();
                if (portaldrop.SelectedNode.X != portaldrop.SourceNode.X ||
                    portaldrop.SelectedNode.Y != portaldrop.SourceNode.Y ||
                    portaldrop.SelectedNode.DungeonId != portaldrop.SourceNode.DungeonId)
                {
                    _dungeon.World.DeletePortal(portaldrop.SelectedNode.DungeonId, portaldrop.SelectedNode.X, portaldrop.SelectedNode.Y);
                    _dungeon.World.CommitPendingChanges();
                }
                ActivityLog.Log(GetUser() + " created new portal on " +
                    dungeon.Name + "(" + portaldrop.SourceNode.DungeonId + ") at [" + (portaldrop.SourceNode.X +1)
                    + "," + (portaldrop.SourceNode.Y +1) + "]");
                _dungeon.Save();                
                //Return back the new source dungeon
                return SelectDungeon(portaldrop.SourceNode.DungeonId);
            }
            catch (Exception ex)
            {
                ActivityLog.Log(ex, this);
                return ResponseError("Portal Creation Failed", ex);
            }
        }

        [HttpPost]
        public string DeletePortal(PitDungeonTemplate dungeon, int nodeX, int nodeY)
        {
            try
            {
                SaveDungeon(dungeon);
                _dungeon.World.DeletePortal(dungeon.TemplateId, nodeX, nodeY);
                _dungeon.World.CommitPendingChanges();
                ActivityLog.Log(GetUser() + " deleted portal on " +
                    dungeon.Name + "(" + dungeon.TemplateId + ") at [" + (nodeX +1)  + "," + (nodeY +1) + "]");
                _dungeon.Save();                
                return SelectDungeon(dungeon.TemplateId);
            }
            catch (Exception ex)
            {
                ActivityLog.Log(ex, this);
                return ResponseError("Could not remove portal", ex);
            }
        }
        
        [HttpPost]
        public string CreateSpawnPoint(PitDungeonTemplate dungeon, SpawnPoint spawnpoint)
        {
            try
            {
                SaveDungeon(dungeon);

                try
                {                    
                    _dungeon.World.DeleteSpawn(spawnpoint.DungeonTemplateId, spawnpoint.NodeX, spawnpoint.NodeY);
                    _dungeon.World.CommitPendingChanges();
                }
                catch { }

                _dungeon.World.CreateSpawn(spawnpoint.DungeonTemplateId, spawnpoint.NodeX, spawnpoint.NodeY, spawnpoint.isDisabled,
                    spawnpoint.DireFaction, spawnpoint.FighterAiType, spawnpoint.MaxWanderDistance, spawnpoint.LeaderNameOverride, spawnpoint.LeaderRaceOverride,
                    spawnpoint.LeaderTypeOverride, spawnpoint.LeaderSexOverride,spawnpoint.MinionNameOverride, 
                    spawnpoint.MinionRaceOverride,spawnpoint.MinionSexOverride,spawnpoint.onKillTitle,spawnpoint.onKillGateKey);
                _dungeon.World.CommitPendingChanges();
                ActivityLog.Log(GetUser() + " created spawnpoint on " +
                    dungeon.Name + "(" + dungeon.TemplateId + ") at [" + (spawnpoint.NodeX +1) + "," + (spawnpoint.NodeY +1) + "]");
                _dungeon.Save();
                return SelectDungeon(spawnpoint.DungeonTemplateId);
            }
            catch (Exception ex)
            {
                ActivityLog.Log(ex, this);
                return ResponseError("Could Not Create New Spawnpoint",ex);
            }
        }

        [HttpPost]
        public string DeleteSpawnPoint(PitDungeonTemplate dungeon, int nodeX, int nodeY)
        {
            try
            {
                SaveDungeon(dungeon);
                _dungeon.World.DeleteSpawn(dungeon.TemplateId, nodeX, nodeY);
                _dungeon.World.CommitPendingChanges();
                ActivityLog.Log(GetUser() + " deleted spawnpoint on " +
                    dungeon.Name + "(" + dungeon.TemplateId + ") at [" + (nodeX +1) + "," + (nodeY +1) + "]");
                _dungeon.Save();
                return SelectDungeon(dungeon.TemplateId);
            }
            catch (Exception ex)
            {
                ActivityLog.Log(ex, this);
                return ResponseError("Could Not Delete Spawnpoint", ex);
            }
        }

        [HttpPost]
        public string ServerCommand(string command, int serverid)
        {
            try
            {
                ServerCommandDrop.Send(command, serverid);
                ActivityLog.Log(GetUser() + " sent command to server("+serverid+"): "+command.Trim());
            }
            catch(Exception ex)
            {
                ActivityLog.Log(ex, this);
                return ResponseError("Error Sending Command", ex);
            }

            return "Success";
        }

        [HttpGet]
        public string RandomTileName(MapType maptype, MapWeather weathertype)
        {
            if(maptype == MapType.NULL)
                maptype = MapType.Dungeon;
            if(weathertype == MapWeather.NULL)
                weathertype = MapWeather.Normal;
            return NGenMap.GetMapName(maptype, weathertype);
        }

        [HttpGet]
        //Temp Auth Logic
        public string DungeonMaster(string user, string pass)
        {
            if (string.IsNullOrEmpty(user) || string.IsNullOrEmpty(pass)) return "no";
            if (user.Trim().ToLower() == DmConfig.Settings.SuperUser.ToLower() && 
                pass.Trim().ToLower() == DmConfig.Settings.SuperPassword.ToLower())
                return "ok";

            return "no";
        }
        
        private string ResponseError(string message, Exception ex)
        {
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return $"ERROR: {message}\n{ex.Message}";   
        }

        private string GetUser()
        {
            return HttpContext.Session.GetString("User");            
        }
    }
}
