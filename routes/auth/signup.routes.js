const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const { SHA256 } = require("crypto-js");
const encBase64 = require("crypto-js/enc-base64");
const fileUpload = require("express-fileupload");
const moment = require("moment/moment.js");
const CryptoJS = require("crypto-js");
// const bcrypt = require('bcrypt');
// const saltRounds = 16;
const jwt = require("jsonwebtoken");
// const Mailgun = require("mailgun.js");
// const formData = require("form-data");
const { Resend } = require("resend");
// console.log("resend:", Resend);
const resend = new Resend(process.env.RESEND_API_KEY);
const validEmailAndUsername = require("../../utils/zod/validEmailAndUsername");
const userValid = require("../../utils/zod/userValid");

//models
const User = require("../../models/User");
//utils
const sendEmail = require("../../utils/sendEmail");
const generateCode = require("../../utils/generateCode");
const { message } = require("statuses");

router.post("/signup", fileUpload(), async (req, res) => {
  console.log("je suis sur la route /signup");
  if (!req.body) {
    return res.status(400).json({ message: "Oups, something went wrong" });
  }
  const { password, username, email, newsletter } = req.body;
  if ((!username, !email, !password)) {
    return res.status(400).json({ message: "Oups, something went wrong" });
  }
  console.log(
    "password in signup:",
    password,
    "\n",
    "username in signup:",
    username,
    "\n",
    "email in signup:",
    email,
    "\n",
    "newsletter in signup:",
    newsletter
  );
  //si le champ username est vide, renvoyer un status Http400
  // if (username.length === 0) {
  //   return res
  //     .status(400)
  //     .json({ message: "un champ du formulaire est manquant" });
  // }
  if (req.body) {
    try {
      const emailAndUsernameAreValid = validEmailAndUsername.parse(req.body);
      if (emailAndUsernameAreValid) {
        //si le mot de passe est differend d'undefined
        if (password !== undefined && email !== undefined) {
          //i check if user exist
          const user = await User.findOne({ email: email });
          console.log("userfindWithEmail in signup:", user);
          if (user) {
            return res
              .status(400)
              .json({ message: "email already exist: please login" });
          } else {
            try {
              // if password equal confirmPassword
              if (password) {
                //i create: salt hash, token
                const salt = uid2(16);
                // console.log("salt in signup:", salt);
                const hash = SHA256(password + salt).toString(encBase64);
                // console.log("hash in signup:", hash);
                // const hash = await bcrypt.hash(password, 16);
                // console.log("hash in signup:", hash);
                // if hash and token is different from null
                const date = moment().format("L");
                console.log("date in /users:", date);
                if (hash !== null && hash !== undefined) {
                  const user = new User({
                    email: email,
                    account: {
                      username: username,
                    },
                    newsletter: newsletter,
                    hash: hash,
                    salt: salt,
                    date: date,
                  });
                  console.log("newUser in /signup:", user);
                  //check object user before saving in the BDD:
                  try {
                    // I check the object user structure with the Zod library
                    const userValidation = userValid.parse(user);
                    console.log("userValidation in /signup:", userValidation);
                    if (userValid) {
                      // I assign the result of the sendEmail function
                      const resultSendEmail = await sendEmail(user);
                      console.log(
                        "resultSendEmail in /signup:",
                        resultSendEmail
                      );
                      await user.save();
                      return res.status(200).json({
                        message:
                          "Merci de confirmer votre email, en entrant le code recu par mail, possiblement dans vos spams ou promotions ^_^",
                      });
                    }
                  } catch (error) {
                    console.log("error:", error);

                    return res.status(400).json({
                      error,
                      error: error.issues,
                      message: "Oops, somethings went wrong",
                    });
                  }
                } else {
                  return res.status(400).json({
                    message: "les mots de passe ne correspondent pas",
                  });
                }
              }
            } catch (error) {
              console.log(error);
              console.log(error.message);
              console.log(error.status);
            }
          }
        }
      }
    } catch (error) {
      return res.status(400).json({
        error: error.issues,
        message: "Oops, somethings went wrong",
      });
    }
  }
});

module.exports = router;
