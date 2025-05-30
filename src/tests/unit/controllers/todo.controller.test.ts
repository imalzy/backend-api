import { Request, Response } from "express";
import * as todoService from "../../../services/todo/todo.service";
import * as todoController from "../../../controllers/todo/todo.controller";
import { Todo } from "../../../types/todo/todo.type";
import { v4 as uuidv4 } from "uuid";

// Mock the todoService
jest.mock("../../../services/todo/todo.service");

describe("Todo Controller", () => {
  let mockRequest: Request;
  let mockResponse: Response;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn().mockReturnThis();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });

    mockRequest = {
      body: {},
      params: {},
      query: {},
      get: jest.fn(),
      header: jest.fn(),
      headers: {},
      route: {},
      cookies: {},
      signedCookies: {},
      // Add other required Express.Request properties
    } as unknown as Request;

    mockResponse = {
      json: responseJson,
      status: responseStatus,
      headersSent: false,
      locals: {},
      app: {} as any,
      // Add other required Express.Response properties
    } as unknown as Response;

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe("getAllTodos", () => {
    it("should return all todos with success status", () => {
      // Arrange
      const mockTodos: Todo[] = [
        { id: uuidv4(), title: "Test Todo 1", completed: false },
        { id: uuidv4(), title: "Test Todo 2", completed: true },
      ];

      (todoService.getAll as jest.Mock).mockReturnValue(mockTodos);

      // Act
      todoController.getAllTodos(mockRequest, mockResponse);

      // Assert
      expect(todoService.getAll).toHaveBeenCalledTimes(1);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockTodos,
      });
    });
  });

  describe("getDetailTodos", () => {
    it("should return a specific todo with success status", () => {
      const id = uuidv4();
      // Arrange
      const mockTodo: Todo = {
        id: id,
        title: "Test Todo",
        completed: false,
      };
      mockRequest.params = { id: id };

      (todoService.getDetail as jest.Mock).mockReturnValue(mockTodo);

      // Act
      todoController.getDetailTodos(mockRequest, mockResponse);

      // Assert
      expect(todoService.getDetail).toHaveBeenCalledWith(id);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockTodo,
      });
    });

    it("should return undefined when todo not found", () => {
      // Arrange
      mockRequest.params = { id: "non-existent" };

      (todoService.getDetail as jest.Mock).mockReturnValue(undefined);

      // Act
      todoController.getDetailTodos(mockRequest, mockResponse);

      // Assert
      expect(todoService.getDetail).toHaveBeenCalledWith("non-existent");
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: undefined
      });
    });
  });

  describe("createTodo", () => {
    it("should create a new todo and return success", () => {
      // Arrange
      const mockTodo: Todo = { id: "1", title: "New Todo", completed: false };
      mockRequest.body = { title: "New Todo" };

      (todoService.create as jest.Mock).mockReturnValue(mockTodo);

      // Act
      todoController.createTodo(mockRequest, mockResponse);

      // Assert
      expect(todoService.create).toHaveBeenCalledWith("New Todo");
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockTodo,
      });
    });
  });

  describe("updateTodo", () => {
    it("should update a todo and return the updated todo", () => {
      const id = uuidv4();
      // Arrange
      const mockTodo: Todo = {
        id: id,
        title: "Create Todo",
        completed: true,
      };
      mockRequest.params = { id: id };
      mockRequest.body = { title: "Updated Todo", completed: true };

      (todoService.update as jest.Mock).mockReturnValue(mockTodo);

      // Act
      todoController.updateTodo(mockRequest, mockResponse);

      // Assert
      expect(todoService.update).toHaveBeenCalledWith(id, {
        title: "Updated Todo",
        completed: true,
      });
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockTodo,
      });
    });

    it("should return undefined when updating non-existent todo", () => {
      // Arrange
      mockRequest.params = { id: "non-existent" };
      mockRequest.body = { title: "Updated Todo" };

      (todoService.update as jest.Mock).mockReturnValue(undefined);

      // Act
      todoController.updateTodo(mockRequest, mockResponse);

      // Assert
      expect(todoService.update).toHaveBeenCalledWith("non-existent", {
        title: "Updated Todo",
      });
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: undefined,
      });
    });
  });

  describe("deleteTodo", () => {
    it("should delete a todo and return the deleted todo", () => {
      const id = uuidv4();
      // Arrange
      const mockTodo: Todo = { id: id, title: "Test Todo", completed: false };
      mockRequest.params = { id: id };

      (todoService.remove as jest.Mock).mockReturnValue(mockTodo);

      // Act
      todoController.deleteTodo(mockRequest, mockResponse);

      // Assert
      expect(todoService.remove).toHaveBeenCalledWith(id);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockTodo,
      });
    });

    it("should return undefined when deleting non-existent todo", () => {
      // Arrange
      mockRequest.params = { id: "non-existent" };

      (todoService.remove as jest.Mock).mockReturnValue(undefined);

      // Act
      todoController.deleteTodo(mockRequest, mockResponse);

      // Assert
      expect(todoService.remove).toHaveBeenCalledWith("non-existent");
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: undefined,
      });
    });
  });

  describe("deleteAllTodo", () => {
    it("should delete all todos and return success message", () => {
      // Arrange
      const mockTodos: Todo[] = [
        { id: uuidv4(), title: "Test Todo 1", completed: false },
        { id: uuidv4(), title: "Test Todo 2", completed: true },
      ];

      (todoService.removeAll as jest.Mock).mockReturnValue(mockTodos);

      // Act
      todoController.deleteAllTodo(mockRequest, mockResponse);

      // Assert
      expect(todoService.removeAll).toHaveBeenCalledTimes(1);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        message: "All todos deleted successfully.",
      });
    });
  });
});
