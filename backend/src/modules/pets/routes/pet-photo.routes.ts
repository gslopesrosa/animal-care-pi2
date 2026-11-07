
import { Router } from "express";
import multer from "multer";
import { authMiddleware } from "../../users/middlewares/auth.middleware.js";
import { UploadPetPhotoController } from "../controllers/upload-pet-photo.controller.js";

const petPhotoRoutes = Router();
const uploadPetPhotoController = new UploadPetPhotoController();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return callback(
        new Error("Formato inválido. Envie JPG, PNG ou WEBP."),
      );
    }

    callback(null, true);
  },
});


/**
 * @openapi
 * /pet-photos:
 *   post:
 *     summary: Enviar foto de um pet
 *     tags:
 *       - Pets
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - photo
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Imagem JPG, PNG ou WEBP de até 5 MB
 *     responses:
 *       201:
 *         description: Foto enviada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 photoUrl:
 *                   type: string
 *                   format: uri
 *       400:
 *         description: Arquivo ausente ou inválido
 *       401:
 *         description: Token ausente ou inválido
 *       500:
 *         description: Erro ao enviar a foto
 */

petPhotoRoutes.post(
  "/",
  authMiddleware,
  upload.single("photo"),
  (req, res) => uploadPetPhotoController.handle(req, res),
);

export { petPhotoRoutes };
