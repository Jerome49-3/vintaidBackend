const moment = require("moment/moment.js");
moment.locale("fr");

const setLockAndCountLoginFailed = (user) => {
  //I increment user.loginFailed each time there is no match between mail and password
  user.loginFailed++;
  console.log("user.loginFailed on /login:", user.loginFailed);
  //if user.loginFailed equal three
  if (user.loginFailed === 3) {
    //i define a date and hour to unlock
    const lockUntil = moment().add(5, "minutes").toDate();
    console.log("lockUntil on setLockAndCountLoginFailed:", lockUntil);
    console.log(
      "typeof lockUntil on setLockAndCountLoginFailed:",
      typeof lockUntil
    );
    user.lockUntil = lockUntil;
    console.log(
      "user.lockUntil on setLockAndCountLoginFailed:",
      user.lockUntil
    );
    console.log(
      "user.loginFailed on setLockAndCountLoginFailed:",
      user.loginFailed
    );
    //i lock the user account
    user.isLocked = true;
    console.log("user.isLocked on setLockAndCountLoginFailed:", user.isLocked);
    //i define a date and hour when the user account was locked
    const lockDate = moment().toDate();
    console.log("lockDate on setLockAndCountLoginFailed:", lockDate);
    console.log(
      "typeof lockDate on setLockAndCountLoginFailed:",
      typeof lockDate
    );
    user.lockDate = lockDate;
  }
  return user;
};

module.exports = setLockAndCountLoginFailed;
