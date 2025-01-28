//************ CONFIG DOTENV *****************//
require("dotenv").config();

//************ CONFIG EXPRESS *****************//
const express = require("express");
const app = express();
app.use(express.json());

//************ CONFIG CORS *****************//
const cors = require("cors");
app.use(
  cors({
    origin: "https://vintaid.netlify.app",
    credentials: true,
  })
);

//************ CONFIG MONGOOSE *****************//
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);

//************ CONFIG STRIPE *****************//
const stripe = require("stripe")(process.env.STRIPE_KEY_SECRET);

//************ CONFIG CLOUDINARY *****************//
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

//************ CONFIG WEBSOCKET *****************//
const WebSocket = require("ws");
const http = require("http");

// Création du serveur HTTP avant son utilisation
const server = http.createServer(app);
// console.log(`server:`, server);
const wss = new WebSocket.Server({ noServer: true });
// console.log(`wss:`, wss);

server.on("upgrade", (request, socket, head) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`)
    .pathname;

  if (pathname.startsWith("/messages/")) {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

wss.on("connection", (connection, request) => {
  // console.log("${request.headers.host}:", `${request.headers.host}`);

  const pathname = new URL(request.url, `http://${request.headers.host}`)
    .pathname;
  // console.log("pathname:", pathname);

  const offerId = pathname.split("/")[2]; // Récupère l'ID de l'offre
  console.log(`Nouvelle connexion WebSocket pour l'offre ${offerId}`);

  connection.on("message", (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      // console.log(`Message reçu pour l'offre ${offerId}:`, parsedMessage);

      // Répercuter le message à tous les clients connectés à cette offre
      wss.clients.forEach((client) => {
        if (client !== connection && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ offerId, ...parsedMessage }));
        }
      });
    } catch (error) {
      console.error("Erreur lors du traitement du message:", error);
    }
  });

  connection.on("close", () => {
    console.log(`Connexion WebSocket fermée pour l'offre ${offerId}`);
  });
});

//************ CONFIG ROUTES *****************//
//Auth
const signupRoutes = require("./routes/auth/signup.routes");
const confirmEmail = require("./routes/auth/confirmEmail.routes");
const loginRoutes = require("./routes/auth/login.routes");
//Offers
const offerPost = require("./routes/offer/offerPost.routes");
const offerGet = require("./routes/offer/offerGet.routes");
const myOffers = require("./routes/myOffers/myOffers.routes");
//Payment
const payment = require("./routes/payment/payment.routes");
const confirmPayment = require("./routes/payment/confirmPayment.routes");
//Transactions
const transactions = require("./routes/transactions/transactions.routes");
const mypurchases = require("./routes/mypurchases/mypurchases.routes");
//Users
const users = require("./routes/users/users");
const userIdGet = require("./routes/users/userIdRoads/userIdGet.routes.js");
const userPutDel = require("./routes/users/userIdRoads/userIdPutDel.routes.js");
//Profile
const profilRoadGet = require("./routes/users/profileRoads/profileGet.routes.js");
const profilRoadPut = require("./routes/users/profileRoads/profilePut.routes.js");
//Messages
const messagesPost = require("./routes/messages/messagesPost.routes.js");

//************ CALL ROUTES *****************//
//Auth
app.use("/user", signupRoutes);
app.use("/user", confirmEmail);
app.use("/user", loginRoutes);
//Offers
app.use(offerPost);
app.use(offerGet);
app.use(myOffers);
//Payment
app.use(payment);
app.use(confirmPayment);
//Users
app.use(users);
app.use(userPutDel);
app.use(userIdGet);
//Transactions
app.use(transactions);
app.use(mypurchases);
//Messages
app.use(messagesPost);
//ProfileUSer
app.use(profilRoadGet);
app.use(profilRoadPut);

//************ BASIC ROUTES *****************//
app.get("/", (req, res) => {
  return res
    .status(200)
    .json({ message: "welcome to my replica of the vinted website" });
});

app.all("*", (req, res) => {
  console.log("all routes");
  res.status(404).json({ message: "All routes" });
});

// Utilisation correcte de server.listen après sa déclaration
server.listen(process.env.PORT, () => {
  console.log("Server started on port:", process.env.PORT);
});
