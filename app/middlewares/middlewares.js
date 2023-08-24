const jwt = require('jsonwebtoken')

const llave_secreta = 'topsecret'

function auth_required (req, res, next) {
  // RUTA SOLAMENTE PARA USUARIOS LOGUEADOS
  // SI EL TOKEN SE ABRE, SE ASUME QUE EL USUARIO SÍ ESTÁ LOGUEADO

  // 1. VERIFICACIÓN DEL TOKEN VÁLIDO
  const {authorization} = req.headers
  
  let decoded;
  try {
    decoded = jwt.verify(authorization, process.env.SECRET_KEY)
  }
  catch(error) {
    console.log('error en la decodificacion', error)
    return res.status(400).json(error)
  }
  // 2. VERIFICACIÓN DEL TIEMPO DE EXPIRACIÓN DEL TOKEN
  const now = (new Date() / 1000)
  if (now > decoded.exp) {
    console.log({now}, {exp: decoded.exp})
    return res.status(401).json({
      err: 'Tu token expiró'
    })
  }
  // 3. SE GUARDA EL USUARIO EN EL OBJETO "request"
  req.data = decoded.data
  // 4. SE SIGUE SI TODO ESTÁ OK.
  next()
}

// EXPORTS
module.exports = {auth_required, llave_secreta}