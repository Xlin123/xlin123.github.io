using Microsoft.EntityFrameworkCore.Migrations;

namespace ForHer.Migrations
{
    public partial class RemovePlaylistURI : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PlaylistUri",
                table: "Songs");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PlaylistUri",
                table: "Songs",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
