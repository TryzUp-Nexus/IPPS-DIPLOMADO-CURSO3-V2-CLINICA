export const noEncontrado = (req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` })
}

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err)
  if (err.code === 11000) {
    const campo = Object.keys(err.keyValue ?? {})[0] ?? 'único'
    return res.status(409).json({ error: `El valor de ${campo} ya está registrado` })
  }
  if (err.name === 'ValidationError') {
    const mensajes = Object.values(err.errors).map(x => x.message)
    return res.status(400).json({ error: mensajes.join('; ') })
  }
  if (err.name === 'CastError') {
    return res.status(404).json({ error: 'Id no encontrado o inválido' })
  }
  if (err.type === 'entity.parse.failed' || (err instanceof SyntaxError && err.status === 400)) {
    return res.status(400).json({ error: 'JSON inválido en el cuerpo de la petición' })
  }
  if (err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ error: err.message })
  }
  console.error('Error interno:', err)
  res.status(500).json({ error: 'Error interno del servidor' })
}
