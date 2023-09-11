﻿using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using WebAPI_tutorial_peliculas.Context;
using WebAPI_tutorial_peliculas.Repository;

namespace Buildyv2.Repository
{
    public class PurchaseRepository : Repository<Purchase>, IPurchaseRepository
    {
        private readonly DbContext _dbContext;

        public PurchaseRepository(ContextDB dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Purchase> Update(Purchase entity)
        {
            entity.Update = DateTime.Now;
            _dbContext.Update(entity);
            await Save();
            return entity;
        }

        public IQueryable<Purchase> GetAllQueryable()
        {
            return dbSet.AsQueryable();
        }

    }
}