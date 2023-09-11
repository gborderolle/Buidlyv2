namespace Buildyv2.Models
{
    /// <summary>
    /// Navegación n..n
    /// </summary>
    public class OwnerEstate
    {
        public int OwnerId { get; set; }
        public int EstateId { get; set; }
        public Owner Owner { get; set; }
        public Estate Estate { get; set; }
    }
}
