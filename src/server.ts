// src/server.ts
import express, { Express, Request, Response, Router } from "express";
import dotenv from "dotenv";
import routes from "./routes/index";
import { errorMiddleware } from "./middlewares/error.middleware";

// Environment configuration
const envFile =
  process.env.NODE_ENV === "prod" ? ".env.production" : ".env.development";
dotenv.config({ path: envFile });

// Server configuration interface
interface ServerConfig {
  port: number;
  environment: string;
}

// Get server configuration from environment variables
const getConfig = (): ServerConfig => {
  const port = parseInt(process.env.PORT || "3000", 10);
  const environment = process.env.NODE_ENV || "development";

  return {
    port,
    environment,
  };
};

// Initialize Express application
const app: Express = express();
const router: Router = Router();

// Middleware configuration
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true }));

// API health check route
router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "API is running",
    environment: getConfig().environment,
  });
});

// Mount routes
app.use("/api", routes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
  });
});

// Global error handler
app.use(errorMiddleware);

// Start server
const startServer = () => {
  const config = getConfig();
  app.listen(config.port, () => {
    console.log(
      `Server is running in ${config.environment} mode on http://localhost:${config.port}`,
    );
    console.log(`Health check: http://localhost:${config.port}/api`);
    console.log(`API routes: http://localhost:${config.port}/api/v1/todo`);
  });
};

startServer();

// Export for testing purposes
export { app, getConfig };
