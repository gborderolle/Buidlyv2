﻿// <auto-generated />
using System;
using Buildyv2.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Buildyv2.Migrations
{
    [DbContext(typeof(ContextDB))]
    partial class ContextDBModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Buildyv2.Models.CityDS", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("Creation")
                        .HasColumnType("datetime2");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("NominatimCityCode")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("ProvinceDSId")
                        .HasColumnType("int");

                    b.Property<DateTime>("Update")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("ProvinceDSId");

                    b.ToTable("CityDS");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Creation = new DateTime(2024, 1, 9, 4, 43, 41, 453, DateTimeKind.Local).AddTicks(3932),
                            Name = "Melo",
                            NominatimCityCode = "ME",
                            ProvinceDSId = 1,
                            Update = new DateTime(2024, 1, 9, 4, 43, 41, 453, DateTimeKind.Local).AddTicks(3934)
                        },
                        new
                        {
                            Id = 2,
                            Creation = new DateTime(2024, 1, 9, 4, 43, 41, 453, DateTimeKind.Local).AddTicks(3935),
                            Name = "Montevideo",
                            NominatimCityCode = "MO",
                            ProvinceDSId = 2,
                            Update = new DateTime(2024, 1, 9, 4, 43, 41, 453, DateTimeKind.Local).AddTicks(3936)
                        });
                });

            modelBuilder.Entity("Buildyv2.Models.CountryDS", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("Creation")
                        .HasColumnType("datetime2");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("NominatimCountryCode")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("Update")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.ToTable("CountryDS");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Creation = new DateTime(2024, 1, 9, 4, 43, 41, 453, DateTimeKind.Local).AddTicks(3168),
                            Name = "Uruguay",
                            NominatimCountryCode = "UY",
                            Update = new DateTime(2024, 1, 9, 4, 43, 41, 453, DateTimeKind.Local).AddTicks(3241)
                        });
                });

            modelBuilder.Entity("Buildyv2.Models.Estate", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Address")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("CityDSId")
                        .HasColumnType("int");

                    b.Property<string>("Comments")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("Creation")
                        .HasColumnType("datetime2");

                    b.Property<bool>("EstateIsRented")
                        .HasColumnType("bit");

                    b.Property<string>("GoogleMapsURL")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LatLong")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<int>("PresentRentId")
                        .HasColumnType("int");

                    b.Property<DateTime>("Update")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("CityDSId");

                    b.ToTable("Estate");
                });

            modelBuilder.Entity("Buildyv2.Models.Job", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Comments")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("Creation")
                        .HasColumnType("datetime2");

                    b.Property<int>("EstateId")
                        .HasColumnType("int");

                    b.Property<decimal>("LabourCost")
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("Month")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<DateTime>("Update")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("EstateId");

                    b.ToTable("Job");
                });

            modelBuilder.Entity("Buildyv2.Models.Photo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("Creation")
                        .HasColumnType("datetime2");

                    b.Property<int?>("JobId")
                        .HasColumnType("int");

                    b.Property<int?>("RentId")
                        .HasColumnType("int");

                    b.Property<int?>("ReportId")
                        .HasColumnType("int");

                    b.Property<string>("URL")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("Update")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("JobId");

                    b.HasIndex("RentId");

                    b.HasIndex("ReportId");

                    b.ToTable("Photo");
                });

            modelBuilder.Entity("Buildyv2.Models.ProvinceDS", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("CountryDSId")
                        .HasColumnType("int");

                    b.Property<DateTime>("Creation")
                        .HasColumnType("datetime2");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("NominatimProvinceCode")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("Update")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("CountryDSId");

                    b.ToTable("ProvinceDS");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            CountryDSId = 1,
                            Creation = new DateTime(2024, 1, 9, 4, 43, 41, 453, DateTimeKind.Local).AddTicks(3749),
                            Name = "Cerro Largo",
                            NominatimProvinceCode = "CL",
                            Update = new DateTime(2024, 1, 9, 4, 43, 41, 453, DateTimeKind.Local).AddTicks(3760)
                        },
                        new
                        {
                            Id = 2,
                            CountryDSId = 1,
                            Creation = new DateTime(2024, 1, 9, 4, 43, 41, 453, DateTimeKind.Local).AddTicks(3762),
                            Name = "Montevideo",
                            NominatimProvinceCode = "MO",
                            Update = new DateTime(2024, 1, 9, 4, 43, 41, 453, DateTimeKind.Local).AddTicks(3762)
                        });
                });

            modelBuilder.Entity("Buildyv2.Models.Rent", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Comments")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("Creation")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("Datetime_monthInit")
                        .HasColumnType("datetime2");

                    b.Property<string>("Duration")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("EstateId")
                        .HasColumnType("int");

                    b.Property<decimal?>("MonthlyValue")
                        .HasColumnType("decimal(18,2)");

                    b.Property<int>("PrimaryTenantId")
                        .HasColumnType("int");

                    b.Property<bool>("RentIsEnded")
                        .HasColumnType("bit");

                    b.Property<DateTime>("Update")
                        .HasColumnType("datetime2");

                    b.Property<string>("Warrant")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("EstateId");

                    b.ToTable("Rent");
                });

            modelBuilder.Entity("Buildyv2.Models.Report", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Comments")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("Creation")
                        .HasColumnType("datetime2");

                    b.Property<int>("EstateId")
                        .HasColumnType("int");

                    b.Property<string>("Month")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<DateTime>("Update")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("EstateId");

                    b.ToTable("Report");
                });

            modelBuilder.Entity("Buildyv2.Models.Tenant", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Comments")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("Creation")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("IdentityDocument")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Phone1")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Phone2")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("RentId")
                        .HasColumnType("int");

                    b.Property<DateTime>("Update")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("RentId");

                    b.ToTable("Tenant");
                });

            modelBuilder.Entity("Buildyv2.Models.Worker", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Comments")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("Creation")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("IdentityDocument")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("JobId")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Phone")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("Update")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("JobId");

                    b.ToTable("Worker");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("AspNetRoles", (string)null);

                    b.HasData(
                        new
                        {
                            Id = "bef4cbd4-1f2b-472f-a1e2-e1a901f6808c",
                            Name = "Admin",
                            NormalizedName = "Admin"
                        });
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUser", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("int");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("bit");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("bit");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("bit");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.ToTable("AspNetUsers", (string)null);

                    b.HasData(
                        new
                        {
                            Id = "c2ee6493-5a73-46f3-a3f2-46d1d11d7176",
                            AccessFailedCount = 0,
                            ConcurrencyStamp = "c7e92584-969b-4cbf-8694-705016c8345a",
                            Email = "admin@buildy2.uy",
                            EmailConfirmed = false,
                            LockoutEnabled = false,
                            NormalizedEmail = "admin@buildy2.uy",
                            NormalizedUserName = "admin@buildy2.uy",
                            PasswordHash = "AQAAAAIAAYagAAAAEOpWuAWb6Jj65/k6/SGP66SwEyN1ZL5VrIvPC3vbCS2pvS+8z4hClMi8ODqBa5i8VQ==",
                            PhoneNumberConfirmed = false,
                            SecurityStamp = "026fac17-0d55-4327-88f1-4bb4362da5e9",
                            TwoFactorEnabled = false,
                            UserName = "Sr.Admin"
                        },
                        new
                        {
                            Id = "e0765c93-676c-4199-b7ee-d7877c471821",
                            AccessFailedCount = 0,
                            ConcurrencyStamp = "17edb884-656a-4404-9fae-af7b613cde90",
                            Email = "normal@buildy2.uy",
                            EmailConfirmed = false,
                            LockoutEnabled = false,
                            NormalizedEmail = "normal@buildy2.uy",
                            NormalizedUserName = "normal@buildy2.uy",
                            PasswordHash = "AQAAAAIAAYagAAAAEGeJnibR1vtrdabCvsuh1lfwwABg7D1jA6/gHYWAdAIVW6Ja8bFAYQQHjHuZdpMO+w==",
                            PhoneNumberConfirmed = false,
                            SecurityStamp = "40baff9c-2cd4-4719-9ced-3b9e1d2cc254",
                            TwoFactorEnabled = false,
                            UserName = "Sr.Normal"
                        });
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);

                    b.HasData(
                        new
                        {
                            Id = 1,
                            ClaimType = "role",
                            ClaimValue = "admin",
                            UserId = "c2ee6493-5a73-46f3-a3f2-46d1d11d7176"
                        });
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("RoleId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Value")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("Buildyv2.Models.CityDS", b =>
                {
                    b.HasOne("Buildyv2.Models.ProvinceDS", "ProvinceDS")
                        .WithMany()
                        .HasForeignKey("ProvinceDSId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ProvinceDS");
                });

            modelBuilder.Entity("Buildyv2.Models.Estate", b =>
                {
                    b.HasOne("Buildyv2.Models.CityDS", "CityDS")
                        .WithMany()
                        .HasForeignKey("CityDSId");

                    b.Navigation("CityDS");
                });

            modelBuilder.Entity("Buildyv2.Models.Job", b =>
                {
                    b.HasOne("Buildyv2.Models.Estate", "Estate")
                        .WithMany("ListJobs")
                        .HasForeignKey("EstateId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Estate");
                });

            modelBuilder.Entity("Buildyv2.Models.Photo", b =>
                {
                    b.HasOne("Buildyv2.Models.Job", null)
                        .WithMany("ListPhotos")
                        .HasForeignKey("JobId");

                    b.HasOne("Buildyv2.Models.Rent", "Rent")
                        .WithMany("ListPhotos")
                        .HasForeignKey("RentId");

                    b.HasOne("Buildyv2.Models.Report", "Report")
                        .WithMany("ListPhotos")
                        .HasForeignKey("ReportId");

                    b.Navigation("Rent");

                    b.Navigation("Report");
                });

            modelBuilder.Entity("Buildyv2.Models.ProvinceDS", b =>
                {
                    b.HasOne("Buildyv2.Models.CountryDS", "CountryDS")
                        .WithMany()
                        .HasForeignKey("CountryDSId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CountryDS");
                });

            modelBuilder.Entity("Buildyv2.Models.Rent", b =>
                {
                    b.HasOne("Buildyv2.Models.Estate", "Estate")
                        .WithMany("ListRents")
                        .HasForeignKey("EstateId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Estate");
                });

            modelBuilder.Entity("Buildyv2.Models.Report", b =>
                {
                    b.HasOne("Buildyv2.Models.Estate", "Estate")
                        .WithMany("ListReports")
                        .HasForeignKey("EstateId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Estate");
                });

            modelBuilder.Entity("Buildyv2.Models.Tenant", b =>
                {
                    b.HasOne("Buildyv2.Models.Rent", "Rent")
                        .WithMany("ListTenants")
                        .HasForeignKey("RentId");

                    b.Navigation("Rent");
                });

            modelBuilder.Entity("Buildyv2.Models.Worker", b =>
                {
                    b.HasOne("Buildyv2.Models.Job", "Job")
                        .WithMany("ListWorkers")
                        .HasForeignKey("JobId");

                    b.Navigation("Job");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Buildyv2.Models.Estate", b =>
                {
                    b.Navigation("ListJobs");

                    b.Navigation("ListRents");

                    b.Navigation("ListReports");
                });

            modelBuilder.Entity("Buildyv2.Models.Job", b =>
                {
                    b.Navigation("ListPhotos");

                    b.Navigation("ListWorkers");
                });

            modelBuilder.Entity("Buildyv2.Models.Rent", b =>
                {
                    b.Navigation("ListPhotos");

                    b.Navigation("ListTenants");
                });

            modelBuilder.Entity("Buildyv2.Models.Report", b =>
                {
                    b.Navigation("ListPhotos");
                });
#pragma warning restore 612, 618
        }
    }
}
