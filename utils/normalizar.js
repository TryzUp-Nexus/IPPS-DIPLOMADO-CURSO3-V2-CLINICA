// Funciones puras: facilitan las pruebas sin conexión a MongoDB.
export const normalizarRut = (rut) =>
  typeof rut === 'string' ? rut.replace(/\./g, '').replace(/\s/g, '').toUpperCase() : rut

const PREVISIONES = { fonasa: 'Fonasa', isapre: 'Isapre', particular: 'Particular' }
export const normalizarPrevision = (valor) => {
  if (typeof valor !== 'string') return valor
  const clave = valor.trim().toLowerCase()
  return PREVISIONES[clave] ?? valor.trim()
}

export const esRutConFormato = (rut) =>
  typeof rut === 'string' && /^\d{7,8}-[0-9K]$/.test(normalizarRut(rut))

export const escaparRegex = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, '\$&')
