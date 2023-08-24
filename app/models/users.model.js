const { DataTypes: dt } = require("sequelize");
const db = require("../config/sequelize.config");

const User = db.define(
  "Users",
  {
    firstName: {
      type: dt.STRING,
      allowNull: false,
    },
    lastName: {
      type: dt.STRING,
      allowNull: false,
    },
    email: {
      type: dt.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          args: [true],
          msg: "Debe ingresar un correo válido",
        },
      },
    },
    password: {
      type: dt.STRING,
      allowNull: false,
    },
    foto: {
      type: dt.STRING,
    },
  },
  { timestamps: true }
);

//EXPORT
module.exports = { User };
