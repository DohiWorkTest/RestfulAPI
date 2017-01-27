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
    public class BundlesController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/Bundles
        public IQueryable<Bundle> GetBundles()
        {
            var toReturn = db.Bundles
                .Include(b => b.Paths)
                .Include(b => b.Paths
                    .Select(p => p.Places));
            return toReturn;
        }

        // GET: api/Bundles/5
        [ResponseType(typeof(Bundle))]
        public IHttpActionResult GetBundle(int id)
        {
            var bundle = db.Bundles.Where(b => b.Id == id)
                .Include(b => b.Paths)
                .Include(b => b.Paths
                    .Select(p => p.Places))
                .FirstOrDefault();


            if (bundle == null)
            {
                return NotFound();
            }

            return Ok(bundle);
        }

        // PUT: api/Bundles/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutBundle(int id, Bundle bundle)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var original = db.Bundles
                .Where(b => b.Id == id)
                .Include(b => b.Paths)
                .FirstOrDefault();

            if (original.Paths.Count == 0)
                foreach (Path path in bundle.Paths)
                {

                    var pathToUpdate = db.Paths.Find(path.Id);
                    original.Paths.Add(pathToUpdate);
                }
            else
            {
                var test = original.Paths.ToList();
                foreach (Path path in test)
                {
                    if (!bundle.Paths.Any(p => p.Id == path.Id))
                    {
                        original.Paths.Remove(path);
                    }
                }

                foreach (Path path in bundle.Paths)
                {
                    if (original.Paths.Any(p => p.Id != path.Id))
                    {
                        var pathToUpdate = db.Paths.Find(path.Id);
                        original.Paths.Add(pathToUpdate);
                    }
                }
            }

            db.Entry(original).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BundleExists(bundle.Id))
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

        // POST: api/Bundles
        [ResponseType(typeof(Bundle))]
        public IHttpActionResult PostBundle(Bundle bundle)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (bundle.Paths.Count != 0)
            {
                foreach (Path path in bundle.Paths)
                {
                    db.Entry(path).State = EntityState.Unchanged;
                }
            }

            db.Bundles.Add(bundle);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = bundle.Id }, bundle);
        }

        // DELETE: api/Bundles/5
        [ResponseType(typeof(Bundle))]
        public IHttpActionResult DeleteBundle(int id)
        {
            var bundle = db.Bundles
                .Where(b => b.Id == id)
                .Include(b => b.Paths)
                .FirstOrDefault();
            if (bundle == null)
            {
                return NotFound();
            }

            foreach (Path p in bundle.Paths)
                p.BundleId = null;

            db.Bundles.Remove(bundle);
            db.SaveChanges();

            return Ok(bundle);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool BundleExists(int id)
        {
            return db.Bundles.Count(e => e.Id == id) > 0;
        }
    }
}