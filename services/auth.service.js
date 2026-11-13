import jwt from 'jsonwebtoken'
import { Medico } from '../models/medico.model.js'
import { JWT_EXPIRA, obtenerJwtSecret } from '../config/jwt.js'

const firmarToken = (medico) => jwt.sign(
  { id: medico._id.toString(), email: medico.email },
  obtenerJwtSecret(),
  { expiresIn: JWT_EXPIRA },
)

export const registrar = async ({ nombre, especialidad, email, password }) => {
  const medico = await Medico.create({ nombre, especialidad, email, password })
  return { medico, token: firmarToken(medico) }
}

export const login = async (email, password) => {
  const medico = await Medico.findOne({ email: email.trim().toLowerCase() })
  if (!medico) return null
  const coincide = await medico.compararPassword(password)
  if (!coincide) return null
  return { medico, token: firmarToken(medico) }
}
