
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  sub: string | number;
}

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token de autenticação não informado.",
    });
  }

  const [, token] = authHeader.split(" ");

  if (!token || authHeader.split(" ")[0] !== "Bearer") {
    return res.status(401).json({
      message: "Formato do token inválido.",
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET não configurada.");

    return res.status(500).json({
      message: "Erro interno de autenticação.",
    });
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (
      typeof decoded === "string" ||
      (typeof decoded.sub !== "string" &&
        typeof decoded.sub !== "number")
    ) {
      return res.status(401).json({
        message: "Token inválido.",
      });
    }

    const payload = decoded as JwtPayload;

    req.userId = String(payload.sub);

    return next();
  } catch {
    return res.status(401).json({
      message: "Token inválido ou expirado.",
    });
  }
}