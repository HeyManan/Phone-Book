module.exports = (sequelize, DataTypes) => {
  const GlobalInfo = sequelize.define("globalInfo", {
    name: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    savedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    spamLikelihood: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    spamCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  return GlobalInfo;
};
