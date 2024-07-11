using System.ComponentModel.DataAnnotations;

namespace CrudWebApi.Models
{
    public class Employee
    {
        [Key]
        public Guid Id { get; set; }
        public string name { get; set; }
        public string mobileNo { get; set; }
        public string emailID { get; set; }

    }
}
