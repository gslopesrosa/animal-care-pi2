
import { Router } from "express";
import { authMiddleware } from "../../users/middlewares/auth.middleware.js";
import { CreateMedicationController } from "../controllers/create-medication.controller.js";
import { ListMedicationsController } from "../controllers/list-medications.controller.js";
import { GetMedicationController } from "../controllers/get-medication.controller.js";
import { UpdateMedicationController } from "../controllers/update-medication.controller.js";
import { DeleteMedicationController } from "../controllers/delete-medication.controller.js";

const medicationRoutes = Router({ mergeParams: true });

const createMedicationController = new CreateMedicationController();
const listMedicationsController = new ListMedicationsController();
const getMedicationController = new GetMedicationController();
const updateMedicationController = new UpdateMedicationController();
const deleteMedicationController = new DeleteMedicationController();

/**
 * @openapi
 * /pets/{petId}/medications:
 *   post:
 *     tags:
 *       - Medications
 *     summary: Cadastrar medicamento para um pet
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
 *               - name
 *               - dosage
 *               - frequency
 *               - startDate
 *             properties:
 *               name:
 *                 type: string
 *               dosage:
 *                 type: string
 *               frequency:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Medicamento cadastrado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Pet não encontrado
 */
medicationRoutes.post("/", authMiddleware, (req, res) =>
  createMedicationController.handle(req, res),
);

/**
 * @openapi
 * /pets/{petId}/medications:
 *   get:
 *     tags:
 *       - Medications
 *     summary: Listar medicamentos de um pet
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
 *         description: Lista de medicamentos
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Pet não encontrado
 */
medicationRoutes.get("/", authMiddleware, (req, res) =>
  listMedicationsController.handle(req, res),
);

/**
 * @openapi
 * /pets/{petId}/medications/{id}:
 *   get:
 *     tags:
 *       - Medications
 *     summary: Consultar medicamento por ID
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
 *         description: Medicamento encontrado
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Pet ou medicamento não encontrado
 *   put:
 *     tags:
 *       - Medications
 *     summary: Atualizar medicamento
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
 *               name:
 *                 type: string
 *               dosage:
 *                 type: string
 *               frequency:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Medicamento atualizado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Pet ou medicamento não encontrado
 *   delete:
 *     tags:
 *       - Medications
 *     summary: Excluir medicamento
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
 *         description: Medicamento excluído
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Pet ou medicamento não encontrado
 */
medicationRoutes.get("/:id", authMiddleware, (req, res) =>
  getMedicationController.handle(req, res),
);

medicationRoutes.put("/:id", authMiddleware, (req, res) =>
  updateMedicationController.handle(req, res),
);

medicationRoutes.delete("/:id", authMiddleware, (req, res) =>
  deleteMedicationController.handle(req, res),
);

export { medicationRoutes };
