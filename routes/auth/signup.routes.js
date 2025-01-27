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

router.post("/signup", fileUpload(), async (req, res) => {
  console.log("je suis sur la route /signup");
  const { password, username, email, newsletter } = req.body;
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
          const user = await User.findOne({ email: email });
          console.log("userfindWithEmail in signup:", user);
          if (user) {
            return res
              .status(400)
              .json({ message: "email already exist: please login" });
          } else {
            try {
              // si password est egale à confirmPassword
              if (password) {
                //génerer le salt hash, token
                const salt = uid2(16);
                // console.log("salt in signup:", salt);
                const hash = SHA256(password + salt).toString(encBase64);
                // console.log("hash in signup:", hash);
                // const hash = await bcrypt.hash(password, 16);
                // console.log("hash in signup:", hash);
                // si le hash, token different de null
                const date = moment().format("DD MMM YYYY");
                console.log("date in /users:", date);
                if (hash !== null && hash !== undefined) {
                  if (req.body !== undefined) {
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
                    //verification de l'object user avant sauvegarde en BDD:
                    const code = generateCode(6);
                    console.log("code in /signup:", code);
                    console.log("typeof code in /signup:", typeof code);
                    user.code = code;
                    try {
                      const userValidation = userValid.parse(user);
                      console.log("userValidation in /signup:", userValidation);
                      if (userValid) {
                        await user.save();
                        sendEmail(user, username, email, code);
                        return res
                          .status(200)
                          .json(
                            "Merci de confirmer votre email, en entrant le code recu par mail, possiblement dans vos spams ou promotions ^_^"
                          );
                      }
                    } catch (error) {
                      console.log("error:", error);

                      return res.status(400).json({
                        error,
                        error: error.issues,
                        message: "Oops, somethings went wrong",
                      });
                    }
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
