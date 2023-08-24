const { Router } = require("express");
const bcrypt = require("bcrypt");
const { User, Bootcamp } = require("../models/index");
const { auth_required } = require("../middlewares/middlewares");

const userController = Router();

// 1. POST – Crear y guardar usuarios llamado "createUser". (OK)
const createUser = async (req, res) => {
  const { firstName, lastName, email, password, foto } = req.body;

  // 1.1 VERIFICACIÓN DE UN EMAIL ÚNICO
  const oldUser = await User.findOne({ where: { email } });
  if (oldUser) {
    return res.status(400).json({
      err: "Ese email ya se encuentra registrado",
    });
  }

  // 1.2 CREACIÓN DE UN NUEVO USUARIO EN LA BASE DE DATOS
  let newUser;
  try {
    const password_encrypt = await bcrypt.hash(password, 10);
    console.log(password_encrypt);
    newUser = await User.create({
      firstName,
      lastName,
      email,
      password: password_encrypt,
      foto,
    });
  } catch (error) {
    return res.status(400).json(error);
  }
  return res.json({ newUser });
};

// 2. GET – Obtener los Bootcamp de un usuario llamado "findUserById". (OK)
const findUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      include: [{ model: Bootcamp, as: "bootcamps" }],
    });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json({ user: user });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al encontrar el usuario", message: error.message });
  }
};

// 3. GET – Obtener todos los Usuarios incluyendo, los Bootcamp llamado "findAllUsers".
const findAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Bootcamp, as: "bootcamps" }],
    });
    res.status(200).json({ users });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al encontrar el usuario", message: error.message });
  }
};

// 4. PUT – Actualizar usuario por Id llamado "updateUserById". (OK)
const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, password } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado", message: error.message });
    }

    // 4.1 ENCRIPTACIÓN DE LA CONTRASEÑA
    let password_encrypt = user.password;
    if (password) {
      password_encrypt = await bcrypt.hash(password, 10);
    };
    await user.update({
      firstName,
      lastName,
    });
    res.status(200).json({ message: "Usuario modificado con éxito", user: user });
  } catch (error) {
    res.status(500).json({error: "Error al modificar al usuario", message: error.message })
  };
};

// 5. DELETE – Eliminar un usuario por Id llamado "deleteUserById". (OK)
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    await User.destroy({
      where: { id },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar el usuario",
      message: error.message,
    });
  }
};

//RUTAS: CONTROLADOR DE USUARIOS
userController.post("/user", createUser);
userController.get("/user/:id", auth_required, findUserById);
userController.get("/user", auth_required, findAllUsers);
userController.put("/user/:id", auth_required, updateUserById);
userController.delete("/user/:id", auth_required, deleteUserById);

//EXPORTS
module.exports = userController;
