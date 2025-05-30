import { Request, Response, NextFunction } from "express";
import { HttpError } from "../types/error/error.type";

/**
 * Error response structure
 */
interface ErrorResponse {
  success: boolean;
  status: number;
  message: string;
  errors?: Record<string, string[]> | string[];
  stack?: string;
}

/**
 * Express request handler wrapper to catch async errors
 */
export const errorHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Global error handler middleware
 */
export const errorMiddleware = (
  err: Error | HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Default status code and message
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: Record<string, string[]> | string[] | undefined = undefined;

  // Handle custom HttpError
  if ("statusCode" in err) {
    statusCode = err.statusCode;
    message = err.message;
    if ("errors" in err && err.errors) {
      errors = err.errors;
    }
  } else if (err instanceof Error) {
    message = err.message;
  }

  // Prepare error response
  const errorResponse: ErrorResponse = {
    success: false,
    status: statusCode,
    message,
  };

  // Include errors if present
  if (errors) {
    errorResponse.errors = errors;
  }

  // Include stack trace in development mode
  if (process.env.NODE_ENV === "development") {
    errorResponse.stack = err.stack;
  }

  // Log error
  console.error(
    `[${req.method}] ${req.path} >> StatusCode:: ${statusCode}, Message:: ${message}`,
  );

  // Send response
  res.status(statusCode).json(errorResponse);
};
