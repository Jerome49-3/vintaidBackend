const jwt = require("jsonwebtoken");

const createToken = async (user) => {
  console.log("user in createToken:", user);

  const accessToken = jwt.sign(
    {
      email: user?.email,
      account: user?.account,
      newsletter: user?.newsletter,
      isAdmin: user?.isAdmin,
      emailIsConfirmed: user?.emailIsConfirmed,
      date: user?.date,
      loginFailed: user?.loginFailed,
      isLocked: user?.isLocked,
      passwordIsChanged: user?.passwordIsChanged,
      isOnline: user?.isOnline,
      // createdAt: user.createdAt,
      // expiresAt: user.expiresAt,
      _id: user?._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }
  );
  // console.log("accessToken in createToken:", accessToken);
  // Token de session (30mn)
  const refreshToken = jwt.sign({ _id: user?._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  // Token de rafraîchissement long (7 jours)
  // console.log("refreshToken in createToken:", refreshToken);
  const stateToken = jwt.sign({ _id: user?._id }, process.env.JWT_SECRET, {
    expiresIn: "30m",
  });
  // Token de session (30mn)
  return { accessToken, refreshToken, stateToken };
};

module.exports = createToken;
