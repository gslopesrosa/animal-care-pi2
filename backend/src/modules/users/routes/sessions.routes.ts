
import { Router } from "express";
import { AuthenticateUserController } from "../controllers/authenticate-user.controller.js";

const sessionsRoutes = Router();

const authenticateUserController = new AuthenticateUserController();

/**
 * @openapi
 * /sessions:
 *   post:
 *     summary: Autenticar usuário
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: teste@animalcare.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Autenticação realizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: E-mail ou senha inválidos
 *       500:
 *         description: Erro interno ao autenticar usuário
 */
sessionsRoutes.post("/", (req, res) =>
  authenticateUserController.handle(req, res)
);

export { sessionsRoutes };