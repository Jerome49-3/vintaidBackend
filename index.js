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
// const Offer = require("./models/Offer.js");
// const User = require("./models/User.js");

//************ utilitaires persos *****************//
// const checkToken = require("./utils/checkToken.js");
// const errorCheckToken = require("./utils/errorCheckToken.js");
//************ CONFIG WEBSOCKET *****************//
const WebSocket = require("ws");
const http = require("http");

// Création du serveur HTTP avant son utilisation
const server = http.createServer(app);
// console.log(`server:`, server);
const wss = new WebSocket.Server({ noServer: true });
// console.log(`wss:`, wss);

// mongoose.connection.once("open", () => {
//   console.log("Connexion Mongoose établie");

//   const User = mongoose.connection.collection("User");
//   const Offer = mongoose.connection.collection("Offer");
//   const Contact = mongoose.connection.collection("Contact");

//   const setupChangeStream = (collection, eventType) => {
//     const changeStream = collection.watch();

//     changeStream.on("change", (change) => {
//       console.log(`Change detected in ${collection.name}:`, {
//         operationType: change.operationType,
//         documentKey: change.documentKey,
//       });

//       wss.clients.forEach((client) => {
//         client.send(
//           JSON.stringify({
//             type: eventType,
//             timestamp: new Date().toISOString(),
//           })
//         );
//       });
//     });

//     changeStream.on("error", (error) => {
//       console.error(`Error in ${collection.name} change stream:`, error);
//     });

//     return changeStream;
//   };

//   const changeStreamUsers = setupChangeStream(User, "REFRESH_USERS");
//   const changeStreamOffers = setupChangeStream(Offer, "REFRESH_OFFERS");
//   const changeStreamContacts = setupChangeStream(Contact, "REFRESH_CONTACT");
// });
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
  // const reqHeaders = request.headers;
  // console.log("reqHeaders in index.js on wss:", reqHeaders);
  console.log("request.headers.cookie:", request.headers.cookie);
  const reqHeadersCook = request.headers.cookie;
  const cookies = cookie.parse(reqHeadersCook);
  console.log("cookies in index.js:", cookies);
  const token = cookies.accessTokenV;
  if (!token) {
    connection.close();
  }

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
// //******** CALL MIDDLEWARE express-rate-limit ********//
// const { rateLimit } = require("express-rate-limit");
// const authLimit = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
//   message: { error: "Too many requests, please try again later." },
//   keyGenerator: (req, res) => {
//     console.log("req.ip in keyGenerator on authLimit:", req.ip);

//     req.ip;
//   },
// });
// const otherLimit = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
//   message: { error: "Too many requests, please try again later." },
//   keyGenerator: (req, res) => {
//     console.log("req.ip in keyGenerator on otherLimit:", req.ip);

//     req.ip;
//   },
// });

//************ CONFIG ROUTES *****************//
//Auth
const signupRoutes = require("./routes/auth/signup.routes.js");
const confirmEmail = require("./routes/auth/confirmEmail.routes.js");
const loginRoutes = require("./routes/auth/login.routes.js");
const verifToken = require("./routes/auth/verifyToken.routes.js");
const refreshToken = require("./routes/auth/refresh.routes.js");
const logOut = require("./routes/auth/logOut.routes.js");
//Offers
const offersPost = require("./routes/offers/POST/offersPost.routes.js");
const offersGet = require("./routes/offers/GET/offersGet.routes.js");
//offerId
const offerIdGet = require("./routes/offerId/GET/offersID.routes.js");
const offerIdDel = require("./routes/offerId/DELETE/offerIdDel.routes.js");
const offerIdPut = require("./routes/offerId/PUT/offerIdPut.routes.js");
//myOffers
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
//UserId
const userIdGet = require("./routes/userId/GET/userIdGet.routes.js");
const userIdPut = require("./routes/userId/PUT/userIdPut.routes.js");
const userIdDel = require("./routes/userId/DEL/userIdDel.routes.js");
//Profile
const profilGet = require("./routes/profile/GET/profileGet.routes.js");
const profilPut = require("./routes/profile/PUT/profilePut.routes.js");
const profilDel = require("./routes/profile/DEL/profileDel.routes.js");
//Messages
const messagesPost = require("./routes/messagesChat/POST/messagesPost.routes.js");
const messagesGet = require("./routes/messagesChat/GET/messagesGet.routes.js");
const messagesContactGet = require("./routes/messagesContact/GET/messagesContact.routes.js");
const mssgContactIdGet = require("./routes/messagesContact/GET/messagesContactId.routes.js");
const mssgContactIdPost = require("./routes/messagesContact/POST/messageContactId.routes.js");
//mails
const sendCode = require("./routes/sendMail/sendCode.routes.js");
const sendCodeId = require("./routes/sendMail/sendCodeId.routes.js");
const sendContact = require("./routes/sendMail/sendContact.routes.js");
//resendEmailPsswd
const resendEmailPsswd = require("./routes/resendEmailPsswd/resendEmailPsswd.routes.js");
//forgotPsswd
const sendForgotPsswd = require("./routes/auth/forgotPsswd.routes.js");
//favorites
const addFav = require("./routes/updateFavOffer/addFavOffer.route.js");
const suppFav = require("./routes/updateFavOffer/suppFavOffer.route.js");

//************ CALL ROUTES *****************//
//Auth
// app.use("/user", authLimit);
app.use("/user", signupRoutes);
app.use("/user", confirmEmail);
app.use("/user", loginRoutes);
app.use("/user", verifToken);
app.use("/user", refreshToken);
app.use("/user", logOut);
app.use("/user", sendForgotPsswd);
//Offers
app.use(offersPost);
app.use(offersGet);
//OfferId
app.use(offerIdGet);
app.use(offerIdDel);
app.use(offerIdPut);
//myOffers
app.use(myOffers);
//Payment
app.use(payment);
app.use(confirmPayment);
//Users
app.use(users);
//UserID
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
app.use(messagesContactGet);
app.use(mssgContactIdGet);
app.use(mssgContactIdPost);
//code
app.use(sendCode);
//sendMail
app.use("/sendMail", sendCode);
app.use("/sendMail", sendCodeId);
app.use("/sendMail", sendContact);

//resendEmailPsswd
app.use(resendEmailPsswd);

//favorites
app.use(addFav);
app.use(suppFav);

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
