using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WorkTestRestfulAPI.Models
{
    public class Bundle
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<Path> Paths { get; set; }
    }
}