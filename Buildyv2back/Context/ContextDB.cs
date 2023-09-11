using Buildyv2.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

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
        public DbSet<Purchase> Purchase { get; set; }
        public DbSet<Rent> Rent { get; set; }
        public DbSet<Report> Report { get; set; }
        public DbSet<Tenant> Tenant { get; set; }
        public DbSet<Warrant> Warrant { get; set; }
        public DbSet<Worker> Worker { get; set; }
        public DbSet<List_JobState> List_JobState { get; set; }
        public DbSet<List_WorkType> List_WorkType { get; set; }
        public DbSet<OwnerEstate> OwnerEstate { get; set; }

        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<OwnerEstate>()
               .HasKey(v => new { v.OwnerId, v.EstateId });

            modelBuilder.Entity<Rent>()
                .HasOne(rent => rent.Estate)
                .WithMany(estate => estate.ListRentsHistory)
                .HasForeignKey(rent => rent.EstateId)
                .HasConstraintName("ForeignKey_Estate_ListRentsHistory")
                .OnDelete(DeleteBehavior.Restrict); // Configurar según tu necesidad

            modelBuilder.Entity<Rent>()
                .HasOne(rent => rent.Contract)
                .WithOne(contract => contract.Rent)
                .HasForeignKey<Rent>(rent => rent.Id) // Rent es el lado dependiente
                .HasConstraintName("ForeignKey_Rent_Contract")
                .OnDelete(DeleteBehavior.Restrict); // Configurar según tu necesidad

            // Configuración para la relación 1..1 entre Estate y Rent a través de PresentRent
            modelBuilder.Entity<Estate>()
                .HasOne(estate => estate.PresentRent)
                .WithOne()
                .HasForeignKey<Rent>(rent => rent.EstateId)
                .HasConstraintName("ForeignKey_Estate_PresentRent")
                .OnDelete(DeleteBehavior.Restrict); // Configurar según tu necesidad

            modelBuilder.Entity<Contract>()
                .HasOne(contract => contract.Warrant)
                .WithOne(warrant => warrant.Contract)
                .HasForeignKey<Warrant>(warrant => warrant.ContractId) // Estableciendo Warrant como el lado dependiente
                .HasConstraintName("ForeignKey_Contract_Warrant")
                .OnDelete(DeleteBehavior.Restrict); // Configurar según tu necesidad

            modelBuilder.Entity<Contract>()
                .Property(b => b.MonthlyValue)
                .HasColumnType("decimal(18, 2)");

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

        }

        private void SeedLists(ModelBuilder modelBuilder)
        {
            // ---------------- Listas ---------------------------------------------

            // Estado de obras
            var dump_jobState1 = new List_JobState();
            dump_jobState1.Id = 1;
            dump_jobState1.Name = "Sin iniciar";
            dump_jobState1.Description = "";

            var dump_jobState2 = new List_JobState();
            dump_jobState2.Id = 2;
            dump_jobState2.Name = "Iniciado";
            dump_jobState2.Description = "";

            var dump_jobState3 = new List_JobState();
            dump_jobState3.Id = 3;
            dump_jobState3.Name = "Terminado";
            dump_jobState3.Description = "";

            modelBuilder.Entity<List_JobState>().HasData(new List<List_JobState>
            {
                dump_jobState1, dump_jobState2,dump_jobState3
            });

            // Tipos de trabajadores
            var dump_workType1 = new List_WorkType();
            dump_workType1.Id = 1;
            dump_workType1.Name = "Albañil";
            dump_workType1.Description = "";

            var dump_workType2 = new List_WorkType();
            dump_workType2.Id = 2;
            dump_workType2.Name = "Electricista";
            dump_workType2.Description = "";

            var dump_workType3 = new List_WorkType();
            dump_workType3.Id = 3;
            dump_workType3.Name = "Carpintero";
            dump_workType3.Description = "";

            var dump_workType4 = new List_WorkType();
            dump_workType4.Id = 4;
            dump_workType4.Name = "Cerrajero";
            dump_workType4.Description = "";

            var dump_workType5 = new List_WorkType();
            dump_workType5.Id = 5;
            dump_workType5.Name = "Multitrabajo";
            dump_workType5.Description = "";

            modelBuilder.Entity<List_WorkType>().HasData(new List<List_WorkType>
            {
                dump_workType1, dump_workType2, dump_workType3, dump_workType4, dump_workType5
            });

            // ---------------- Usuarios ---------------------------------------------
        }

    }
}