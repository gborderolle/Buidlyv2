namespace WebAPI_tutorial_peliculas.Utilities
{
    public class AuthenticationResponse
    {
        public string Token { get; set; }
        public DateTime Expiration { get; set; }
    }
}
