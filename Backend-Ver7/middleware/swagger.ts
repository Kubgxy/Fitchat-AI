import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { Express } from "express";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Swagger API",
            version: "1.0.0",
        },
    },
    apis: [path.resolve(__dirname, "../src/**/**/*.ts")],
}

const swaggerSpec = swaggerJSDoc(options);

export function useSwagger (app: Express): void {
    app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}