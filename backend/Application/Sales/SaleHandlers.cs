using FluentValidation;
using MediatR;
using StockVente.Application.Common;
using StockVente.Domain.Entities;

namespace StockVente.Application.Sales;

// ── QUERIES ──────────────────────────────────────────────────

public sealed record GetAllSalesQuery : IRequest<IEnumerable<SaleListDto>>;

public sealed class GetAllSalesHandler(ISaleRepository repo)
    : IRequestHandler<GetAllSalesQuery, IEnumerable<SaleListDto>>
{
    public async Task<IEnumerable<SaleListDto>> Handle(GetAllSalesQuery _, CancellationToken ct)
        => (await repo.GetAllAsync(ct)).Select(s => new SaleListDto(
            s.Id, s.ClientId, s.Client?.Name,
            s.SaleDate, s.PaymentMethod, s.Total));
}

public sealed record GetSaleByIdQuery(long Id) : IRequest<SaleDto?>;

public sealed class GetSaleByIdHandler(ISaleRepository repo)
    : IRequestHandler<GetSaleByIdQuery, SaleDto?>
{
    public async Task<SaleDto?> Handle(GetSaleByIdQuery req, CancellationToken ct)
    {
        var s = await repo.GetByIdAsync(req.Id, ct);
        if (s is null) return null;
        return new SaleDto(
            s.Id, s.ClientId, s.Client?.Name,
            s.SaleDate, s.PaymentMethod, s.Total, s.CreatedAt,
            s.SaleItems.Select(i => new SaleItemDto(
                i.Id, i.ProductId, i.Product?.Name ?? "",
                i.Quantity, i.UnitPrice, i.SubTotal)));
    }
}

// ── CREATE SALE — decrements stock ────────────────────────────

public sealed record CreateSaleItemRequest(long ProductId, int Quantity);

public sealed record CreateSaleCommand(
    long? ClientId,
    DateTime SaleDate,
    string PaymentMethod,
    IEnumerable<CreateSaleItemRequest> Items) : IRequest<long>;

public sealed class CreateSaleValidator : AbstractValidator<CreateSaleCommand>
{
    public CreateSaleValidator()
    {
        RuleFor(x => x.PaymentMethod).NotEmpty();
        RuleFor(x => x.SaleDate).NotEmpty();
        RuleFor(x => x.Items).NotEmpty().WithMessage("La vente doit contenir au moins un produit.");
        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(i => i.ProductId).GreaterThan(0);
            item.RuleFor(i => i.Quantity).GreaterThan(0);
        });
    }
}

public sealed class CreateSaleHandler(
    ISaleRepository saleRepo,
    IProductRepository productRepo)
    : IRequestHandler<CreateSaleCommand, long>
{
    public async Task<long> Handle(CreateSaleCommand cmd, CancellationToken ct)
    {
        // 1. Create the sale header
        var sale = Sale.Create(cmd.ClientId, cmd.SaleDate, cmd.PaymentMethod);
        await saleRepo.AddAsync(sale, ct);
        await saleRepo.SaveChangesAsync(ct); // get sale.Id

        decimal total = 0;

        // 2. Process each item — decrement stock
        foreach (var item in cmd.Items)
        {
            var product = await productRepo.GetByIdAsync(item.ProductId, ct)
                ?? throw new KeyNotFoundException($"Produit ID {item.ProductId} introuvable.");

            product.DecreaseStock(item.Quantity); // throws if insufficient
            productRepo.Update(product);

            var saleItem = SaleItem.Create(sale.Id, product.Id, item.Quantity, product.SalePrice);
            total += saleItem.SubTotal;

            // Add to context via repo
            await saleRepo.AddSaleItemAsync(saleItem, ct);
        }

        // 3. Update total on the sale
        await saleRepo.UpdateTotalAsync(sale.Id, total, ct);
        await saleRepo.SaveChangesAsync(ct);

        return sale.Id;
    }
}

// ── DELETE SALE — restores stock ─────────────────────────────

public sealed record DeleteSaleCommand(long Id) : IRequest<bool>;

public sealed class DeleteSaleHandler(
    ISaleRepository saleRepo,
    IProductRepository productRepo)
    : IRequestHandler<DeleteSaleCommand, bool>
{
    public async Task<bool> Handle(DeleteSaleCommand cmd, CancellationToken ct)
    {
        var sale = await saleRepo.GetByIdAsync(cmd.Id, ct);
        if (sale is null) return false;

        // Restore stock for each item
        foreach (var item in sale.SaleItems)
        {
            var product = await productRepo.GetByIdAsync(item.ProductId, ct);
            if (product is not null)
            {
                product.IncreaseStock(item.Quantity);
                productRepo.Update(product);
            }
        }

        saleRepo.Delete(sale);
        await saleRepo.SaveChangesAsync(ct);
        return true;
    }
}
