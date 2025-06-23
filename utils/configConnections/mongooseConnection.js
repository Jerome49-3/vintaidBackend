const mongooseConnection = async () => {
  try {
    const mongoose = require("mongoose");
    const conn = await mongoose
      .createConnection(process.env.MONGODB_URI)
      .asPromise();
    // console.log(
    //   "process.env.MONGODB_URI on mongooseConnection:",
    //   process.env.MONGODB_URI
    // );
    conn.readyState;
    conn.on("connected", () => {
      console.log("%cconnected mongoose:", "color: purple", conn.readyState);
    });
  } catch (error) {
    console.error("%cerrorConnection mongoose:", "color: purple", error);
  }
};
module.exports = mongooseConnection;
