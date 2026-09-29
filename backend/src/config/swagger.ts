import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Animal Care API",
      version: "1.0.0",
      description:
        "API para gerenciamento e acompanhamento do bem-estar animal.",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/modules/**/*.routes.ts"],
});