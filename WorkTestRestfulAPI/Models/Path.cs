using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WorkTestRestfulAPI.Models
{
    public class Path
    {
        public int Id { get; set; }

        public string Name { get; set; }


        //Relations

        [ForeignKey("Bundle")]
        public int? BundleId { get; set; }
        [JsonIgnore]
        public virtual Bundle Bundle { get; set; }

        public ICollection<Place> Places { get; set; }
    }
}