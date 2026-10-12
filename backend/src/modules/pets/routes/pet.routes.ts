
import { Router } from "express";
import { CreatePetController } from "../controllers/create-pet.controller.js";
import { authMiddleware } from "../../users/middlewares/auth.middleware.js";
import { ListPetsController } from "../controllers/list-pets.controller.js";
import { GetPetController } from "../controllers/get-pet.controller.js";
import { UpdatePetController } from "../controllers/update-pet.controller.js";
import { DeletePetController } from "../controllers/delete-pet.controller.js";

const petRoutes = Router();
const createPetController = new CreatePetController();
const listPetsController = new ListPetsController();
const getPetController = new GetPetController();
const updatePetController = new UpdatePetController();
const deletePetController = new DeletePetController();

/**
 * @openapi
 * /pets:
 *   post:
 *     summary: Cadastrar um pet
 *     tags:
 *       - Pets
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - species
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rex
 *               species:
 *                 type: string
 *                 example: Cachorro
 *               breed:
 *                 type: string
 *                 example: Labrador
 *               sex:
 *                 type: string
 *                 enum: [Macho, Fêmea]
 *                 example: Macho
 *               birthDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-05-10T00:00:00.000Z"
 *               weight:
 *                 type: number
 *                 example: 12.5
 *               photoUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/rex.jpg"
 *     responses:
 *       201:
 *         description: Pet cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token ausente ou inválido
 *       500:
 *         description: Erro interno
 */
petRoutes.post(
  "/",
  authMiddleware,
  (req, res) => createPetController.handle(req, res),
);

/**
 * @openapi
 * /pets:
 *   get:
 *     summary: Listar pets do usuário autenticado
 *     tags:
 *       - Pets
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pets do usuário
 *       401:
 *         description: Token ausente ou inválido
 */
petRoutes.get(
  "/",
  authMiddleware,
  (req, res) => listPetsController.handle(req, res),
);

/**
 * @openapi
 * /pets/{id}:
 *   get:
 *     summary: Consultar pet por ID
 *     tags:
 *       - Pets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pet
 *     responses:
 *       200:
 *         description: Pet encontrado
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Token ausente ou inválido
 *       404:
 *         description: Pet não encontrado
 */
petRoutes.get(
  "/:id",
  authMiddleware,
  (req, res) => getPetController.handle(req, res),
);

/**
 * @openapi
 * /pets/{id}:
 *   put:
 *     summary: Atualizar dados de um pet
 *     tags:
 *       - Pets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rex
 *               species:
 *                 type: string
 *                 example: Cachorro
 *               breed:
 *                 type: string
 *                 example: Labrador
 *               sex:
 *                 type: string
 *                 enum: [Macho, Fêmea]
 *               birthDate:
 *                 type: string
 *                 format: date-time
 *               weight:
 *                 type: number
 *                 example: 13.2
 *               photoUrl:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Pet atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token ausente ou inválido
 *       404:
 *         description: Pet não encontrado
 *       500:
 *         description: Erro interno
 */
petRoutes.put(
  "/:id",
  authMiddleware,
  (req, res) => updatePetController.handle(req, res),
);


/**
 * @openapi
 * /pets/{id}:
 *   delete:
 *     summary: Excluir um pet
 *     tags:
 *       - Pets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pet
 *     responses:
 *       204:
 *         description: Pet excluído com sucesso
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Token ausente ou inválido
 *       404:
 *         description: Pet não encontrado
 *       500:
 *         description: Erro interno
 */
petRoutes.delete(
  "/:id",
  authMiddleware,
  (req, res) => deletePetController.handle(req, res),
);

export { petRoutes };