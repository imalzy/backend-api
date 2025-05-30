import { Request, Response, NextFunction } from "express";
import {
  errorMiddleware,
  errorHandler,
} from "../../../middlewares/error.middleware";
import { HttpError } from "../../../types/error/error.type";

describe("Error Middleware", () => {
  let mockRequest: Request;
  let mockResponse: Response;
  let nextFunction: NextFunction = jest.fn();
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn().mockReturnThis();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });

    mockRequest = {
      method: "GET",
      path: "/test",
      get: jest.fn(),
      header: jest.fn(),
      headers: {},
      route: {},
      cookies: {},
      signedCookies: {},
      // Add other required Express.Request properties
    } as unknown as Request;

    mockResponse = {
      status: responseStatus,
      json: responseJson,
      headersSent: false,
      locals: {},
      app: {} as any,
      // Add other required Express.Response properties
    } as unknown as Response;

    // Mock console.error to prevent pollution of test output
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("errorMiddleware", () => {
    it("should handle generic Error with 500 status", () => {
      // Arrange
      const error = new Error("Test error message");

      // Act
      errorMiddleware(error, mockRequest, mockResponse, nextFunction);

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        status: 500,
        message: "Test error message",
      });
    });

    it("should handle HttpError with custom status code", () => {
      // Arrange
      const error = HttpError.NotFound("Resource not found");

      // Act
      errorMiddleware(error, mockRequest, mockResponse, nextFunction);

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        status: 404,
        message: "Resource not found",
      });
    });

    it("should include validation errors when present", () => {
      // Arrange
      const validationErrors = {
        name: ["Name is required"],
        email: ["Invalid email format", "Email is required"],
      };
      const error = HttpError.UnprocessableEntity(
        "Validation failed",
        validationErrors,
      );

      // Act
      errorMiddleware(error, mockRequest, mockResponse, nextFunction);

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(422);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        status: 422,
        message: "Validation failed",
        errors: validationErrors,
      });
    });

    it("should include stack trace in development environment", () => {
      // Arrange
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";
      const error = new Error("Test error message");
      error.stack = "Error stack trace";

      // Act
      errorMiddleware(error, mockRequest, mockResponse, nextFunction);

      // Assert
      expect(responseJson).toHaveBeenCalledWith(
        expect.objectContaining({
          stack: "Error stack trace",
        }),
      );

      // Clean up
      process.env.NODE_ENV = originalEnv;
    });

    it("should not include stack trace in production environment", () => {
      // Arrange
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";
      const error = new Error("Test error message");
      error.stack = "Error stack trace";

      // Act
      errorMiddleware(error, mockRequest, mockResponse, nextFunction);

      // Assert
      expect(responseJson).toHaveBeenCalledWith(
        expect.not.objectContaining({
          stack: expect.anything(),
        }),
      );

      // Clean up
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe("errorHandler", () => {
    it("should pass to next when function executes successfully", async () => {
      // Arrange
      const mockFn = jest.fn().mockResolvedValue("Success");
      const wrappedFn = errorHandler(mockFn);

      // Act
      await wrappedFn(mockRequest, mockResponse, nextFunction);

      // Assert
      expect(mockFn).toHaveBeenCalledWith(
        mockRequest,
        mockResponse,
        nextFunction,
      );
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should call next with error when function throws", async () => {
      // Arrange
      const mockError = new Error("Test error");
      const mockFn = jest.fn().mockRejectedValue(mockError);
      const wrappedFn = errorHandler(mockFn);

      // Act
      await wrappedFn(mockRequest, mockResponse, nextFunction);

      // Assert
      expect(mockFn).toHaveBeenCalledWith(
        mockRequest,
        mockResponse,
        nextFunction,
      );
      expect(nextFunction).toHaveBeenCalledWith(mockError);
    });
  });
});
