const jwt = require("jsonwebtoken");

const checkToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

module.exports = checkToken;
