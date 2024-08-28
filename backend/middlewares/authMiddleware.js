const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const secret = process.env.JWT_SECRET
    JWT.verify(token, secret, (err, decode) => {
      if (err) {
        return res.status(200).send({
          message: "auth failed",
          success: false,
        });
      } else {
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      message: "auth failed",
      success: false,
    });
  }
};
