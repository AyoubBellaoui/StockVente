using Microsoft.EntityFrameworkCore;
using StockVente.Domain.Entities;

namespace StockVente.Infrastructure.Data;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Product>  Products  => Set<Product>();
    public DbSet<Client>   Clients   => Set<Client>();
    public DbSet<Sale>     Sales     => Set<Sale>();
    public DbSet<SaleItem> SaleItems => Set<SaleItem>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        base.OnModelCreating(mb);

        // ── Product ─────────────────────────────────────────
        mb.Entity<Product>(e =>
        {
            e.ToTable("Products");
            e.HasKey(p => p.Id);
            e.Property(p => p.Id).UseIdentityColumn();
            e.Property(p => p.Name).IsRequired().HasMaxLength(100);
            e.Property(p => p.Description).HasMaxLength(500);
            e.Property(p => p.Category).IsRequired().HasMaxLength(50);
            e.Property(p => p.PurchasePrice).HasPrecision(18, 2).IsRequired();
            e.Property(p => p.SalePrice).HasPrecision(18, 2).IsRequired();
            e.Property(p => p.Quantity).IsRequired();
            e.Property(p => p.ImageUrl).HasMaxLength(500);
            e.Property(p => p.CreatedAt).IsRequired();
            e.Property(p => p.UpdatedAt).IsRequired();
        });

        // ── Client ──────────────────────────────────────────
        mb.Entity<Client>(e =>
        {
            e.ToTable("Clients");
            e.HasKey(c => c.Id);
            e.Property(c => c.Id).UseIdentityColumn();
            e.Property(c => c.Name).IsRequired().HasMaxLength(100);
            e.Property(c => c.Phone).HasMaxLength(20);
            e.Property(c => c.Email).HasMaxLength(100);
            e.Property(c => c.Address).HasMaxLength(255);
            e.Property(c => c.CreatedAt).IsRequired();
        });

        // ── Sale ────────────────────────────────────────────
        mb.Entity<Sale>(e =>
        {
            e.ToTable("Sales");
            e.HasKey(s => s.Id);
            e.Property(s => s.Id).UseIdentityColumn();
            e.Property(s => s.PaymentMethod).IsRequired().HasMaxLength(50);
            e.Property(s => s.Total).HasPrecision(18, 2).IsRequired();
            e.Property(s => s.SaleDate).IsRequired();
            e.Property(s => s.CreatedAt).IsRequired();
            e.HasOne(s => s.Client)
             .WithMany(c => c.Sales)
             .HasForeignKey(s => s.ClientId)
             .OnDelete(DeleteBehavior.SetNull);
        });

        // ── SaleItem ─────────────────────────────────────────
        mb.Entity<SaleItem>(e =>
        {
            e.ToTable("SaleItems");
            e.HasKey(i => i.Id);
            e.Property(i => i.Id).UseIdentityColumn();
            e.Property(i => i.UnitPrice).HasPrecision(18, 2).IsRequired();
            e.Property(i => i.SubTotal).HasPrecision(18, 2).IsRequired();
            e.Property(i => i.Quantity).IsRequired();
            e.HasOne(i => i.Sale)
             .WithMany(s => s.SaleItems)
             .HasForeignKey(i => i.SaleId)
             .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(i => i.Product)
             .WithMany(p => p.SaleItems)
             .HasForeignKey(i => i.ProductId)
             .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
