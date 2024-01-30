const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(400).json([{ msg: "Token is not present" }]);
  } else {
    try {
      const decoded = jwt.verify(token, config.get("secretKey"));
      req.user = decoded.user;
      console.log("🚀 ~ decoded:", decoded);
      next();
    } catch (error) {
      res.status(401).json([{ msg: "Token not Valid" }]);
      console.log(err);
    }
  }
};
