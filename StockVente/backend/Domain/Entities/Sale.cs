namespace StockVente.Domain.Entities;

public sealed class Sale
{
    public long      Id            { get; private set; }
    public long?     ClientId      { get; private set; }
    public DateTime  SaleDate      { get; private set; }
    public string    PaymentMethod { get; private set; } = string.Empty;
    public decimal   Total         { get; private set; }
    public DateTime  CreatedAt     { get; private set; }

    // Navigation
    public Client?               Client    { get; private set; }
    public ICollection<SaleItem> SaleItems { get; private set; } = [];

    private Sale() { }

    public static Sale Create(long? clientId, DateTime saleDate, string paymentMethod)
        => new()
        {
            ClientId = clientId, SaleDate = saleDate,
            PaymentMethod = paymentMethod, Total = 0,
            CreatedAt = DateTime.UtcNow
        };

    public void AddItem(SaleItem item)
    {
        SaleItems.Add(item);
        RecalculateTotal();
    }

    public void RecalculateTotal()
        => Total = SaleItems.Sum(i => i.SubTotal);
}

public sealed class SaleItem
{
    public long    Id        { get; private set; }
    public long    SaleId    { get; private set; }
    public long    ProductId { get; private set; }
    public int     Quantity  { get; private set; }
    public decimal UnitPrice { get; private set; }
    public decimal SubTotal  { get; private set; }

    // Navigation
    public Sale?    Sale    { get; private set; }
    public Product? Product { get; private set; }

    private SaleItem() { }

    public static SaleItem Create(long saleId, long productId, int quantity, decimal unitPrice)
        => new()
        {
            SaleId = saleId, ProductId = productId,
            Quantity = quantity, UnitPrice = unitPrice,
            SubTotal = unitPrice * quantity
        };
}
