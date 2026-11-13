import { Paciente } from '../models/paciente.model.js'
import { normalizarPrevision } from '../utils/normalizar.js'

const DETALLE_MEDICO = 'nombre especialidad email'
const CAMPOS_EDITABLES = ['nombre', 'apellido', 'rut', 'edad', 'prevision', 'telefono', 'diagnostico']
const seleccionarCampos = (datos) => Object.fromEntries(
  CAMPOS_EDITABLES.filter(k => Object.prototype.hasOwnProperty.call(datos, k)).map(k => [k, datos[k]]),
)

export const crearPaciente = (datos, medicoId) => {
  const permitido = seleccionarCampos(datos)
  // Ignoramos datos.medico: la autoridad viene exclusivamente del JWT.
  return Paciente.create({ ...permitido, medico: medicoId })
}
export const listarPacientes = (medicoId, prevision) => {
  const filtro = { medico: medicoId }
  if (typeof prevision === 'string' && prevision.trim()) filtro.prevision = normalizarPrevision(prevision)
  return Paciente.find(filtro).populate('medico', DETALLE_MEDICO).sort({ createdAt: -1 })
}
export const buscarPorId = (id) => Paciente.findById(id)
export const completarPaciente = (paciente) => paciente.populate('medico', DETALLE_MEDICO)
export const actualizarPaciente = async (paciente, datos) => {
  const cambios = seleccionarCampos(datos)
  Object.assign(paciente, cambios)
  await paciente.save() // activa todas las validaciones de Mongoose
  return completarPaciente(paciente)
}
export const eliminarPaciente = (paciente) => paciente.deleteOne()
