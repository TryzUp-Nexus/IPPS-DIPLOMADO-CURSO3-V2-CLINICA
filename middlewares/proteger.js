import jwt from 'jsonwebtoken'
import { Medico } from '../models/medico.model.js'
import { obtenerJwtSecret } from '../config/jwt.js'

export const proteger = async (req, res, next) => {
  const autorizacion = req.headers.authorization
  if (!autorizacion || !/^Bearer\s+\S+$/.test(autorizacion)) {
    return res.status(401).json({ error: 'Falta el token Bearer' })
  }
  try {
    const token = autorizacion.split(' ')[1]
    const payload = jwt.verify(token, obtenerJwtSecret())
    if (!payload.id) return res.status(401).json({ error: 'Token inválido' })
    const existe = await Medico.exists({ _id: payload.id })
    if (!existe) return res.status(401).json({ error: 'Médico del token ya no existe' })
    req.medico = { id: payload.id, email: payload.email }
    return next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError' || error.name === 'CastError') {
      return res.status(401).json({ error: 'Token inválido o expirado' })
    }
    return next(error)
  }
}
