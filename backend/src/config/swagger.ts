import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "OnlineShop API",
            version: "1.0.0",
            description: "E-commerce backend API documentation"
        },
        servers: [
            {
                url: `http://localhost:${env.port}`,
                description: "Configured local server"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ["./src/routes/*.ts"]
};

export const swaggerSpec = swaggerJsdoc(options);
