const jwt = require("jsonwebtoken");

const createToken = async (user) => {
  // Token d'accès court (2 minutes)
  const accessToken = jwt.sign(
    {
      _id: user._id,
      account: user.account,
      isAdmin: user.isAdmin,
      newsletter: user.newsletter,
      isLocked: user.isLocked,
    },
    process.env.SRV_KEY_SECRET,
    { expiresIn: "30m" }
  );

  // Token de rafraîchissement long (7 jours)
  const refreshToken = jwt.sign({ _id: user._id }, process.env.SRV_KEY_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

module.exports = createToken;
