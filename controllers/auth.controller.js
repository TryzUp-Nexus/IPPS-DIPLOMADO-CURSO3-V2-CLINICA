import * as service from '../services/auth.service.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { HttpError } from '../utils/HttpError.js'

export const registrar = asyncHandler(async (req, res) => {
  const { nombre, especialidad, email, password } = req.body ?? {}
  if (![nombre, especialidad, email, password].every(v => typeof v === 'string' && v.trim())) {
    throw new HttpError(400, 'Nombre, especialidad, email y password son obligatorios')
  }
  const resultado = await service.registrar({ nombre, especialidad, email, password })
  res.status(201).json(resultado)
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body ?? {}
  if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
    throw new HttpError(400, 'Email y password son obligatorios')
  }
  const resultado = await service.login(email, password)
  if (!resultado) throw new HttpError(401, 'Credenciales incorrectas')
  res.status(200).json(resultado)
})
