using ForHer.Models;
using Microsoft.EntityFrameworkCore;

namespace ForHer.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Song> Songs { get; set; }

    }
}
