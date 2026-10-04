using FluentValidation;
using MediatR;
using StockVente.Application.Common;
using StockVente.Domain.Entities;

namespace StockVente.Application.Clients;

public sealed record GetAllClientsQuery : IRequest<IEnumerable<ClientDto>>;

public sealed class GetAllClientsHandler(IClientRepository repo)
    : IRequestHandler<GetAllClientsQuery, IEnumerable<ClientDto>>
{
    public async Task<IEnumerable<ClientDto>> Handle(GetAllClientsQuery _, CancellationToken ct)
        => (await repo.GetAllAsync(ct)).Select(c => new ClientDto(c.Id, c.Name, c.Phone, c.Email, c.Address));
}

public sealed record CreateClientCommand(
    string Name, string? Phone, string? Email, string? Address) : IRequest<long>;

public sealed class CreateClientValidator : AbstractValidator<CreateClientCommand>
{
    public CreateClientValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
    }
}

public sealed class CreateClientHandler(IClientRepository repo)
    : IRequestHandler<CreateClientCommand, long>
{
    public async Task<long> Handle(CreateClientCommand cmd, CancellationToken ct)
    {
        var c = Client.Create(cmd.Name, cmd.Phone, cmd.Email, cmd.Address);
        await repo.AddAsync(c, ct);
        await repo.SaveChangesAsync(ct);
        return c.Id;
    }
}

public sealed record UpdateClientCommand(
    long Id, string Name, string? Phone, string? Email, string? Address) : IRequest<bool>;

public sealed class UpdateClientHandler(IClientRepository repo)
    : IRequestHandler<UpdateClientCommand, bool>
{
    public async Task<bool> Handle(UpdateClientCommand cmd, CancellationToken ct)
    {
        var c = await repo.GetByIdAsync(cmd.Id, ct);
        if (c is null) return false;
        c.Update(cmd.Name, cmd.Phone, cmd.Email, cmd.Address);
        repo.Update(c);
        await repo.SaveChangesAsync(ct);
        return true;
    }
}

public sealed record DeleteClientCommand(long Id) : IRequest<bool>;

public sealed class DeleteClientHandler(IClientRepository repo)
    : IRequestHandler<DeleteClientCommand, bool>
{
    public async Task<bool> Handle(DeleteClientCommand cmd, CancellationToken ct)
    {
        var c = await repo.GetByIdAsync(cmd.Id, ct);
        if (c is null) return false;
        repo.Delete(c);
        await repo.SaveChangesAsync(ct);
        return true;
    }
}
