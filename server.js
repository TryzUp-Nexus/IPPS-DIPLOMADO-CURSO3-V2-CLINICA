import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { conectar } from './config/db.js'
import { obtenerJwtSecret } from './config/jwt.js'
import { authRoutes } from './routes/auth.routes.js'
import { medicoRoutes } from './routes/medico.routes.js'
import { pacienteRoutes } from './routes/paciente.route.js'
import { errorHandler, noEncontrado } from './middlewares/errorHandler.js'
import { Medico } from './models/medico.model.js'
import { Paciente } from './models/paciente.model.js'

const app = express()
app.disable('x-powered-by')
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.status(200).json({ mensaje: 'API Clínica funcionando', version: '1.0.0' }))
app.use('/auth', authRoutes)
app.use('/medicos', medicoRoutes)
app.use('/pacientes', pacienteRoutes)
app.use(noEncontrado)
app.use(errorHandler)

const puerto = Number(process.env.PORT) || 3001
try {
  obtenerJwtSecret() // Fallar antes de levantar si no hay secreto seguro.
  await conectar()
  // Esperar índices únicos antes de permitir solicitudes (email y RUT).
  await Promise.all([Medico.init(), Paciente.init()])
  app.listen(puerto, () => console.log(`🚀 API Clínica en http://localhost:${puerto}`))
} catch (error) {
  console.error('❌ No se pudo iniciar la API:', error.message)
  process.exit(1)
}
