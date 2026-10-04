using FluentValidation;
using MediatR;
using StockVente.Application.Common;
using StockVente.Domain.Entities;

namespace StockVente.Application.Products;

// ── QUERIES ──────────────────────────────────────────────────

public sealed record GetAllProductsQuery : IRequest<IEnumerable<ProductDto>>;

public sealed class GetAllProductsHandler(IProductRepository repo)
    : IRequestHandler<GetAllProductsQuery, IEnumerable<ProductDto>>
{
    public async Task<IEnumerable<ProductDto>> Handle(GetAllProductsQuery _, CancellationToken ct)
        => (await repo.GetAllAsync(ct)).Select(Map);

    public static ProductDto Map(Product p) => new(
        p.Id, p.Name, p.Description, p.Category,
        p.PurchasePrice, p.SalePrice, p.Quantity,
        p.ImageUrl, p.CreatedAt);
}

public sealed record GetProductByIdQuery(long Id) : IRequest<ProductDto?>;

public sealed class GetProductByIdHandler(IProductRepository repo)
    : IRequestHandler<GetProductByIdQuery, ProductDto?>
{
    public async Task<ProductDto?> Handle(GetProductByIdQuery req, CancellationToken ct)
    {
        var p = await repo.GetByIdAsync(req.Id, ct);
        return p is null ? null : GetAllProductsHandler.Map(p);
    }
}

// ── COMMANDS ─────────────────────────────────────────────────

public sealed record CreateProductCommand(
    string Name, string? Description, string Category,
    decimal PurchasePrice, decimal SalePrice,
    int Quantity, string? ImageUrl) : IRequest<long>;

public sealed class CreateProductValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MinimumLength(2).MaximumLength(100);
        RuleFor(x => x.Category).NotEmpty();
        RuleFor(x => x.PurchasePrice).GreaterThanOrEqualTo(0);
        RuleFor(x => x.SalePrice).GreaterThan(0);
        RuleFor(x => x.Quantity).GreaterThanOrEqualTo(0);
    }
}

public sealed class CreateProductHandler(IProductRepository repo)
    : IRequestHandler<CreateProductCommand, long>
{
    public async Task<long> Handle(CreateProductCommand cmd, CancellationToken ct)
    {
        var p = Product.Create(cmd.Name, cmd.Description, cmd.Category,
            cmd.PurchasePrice, cmd.SalePrice, cmd.Quantity, cmd.ImageUrl);
        await repo.AddAsync(p, ct);
        await repo.SaveChangesAsync(ct);
        return p.Id;
    }
}

public sealed record UpdateProductCommand(
    long Id, string Name, string? Description, string Category,
    decimal PurchasePrice, decimal SalePrice,
    int Quantity, string? ImageUrl) : IRequest<bool>;

public sealed class UpdateProductValidator : AbstractValidator<UpdateProductCommand>
{
    public UpdateProductValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
        RuleFor(x => x.Name).NotEmpty().MinimumLength(2).MaximumLength(100);
        RuleFor(x => x.Category).NotEmpty();
        RuleFor(x => x.PurchasePrice).GreaterThanOrEqualTo(0);
        RuleFor(x => x.SalePrice).GreaterThan(0);
        RuleFor(x => x.Quantity).GreaterThanOrEqualTo(0);
    }
}

public sealed class UpdateProductHandler(IProductRepository repo)
    : IRequestHandler<UpdateProductCommand, bool>
{
    public async Task<bool> Handle(UpdateProductCommand cmd, CancellationToken ct)
    {
        var p = await repo.GetByIdAsync(cmd.Id, ct);
        if (p is null) return false;
        p.Update(cmd.Name, cmd.Description, cmd.Category,
            cmd.PurchasePrice, cmd.SalePrice, cmd.Quantity, cmd.ImageUrl);
        repo.Update(p);
        await repo.SaveChangesAsync(ct);
        return true;
    }
}

public sealed record DeleteProductCommand(long Id) : IRequest<bool>;

public sealed class DeleteProductHandler(IProductRepository repo)
    : IRequestHandler<DeleteProductCommand, bool>
{
    public async Task<bool> Handle(DeleteProductCommand cmd, CancellationToken ct)
    {
        var p = await repo.GetByIdAsync(cmd.Id, ct);
        if (p is null) return false;
        repo.Delete(p);
        await repo.SaveChangesAsync(ct);
        return true;
    }
}
