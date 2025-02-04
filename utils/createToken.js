const jwt = require("jsonwebtoken");

const createToken = async (user) => {
  console.log("user in createToken:", user);

  const accessToken = jwt.sign(
    {
      _id: user._id,
      account: user.account,
      isAdmin: user.isAdmin,
      newsletter: user.newsletter,
      isLocked: user.isLocked,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }
  );
  console.log("accessToken in createToken:", accessToken);
  // Token de rafraîchissement long (7 jours)
  const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  console.log("refreshToken in createToken:", refreshToken);
  return { accessToken, refreshToken };
};

module.exports = createToken;
