using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Buildyv2.Models;

namespace Buildyv2;

public class Log : IId
{

    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public string Entity { get; set; }
    public string Action { get; set; }
    public string Data { get; set; }
    public string Username { get; set; }
    public DateTime Creation { get; set; } = DateTime.Now;
}