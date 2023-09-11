using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore;
using Buildyv2.Models;
using static Microsoft.ApplicationInsights.MetricDimensionNames.TelemetryContext;

namespace WebAPI_tutorial_peliculas.Context
{
    public class ContextDB : IdentityDbContext
    {
        public ContextDB(DbContextOptions<ContextDB> options) : base(options)
        {
        }

        #region DB Tables

        public DbSet<Contract> Contract { get; set; }
        public DbSet<Estate> Estate { get; set; }
        public DbSet<Job> Job { get; set; }
        public DbSet<Notary> Notary { get; set; }
        public DbSet<Owner> Owner { get; set; }
        public DbSet<Photo> Photo { get; set; }
        public DbSet<Purchase> Purchase { get; set; }
        public DbSet<Rent> Rent { get; set; }
        public DbSet<Report> Report { get; set; }
        public DbSet<Tenant> Tenant { get; set; }
        public DbSet<Warrant> Warrant { get; set; }
        public DbSet<Worker> Worker { get; set; }
        public DbSet<List_JobState> List_JobState { get; set; }
        public DbSet<List_WorkType> List_WorkType { get; set; }

        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }

    }
}