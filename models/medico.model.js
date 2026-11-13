import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const medicoSchema = new mongoose.Schema({
  nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
  especialidad: { type: String, required: [true, 'La especialidad es obligatoria'], trim: true },
  email: { type: String, required: [true, 'El email es obligatorio'], unique: true, lowercase: true, trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email inválido'] },
  password: { type: String, required: [true, 'La contraseña es obligatoria'], minlength: [6, 'Mínimo 6 caracteres'] },
}, { timestamps: true })

// El hash se aplica antes de guardar; en consultas nunca devolvemos la contraseña.
medicoSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

medicoSchema.methods.compararPassword = function (passwordPlano) {
  return bcrypt.compare(passwordPlano, this.password)
}

medicoSchema.methods.toJSON = function () {
  const objeto = this.toObject()
  delete objeto.password
  delete objeto.__v
  return objeto
}

export const Medico = mongoose.model('Medico', medicoSchema, 'medicos')
