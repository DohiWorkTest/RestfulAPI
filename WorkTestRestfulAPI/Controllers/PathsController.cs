using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using WorkTestRestfulAPI.Models;

namespace WorkTestRestfulAPI.Controllers
{
    public class PathsController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/Paths
        public IQueryable<Path> GetPaths()
        {
            var toReturn = db.Paths.Include(p => p.Places);
            return toReturn;
        }

        // GET: api/Paths/5
        [ResponseType(typeof(Path))]
        public IHttpActionResult GetPath(int id)
        {
            var path = db.Paths
                .Where(p => p.Id == id)
                .Include(p => p.Places)
                .FirstOrDefault();
            if (path == null)
            {
                return NotFound();
            }

            return Ok(path);
        }

        // PUT: api/Paths/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutPath(int id, Path path)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            Path original = db.Paths
               .Where(b => b.Id == id)
               .Include(b => b.Places)
               .FirstOrDefault();

            if (original.Places.Count == 0)
                foreach (Place place in path.Places)
                {
                    var placeToUpdate = db.Places.Find(place.Id);
                    original.Places.Add(placeToUpdate);
                }
            else
            {
                var test = original.Places.ToList();
                foreach (Place place in test)
                {
                    if (!path.Places.Any(p => p.Id == place.Id))
                        original.Places.Remove(place);
                }
            }

            foreach (Place place in path.Places)
            {
                if (original.Places.Any(p => p.Id != place.Id))
                {
                    var placeToUpdate = db.Places.Find(place.Id);
                    original.Places.Add(placeToUpdate);
                }
            }

            db.Entry(original).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PathExists(path.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Paths
        [ResponseType(typeof(Path))]
        public IHttpActionResult PostPath(Path path)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Paths.Add(path);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = path.Id }, path);
        }

        // DELETE: api/Paths/5
        [ResponseType(typeof(Path))]
        public IHttpActionResult DeletePath(int id)
        {
            Path path = db.Paths
               .Where(b => b.Id == id)
               .Include(b => b.Places)
               .FirstOrDefault();
            if (path == null)
            {
                return NotFound();
            }

            foreach (Place p in path.Places)
                p.PathId = null;

            db.Paths.Remove(path);
            db.SaveChanges();

            return Ok(path);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PathExists(int id)
        {
            return db.Paths.Count(e => e.Id == id) > 0;
        }
    }
}