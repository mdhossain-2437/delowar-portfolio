import type { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { appConfig } from "./config";

const servers = [
  {
    url: appConfig.publicApiBase.replace(/\/$/, ""),
    description: "Production / canonical",
  },
  {
    url: "http://localhost:5000",
    description: "Local development",
  },
];

export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Delowar Portfolio API",
    version: "1.0.0",
    description:
      "Public API surface that mirrors the portfolio content. Designed for demos, hackable dashboards, and DX inspiration.",
    contact: {
      name: appConfig.profile.name,
      url: appConfig.profile.socials.linkedin,
    },
  },
  servers,
  paths: {
    "/api/public/profile": {
      get: {
        summary: "Get profile",
        description: "Returns the public profile/bio JSON.",
        responses: {
          "200": {
            description: "Profile payload",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    title: { type: "string" },
                    bio: { type: "string" },
                    location: { type: "string" },
                    timezone: { type: "string" },
                    availability: { type: "string" },
                    socials: {
                      type: "object",
                      additionalProperties: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/public/projects": {
      get: {
        summary: "List projects",
        parameters: [
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 25 },
          },
        ],
        responses: {
          "200": {
            description: "Array of projects",
            content: {
              "application/json": {
                schema: { type: "array", items: { type: "object" } },
              },
            },
          },
        },
      },
    },
    "/api/og": {
      get: {
        summary: "Generate OG image",
        parameters: [
          {
            name: "title",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "highlight",
            in: "query",
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "SVG OG card",
            content: {
              "image/svg+xml": {},
            },
          },
        },
      },
    },
  },
};

export function mountSwagger(app: Express) {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
