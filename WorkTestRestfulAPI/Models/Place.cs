using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WorkTestRestfulAPI.Models
{
    public class Place
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public double LocationLat { get; set; }
        public double LocationLong { get; set; }

        //Relations
        [ForeignKey("Path")]
        public int? PathId { get; set; }
        [JsonIgnore]
        public virtual Path Path { get; set; }

    }
}