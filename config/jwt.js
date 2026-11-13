export const JWT_EXPIRA = process.env.JWT_EXPIRA || '2h'

export const obtenerJwtSecret = () => {
  const secreto = process.env.JWT_SECRET
  if (!secreto || secreto.length < 24 || secreto.startsWith('REEMPLAZA')) {
    throw new Error('Configura JWT_SECRET (mínimo 24 caracteres) en .env')
  }
  return secreto
}
