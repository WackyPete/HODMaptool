using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using ThePit.Data.Tools;

namespace HODDungeonMaster.ViewModels.DungeonViews
{
    public class DungeonViewModel
    {
        public IEnumerable<PitDungeonTemplate> Dungeons { get; }
        public PitWorldTemplate World { get; }
        public PitDungeonTemplate SelectedDungeon { get; set; }

        private readonly string _dungeonFilePath = DmConfig.Settings.SavePath;
        private readonly string _dungeonPublishPath = DmConfig.Settings.PublishPath;

        public const string DefaultDungeonId = "ZKRZK";
        public const int DungeonMaxNodes = 15;

        public DungeonViewModel(PitWorldTemplate world)
        {
            World = world;
            Dungeons = World.DungeonTemplates;
            var pitDungeonTemplate = Dungeons.FirstOrDefault(d => d.IsStartingDungeon);
            string startId = pitDungeonTemplate != null ? pitDungeonTemplate.TemplateId : DefaultDungeonId;
            SelectedDungeon = World.GetDungeon(startId);
        }
        
        public PitDungeonTemplate GetDungeon(string id)
        {
            return World.GetDungeon(id);
        }
        
        public void Save(bool forceSave = false)
        {
            try
            {
                Startup.SaveWorld(forceSave);
                ActivityLog.Log("World Saved");
            }
            catch (Exception ex)
            {
                string message = "Could Not Save Dungeon File XML";
                ActivityLog.Log(message);
                ActivityLog.Log(ex, this);
                throw new Exception(message, ex.InnerException);
            }
        }

        public void ForceSave()
        {
            Save(true);
        }

        public void Publish()
        {
            try
            {
                if (World == null) return;
                try
                {
                    foreach (var file in Directory.GetFiles(_dungeonFilePath))
                    {
                        string filename = Path.GetFileName(file);
                        if (filename != null)
                            File.Copy(file, Path.Combine(_dungeonPublishPath, filename), true);
                    }
                }
                finally
                {
                    ActivityLog.Log("World Published");
                }                
            }
            catch (Exception ex)
            {
                string message = "Could Not Publish Dungeon!";
                ActivityLog.Log(message);
                ActivityLog.Log(ex, this);
                throw new Exception(message, ex.InnerException);
            }
        }
    }
}
