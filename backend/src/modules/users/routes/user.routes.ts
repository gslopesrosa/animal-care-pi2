import { Router } from "express";
import { CreateUserController } from "../controllers/create-user.controller.js";

const userRoutes = Router();

const createUserController = new CreateUserController();

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

export { userRoutes };