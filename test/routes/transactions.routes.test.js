// Import de Supertest
const request = require("supertest");

// Import d'Express
const express = require("express");

// Import des routes
const transactionsRoutes = require("../../routes/transactions/transactions.routes");

// Import model
const Transactions = require("../../models/Transactions");

// Mock du middleware `isAuthenticated`
// Remplace le middleware réel par une version simulée qui injecte un utilisateur fictif
jest.mock("../../../middleware/isAuthenticated.js", () => (req, res, next) => {
  req.user = { id: "mockUserId", name: "Mock User" };
  next();
});

// Mock du modèle Mongoose `Transactions`
// Permet de remplacer les méthodes `find`, `findById`, etc., par des versions simulées
jest.mock("../../../models/Transactions");

// Création d'une instance de l'application Express
const app = express();
app.use(express.json()); // Middleware pour analyser les requêtes JSON
app.use(transactionsRoutes); // Attache les routes de transactions à l'application

// Début des tests pour la route /transactions
describe("transactions", () => {
  // Réinitialisation des mocks après chaque test
  afterEach(() => {
    jest.clearAllMocks(); // Réinitialise les appels sur les fonctions simulées
  });

  // Test de la route GET /transactions
  test("GET /transactions - retourne toutes les transactions", async () => {
    // Création d'un tableau de transactions simulées, correspondant au modèle
    const mockTransactions = [
      {
        _id: "1",
        product_name: "Produit A",
        product_price: 100,
        seller: { id: "seller1", name: "Vendeur A" },
        buyer: { id: "buyer1", name: "Acheteur A" },
        product_id: "63f2b9b8f9d2c9001cba2e7b",
        buyer_address: { city: "Paris", postal_code: "75001" },
        date: "2025-01-01",
      },
      {
        _id: "2",
        product_name: "Produit B",
        product_price: 200,
        seller: { id: "seller2", name: "Vendeur B" },
        buyer: { id: "buyer2", name: "Acheteur B" },
        product_id: "63f2b9b8f9d2c9001cba2e7c",
        buyer_address: { city: "Lyon", postal_code: "69001" },
        date: "2025-01-02",
      },
    ];

    // Simule le comportement de `Transactions.find` pour retourner les transactions simulées
    Transactions.find.mockResolvedValue(mockTransactions);

    // Envoie une requête GET à l'endpoint /transactions via Supertest
    const response = await request(app).get("/transactions");

    // Vérifie que le statut HTTP de la réponse est 200
    expect(response.status).toBe(200);

    // Vérifie que le corps de la réponse contient les transactions simulées
    expect(response.body).toEqual(mockTransactions);

    // Vérifie que `Transactions.find` a été appelée exactement une fois
    expect(Transactions.find).toHaveBeenCalledTimes(1);
  });

  // Test de la route GET /transactions/:id
  test("GET /transactions/:id - retourne une transaction spécifique", async () => {
    // Création d'une transaction simulée, correspondant au modèle
    const mockTransaction = {
      _id: "1",
      product_name: "Produit A",
      product_price: 100,
      seller: { id: "seller1", name: "Vendeur A" },
      buyer: { id: "buyer1", name: "Acheteur A" },
      product_id: "63f2b9b8f9d2c9001cba2e7b",
      buyer_address: { city: "Paris", postal_code: "75001" },
      date: "2025-01-01",
    };

    // Simule le comportement de `Transactions.findById` pour retourner la transaction simulée
    Transactions.findById.mockResolvedValue(mockTransaction);

    // Envoie une requête GET à /transactions/1
    const response = await request(app).get("/transactions/1");

    // Vérifie que le statut HTTP de la réponse est 200: ok
    expect(response.status).toBe(200);

    // Vérifie que la réponse contient la transaction
    expect(response.body).toEqual(mockTransaction);

    // Vérifie que `Transactions.findById` a été appelée avec l'ID "1"
    expect(Transactions.findById).toHaveBeenCalledWith("1");

    // Vérifie que `Transactions.findById` a été appelée exactement une fois
    expect(Transactions.findById).toHaveBeenCalledTimes(1);
  });
});
