const { DataTypes: dt } = require("sequelize");
const db = require("../config/sequelize.config");

//BOOTCAMP
const Bootcamp = db.define(
  "Bootcamp",
  {
    title: {
      type: dt.STRING,
      allowNull: false,
    },
    cue: {
      type: dt.INTEGER,
      allowNull: false,
      validate: {
        min: 5,
        max: 20,
      },
    },
    description: {
      type: dt.STRING,
      allowNull: false,
    },
  },
  { timestamps: true }
);

//EXPORT
module.exports = { Bootcamp };