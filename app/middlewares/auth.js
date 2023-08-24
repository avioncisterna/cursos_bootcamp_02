const express = require("express");
const jwt = require("jsonwebtoken");
const { Router } = require("express");
const bcrypt = require("bcrypt");

const { auth_required } = require("./middlewares");
const { User } = require("../models/index");

const authRouter = Router();

// 1. CREACIÓN DEL JWT: LOGIN
const userLogin = async (req, res, next) => {
  // 1.1 PARAMETROS DEL FORMULARIO
  const { email, password } = req.body;

  // 1.2 VERIFICACIÓN DEL USUSARIO EN LA BASE DE DATOS
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ err: "Usuario inexistente" });
  }

  // 1.3 VERIFICACIÓN DE LA CONTRASEÑA DEL USUARIO
  const son_iguales = await bcrypt.compare(password, user.password);
  if (!son_iguales) {
    return res.status(400).json({ err: "Contraseña incorrecta" });
  }

  // 1.4 CÁLCULO DE TIEMPO DE AUTORIZACIÓN
  const una_hora = Math.floor(new Date() / 1000) + 3600;

  // 1.5 CREACIÓN DEL TOKEN
  const token = jwt.sign(
    {
      exp: una_hora,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    },
    process.env.SECRET_KEY
  );

  // 1.6 RETORNO DEL TOKEN Y DATOS DEL USUARIO
  const responseData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  res.json(token);
  console.log(responseData);
};

// 2. CREACIÓN DEL JWT: SIGNUP
const verifySignUp = async (req, res, next) => {
  // 2.1 PARAMETROS DEL FORMULARIO
  const { firstName, lastName, email, password, pass_confirm } = req.body;

  // 2.2 VERIFICACIÓN DE CAMPOS (firstName, lastName, email, password, pass_conrifm)
  if (!firstName || !lastName || !email || !password || !pass_confirm) {
    return res.status(400).json({
      err: "Debe ingresar todos los campos",
    });
  }

  // 2.3 VERIFICACIÓN DE CONTRASEÑAS
  if (password != pass_confirm) {
    return res.status(400).json({
      err: "Las contraseñas no coinciden",
    });
  }

  // 2.4 VERIFICACIÓN DE UN EMAIL ÚNICO
  const oldUser = await User.findOne({ where: { email } });
  if (oldUser) {
    return res.status(400).json({
      err: "Ese email ya se encuentra registrado",
    });
  }

  // 2.5 CREACIÓN DE UN NUEVO USUARIO EN LA BASE DE DATOS
  let newUser;
  try {
    const password_encrypt = await bcrypt.hash(password, 10);
    console.log(password_encrypt);
    newUser = await User.create({
      firstName,
      lastName,
      email,
      password: password_encrypt,
    });
  } catch (error) {
    return res.status(400).json(error);
  }

  // 2.6 CREACIÓN DEL TOKEN CON ENVÍO AL USUARIO
  const una_hora = Math.floor(new Date() / 1000) + 3600;

  const token = jwt.sign(
    {
      exp: una_hora,
      data: {
        id: newUser.id,
        email,
        firstName,
        lastName,
      },
    },
    process.env.SECRET_KEY
  );

  // 2.7 RETORNO DEL TOKENR Y DATOS DEL USUARIO
   const responseData = {
    id: newUser.id,
    email: newUser.email,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
  };
res.json(token);
console.log(responseData);
};

// 3. LECTURA DEL JWT
const readToken = async (req, res, next) => {
  const { token } = req.body;
  
  let decoded;
  try {
    decoded = jwt.verify(token, llave_secreta);
  } catch (error) {
    return res.status(400).json(error);
  }
  res.json(decoded);
};

// 4. RUTA PROTEGIDA POR EL MIDDLEWARE "auth_required"
const myProfile = async (req, res, next) => {
  try {
    // 4.1 INFORMACIÓN PROVENIENTE DEL MIDDLEWARE
    const userId = req.data.id;
  
    // 4.2 OBTENER INFORMACIÓN DEL USUARIO POR SU ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ err: "Usuario no encontrado" });
    }
  
    // 4.3 SE DEVUELVE LA INFORMACIÓN DEL USUARIO
    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } catch (error) {
    res
      .status(500)
      .json({ err: "Error al obtener la información del usuario" });
  }
};

//RUTAS: CONTROLADOR DE AUTH
authRouter.post('/login', userLogin);
authRouter.post("/signup", verifySignUp);
authRouter.post('/read', readToken);
authRouter.get('/my', auth_required, myProfile);

// EXPORTS
module.exports = authRouter;
