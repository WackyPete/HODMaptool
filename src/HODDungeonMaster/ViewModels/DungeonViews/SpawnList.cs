using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ThePit.Logic;
using ThePit.Logic.Dungeons;

namespace HODDungeonMaster.ViewModels.DungeonViews
{
    public class SpawnList
    {
        public Dictionary<FighterAiType, List<DireFaction>> FighterTypes =
            new Dictionary<FighterAiType, List<DireFaction>>();

        private int _dietyCount = 0;
        private int _leaderCount = 0;
        private int _officerCount = 0;
        private int _minionCount = 0;
        private DireFaction _questFaction = DireFaction.NULL;

        public int TotalCount
        {
            get { return _dietyCount + _leaderCount + _officerCount + _minionCount; }
        }

        public DireFaction QuestFaction
        {
            get { return _questFaction; }
            private set { _questFaction = value; }
        }

        public bool isQuestReady()
        {
            if (TotalCount == 0) return false;
            IEnumerable<DireFaction> commonFaction = null;
            if (_dietyCount > 0 && _leaderCount > 0 && _officerCount >= 3 && _minionCount >= 4)
            {
                commonFaction = FighterTypes[FighterAiType.Deity].
                Intersect(FighterTypes[FighterAiType.Leader].
                Intersect(FighterTypes[FighterAiType.Officer].
                Intersect(FighterTypes[FighterAiType.Minion])));
            }
            else if (_leaderCount > 0 && _officerCount >= 3 && _minionCount >= 4)
            {
                commonFaction = FighterTypes[FighterAiType.Leader].
                Intersect(FighterTypes[FighterAiType.Officer].
                Intersect(FighterTypes[FighterAiType.Minion]));

            }
            /*else if (_officerCount >= 3 && _minionCount >= 4)
            {
                commonFaction = FighterTypes[FighterAiType.Officer].
                    Intersect(FighterTypes[FighterAiType.Minion]);
            }*/
                        
            if (commonFaction != null)            
                QuestFaction = commonFaction.FirstOrDefault();

            return commonFaction == null ? false : commonFaction.Count() >= 1;
        }

        public void AddFighter(PitSpawnPoint sp)
        {
            if (FighterTypes.ContainsKey(sp.AiType))
            {
                if (!FighterTypes[sp.AiType].Contains(sp.Faction))                
                    FighterTypes[sp.AiType].Add(sp.Faction);                
            }
            else
            {
                var list = new List<DireFaction>();
                list.Add(sp.Faction);
                FighterTypes.Add(sp.AiType, list);
            }

            SetCount(sp.AiType, 1);
        }

        public int GetCount(FighterAiType fighter)
        {
            switch (fighter)
            {
                case FighterAiType.Deity:
                    return _dietyCount;
                case FighterAiType.Leader:
                    return _leaderCount;
                case FighterAiType.Officer:
                    return _officerCount;
                case FighterAiType.Minion:
                    return _minionCount;
                default:
                    return 0;
            }
        }

        public void SetCount(FighterAiType fighter, int count)
        {
            switch (fighter)
            {
                case FighterAiType.Deity:
                    _dietyCount += count;
                    break;
                case FighterAiType.Leader:
                    _leaderCount += count;
                    break;
                case FighterAiType.Officer:
                    _officerCount += count;
                    break;
                case FighterAiType.Minion:
                    _minionCount += count;
                    break;
            }
        }
    }
}
