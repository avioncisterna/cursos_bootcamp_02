const Sequelize = require('sequelize')

// 1. CREACIÓN DE LA BASE DE DATOS
const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
})

// 2. SINCRONIZACIÓN DE LA BASE DE DATOS
async function syncDB () {
  try {
    await db.authenticate()
    console.log('Conexión establecida exitosamente a la base de datos "db_jwtbootcamp"');
  }
  catch(error) {
    console.error('Imposible conectar a la base de datos "db_jwtbootcamp"', error)
  }
}
syncDB()

module.exports = db