using MediatR;
using Microsoft.AspNetCore.Mvc;
using StockVente.Application.Clients;
using StockVente.Application.Dashboard;

namespace StockVente.API.Controllers;

[ApiController]
[Route("api/clients")]
public sealed class ClientsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
        => Ok(await mediator.Send(new GetAllClientsQuery(), ct));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateClientCommand cmd, CancellationToken ct)
    {
        var id = await mediator.Send(cmd, ct);
        return Created($"/api/clients/{id}", new { id });
    }

    [HttpPut("{id:long}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateClientCommand cmd, CancellationToken ct)
    {
        var ok = await mediator.Send(cmd with { Id = id }, ct);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Delete(long id, CancellationToken ct)
    {
        var ok = await mediator.Send(new DeleteClientCommand(id), ct);
        return ok ? NoContent() : NotFound();
    }
}

[ApiController]
[Route("api/dashboard")]
public sealed class DashboardController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken ct)
        => Ok(await mediator.Send(new GetDashboardQuery(), ct));
}
