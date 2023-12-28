using Buildyv2.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Buildyv2.Context
{
    public class ContextDB : IdentityDbContext
    {
        public ContextDB(DbContextOptions<ContextDB> options) : base(options)
        {
        }

        #region DB Tables

        public DbSet<Estate> Estate { get; set; }
        public DbSet<Job> Job { get; set; }
        public DbSet<Photo> Photo { get; set; }
        public DbSet<Rent> Rent { get; set; }
        public DbSet<Report> Report { get; set; }
        public DbSet<Tenant> Tenant { get; set; }
        public DbSet<Worker> Worker { get; set; }
        public DbSet<CityDS> CityDS { get; set; }
        public DbSet<ProvinceDS> ProvinceDS { get; set; }
        public DbSet<CountryDS> CountryDS { get; set; }

        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            SeedLists(modelBuilder);
            SeedUsers(modelBuilder);
            SeedEntities(modelBuilder);
        }

        private void SeedUsers(ModelBuilder modelBuilder)
        {
            // Clase: https://www.udemy.com/course/construyendo-web-apis-restful-con-aspnet-core/learn/lecture/20660148#notes
            // Generar GUID: https://guidgenerator.com/online-guid-generator.aspx
            // ---------------- Usuarios ---------------------------------------------
            var rolAdminId = "bef4cbd4-1f2b-472f-a1e2-e1a901f6808c";
            var userAdminId = "c2ee6493-5a73-46f3-a3f2-46d1d11d7176";
            var userNormalId = "e0765c93-676c-4199-b7ee-d7877c471821";

            var rolAdmin = new IdentityRole()
            {
                Id = rolAdminId,
                Name = "Admin",
                NormalizedName = "Admin"
            };

            var passwordHasher = new PasswordHasher<IdentityUser>();

            var username1 = "admin@buildy2.uy";
            var userAdmin = new IdentityUser()
            {
                Id = userAdminId,
                UserName = "Sr.Admin",
                NormalizedUserName = username1,
                Email = username1,
                NormalizedEmail = username1,
                PasswordHash = passwordHasher.HashPassword(null, "Aa1234.")
            };

            var username2 = "normal@buildy2.uy";
            var userNormal = new IdentityUser()
            {
                Id = userNormalId,
                UserName = "Sr.Normal",
                NormalizedUserName = username2,
                Email = username2,
                NormalizedEmail = username2,
                PasswordHash = passwordHasher.HashPassword(null, "Aa1234.")
            };

            modelBuilder.Entity<IdentityUser>()
                .HasData(userAdmin, userNormal);

            modelBuilder.Entity<IdentityRole>()
                .HasData(rolAdmin);

            modelBuilder.Entity<IdentityUserClaim<string>>()
                .HasData(new IdentityUserClaim<string>()
                {
                    Id = 1,
                    ClaimType = "role",
                    UserId = userAdminId,
                    ClaimValue = "admin"
                });
        }

        private void SeedEntities(ModelBuilder modelBuilder)
        {
            var country1 = new CountryDS() { Id = 1, Name = "Uruguay", NominatimCountryCode = "UY" };
            modelBuilder.Entity<CountryDS>().HasData(new List<CountryDS>
            {
                country1
            });

            var province1 = new ProvinceDS() { Id = 1, Name = "Cerro Largo", CountryDSId = 1, NominatimProvinceCode = "CL" };
            var province2 = new ProvinceDS() { Id = 2, Name = "Montevideo", CountryDSId = 1, NominatimProvinceCode = "MO" };
            modelBuilder.Entity<ProvinceDS>().HasData(new List<ProvinceDS>
            {
                province1,province2
            });

            var city1 = new CityDS { Id = 1, Name = "Melo", ProvinceDSId = 1, NominatimCityCode = "ME" };
            var city2 = new CityDS() { Id = 2, Name = "Montevideo", ProvinceDSId = 2, NominatimCityCode = "MO" };
            modelBuilder.Entity<CityDS>().HasData(new List<CityDS>
            {
                city1,city2
            });
        }

        private void SeedLists(ModelBuilder modelBuilder)
        {
            // ---------------- Listas ---------------------------------------------

            // ---------------- Usuarios ---------------------------------------------
        }

    }
}