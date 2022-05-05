using ForHer.Data;
using ForHer.Models;
using HotChocolate;
using HotChocolate.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ForHer.GraphQL
{
    public class Query
    {
        [UseDbContext(typeof(AppDbContext))]
        [UseFiltering]
        public IQueryable<Song> GetSongs([ScopedService] AppDbContext context) 
        {
            return context.Songs;
        }
        
       
    }
}
