﻿using ForHer.Data;
using ForHer.Models;
using HotChocolate;
using HotChocolate.Data;
using System.Linq;

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
