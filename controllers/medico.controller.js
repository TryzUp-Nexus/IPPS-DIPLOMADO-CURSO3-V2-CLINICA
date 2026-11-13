import * as service from '../services/medico.service.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { HttpError } from '../utils/HttpError.js'

export const listar = asyncHandler(async (req, res) => {
  res.status(200).json(await service.listarMedicos({ especialidad: req.query.especialidad }))
})
export const perfil = asyncHandler(async (req, res) => {
  const medico = await service.buscarPorId(req.medico.id)
  if (!medico) throw new HttpError(404, 'Médico no encontrado')
  res.status(200).json(medico)
})
export const obtener = asyncHandler(async (req, res) => {
  const medico = await service.buscarPorId(req.params.id)
  if (!medico) throw new HttpError(404, 'Médico no encontrado')
  res.status(200).json(medico)
})
export const pacientes = asyncHandler(async (req, res) => {
  const medico = await service.buscarPorId(req.params.id)
  if (!medico) throw new HttpError(404, 'Médico no encontrado')
  if (req.medico.id !== req.params.id) throw new HttpError(403, 'Solo puedes consultar tus pacientes')
  res.status(200).json(await service.pacientesDeMedico(req.params.id))
})
