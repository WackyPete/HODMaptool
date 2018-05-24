using ThePit.Logic;
using ThePit.Logic.Fighters;

namespace HODDungeonMaster.Mappings
{
    public class SpawnPoint
    {
        public string DungeonTemplateId { get; set; }
        public int NodeX { get; set; }
        public int NodeY { get; set; }
        public bool isDisabled { get; set; }
        public DireFaction DireFaction { get; set; }
        public FighterAiType FighterAiType { get; set; }
        public int MaxWanderDistance { get; set; }
        public string LeaderNameOverride { get; set; }
        public RaceType LeaderRaceOverride { get; set; }
        public FighterType LeaderTypeOverride { get; set; }
        public SexType LeaderSexOverride { get; set; }
        public string MinionNameOverride { get; set; }
        public RaceType MinionRaceOverride { get; set; }
        public FighterType MinionTypeOverride { get; set; }
        public SexType MinionSexOverride { get; set; }
        public string onKillTitle { get; set; }
        public string onKillGateKey { get; set; }
    }
}
