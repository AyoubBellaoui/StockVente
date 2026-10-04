namespace StockVente.Domain.Entities;

public sealed class Product
{
    public long     Id            { get; private set; }
    public string   Name          { get; private set; } = string.Empty;
    public string?  Description   { get; private set; }
    public string   Category      { get; private set; } = string.Empty;
    public decimal  PurchasePrice { get; private set; }
    public decimal  SalePrice     { get; private set; }
    public int      Quantity      { get; private set; }
    public string?  ImageUrl      { get; private set; }
    public DateTime CreatedAt     { get; private set; }
    public DateTime UpdatedAt     { get; private set; }

    // Navigation
    public ICollection<SaleItem> SaleItems { get; private set; } = [];

    private Product() { }

    public static Product Create(string name, string? description, string category,
        decimal purchasePrice, decimal salePrice, int quantity, string? imageUrl)
        => new()
        {
            Name = name, Description = description, Category = category,
            PurchasePrice = purchasePrice, SalePrice = salePrice,
            Quantity = quantity, ImageUrl = imageUrl,
            CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
        };

    public void Update(string name, string? description, string category,
        decimal purchasePrice, decimal salePrice, int quantity, string? imageUrl)
    {
        Name = name; Description = description; Category = category;
        PurchasePrice = purchasePrice; SalePrice = salePrice;
        Quantity = quantity; ImageUrl = imageUrl;
        UpdatedAt = DateTime.UtcNow;
    }

    public void DecreaseStock(int qty)
    {
        if (qty > Quantity)
            throw new InvalidOperationException($"Stock insuffisant pour '{Name}'. Disponible: {Quantity}, demandé: {qty}");
        Quantity -= qty;
        UpdatedAt = DateTime.UtcNow;
    }

    public void IncreaseStock(int qty)
    {
        Quantity += qty;
        UpdatedAt = DateTime.UtcNow;
    }
}
