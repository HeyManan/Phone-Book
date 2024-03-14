const db = require("../models");
const bcrypt = require("bcrypt");
const { JWTController } = require("./JWTController");

//Main Models

const GlobalInfo = db.globalInfos;
const User = db.users;

//Operations

const register = async (req, res) => {
  let user = await User.findOne({
    where: { phoneNumber: req.body.phoneNumber },
  });

  if (user)
    return res
      .status(400)
      .send("User with the entered phone number already exist.");

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  user = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    password: hashedPassword,
  };

  const registerUser = User.create(user);

  const token = JWTController.createToken(
    { phoneNumber: user.phoneNumber },
    true
  );

  res.cookie("refresh_token", token.refresh_token, {
    expires: new Date(Date.now() + 30 * 24 * 360000),
    httpOnly: true,
  });

  res.status(200).send({ ...registerUser, access_token: token.access_token });
  console.log(registerUser);
};

const login = async (req, res) => {
  let user = await User.findOne({
    where: { phoneNumber: req.body.phoneNumber },
  });

  if (!user) return res.status(404).send("Account does not exist.");

  if (bcrypt.compareSync(req.body.password, user.password)) {
    const token = JWTController.createToken(
      { phoneNumber: user.phoneNumber },
      true
    );

    res.cookie("refresh_token", token.refresh_token, {
      expires: new Date(Date.now() + 30 * 24 * 360000),
      httpOnly: true,
    });

    res.status(200).send({
      name: user.name,
      phoneNumber: user.phoneNumber,
      access_token: token.access_token,
    });
  } else {
    res.status(400).send("Incorrect Password");
  }
};

module.exports = {
  register,
  login,
};
