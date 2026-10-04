using MediatR;
using Microsoft.AspNetCore.Mvc;
using StockVente.Application.Sales;

namespace StockVente.API.Controllers;

[ApiController]
[Route("api/sales")]
public sealed class SalesController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
        => Ok(await mediator.Send(new GetAllSalesQuery(), ct));

    [HttpGet("{id:long}")]
    public async Task<IActionResult> GetById(long id, CancellationToken ct)
    {
        var r = await mediator.Send(new GetSaleByIdQuery(id), ct);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSaleCommand cmd, CancellationToken ct)
    {
        var id = await mediator.Send(cmd, ct);
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Delete(long id, CancellationToken ct)
    {
        var ok = await mediator.Send(new DeleteSaleCommand(id), ct);
        return ok ? NoContent() : NotFound();
    }
}
