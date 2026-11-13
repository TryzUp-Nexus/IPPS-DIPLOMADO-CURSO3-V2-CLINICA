import { Router } from 'express'
import { proteger } from '../middlewares/proteger.js'
import { validarObjectId } from '../middlewares/validarObjectId.js'
import * as controller from '../controllers/medico.controller.js'

export const medicoRoutes = Router()
medicoRoutes.use(proteger)
medicoRoutes.get('/', controller.listar)                         // GET /medicos?especialidad=...
medicoRoutes.get('/perfil', controller.perfil)                   // GET /medicos/perfil (antes de :id)
medicoRoutes.get('/:id/pacientes', validarObjectId, controller.pacientes)
medicoRoutes.get('/:id', validarObjectId, controller.obtener)
