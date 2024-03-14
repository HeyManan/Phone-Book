const { JWTController } = require("../controllers/JWTController.js");
const userController = require("../controllers/userController.js");

const router = require("express").Router();

router.post("/register", userController.register);

router.post("/login", userController.login);

router.get(
  "/new_access_token",
  JWTController.grantNewAccessToken.bind(JWTController)
);

module.exports = router;
