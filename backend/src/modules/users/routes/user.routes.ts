import { Router } from "express";
import { CreateUserController } from "../controllers/create-user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { GetMeController } from "../controllers/get-me.controller.js";

const userRoutes = Router();

const createUserController = new CreateUserController();
const getMeController = new GetMeController();

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Cadastrar usuário
 *     tags:
 *       - Usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Usuário Teste
 *               email:
 *                 type: string
 *                 format: email
 *                 example: teste@animalcare.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 */
userRoutes.post("/", (req, res) =>
  createUserController.handle(req, res)
);


/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: Consultar usuário autenticado
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário autenticado
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       404:
 *         description: Usuário não encontrado
 */
userRoutes.get(
  "/me",
  authMiddleware,
  (req, res) => getMeController.handle(req, res)
);

export { userRoutes };