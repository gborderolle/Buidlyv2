using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Buildyv2.Migrations
{
    /// <inheritdoc />
    public partial class migracion2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "PresentRentId",
                table: "Estate",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "PresentRentId",
                table: "Estate",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "bef4cbd4-1f2b-472f-a1e2-e1a901f6808c",
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 15, 831, DateTimeKind.Local).AddTicks(9619), new DateTime(2024, 1, 25, 18, 54, 15, 831, DateTimeKind.Local).AddTicks(9621) });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "bef4cbd4-1f2b-472f-a3f2-e1a901f6811c",
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 15, 831, DateTimeKind.Local).AddTicks(9624), new DateTime(2024, 1, 25, 18, 54, 15, 831, DateTimeKind.Local).AddTicks(9625) });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "11c767dc-e8ce-448e-8fdb-ee590a44a3ff",
                columns: new[] { "ConcurrencyStamp", "Creation", "PasswordHash", "SecurityStamp", "Update" },
                values: new object[] { "c3ed0ca9-86e2-41c5-b85e-76e0d795401b", new DateTime(2024, 1, 25, 18, 54, 16, 85, DateTimeKind.Local).AddTicks(4634), "AQAAAAIAAYagAAAAEBCvQ+26MxhNddcBe6300GluqdxIubkSp5OhhezGibD68HaSGZbrVVMBpttPoarEyQ==", "aa345af5-fd36-4cd7-a969-d3e300decdf6", new DateTime(2024, 1, 25, 18, 54, 16, 85, DateTimeKind.Local).AddTicks(4652) });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "58fbedfc-e682-479b-ba46-19ef4c137d2a",
                columns: new[] { "ConcurrencyStamp", "Creation", "PasswordHash", "SecurityStamp", "Update" },
                values: new object[] { "0d5739cf-80be-4235-8abd-72ffc4abd76a", new DateTime(2024, 1, 25, 18, 54, 16, 1, DateTimeKind.Local).AddTicks(3352), "AQAAAAIAAYagAAAAEN19rzIrd+nP8HHlhS/aFqXvobA2hhVEl5/S35lGwVrBrUVZoIKeBnJ1Ze9d1aPiVw==", "1af19702-6caf-4192-8b08-89d695d02da6", new DateTime(2024, 1, 25, 18, 54, 16, 1, DateTimeKind.Local).AddTicks(3529) });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "c2ee6493-5a73-46f3-a3f2-46d1d11d7176",
                columns: new[] { "ConcurrencyStamp", "Creation", "PasswordHash", "SecurityStamp", "Update" },
                values: new object[] { "fa80eafb-d9f4-49d0-bca3-890c60e38c85", new DateTime(2024, 1, 25, 18, 54, 15, 831, DateTimeKind.Local).AddTicks(9633), "AQAAAAIAAYagAAAAEIvvSll3ZkBkC8vv0/qR2KpjrnoGIKCzZKI9rNw9er/4VxkdA6LB5h2dd1/SfqbQ3g==", "7bd67f07-bdef-440d-a7dc-b14cb6ccc434", new DateTime(2024, 1, 25, 18, 54, 15, 831, DateTimeKind.Local).AddTicks(9634) });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "e0765c93-676c-4199-b7ee-d7877c471821",
                columns: new[] { "ConcurrencyStamp", "Creation", "PasswordHash", "SecurityStamp", "Update" },
                values: new object[] { "ca7ea6d0-0e9f-4558-8886-787f8d4152c6", new DateTime(2024, 1, 25, 18, 54, 15, 916, DateTimeKind.Local).AddTicks(3015), "AQAAAAIAAYagAAAAEHnfRKE2VtNukN71YeI0dZ7cjap5eCBELHCanyxw6TtrYKmI91DGyWPJLun0TcK9pw==", "aef3c2ab-9324-470a-b838-4e09fec94856", new DateTime(2024, 1, 25, 18, 54, 15, 916, DateTimeKind.Local).AddTicks(3029) });

            migrationBuilder.UpdateData(
                table: "CityDS",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8319), new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8320) });

            migrationBuilder.UpdateData(
                table: "CityDS",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8322), new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8322) });

            migrationBuilder.UpdateData(
                table: "CountryDS",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8134), new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8153) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8417), new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8418) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8426), new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8426) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8428), new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8428) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8430), new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8430) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8432), new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8442) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8463), new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8463) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8469), new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8469) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8470), new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8471) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8472), new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8473) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8475), new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8475) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8477), new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8477) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8479), new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8479) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8481), new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8482) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8483), new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8484) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8485), new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8486) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8488), new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8488) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 17,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8490), new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8490) });

            migrationBuilder.UpdateData(
                table: "Estate",
                keyColumn: "Id",
                keyValue: 18,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8492), new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8492) });

            migrationBuilder.UpdateData(
                table: "OwnerDS",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8369), new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8370) });

            migrationBuilder.UpdateData(
                table: "OwnerDS",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8371), new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8371) });

            migrationBuilder.UpdateData(
                table: "OwnerDS",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8372), new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8373) });

            migrationBuilder.UpdateData(
                table: "ProvinceDS",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8209), new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8210) });

            migrationBuilder.UpdateData(
                table: "ProvinceDS",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Creation", "Update" },
                values: new object[] { new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8211), new DateTime(2024, 1, 25, 18, 54, 16, 169, DateTimeKind.Local).AddTicks(8212) });
        }
    }
}
