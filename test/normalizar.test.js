import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizarRut, normalizarPrevision, esRutConFormato, escaparRegex } from '../utils/normalizar.js'

test('RUT se normaliza sin puntos y con DV mayúscula', () => {
  assert.equal(normalizarRut('12.345.678-k'), '12345678-K')
})
test('RUT acepta 7 u 8 dígitos y guion con DV', () => {
  assert.equal(esRutConFormato('12.345.678-5'), true)
  assert.equal(esRutConFormato('rut malo'), false)
})
test('Previsión normalizada coincide con enum', () => {
  assert.equal(normalizarPrevision(' FONASA '), 'Fonasa')
  assert.equal(normalizarPrevision('isapre'), 'Isapre')
})
test('Especialidad no puede inyectar expresiones regulares', () => {
  assert.equal(escaparRegex('Medicina.*'), 'Medicina\.\*')
})
