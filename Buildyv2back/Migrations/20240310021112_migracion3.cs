using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Buildyv2.Migrations
{
    /// <inheritdoc />
    public partial class migracion3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "File",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Creation = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Update = table.Column<DateTime>(type: "datetime2", nullable: false),
                    URL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RentId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_File", x => x.Id);
                    table.ForeignKey(
                        name: "FK_File_Rent_RentId",
                        column: x => x.RentId,
                        principalTable: "Rent",
                        principalColumn: "Id");
                });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "bef4cbd4-1f2b-472f-a1e2-e1a901f6808c",
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 369, DateTimeKind.Local).AddTicks(4899), new DateTime(2024, 3, 9, 23, 11, 11, 369, DateTimeKind.Local).AddTicks(4900) });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "bef4cbd4-1f2b-472f-a3f2-e1a901f6811c",
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 369, DateTimeKind.Local).AddTicks(4905), new DateTime(2024, 3, 9, 23, 11, 11, 369, DateTimeKind.Local).AddTicks(4906) });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "11c767dc-e8ce-448e-8fdb-ee590a44a3ff",
                columns: new[] { "ConcurrencyStamp", "Creation", "PasswordHash", "SecurityStamp", "Update" },
                values: new object[] { "0ab04acd-6fc6-4737-9187-d9eec6326624", new DateTime(2024, 3, 9, 23, 11, 11, 626, DateTimeKind.Local).AddTicks(4652), "AQAAAAIAAYagAAAAEL3g9ASaYVFEJD+2rBRBJe14Hlh/nZVSm8a8UggRXHxjAhdvOENU9HXSyxI3eCqMCw==", "aa1d39d2-f7ff-42a8-9473-b8bdab07ddec", new DateTime(2024, 3, 9, 23, 11, 11, 626, DateTimeKind.Local).AddTicks(4661) });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "58fbedfc-e682-479b-ba46-19ef4c137d2a",
                columns: new[] { "ConcurrencyStamp", "Creation", "PasswordHash", "SecurityStamp", "Update" },
                values: new object[] { "ede48019-7b23-4467-991e-6720c05d651b", new DateTime(2024, 3, 9, 23, 11, 11, 537, DateTimeKind.Local).AddTicks(9580), "AQAAAAIAAYagAAAAEH/mcZd6Pw8JarbzBBMeYiGsn5HoSgW6A9QudHpXiLii/XGnjY/ORjE0GhHnwmEmBg==", "81b7ed6a-c9be-41d9-9050-71793cff2ef2", new DateTime(2024, 3, 9, 23, 11, 11, 537, DateTimeKind.Local).AddTicks(9589) });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "c2ee6493-5a73-46f3-a3f2-46d1d11d7176",
                columns: new[] { "ConcurrencyStamp", "Creation", "PasswordHash", "SecurityStamp", "Update" },
                values: new object[] { "e6cf4cc5-c453-49d4-9283-ea6bfe7f5f9d", new DateTime(2024, 3, 9, 23, 11, 11, 369, DateTimeKind.Local).AddTicks(4937), "AQAAAAIAAYagAAAAEBZWn4yEQfzVMG4WGjROEWOVZbI7Jo4w3qAxxoh4ZK+ocqZBa9wbtLQqZaOTOXUhXw==", "77fda8bf-6ddb-46c7-a8d7-03d64ceab307", new DateTime(2024, 3, 9, 23, 11, 11, 369, DateTimeKind.Local).AddTicks(4937) });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "e0765c93-676c-4199-b7ee-d7877c471821",
                columns: new[] { "ConcurrencyStamp", "Creation", "PasswordHash", "SecurityStamp", "Update" },
                values: new object[] { "62e40bd5-7b41-4727-a566-fd13df34a2ca", new DateTime(2024, 3, 9, 23, 11, 11, 452, DateTimeKind.Local).AddTicks(730), "AQAAAAIAAYagAAAAEAXveskSElOgPXJBQF3bc3tu5JKjr9/l65X9r6gpDmTUnhMBbRPXOgHmCFpdZt7rXg==", "bb8f4b84-ba79-4839-9c0e-58013ba73859", new DateTime(2024, 3, 9, 23, 11, 11, 452, DateTimeKind.Local).AddTicks(747) });

            migrationBuilder.UpdateData(
                table: "CityDS",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1205), new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1205) });

            migrationBuilder.UpdateData(
                table: "CityDS",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1207), new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1207) });

            migrationBuilder.UpdateData(
                table: "CountryDS",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(990), new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(998) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1299), new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1300) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1335), new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1336) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1338), new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1338) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1341), new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1341) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1343), new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1343) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1345), new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1345) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1347), new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1348) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1497), new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1497) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1500), new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1501) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1502), new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1503) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1504), new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1505) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1506), new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1507) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1508), new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1509) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1510), new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1511) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1512), new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1513) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1514), new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1515) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 17,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1516), new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1516) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 18,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1518), new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1518) });

            migrationBuilder.UpdateData(
                table: "OwnerDS",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1255), new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1255) });

            migrationBuilder.UpdateData(
                table: "OwnerDS",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1256), new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1257) });

            migrationBuilder.UpdateData(
                table: "OwnerDS",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1258), new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1258) });

            migrationBuilder.UpdateData(
                table: "ProvinceDS",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1144), new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1145) });

            migrationBuilder.UpdateData(
                table: "ProvinceDS",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1146), new DateTime(2024, 3, 9, 23, 11, 11, 726, DateTimeKind.Local).AddTicks(1146) });

            migrationBuilder.CreateIndex(
                name: "IX_File_RentId",
                table: "File",
                column: "RentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "File");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "bef4cbd4-1f2b-472f-a1e2-e1a901f6808c",
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 485, DateTimeKind.Local).AddTicks(6200), new DateTime(2024, 1, 26, 19, 46, 31, 485, DateTimeKind.Local).AddTicks(6200) });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "bef4cbd4-1f2b-472f-a3f2-e1a901f6811c",
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 485, DateTimeKind.Local).AddTicks(6205), new DateTime(2024, 1, 26, 19, 46, 31, 485, DateTimeKind.Local).AddTicks(6205) });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "11c767dc-e8ce-448e-8fdb-ee590a44a3ff",
                columns: new[] { "ConcurrencyStamp", "Creation", "PasswordHash", "SecurityStamp", "Update" },
                values: new object[] { "22f6de7e-6efe-437b-9cb1-5e63aacfe55f", new DateTime(2024, 1, 26, 19, 46, 31, 711, DateTimeKind.Local).AddTicks(5879), "AQAAAAIAAYagAAAAEJtXXVCPgRB/8D4tjTOIHt5wuM5P0Vw7KZMHfMXLn29QcdH5Hn+Cekd9U3ddA/rJiw==", "46a32c47-cb2b-4c39-ae02-3721aee10e4a", new DateTime(2024, 1, 26, 19, 46, 31, 711, DateTimeKind.Local).AddTicks(5895) });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "58fbedfc-e682-479b-ba46-19ef4c137d2a",
                columns: new[] { "ConcurrencyStamp", "Creation", "PasswordHash", "SecurityStamp", "Update" },
                values: new object[] { "d6ec23fa-421e-4725-992b-c191d442e93b", new DateTime(2024, 1, 26, 19, 46, 31, 636, DateTimeKind.Local).AddTicks(6652), "AQAAAAIAAYagAAAAEN7SygZ7PwrYaTyJ6auQyx4Tbl9sTlBtRa7Y5AvqP09nVgWvIGI6aPnaGyXKO/9dGg==", "d5ffd280-610c-4256-ba0a-2a2bb1f27c06", new DateTime(2024, 1, 26, 19, 46, 31, 636, DateTimeKind.Local).AddTicks(6669) });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "c2ee6493-5a73-46f3-a3f2-46d1d11d7176",
                columns: new[] { "ConcurrencyStamp", "Creation", "PasswordHash", "SecurityStamp", "Update" },
                values: new object[] { "b783d2c7-1fb1-4b8a-b821-b95207799742", new DateTime(2024, 1, 26, 19, 46, 31, 485, DateTimeKind.Local).AddTicks(6214), "AQAAAAIAAYagAAAAEM5uMc+7L05ufz0lFUcX1Rc9ptnMbaAbJ7+MGWHBxyCrmhleAB7tVRE+2GH2UWokSw==", "af177ad6-5e45-4b42-828b-c9edcede984a", new DateTime(2024, 1, 26, 19, 46, 31, 485, DateTimeKind.Local).AddTicks(6215) });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "e0765c93-676c-4199-b7ee-d7877c471821",
                columns: new[] { "ConcurrencyStamp", "Creation", "PasswordHash", "SecurityStamp", "Update" },
                values: new object[] { "f833f0c4-1d7b-42a1-b0c7-4e7d0088172e", new DateTime(2024, 1, 26, 19, 46, 31, 561, DateTimeKind.Local).AddTicks(737), "AQAAAAIAAYagAAAAEM3kJJ6NYBtUdr0zMRFyYAixDyVSG3CyR8k1Ivvqgf1H5nz6T9Z+cXOz9XuvRom22w==", "6592f575-9834-4191-8ff9-4adbcf4e5f7c", new DateTime(2024, 1, 26, 19, 46, 31, 561, DateTimeKind.Local).AddTicks(751) });

            migrationBuilder.UpdateData(
                table: "CityDS",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9195), new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9196) });

            migrationBuilder.UpdateData(
                table: "CityDS",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9199), new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9199) });

            migrationBuilder.UpdateData(
                table: "CountryDS",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9104), new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9109) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9273), new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9274) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9281), new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9281) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9284), new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9284) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9285), new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9286) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9287), new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9287) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9290), new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9290) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9291), new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9292) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9293), new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9293) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9295), new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9296) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9297), new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9297) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9298), new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9299) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9380), new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9380) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9382), new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9382) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9384), new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9384) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9386), new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9386) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9387), new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9387) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 17,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9389), new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9389) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 18,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9391), new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9391) });

            migrationBuilder.UpdateData(
                table: "OwnerDS",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9238), new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9238) });

            migrationBuilder.UpdateData(
                table: "OwnerDS",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9240), new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9240) });

            migrationBuilder.UpdateData(
                table: "OwnerDS",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9241), new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9242) });

            migrationBuilder.UpdateData(
                table: "ProvinceDS",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9156), new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9157) });

            migrationBuilder.UpdateData(
                table: "ProvinceDS",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9158), new DateTime(2024, 1, 26, 19, 46, 31, 787, DateTimeKind.Local).AddTicks(9159) });
        }
    }
}
