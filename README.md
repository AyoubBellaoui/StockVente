# 🧾 StockVente — Application de Gestion Stock & Ventes

## ✅ Prérequis
| Outil | Téléchargement | Vérification |
|-------|---------------|--------------|
| .NET 9 SDK | https://dotnet.microsoft.com/download/dotnet/9.0 | `dotnet --version` → `9.x.x` |
| Node.js LTS | https://nodejs.org | `node --version` → `v20+` |
| SQL Server | https://www.microsoft.com/sql-server (Express = gratuit) | Démarrer le service SQL Server |

---

## ⚙️ ÉTAPE 1 — Configure la connexion SQL Server

Ouvre : `backend/appsettings.json`

```json
"Default": "Server=localhost;Database=StockVenteDb;Trusted_Connection=True;TrustServerCertificate=True;"
```

Si SQL Express :
```json
"Default": "Server=localhost\\SQLEXPRESS;Database=StockVenteDb;Trusted_Connection=True;TrustServerCertificate=True;"
```

> ✅ La base de données et TOUTES les tables sont créées automatiquement au premier `dotnet run`.
> Plus besoin de créer les tables manuellement — `EnsureCreated()` s'en charge.

---

## 🚀 ÉTAPE 2 — Lance le backend

```bash
cd backend
dotnet run
```

Résultat attendu :
```
Now listening on: http://localhost:5000
```

Swagger : **http://localhost:5000/swagger**

---

## 🌐 ÉTAPE 3 — Lance le frontend

```bash
cd frontend
npm install
npm start
```

Application : **http://localhost:4200**

---

## 📱 Pages disponibles

| URL | Page |
|-----|------|
| /dashboard | Tableau de bord + stats + ruptures |
| /products | Liste produits avec recherche/filtre |
| /products/create | Créer un produit |
| /products/edit/:id | Modifier un produit |
| /sales | Liste des ventes avec filtre date |
| /sales/create | Créer une vente (table dynamique) |
| /sales/:id | Détail d'une vente |
| /clients | Liste des clients |
| /clients/create | Créer un client |

---

## ⚡ Règles métier importantes

- **Créer une vente** → stock décrémenté automatiquement
- **Supprimer une vente** → stock remis à jour automatiquement
- **Stock insuffisant** → erreur retournée par l'API (ne laisse pas passer)
- **Produits épuisés** → non affichés dans le formulaire de vente

---

## 📁 Architecture (Clean Architecture — 1 seul .csproj)

```
backend/
├── Domain/Entities/          ← Product, Client, Sale, SaleItem
├── Application/              ← Handlers MediatR, DTOs, Interfaces
│   ├── Products/
│   ├── Sales/
│   ├── Clients/
│   └── Dashboard/
├── Infrastructure/           ← EF Core, Repositories
│   ├── Data/AppDbContext.cs
│   └── Repositories/
└── API/Controllers/          ← REST Controllers

frontend/
└── src/app/
    ├── core/services/        ← Tous les services HTTP
    ├── features/
    │   ├── dashboard/
    │   ├── products/         ← list + form
    │   ├── sales/            ← list + form + detail
    │   └── clients/          ← list + form
    └── app.component.ts      ← Shell + sidebar
```
