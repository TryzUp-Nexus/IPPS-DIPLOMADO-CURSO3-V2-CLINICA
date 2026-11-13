import { Medico } from '../models/medico.model.js'
import { Paciente } from '../models/paciente.model.js'
import { escaparRegex } from '../utils/normalizar.js'

export const listarMedicos = ({ especialidad } = {}) => {
  const filtro = especialidad?.trim()
    ? { especialidad: new RegExp(`^${escaparRegex(especialidad.trim())}$`, 'i') }
    : {}
  return Medico.find(filtro).select('-password').sort({ nombre: 1 })
}
export const buscarPorId = (id) => Medico.findById(id).select('-password')
export const pacientesDeMedico = (id) => Paciente.find({ medico: id })
  .populate('medico', 'nombre especialidad email')
  .sort({ createdAt: -1 })
