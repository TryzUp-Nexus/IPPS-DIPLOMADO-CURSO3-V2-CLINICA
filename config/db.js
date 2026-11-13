import mongoose from 'mongoose'

export const conectar = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('Falta MONGODB_URI en el archivo .env')
  }
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 })
  console.log('✅ MongoDB conectado: ' + mongoose.connection.name)
}
