const { DataTypes: dt } = require("sequelize");
const db = require("../config/sequelize.config");
const { User } = require("../models/users.model");
const { Bootcamp } = require("../models/bootcamps.model");

//RELACIONES – MANY TO MANY
User.belongsToMany(Bootcamp, { through: "UsersBootcamp", as: "bootcamps" });
Bootcamp.belongsToMany(User, { through: "UsersBootcamp", as: "users" });

//SYNC
try {
  db.sync();
  console.log('Conexión establecida exitosamente a la base de datos "db_jwtbootcamp"');
} catch (error) {
  console.log('Imposible contectar a la base de datos "db_jwtbootcamp"', error);
}

//EXPORTS
module.exports = {
  db,
  User,
  Bootcamp,
};