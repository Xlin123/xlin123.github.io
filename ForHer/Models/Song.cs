using System.ComponentModel.DataAnnotations;

namespace ForHer.Models
{

    public class Song
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string SongUri { get; set; }
        [Required]
        public int Date { get; set; }

    }
}
