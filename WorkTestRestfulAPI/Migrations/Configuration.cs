namespace WorkTestRestfulAPI.Migrations
{
    using Models;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<WorkTestRestfulAPI.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
        }

        protected override void Seed(WorkTestRestfulAPI.Models.ApplicationDbContext context)
        {



            context.Bundles.AddOrUpdate(x => x.Id,
                new Bundle()
                {
                    Id = 1,
                    Name = "Exciting bundle",
                    Paths = new List<Path>()
                        {
                            new Path() { Id = 3, Name = "Scenic path" }
                         },
                },
                new Bundle()
                {
                    Id = 2,
                    Name = "Boring bundle",
                    Paths = new List<Path>()
                    {
                        new Path() { Id = 1, Name = "Short path" },
                        new Path() { Id = 2, Name = "Normal path" }
                    }
                });

            context.Paths.AddOrUpdate(x => x.Id,
                new Path() { Id = 4, Name = "No-mans path" }
                );

            context.Places.AddOrUpdate(x => x.Id,
                new Place() { Id = 1, Name = "Museum", PathId = 1, LocationLat = 63.82947699999999, LocationLong = 20.289672 },
                new Place() { Id = 2, Name = "Church", PathId = 1, LocationLat = 63.8235519, LocationLong = 20.2678029 },
                new Place() { Id = 3, Name = "Shopping", PathId = 1, LocationLat = 63.82591419999999, LocationLong = 20.264984 },
                new Place() { Id = 4, Name = "Town hall park", PathId = 2, LocationLat = 63.8246559, LocationLong = 20.2619717 },
                new Place() { Id = 5, Name = "Bridge park", PathId = 2, LocationLat = 63.82630919999999, LocationLong = 20.2516867 },
                new Place() { Id = 6, Name = "Exhibition", PathId = 3, LocationLat = 63.82034479999999, LocationLong = 20.276341 },
                new Place() { Id = 7, Name = "Harbor", PathId = 3, LocationLat = 63.82444259999999, LocationLong = 20.2590704 }
                );
        }
    }
}
