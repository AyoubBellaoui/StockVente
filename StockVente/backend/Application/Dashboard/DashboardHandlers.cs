using MediatR;
using StockVente.Application.Common;
using StockVente.Application.Products;

namespace StockVente.Application.Dashboard;

public sealed record GetDashboardQuery : IRequest<DashboardDto>;

public sealed class GetDashboardHandler(
    IProductRepository productRepo,
    ISaleRepository saleRepo)
    : IRequestHandler<GetDashboardQuery, DashboardDto>
{
    public async Task<DashboardDto> Handle(GetDashboardQuery _, CancellationToken ct)
    {
        var products = (await productRepo.GetAllAsync(ct)).ToList();
        var sales    = (await saleRepo.GetAllAsync(ct)).ToList();

        var outOfStock = products.Where(p => p.Quantity == 0).ToList();

        return new DashboardDto(
            TotalProducts:      products.Count,
            TotalSales:         sales.Count,
            TotalRevenue:       sales.Sum(s => s.Total),
            OutOfStockCount:    outOfStock.Count,
            OutOfStockProducts: outOfStock.Select(GetAllProductsHandler.Map));
    }
}
