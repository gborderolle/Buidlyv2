namespace WebAPI_tutorial_peliculas.Utilities.HATEOAS
{
    public class ResourcesCollection<T> : Resource where T : Resource
    {
        public List<T> Values { get; set; }
    }
}
