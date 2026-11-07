
import type { Response } from "express";
import type { AuthenticatedRequest } from "../../users/middlewares/auth.middleware.js";
import { cloudinary } from "../../../config/cloudinary.js";

export class UploadPetPhotoController {
  async handle(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          message: "Usuário não autenticado.",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "Selecione uma imagem para enviar.",
        });
      }

      const imageBase64 = req.file.buffer.toString("base64");
      const imageDataUri = `data:${req.file.mimetype};base64,${imageBase64}`;

      const result = await cloudinary.uploader.upload(imageDataUri, {
        folder: "animal-care/pets",
        resource_type: "image",
      });

      return res.status(201).json({
        photoUrl: result.secure_url,
      });
    } catch (error) {
      console.error("Erro ao enviar foto do pet:", error);

      return res.status(500).json({
        message: "Não foi possível enviar a foto do pet.",
      });
    }
  }
}
