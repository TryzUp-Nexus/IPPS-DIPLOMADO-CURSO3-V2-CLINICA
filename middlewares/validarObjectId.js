import mongoose from 'mongoose'

export const validarObjectId = (req, res, next) => {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return res.status(404).json({ error: 'Id no encontrado o inválido' })
  }
  next()
}
