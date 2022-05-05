using Microsoft.EntityFrameworkCore.Migrations;

namespace ForHer.Migrations
{
    public partial class ModelUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LicenseKey",
                table: "Songs");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Songs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Songs");

            migrationBuilder.AddColumn<string>(
                name: "LicenseKey",
                table: "Songs",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
