import mongoose from 'mongoose'
import { normalizarRut, normalizarPrevision, esRutConFormato } from '../utils/normalizar.js'

const pacienteSchema = new mongoose.Schema({
  nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
  apellido: { type: String, trim: true },
  rut: { type: String, required: [true, 'El RUT es obligatorio'], unique: true, set: normalizarRut,
    validate: { validator: esRutConFormato, message: 'Formato de RUT inválido (ejemplo: 12345678-5)' } },
  edad: { type: Number, min: [0, 'La edad no puede ser negativa'], max: [130, 'Edad fuera de rango'] },
  prevision: { type: String, enum: { values: ['Fonasa', 'Isapre', 'Particular'], message: 'Previsión inválida' },
    default: 'Fonasa', set: normalizarPrevision },
  telefono: { type: String, trim: true },
  diagnostico: { type: String, trim: true },
  medico: { type: mongoose.Schema.Types.ObjectId, ref: 'Medico', required: true, immutable: true },
}, { timestamps: true })

export const Paciente = mongoose.model('Paciente', pacienteSchema, 'pacientes')
