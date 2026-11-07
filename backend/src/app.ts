import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { userRoutes } from "./modules/users/routes/user.routes.js";
import { sessionsRoutes } from "./modules/users/routes/sessions.routes.js";
import { petRoutes } from "./modules/pets/routes/pet.routes.js";
import { vaccinationRoutes } from "./modules/Vaccination/routes/vaccination.routes.js";
import { medicationRoutes } from "./modules/medications/routes/medication.routes.js";
import { appointmentRoutes } from "./modules/appointments/routes/appointment.routes.js";
import { reminderRoutes } from "./modules/reminders/routes/reminder.routes.js";
import { petPhotoRoutes } from "./modules/pets/routes/pet-photo.routes.js";

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
app.use("/pets/:petId/vaccinations", vaccinationRoutes);
app.use("/pets/:petId/medications", medicationRoutes);
app.use("/pets/:petId/appointments", appointmentRoutes);
app.use("/pets/:petId/reminders", reminderRoutes);
app.use("/pet-photos", petPhotoRoutes);

export { app };