import { app } from "./app.js";
import { prisma } from "./database/prisma.js";
import { env } from "./config/env.js";

app.listen(env.port, async () => {
  console.log(`API rodando em http://localhost:${env.port}`);

  try {
    await prisma.$connect();
    console.log("Banco de dados conectado com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar ao banco:", error);
  }
});