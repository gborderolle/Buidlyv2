using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore;

namespace WebAPI_tutorial_peliculas.Context
{
    public class ContextDB : IdentityDbContext
    {
        public ContextDB(DbContextOptions<ContextDB> options) : base(options)
        {
        }

        #region DB Tables

        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }

    }
}