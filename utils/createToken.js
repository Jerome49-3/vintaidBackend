const jwt = require("jsonwebtoken");

const createToken = async (user) => {
  // console.log("user in createToken:", user);

  const accessToken = jwt.sign(
    {
      email: user.email,
      account: user.account,
      newsletter: user.newsletter,
      isAdmin: user.isAdmin,
      becomeAdmin: user.becomeAdmin,
      emailIsConfirmed: user.emailIsConfirmed,
      date: user.date,
      loginFailed: user.loginFailed,
      isLocked: user.isLocked,
      createdAt: user.createdAt,
      // expiresAt: user.expiresAt,
      _id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }
  );
  // console.log("accessToken in createToken:", accessToken);
  // Token de rafraîchissement long (7 jours)
  const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  // console.log("refreshToken in createToken:", refreshToken);
  return { accessToken, refreshToken };
};

module.exports = createToken;
