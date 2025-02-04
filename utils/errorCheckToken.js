const errorCheckToken = (error) => {
  try {
    let newError = {};
    // console.log("error:", error);
    // console.log("typeof error:", typeof error);
    // console.log("arrayisArray error:", Array.isArray(error));
    // console.log("errorKeys:", Object.keys(error));
    const errorArrKeys = Object.keys(error);
    const errorArrValues = Object.values(error);
    // console.log("errorArrValues:", errorArrValues);
    newError = {
      name: errorArrValues[0],
      message: errorArrValues[1],
      expiredAt: errorArrValues[2],
    };
    // console.log("newError:", newError);
    return newError;
  } catch (error) {
    console.error(error);
  }
};
module.exports = errorCheckToken;
