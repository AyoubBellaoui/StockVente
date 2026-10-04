using Microsoft.EntityFrameworkCore;
using StockVente.Application.Common;
using StockVente.Domain.Entities;
using StockVente.Infrastructure.Data;

namespace StockVente.Infrastructure.Repositories;

// ── Product Repository ────────────────────────────────────────
public sealed class ProductRepository(AppDbContext db) : IProductRepository
{
    public async Task<IEnumerable<Product>> GetAllAsync(CancellationToken ct = default)
        => await db.Products.AsNoTracking().OrderByDescending(p => p.CreatedAt).ToListAsync(ct);

    public async Task<Product?> GetByIdAsync(long id, CancellationToken ct = default)
        => await db.Products.FindAsync([id], ct);

    public async Task AddAsync(Product p, CancellationToken ct = default)
        => await db.Products.AddAsync(p, ct);

    public void Update(Product p) => db.Products.Update(p);
    public void Delete(Product p) => db.Products.Remove(p);

    public async Task<int> SaveChangesAsync(CancellationToken ct = default)
        => await db.SaveChangesAsync(ct);
}

// ── Client Repository ─────────────────────────────────────────
public sealed class ClientRepository(AppDbContext db) : IClientRepository
{
    public async Task<IEnumerable<Client>> GetAllAsync(CancellationToken ct = default)
        => await db.Clients.AsNoTracking().OrderBy(c => c.Name).ToListAsync(ct);

    public async Task<Client?> GetByIdAsync(long id, CancellationToken ct = default)
        => await db.Clients.FindAsync([id], ct);

    public async Task AddAsync(Client c, CancellationToken ct = default)
        => await db.Clients.AddAsync(c, ct);

    public void Update(Client c) => db.Clients.Update(c);
    public void Delete(Client c) => db.Clients.Remove(c);

    public async Task<int> SaveChangesAsync(CancellationToken ct = default)
        => await db.SaveChangesAsync(ct);
}

// ── Sale Repository ───────────────────────────────────────────
public sealed class SaleRepository(AppDbContext db) : ISaleRepository
{
    public async Task<IEnumerable<Sale>> GetAllAsync(CancellationToken ct = default)
        => await db.Sales
            .AsNoTracking()
            .Include(s => s.Client)
            .Include(s => s.SaleItems).ThenInclude(i => i.Product)
            .OrderByDescending(s => s.SaleDate)
            .ToListAsync(ct);

    public async Task<Sale?> GetByIdAsync(long id, CancellationToken ct = default)
        => await db.Sales
            .Include(s => s.Client)
            .Include(s => s.SaleItems).ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(s => s.Id == id, ct);

    public async Task AddAsync(Sale s, CancellationToken ct = default)
        => await db.Sales.AddAsync(s, ct);

    public async Task AddSaleItemAsync(SaleItem item, CancellationToken ct = default)
        => await db.SaleItems.AddAsync(item, ct);

    public async Task UpdateTotalAsync(long saleId, decimal total, CancellationToken ct = default)
    {
        var sale = await db.Sales.FindAsync([saleId], ct);
        if (sale is not null)
        {
            db.Entry(sale).Property("Total").CurrentValue = total;
        }
    }

    public void Delete(Sale s) => db.Sales.Remove(s);

    public async Task<int> SaveChangesAsync(CancellationToken ct = default)
        => await db.SaveChangesAsync(ct);
}
