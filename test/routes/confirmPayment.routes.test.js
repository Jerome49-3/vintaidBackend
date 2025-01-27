// Import de Supertest
const request = require("supertest");

// Import d'Express
const express = require("express");

// Import des routes
const confirmPaymentRoutes = require("../../routes/payment/confirmPayment.routes.js");

//instance d'express
const app = express();
app.use(express.json());
app.use(transactionsRoutes);

// Import des models
const User = require("../../models/User.js");
const Offer = require("../../models/Offer.js");
const Transactions = require("../../models/Transactions.js");

// Mock du middleware `isAuthenticated`
// Remplace le middleware réel par une version simulée qui injecte un utilisateur fictif
jest.mock("../../../middleware/isAuthenticated.js", () => (req, res, next) => {
  req.user = { id: "mockUserId", name: "Mock User" };
  next();
});
// mock des models
jest.mock("../../../models/Offer.js");
jest.mock("../../../models/User.js");
jest.mock("../../../models/Transactions.js");

// desbut des tests pour la route /confirmPayment
describe("confirmPayment", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
});

test(" POST /confirmPayment", async () => {
  const buyer_address = '{ city: "Paris", postal_code: "75001" }';
  const parsedAddress = JSON.parse(buyer_address);

  // Vérifiez que l'objet retourné par JSON.parse est correct
  expect(parsedAddress).toEqual({ city: "Paris", postal_code: "75001" });
  // création d'un objet newTransactions:
  const newTransactions = {
    _id: "1",
    product_name: "Produit A",
    product_price: 100,
    seller: { id: "seller1", name: "Vendeur A" },
    buyer: { id: "buyer1", name: "Acheteur A" },
    product_id: "63f2b9b8f9d2c9001cba2e7b",
    buyer_address: { city: "Paris", postal_code: "75001" },
    date: "2025-01-01",
  };
  Transactions.create.mockResolvedValue(newTransactions);
  // Envoie une requête POST à /transactions/1
  const response = await request(app)
    .post("/confirmPayment")
    .send(newTransactions);
  // Vérifie que le statut HTTP de la réponse est 201, object crée
  expect(response.status).toBe(201);
  // Vérifie que la réponse contient la transaction
  expect(response.body).toEqual(newTransactions);

  // transactions crée avec la valeur newTransactions
  expect(Transactions.create).toHaveBeenCalledWith(newTransactions);
});
