using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Buildyv2.Migrations
{
    /// <inheritdoc />
    public partial class migracion4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photo_Rent_RentId",
                table: "Photo");

            migrationBuilder.DropIndex(
                name: "IX_Photo_RentId",
                table: "Photo");

            migrationBuilder.DropColumn(
                name: "RentId",
                table: "Photo");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "bef4cbd4-1f2b-472f-a1e2-e1a901f6808c",
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 39, 963, DateTimeKind.Local).AddTicks(1639), new DateTime(2024, 3, 10, 0, 15, 39, 963, DateTimeKind.Local).AddTicks(1644) });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "bef4cbd4-1f2b-472f-a3f2-e1a901f6811c",
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 39, 963, DateTimeKind.Local).AddTicks(1653), new DateTime(2024, 3, 10, 0, 15, 39, 963, DateTimeKind.Local).AddTicks(1653) });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "11c767dc-e8ce-448e-8fdb-ee590a44a3ff",
                columns: new[] { "ConcurrencyStamp", "Creation", "PasswordHash", "SecurityStamp", "Update" },
                values: new object[] { "f328bd07-90dd-43bc-8963-830b7a42329c", new DateTime(2024, 3, 10, 0, 15, 40, 278, DateTimeKind.Local).AddTicks(6206), "AQAAAAIAAYagAAAAEMM/cGZUvjzCL93iBDa7EGbvsFKdi5X30QByUq1EJymoEo4yDelwDDRt8EJBePz7RA==", "3205b28a-a998-41c7-911e-4298ba07321c", new DateTime(2024, 3, 10, 0, 15, 40, 278, DateTimeKind.Local).AddTicks(6225) });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "58fbedfc-e682-479b-ba46-19ef4c137d2a",
                columns: new[] { "ConcurrencyStamp", "Creation", "PasswordHash", "SecurityStamp", "Update" },
                values: new object[] { "65063b1a-a7b5-4345-bd7a-b0ebd564b80e", new DateTime(2024, 3, 10, 0, 15, 40, 176, DateTimeKind.Local).AddTicks(3835), "AQAAAAIAAYagAAAAEF4lxRQCuSH2yj4CcmZPFswznwGICay9HLPx/k271Ol0DJjhZiVzarIkEHcoKsqE5g==", "f8f104fa-e676-430c-998b-4a82e03f444a", new DateTime(2024, 3, 10, 0, 15, 40, 176, DateTimeKind.Local).AddTicks(3854) });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "c2ee6493-5a73-46f3-a3f2-46d1d11d7176",
                columns: new[] { "ConcurrencyStamp", "Creation", "PasswordHash", "SecurityStamp", "Update" },
                values: new object[] { "4eff9577-529b-492c-9717-684dfbcde2a0", new DateTime(2024, 3, 10, 0, 15, 39, 963, DateTimeKind.Local).AddTicks(1740), "AQAAAAIAAYagAAAAEJfkcAQpDZMT6xaGRY9v8PgA+1ML2VAUFycm2tnBxKID/dxjW1nrnuScjVAr2OoWYA==", "46fffe2d-e16e-4cba-9d29-050a1de6517c", new DateTime(2024, 3, 10, 0, 15, 39, 963, DateTimeKind.Local).AddTicks(1741) });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "e0765c93-676c-4199-b7ee-d7877c471821",
                columns: new[] { "ConcurrencyStamp", "Creation", "PasswordHash", "SecurityStamp", "Update" },
                values: new object[] { "f267a0ed-87da-4162-9af3-c4c5a2c1b015", new DateTime(2024, 3, 10, 0, 15, 40, 58, DateTimeKind.Local).AddTicks(1570), "AQAAAAIAAYagAAAAECPQT+EfMOCDpyggVOwPnaH4+RcxggMs/M115175ksOfa/Mdzcp5/J5TtL19736Vug==", "ff6cac90-938f-4521-b23c-1c9e11a2b340", new DateTime(2024, 3, 10, 0, 15, 40, 58, DateTimeKind.Local).AddTicks(1597) });

            migrationBuilder.UpdateData(
                table: "CityDS",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(1937), new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(1938) });

            migrationBuilder.UpdateData(
                table: "CityDS",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(1941), new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(1941) });

            migrationBuilder.UpdateData(
                table: "CountryDS",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(1059), new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(1089) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2163), new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2164) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2190), new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2191) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2194), new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2195) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2198), new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2211) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2219), new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2233) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2257), new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2258) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2272), new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2273) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2532), new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2533) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2539), new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2540) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2542), new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2543) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2546), new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2547) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2549), new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2550) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2572), new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2573) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2575), new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2576) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2578), new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2578) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2581), new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2581) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 17,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2583), new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2584) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 18,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2586), new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2587) });

            migrationBuilder.UpdateData(
                table: "OwnerDS",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2085), new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2086) });

            migrationBuilder.UpdateData(
                table: "OwnerDS",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2088), new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2089) });

            migrationBuilder.UpdateData(
                table: "OwnerDS",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2091), new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(2092) });

            migrationBuilder.UpdateData(
                table: "ProvinceDS",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(1772), new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(1799) });

            migrationBuilder.UpdateData(
                table: "ProvinceDS",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(1801), new DateTime(2024, 3, 10, 0, 15, 40, 371, DateTimeKind.Local).AddTicks(1802) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RentId",
                table: "Photo",
                type: "int",
                nullable: true);

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
                name: "IX_Photo_RentId",
                table: "Photo",
                column: "RentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Photo_Rent_RentId",
                table: "Photo",
                column: "RentId",
                principalTable: "Rent",
                principalColumn: "Id");
        }
    }
}
