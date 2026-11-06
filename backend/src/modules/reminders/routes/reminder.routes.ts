import { Router } from "express";
import { authMiddleware } from "../../users/middlewares/auth.middleware.js";
import { CreateReminderController } from "../controllers/create-reminder.controller.js";
import { ListRemindersController } from "../controllers/list-reminders.controller.js";
import { GetReminderController } from "../controllers/get-reminder.controller.js";
import { UpdateReminderController } from "../controllers/update-reminder.controller.js";
import { DeleteReminderController } from "../controllers/delete-reminder.controller.js";

const reminderRoutes = Router({ mergeParams: true });

const createReminderController = new CreateReminderController();
const listRemindersController = new ListRemindersController();
const getReminderController = new GetReminderController();
const updateReminderController = new UpdateReminderController();
const deleteReminderController = new DeleteReminderController();

/**
 * @openapi
 * /pets/{petId}/reminders:
 *   post:
 *     tags:
 *       - Reminders
 *     summary: Cadastrar lembrete para um pet
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *                 example: Aplicar antipulgas
 *               description:
 *                 type: string
 *                 example: Administrar conforme orientação veterinária
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-11-06T12:00:00.000Z"
 *               type:
 *                 type: string
 *                 example: Medicamento
 *               completed:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Lembrete cadastrado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Pet não encontrado
 */
reminderRoutes.post("/", authMiddleware, (req, res) =>
  createReminderController.handle(req, res),
);

/**
 * @openapi
 * /pets/{petId}/reminders:
 *   get:
 *     tags:
 *       - Reminders
 *     summary: Listar lembretes de um pet
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pet
 *     responses:
 *       200:
 *         description: Lista de lembretes
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Pet não encontrado
 */
reminderRoutes.get("/", authMiddleware, (req, res) =>
  listRemindersController.handle(req, res),
);

/**
 * @openapi
 * /pets/{petId}/reminders/{id}:
 *   get:
 *     tags:
 *       - Reminders
 *     summary: Buscar lembrete por ID
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
 *         description: Lembrete encontrado
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Lembrete não encontrado
 */
reminderRoutes.get("/:id", authMiddleware, (req, res) =>
  getReminderController.handle(req, res),
);

/**
 * @openapi
 * /pets/{petId}/reminders/{id}:
 *   put:
 *     tags:
 *       - Reminders
 *     summary: Atualizar lembrete
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *                 nullable: true
 *               date:
 *                 type: string
 *                 format: date-time
 *               type:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Lembrete atualizado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Pet ou lembrete não encontrado
 */
reminderRoutes.put("/:id", authMiddleware, (req, res) =>
  updateReminderController.handle(req, res),
);

/**
 * @openapi
 * /pets/{petId}/reminders/{id}:
 *   delete:
 *     tags:
 *       - Reminders
 *     summary: Excluir lembrete
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
 *       204:
 *         description: Lembrete excluído
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Pet ou lembrete não encontrado
 */
reminderRoutes.delete("/:id", authMiddleware, (req, res) =>
  deleteReminderController.handle(req, res),
);

export { reminderRoutes };