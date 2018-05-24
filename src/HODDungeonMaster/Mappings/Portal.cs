namespace HODDungeonMaster.Mappings
{
    public class Portal
    {
        public string TargetDungeonId { get; set; }
        public int TargetNodeX { get; set; }
        public int TargetNodeY { get; set; }
        public Node SourceNode { get; set; }
        public Node SelectedNode { get; set; }

        public void Clean()
        {
            TargetDungeonId = TargetDungeonId.Trim().ToUpper();
            SourceNode.DungeonId = SourceNode.DungeonId.Trim().ToUpper();
            SelectedNode.DungeonId = SelectedNode.DungeonId.Trim().ToUpper();
        }
    }
}