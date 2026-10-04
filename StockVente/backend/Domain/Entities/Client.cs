namespace StockVente.Domain.Entities;

public sealed class Client
{
    public long    Id        { get; private set; }
    public string  Name      { get; private set; } = string.Empty;
    public string? Phone     { get; private set; }
    public string? Email     { get; private set; }
    public string? Address   { get; private set; }
    public DateTime CreatedAt { get; private set; }

    // Navigation
    public ICollection<Sale> Sales { get; private set; } = [];

    private Client() { }

    public static Client Create(string name, string? phone, string? email, string? address)
        => new() { Name = name, Phone = phone, Email = email, Address = address, CreatedAt = DateTime.UtcNow };

    public void Update(string name, string? phone, string? email, string? address)
    {
        Name = name; Phone = phone; Email = email; Address = address;
    }
}
