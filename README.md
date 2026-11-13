# API REST de Clínica — Evaluación 2 · Módulo 3

**Diplomado Full Stack · Instituto Profesional San Sebastián**  
**Tecnologías:** Node.js · Express · MongoDB Atlas · Mongoose · JSON Web Token (JWT)

## Descripción

API REST para la gestión de médicos y pacientes de una clínica. Permite registrar e iniciar sesión como médico, consultar médicos y administrar pacientes mediante rutas protegidas. Cada paciente está asociado a un **médico tratante**, quien es el único autorizado para consultar sus detalles, actualizarlo o eliminarlo.

Este desarrollo continúa el [repositorio de clase proporcionado por el profesor](https://github.com/ivandress/IPPS-DIPLOMADO-CURSO3-V2-CLINICA), conservando su estructura por capas.

## Funcionalidades implementadas

- Registro de médicos e inicio de sesión con contraseñas protegidas mediante `bcryptjs` y autenticación con **JWT**.
- Consulta de médicos, perfil autenticado, filtro por especialidad y listado de pacientes asociados a un médico.
- Modelo **Paciente** con campos obligatorios, RUT único, previsión validada y valor predeterminado `Fonasa`.
- Relación entre paciente y médico mediante `ObjectId`, `ref: 'Medico'` y uso de `populate()` para consultar información del médico sin exponer su contraseña.
- CRUD de pacientes con acceso restringido al médico tratante.
- Respuestas JSON y códigos HTTP según el resultado de cada operación.
- Pruebas funcionales mediante una colección de Postman incluida en el repositorio.

## Arquitectura del proyecto

```text
config/         Conexión a MongoDB y configuración JWT
models/         Esquemas Mongoose de médicos y pacientes
services/       Consultas y lógica de negocio
controllers/    Gestión de solicitudes y respuestas HTTP
routes/         Definición de endpoints
middlewares/   Autenticación, validación de IDs y errores
utils/          Funciones auxiliares
postman/        Colección de pruebas de la API
test/           Pruebas unitarias
server.js       Configuración y arranque del servidor
```

El flujo de una petición sigue la separación de responsabilidades: **ruta → middleware → controlador → servicio → modelo → MongoDB**.

## Requisitos e instalación

- Node.js 20 o superior y npm (o Yarn).
- Acceso a un clúster de MongoDB Atlas.
- Postman para ejecutar los casos de prueba.

1. Clonar el fork y entrar en la carpeta del proyecto:

   ```bash
   git clone https://github.com/TryzUp-Nexus/IPPS-DIPLOMADO-CURSO3-V2-CLINICA.git
   cd IPPS-DIPLOMADO-CURSO3-V2-CLINICA
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Copiar `.env.example` como `.env` y completar las variables con valores propios:

   ```dotenv
   PORT=3001
   MONGODB_URI=mongodb+srv://USUARIO:CLAVE@CLUSTER.mongodb.net/clinica_ipss?retryWrites=true&w=majority
   JWT_SECRET=REEMPLAZAR_POR_UN_SECRETO_SEGURO_DE_AL_MENOS_32_CARACTERES
   JWT_EXPIRA=2h
   ```

   **Seguridad:** `.env` está excluido del repositorio mediante `.gitignore`. para no publicar contraseñas, tokens ni cadenas de conexión reales.

4. Iniciar el servidor:

   ```bash
   npm run dev
   ```

   También se puede ejecutar con `npm start` o, si se utiliza Yarn, `yarn dev`.

5. Comprobar el funcionamiento en `http://localhost:3001/`. La API responde con un JSON de estado.

## Endpoints de la API

Las rutas identificadas con **Sí** requieren `Authorization: Bearer <token>`.

### Autenticación

| Método | Endpoint | Token | Descripción |
|---|---|---|---|
| `POST` | `/auth/registro` | No | Registrar médico (`201`) |
| `POST` | `/auth/registrar` | No | Alias de registro (`201`) |
| `POST` | `/auth/login` | No | Iniciar sesión y obtener JWT (`200`) |

### Médicos

| Método | Endpoint | Token | Descripción |
|---|---|---|---|
| `GET` | `/medicos` | Sí | Listar médicos (`200`) |
| `GET` | `/medicos?especialidad=Pediatría` | Sí | Filtrar por especialidad (`200`) |
| `GET` | `/medicos/perfil` | Sí | Consultar perfil autenticado (`200`) |
| `GET` | `/medicos/:id` | Sí | Consultar médico por ID (`200` / `404`) |
| `GET` | `/medicos/:id/pacientes` | Sí | Consultar pacientes del médico (`200` / `403`) |

### Pacientes

| Método | Endpoint | Token | Descripción |
|---|---|---|---|
| `POST` | `/pacientes` | Sí | Crear paciente (`201`) |
| `GET` | `/pacientes` | Sí | Listar pacientes propios (`200`) |
| `GET` | `/pacientes?prevision=Fonasa` | Sí | Filtrar pacientes por previsión (`200`) |
| `GET` | `/pacientes/:id` | Sí | Consultar paciente por ID (`200` / `403` / `404`) |
| `PUT` | `/pacientes/:id` | Sí | Actualizar paciente (`200` / `403` / `404`) |
| `DELETE` | `/pacientes/:id` | Sí | Eliminar paciente (`200` / `403` / `404`) |

## Seguridad y reglas de negocio

- El token JWT identifica al médico autenticado.
- El servidor asigna el campo `medico` del paciente **desde el token**, no desde el cuerpo de la solicitud.
- Solo el médico tratante puede consultar individualmente, actualizar o eliminar a su paciente; otro médico recibe `403 Forbidden`.
- Las contraseñas se almacenan como hash y no se incluyen en las respuestas JSON.
- El RUT del paciente es único y la previsión admite `Fonasa`, `Isapre` o `Particular` (por defecto, `Fonasa`).

### Códigos de respuesta utilizados

| Código | Significado |
|---|---|
| `200` | Consulta, actualización o eliminación exitosa |
| `201` | Recurso creado |
| `400` | Solicitud o datos inválidos |
| `401` | Token ausente, inválido o credenciales incorrectas |
| `403` | Operación no autorizada para ese médico |
| `404` | Recurso no encontrado o identificador inválido |
| `409` | Conflicto por RUT o correo ya registrado |

## Pruebas con Postman

Importar el archivo [`postman/Clinica-IPSS-Evaluacion2.postman_collection.json`](postman/Clinica-IPSS-Evaluacion2.postman_collection.json) desde **Postman → Import**. La colección incluye solicitudes para comprobar el flujo completo, incluyendo:

1. Registro e inicio de sesión de **dos médicos**.
2. Creación y consulta de pacientes asociados al médico A.
3. Acceso sin token y con token inválido (`401`).
4. Intento del médico B de consultar, modificar y eliminar un paciente del médico A (`403`).
5. Validación de datos, previsión no permitida y cuerpo inválido (`400`).
6. RUT duplicado (`409`) e identificadores inexistentes (`404`).
7. Actualización y eliminación autorizadas por el médico tratante (`200`), seguidas de la consulta del paciente eliminado (`404`).

Para pruebas unitarias de funciones auxiliares:

```bash
npm test
```

## Video de demostración

**Video (5–8 minutos):** https://youtu.be/QMSm2QAPM68

La demostración presenta el funcionamiento de la API en Postman, el registro y login de médicos, el CRUD de pacientes, la seguridad JWT, la regla del médico tratante y los códigos HTTP. También explica las decisiones de diseño y las correcciones realizadas para iniciar el proyecto.

---

**Evaluación 2 — Módulo 3 · API REST de Clínica**
