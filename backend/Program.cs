using FluentValidation;
using Microsoft.EntityFrameworkCore;
using StockVente.Application.Common;
using StockVente.Infrastructure.Data;
using StockVente.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// ── MediatR ───────────────────────────────────────────────────
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));

// ── FluentValidation ─────────────────────────────────────────
builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);

// ── EF Core ───────────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

// ── Repositories ─────────────────────────────────────────────
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IClientRepository,  ClientRepository>();
builder.Services.AddScoped<ISaleRepository,    SaleRepository>();

// ── CORS ─────────────────────────────────────────────────────
builder.Services.AddCors(o => o.AddPolicy("Angular", p =>
    p.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod()));

// ── Web ───────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ── CREATE DATABASE & TABLES AUTOMATICALLY ────────────────────
// EnsureCreated() reads the entity configurations and creates
// the database + all tables if they don't exist yet.
// No migration files needed — works on first run every time.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated(); // ← THIS replaces dotnet ef migrations
}

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("Angular");
app.MapControllers();
app.Run();
