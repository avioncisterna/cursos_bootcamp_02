const { Router } = require("express");
const { User, Bootcamp } = require("../models/index");
const { auth_required } = require("../middlewares/middlewares");

const bootcampController = Router();

// 1. POST – Crear y guardar un nuevo Bootcamp llamado "createBootcamp". (OK)
const createBootcamp = async (req, res) => {
  try {
    const { title, cue, description } = req.body;
    const nuevoBootcamp = await Bootcamp.create({
      title,
      cue,
      description,
    });
    res.status(201).json({ bootcamp: nuevoBootcamp });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear el bootcamp", message: error.message });
  }
};

// 2. POST – Agregar un Usuario al Bootcamp llamado "addUserToBootcamp".
const addUserToBootcamp = async (req, res) => {
  try {
    const { idUser, idBootcamp } = req.body;
    const bootcamp = await Bootcamp.findByPk(idBootcamp, {
        include: [{ model: User, as: 'users' }],
    });
    const user = await User.findByPk(idUser);
    if (!bootcamp || !user) {
      return res
        .status(404)
        .json({ error: "Bootcamp o usuario no encontrado" });
    }
    await bootcamp.addUser(user);
    res.status(200).json({ message: "Usuario agregado correctamente al bootcamp", user });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al agregar al usuario al bootcamp", message: error.message });
  }
};

// 3. GET – Obtener los Bootcamp de un usuario llamado "findBootcampById". (OK)
const findBootcampById = async (req, res) => {
  try {
    const { id } = req.params;
    const bootcamp = await Bootcamp.findByPk(id, {
      include: [{ model: User, as: 'users' }],
    });
    if (!bootcamp) {
      return res.status(404).json({ error: "Bootcamp no encontrado" });
    }
    res.status(200).json({ bootcamp });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al encontrar el bootcamp",
        message: error.message,
      });
  }
};

// 4. GET – Obtener todos los Usuarios incluyendo los Bootcamp llamado "findAllBootcamps". (OK)
const findAllBootcamps = async (req, res) => {
  try {
    const bootcamps = await Bootcamp.findAll({
      include: [{ model: User, as: 'users' }],
    });
    return res.status(200).json({ bootcamps });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear el usuario", message: error.message });
  }
};

// 5. PUT – Actualizar Bootcamp llamado "updateBootcampById ". (OK)
const updateBootcampById = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, cue, description } = req.body;
    const bootcamp = await Bootcamp.findByPk(id);
    if (!bootcamp) {
      return res.status(404).json({ error: "Bootcamp no encontrado" });
    }
    await bootcamp.update({
      title,
      cue,
      description,
    });
    res.status(200).json({ message: "Bootcamp modificado con éxito", bootcamp: bootcamp });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener al bootcamp", message: error.message });
  }
};

// 6. DELETE – Eliminar un Bootcamp por Id llamado "deleteBootcampById". (OK)
const deleteBootcampById = async (req, res) => {
  try {
    const { id } = req.params;
    const bootcamp = await Bootcamp.findByPk(id);
    if (!bootcamp) {
      return res.status(404).json({ error: "Bootcamp no encontrado" });
    }
    await Bootcamp.destroy({
      where: { idBootcamp: id },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar el bootcamp",
      message: error.message,
    });
  }
};

//RUTAS: CONTROLADOR DE BOOTCAMPS
bootcampController.post("/bootcamp", auth_required, createBootcamp);
bootcampController.post("/bootcamp/adduser", auth_required, addUserToBootcamp);
bootcampController.get("/bootcamp/:id", auth_required, findBootcampById);
bootcampController.get("/bootcamp", findAllBootcamps);
bootcampController.put("/bootcamp/:id", auth_required, updateBootcampById);
bootcampController.delete("/bootcamp/:id", auth_required, deleteBootcampById);

//EXPORTS
module.exports = bootcampController;
