import * as service from '../services/paciente.service.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { HttpError } from '../utils/HttpError.js'

const revisarTitularidad = (paciente, medicoId) => {
  if (!paciente) throw new HttpError(404, 'Paciente no encontrado')
  if (paciente.medico.toString() !== medicoId) {
    throw new HttpError(403, 'Solo el médico tratante puede acceder o modificar este paciente')
  }
}

export const crear = asyncHandler(async (req, res) => {
  const paciente = await service.crearPaciente(req.body ?? {}, req.medico.id)
  res.status(201).json(await service.completarPaciente(paciente))
})
export const listar = asyncHandler(async (req, res) => {
  res.status(200).json(await service.listarPacientes(req.medico.id, req.query.prevision))
})
export const obtener = asyncHandler(async (req, res) => {
  const paciente = await service.buscarPorId(req.params.id)
  revisarTitularidad(paciente, req.medico.id)
  res.status(200).json(await service.completarPaciente(paciente))
})
export const actualizar = asyncHandler(async (req, res) => {
  const paciente = await service.buscarPorId(req.params.id)
  revisarTitularidad(paciente, req.medico.id)
  res.status(200).json(await service.actualizarPaciente(paciente, req.body ?? {}))
})
export const eliminar = asyncHandler(async (req, res) => {
  const paciente = await service.buscarPorId(req.params.id)
  revisarTitularidad(paciente, req.medico.id)
  await service.eliminarPaciente(paciente)
  res.status(200).json({ mensaje: 'Paciente eliminado correctamente' })
})
