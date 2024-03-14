const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

let corOptions = {
  origin: "https://localhost:8081",
};

//Middlewares

app.use(cors(corOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//router

const globalInfoRouter = require("./routes/globalInfoRouter.js");
const userRouter = require("./routes/userRouter.js");
const { JWTController } = require("./controllers/JWTController.js");
app.use(
  "/api/globalInfo/",
  JWTController.verifyAccessToken.bind(JWTController),
  globalInfoRouter
);
// app.use("/api/globalInfo/", globalInfoRouter);
app.use("/api/user/", userRouter);

//Test API

app.get("/", (req, res) => {
  res.json({ message: "hello its working" });
});

//Server

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
