const db = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

//Main Models

const GlobalInfo = db.globalInfos;
const User = db.users;

//Operations

const addGlobalInfo = async (req, res) => {
  let info = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    savedBy: req.body.id,
  };

  const globalInfo = await GlobalInfo.create(info);
  res.status(200).send(globalInfo);
  console.log(globalInfo);
};

const getAllGlobalInfo = async (req, res) => {
  let globalInfos = await GlobalInfo.findAll({});
  res.status(200).send(globalInfos);
};

const getGlobalInfo = async (req, res) => {
  let id = req.params.id;
  let globalInfo = await GlobalInfo.findOne({ where: { id: id } });
  res.status(200).send(globalInfo);
};

const updateGlobalInfo = async (req, res) => {
  let id = req.params.id;
  const globalInfo = await GlobalInfo.update(req.body, { where: { id: id } });
  res.status(200).send(globalInfo);
};

const deleteGlobalInfo = async (req, res) => {
  let id = req.params.id;
  await GlobalInfo.destroy({ where: { id: id } });
  res.status(200).send("Information deleted successfully.");
};

const searchByName = async (req, res) => {
  let searchString = req.body.searchString;

  let info = await GlobalInfo.findAll(
    {
      attributes: ["name", "phoneNumber", "spamLikelihood"],
    },
    {
      where: {
        name: {
          [Op.like]: `%${searchString}%`, // LIKE '%sample_fruit_string%'
        },
      },
    }
  );
  res.status(200).send(info);
};

const searchByNumber = async (req, res) => {
  let reqPhoneNumber = req.body.phoneNumber;

  let info = await User.findOne(
    {
      attributes: ["id", "name", "phoneNumber"],
    },
    {
      where: {
        phoneNumber: reqPhoneNumber,
      },
    }
  );

  if (!info) {
    info = await GlobalInfo.findAll(
      {
        attributes: ["name", "phoneNumber", "spamLikelihood"],
      },
      {
        where: {
          phoneNumber: reqPhoneNumber,
        },
      }
    );

    res.status(200).send(info);
  } else {
    let spamLikelihood = await GlobalInfo.findOne(
      {
        attributes: ["spamLikelihood"],
      },
      {
        where: {
          phoneNumber: info.PhoneNumber,
          name: info.name,
          savedBy: info.id,
        },
      }
    );

    res.status(200).send({ ...info, ...spamLikelihood });
  }
};

const markSpam = async (req, res) => {
  let globalUser = await GlobalInfo.findAll(
    {
      attributes: ["id", "spamCount"],
    },
    {
      where: {
        phoneNumber: req.body.phoneNumber,
      },
    }
  );

  if (!globalUser) {
    globalUser = {
      phoneNumber: req.body.phoneNumber,
      savedBy: req.body.id,
      spamCount: 1,
    };
    await GlobalInfo.create(globalUser);
    res.status(200).send(globalUser);
  } else {
    for (let i = 0; i < globalUser.size; i++) {
      await GlobalInfo.update(
        { spamCount: globalUser[i].spamCount + 1 },
        { where: { id: globalUser[i].id } }
      );

      if (globalUser.spamCount >= 4)
        await GlobalInfo.update(
          { spamLikelihood: true },
          { where: { id: globalUser[i].id } }
        );
    }

    res.status(200).send("Marked Spam");
  }
};

const unMarkSpam = async (req, res) => {
  let globalUser = await GlobalInfo.findAll(
    {
      attributes: ["id", "spamCount"],
    },
    {
      where: {
        phoneNumber: req.body.phoneNumber,
      },
    }
  );

  for (let i = 0; i < globalUser.size; i++) {
    await GlobalInfo.update(
      { spamCount: globalUser[i].spamCount - 1 },
      { where: { id: globalUser[i].id } }
    );

    if (globalUser.spamCount <= 5)
      await GlobalInfo.update(
        { spamLikelihood: false },
        { where: { id: globalUser[i].id } }
      );
  }

  res.status(200).send("UnMarked Spam");
};

module.exports = {
  addGlobalInfo,
  getAllGlobalInfo,
  getGlobalInfo,
  updateGlobalInfo,
  deleteGlobalInfo,
  searchByName,
  searchByNumber,
  markSpam,
  unMarkSpam,
};
