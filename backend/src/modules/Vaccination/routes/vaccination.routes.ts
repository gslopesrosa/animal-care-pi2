
import { Router } from "express";
import { authMiddleware } from "../../users/middlewares/auth.middleware.js";
import { CreateVaccinationController } from "../controllers/create-vaccination.controller.js";
import { ListVaccinationsController } from "../controllers/list-vaccinations.controller.js";
import { GetVaccinationController } from "../controllers/get-vaccination.controller.js";
import { UpdateVaccinationController } from "../controllers/update-vaccination.controller.js";
import { DeleteVaccinationController } from "../controllers/delete-vaccination.controller.js";

const vaccinationRoutes = Router({ mergeParams: true });

const createVaccinationController = new CreateVaccinationController();
const listVaccinationsController = new ListVaccinationsController();
const getVaccinationController = new GetVaccinationController();
const updateVaccinationController = new UpdateVaccinationController();
const deleteVaccinationController = new DeleteVaccinationController();

/**
 * @openapi
 * /pets/{petId}/vaccinations:
 *   post:
 *     summary: Cadastrar uma vacina para um pet
 *     tags:
 *       - Vacinações
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
 *               - vaccineName
 *               - applicationDate
 *             properties:
 *               vaccineName:
 *                 type: string
 *                 example: Antirrábica
 *               applicationDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-10-13T00:00:00.000Z"
 *               nextDoseDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2027-10-13T00:00:00.000Z"
 *               responsible:
 *                 type: string
 *                 example: Dra. Ana
 *     responses:
 *       201:
 *         description: Vacina cadastrada com sucesso
 *       400:
 *         description: Dados ou ID inválidos
 *       401:
 *         description: Token ausente ou inválido
 *       404:
 *         description: Pet não encontrado
 */
vaccinationRoutes.post(
  "/",
  authMiddleware,
  (req, res) => createVaccinationController.handle(req, res),
);

/**
 * @openapi
 * /pets/{petId}/vaccinations:
 *   get:
 *     summary: Listar vacinas de um pet
 *     tags:
 *       - Vacinações
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
 *         description: Histórico de vacinação
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Token ausente ou inválido
 *       404:
 *         description: Pet não encontrado
 */
vaccinationRoutes.get(
  "/",
  authMiddleware,
  (req, res) => listVaccinationsController.handle(req, res),
);


/**
 * @openapi
 * /pets/{petId}/vaccinations/{id}:
 *   get:
 *     summary: Consultar uma vacina pelo ID
 *     tags:
 *       - Vacinações
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
 *         description: Vacina encontrada
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Token ausente ou inválido
 *       404:
 *         description: Pet ou vacina não encontrado
 */
vaccinationRoutes.get(
  "/:id",
  authMiddleware,
  (req, res) => getVaccinationController.handle(req, res),
);

/**
 * @openapi
 * /pets/{petId}/vaccinations/{id}:
 *   put:
 *     summary: Atualizar uma vacina
 *     tags:
 *       - Vacinações
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
 *               vaccineName:
 *                 type: string
 *                 example: Antirrábica
 *               applicationDate:
 *                 type: string
 *                 format: date-time
 *               nextDoseDate:
 *                 type: string
 *                 format: date-time
 *               responsible:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vacina atualizada
 *       400:
 *         description: Dados ou ID inválidos
 *       401:
 *         description: Token ausente ou inválido
 *       404:
 *         description: Pet ou vacina não encontrado
 */
vaccinationRoutes.put(
  "/:id",
  authMiddleware,
  (req, res) => updateVaccinationController.handle(req, res),
);

/**
 * @openapi
 * /pets/{petId}/vaccinations/{id}:
 *   delete:
 *     summary: Excluir uma vacina
 *     tags:
 *       - Vacinações
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
 *         description: Vacina excluída
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Token ausente ou inválido
 *       404:
 *         description: Pet ou vacina não encontrado
 */
vaccinationRoutes.delete(
  "/:id",
  authMiddleware,
  (req, res) => deleteVaccinationController.handle(req, res),
);

export { vaccinationRoutes };
