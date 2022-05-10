using System.ComponentModel.DataAnnotations;

namespace ForHer.Models
{
    public class Key
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Secret { get; set; }
    }
}
