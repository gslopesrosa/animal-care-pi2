
import { Router } from "express";
import { authMiddleware } from "../../users/middlewares/auth.middleware.js";
import { CreateAppointmentController } from "../controllers/create-appointment.controller.js";
import { ListAppointmentsController } from "../controllers/list-appointments.controller.js";
import { GetAppointmentController } from "../controllers/get-appointment.controller.js";
import { UpdateAppointmentController } from "../controllers/update-appointment.controller.js";
import { DeleteAppointmentController } from "../controllers/delete-appointment.controller.js";

const appointmentRoutes = Router({ mergeParams: true });

const createAppointmentController = new CreateAppointmentController();
const listAppointmentsController = new ListAppointmentsController();
const getAppointmentController = new GetAppointmentController();
const updateAppointmentController = new UpdateAppointmentController();
const deleteAppointmentController = new DeleteAppointmentController();

/**
 * @openapi
 * /pets/{petId}/appointments:
 *   post:
 *     tags:
 *       - Appointments
 *     summary: Cadastrar consulta veterinária para um pet
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               clinic:
 *                 type: string
 *               veterinarian:
 *                 type: string
 *               diagnosis:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Consulta cadastrada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Pet não encontrado
 */
appointmentRoutes.post("/", authMiddleware, (req, res) =>
  createAppointmentController.handle(req, res),
);

/**
 * @openapi
 * /pets/{petId}/appointments:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: Listar consultas veterinárias de um pet
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de consultas veterinárias
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Pet não encontrado
 */
appointmentRoutes.get("/", authMiddleware, (req, res) =>
  listAppointmentsController.handle(req, res),
);

/**
 * @openapi
 * /pets/{petId}/appointments/{id}:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: Consultar consulta veterinária por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Consulta encontrada
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Pet ou consulta não encontrado
 *   put:
 *     tags:
 *       - Appointments
 *     summary: Atualizar consulta veterinária
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               clinic:
 *                 type: string
 *                 nullable: true
 *               veterinarian:
 *                 type: string
 *                 nullable: true
 *               diagnosis:
 *                 type: string
 *                 nullable: true
 *               notes:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Consulta atualizada
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Pet ou consulta não encontrado
 *   delete:
 *     tags:
 *       - Appointments
 *     summary: Excluir consulta veterinária
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Consulta excluída
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Pet ou consulta não encontrado
 */
appointmentRoutes.get("/:id", authMiddleware, (req, res) =>
  getAppointmentController.handle(req, res),
);

appointmentRoutes.put("/:id", authMiddleware, (req, res) =>
  updateAppointmentController.handle(req, res),
);

appointmentRoutes.delete("/:id", authMiddleware, (req, res) =>
  deleteAppointmentController.handle(req, res),
);

export { appointmentRoutes };
