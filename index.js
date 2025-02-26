//************ CONFIG DOTENV *****************//
require("dotenv").config();

//************ CONFIG EXPRESS *****************//
const express = require("express");
const app = express();
app.use(express.json());

//************ CONFIG CORS *****************//
const cors = require("cors");
if (process.env.NODE_ENV === "developpement") {
  console.log("process.env.NODE_ENV on index.js:", process.env.NODE_ENV);
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  );
} else {
  app.use(
    cors({
      origin: "https://vintaid.netlify.app",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  );
}
//************ COOKIE-PARSER *****************//
// a verifier si encore utiliser > car remplacer par jwt si not use > remove lib and import
const cookieParser = require("cookie-parser");
app.use(cookieParser());
//************ COOKIE *****************//
const cookie = require("cookie");
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
//************ JWT *****************//
const jwt = require("jsonwebtoken");
//************ MODELS *****************//
const Offer = require("./models/Offer.js");
const User = require("./models/User.js");
//************ MODELS *****************//
const checkToken = require("./utils/checkToken.js");
const errorCheckToken = require("./utils/errorCheckToken.js");
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
const clients = {};
let cookObj = {};
wss.on("connection", (connection, request) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`)
    .pathname;
  // console.log("pathname:", pathname);

  const offerId = pathname.split("/")[2]; // Récupère l'ID de l'offre
  console.log(`Nouvelle connexion WebSocket pour l'offre ${offerId}`);

  if (offerId) {
    // const recipientId = offer.owner;
  }

  connection.on("message", (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      // console.log(`Message reçu pour l'offre ${offerId}:`, parsedMessage);

      // Répercuter le message à tous les clients connectés à cette offre
      wss.clients.forEach((client) => {
        // console.log("wss.clients:", wss.clients);
        // console.log("client:", client);
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
// //******** CALL MIDDLEWARE RATELIMITED ********//
// const isRateLimited = require("./middleware/isRateLimited.js");
// app.use(isRateLimited);
//************ CONFIG ROUTES *****************//
//Auth
const signupRoutes = require("./routes/auth/signup.routes.js");
const confirmEmail = require("./routes/auth/confirmEmail.routes.js");
const loginRoutes = require("./routes/auth/login.routes.js");
const verifToken = require("./routes/auth/verifyToken.routes.js");
const refreshToken = require("./routes/auth/refresh.routes.js");
const logOut = require("./routes/auth/logOut.routes.js");
//Offers
const offerPost = require("./routes/offer/offerPost.routes.js");
const offerGet = require("./routes/offer/offerGet.routes.js");
const offerID = require("./routes/offer/offersID.routes.js");
const myOffers = require("./routes/myOffers/myOffers.routes");
//Payment
const payment = require("./routes/payment/payment.routes.js");
const confirmPayment = require("./routes/payment/confirmPayment.routes.js");
//Transactions
const transactions = require("./routes/transactions/transactions.routes.js");
const mypurchases = require("./routes/mypurchases/mypurchases.routes.js");
const transactionsId = require("./routes/transactions/transactionsId.routes.js");
//Users
const users = require("./routes/users/users.routes.js");
const userIdGet = require("./routes/users/userIdGet.routes.js");
const userIdPut = require("./routes/users/userIdPut.routes.js");
const userIdDel = require("./routes/users/userIdDel.routes.js");
//Profile
const profilGet = require("./routes/profile/profileGet.routes.js");
const profilPut = require("./routes/profile/profilePut.routes.js");
const profilDel = require("./routes/profile/profileDel.routes.js");
//Messages
const messagesPost = require("./routes/messages/messagesPost.routes.js");
const messagesGet = require("./routes/messages/messagesGet.routes.js");
//mails
const sendCode = require("./routes/emails/sendCode.routes.js");
const contact = require("./routes/emails/contact.routes");

//************ CALL ROUTES *****************//
//Auth
app.use("/user", signupRoutes);
app.use("/user", confirmEmail);
app.use("/user", loginRoutes);
app.use("/user", verifToken);
app.use("/user", refreshToken);
app.use("/user", logOut);
//Offers
app.use(offerPost);
app.use(offerGet);
app.use(offerID);
app.use(myOffers);
//Payment
app.use(payment);
app.use(confirmPayment);
//Users
app.use(users);
app.use(userIdGet);
app.use(userIdPut);
app.use(userIdDel);
//Transactions
app.use(transactions);
app.use(mypurchases);
app.use(transactionsId);

//ProfileUSer
app.use(profilGet);
app.use(profilPut);
app.use(profilDel);
//Messages
app.use(messagesPost);
app.use(messagesGet);
//mails
app.use("/sendMail", sendCode);
app.use("/sendMail", contact);

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
