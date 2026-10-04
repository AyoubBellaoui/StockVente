using StockVente.Domain.Entities;

namespace StockVente.Application.Common;

// ── Repository Interfaces ─────────────────────────────────────

public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllAsync(CancellationToken ct = default);
    Task<Product?> GetByIdAsync(long id, CancellationToken ct = default);
    Task AddAsync(Product product, CancellationToken ct = default);
    void Update(Product product);
    void Delete(Product product);
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}

public interface ISaleRepository
{
    Task<IEnumerable<Sale>> GetAllAsync(CancellationToken ct = default);
    Task<Sale?> GetByIdAsync(long id, CancellationToken ct = default);
    Task AddAsync(Sale sale, CancellationToken ct = default);
    Task AddSaleItemAsync(SaleItem item, CancellationToken ct = default);
    Task UpdateTotalAsync(long saleId, decimal total, CancellationToken ct = default);
    void Delete(Sale sale);
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}

public interface IClientRepository
{
    Task<IEnumerable<Client>> GetAllAsync(CancellationToken ct = default);
    Task<Client?> GetByIdAsync(long id, CancellationToken ct = default);
    Task AddAsync(Client client, CancellationToken ct = default);
    void Update(Client client);
    void Delete(Client client);
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}

// ── DTOs ──────────────────────────────────────────────────────

public sealed record ProductDto(
    long Id, string Name, string? Description, string Category,
    decimal PurchasePrice, decimal SalePrice, int Quantity,
    string? ImageUrl, DateTime CreatedAt);

public sealed record ClientDto(
    long Id, string Name, string? Phone, string? Email, string? Address);

public sealed record SaleItemDto(
    long Id, long ProductId, string ProductName,
    int Quantity, decimal UnitPrice, decimal SubTotal);

public sealed record SaleDto(
    long Id, long? ClientId, string? ClientName,
    DateTime SaleDate, string PaymentMethod,
    decimal Total, DateTime CreatedAt,
    IEnumerable<SaleItemDto> Items);

public sealed record SaleListDto(
    long Id, long? ClientId, string? ClientName,
    DateTime SaleDate, string PaymentMethod, decimal Total);

public sealed record DashboardDto(
    int TotalProducts, int TotalSales,
    decimal TotalRevenue, int OutOfStockCount,
    IEnumerable<ProductDto> OutOfStockProducts);
