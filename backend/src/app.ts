import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { userRoutes } from "./modules/users/routes/user.routes.js";
import { sessionsRoutes } from "./modules/users/routes/sessions.routes.js";
import { petRoutes } from "./modules/pets/routes/pet.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "API do Projeto Integrador funcionando!",
  });
});

app.use("/users", userRoutes);
app.use("/sessions", sessionsRoutes);
app.use("/pets", petRoutes);

export { app };