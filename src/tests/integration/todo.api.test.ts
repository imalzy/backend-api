import request from "supertest";
import express, { Express, Request, Response } from "express";
import { json } from "body-parser";
import * as todoRepository from "../../repository/todo/todo.repository";
import { Todo } from "../../types/todo/todo.type";
import { v4 as uuidv4 } from "uuid";

// Create a mock Express app for testing
const mockApp: Express = express();
mockApp.use(json());

// Mock the repository to provide predictable test data
jest.mock("../../repository/todo/todo.repository");

describe("Todo API Endpoints", () => {
  // Sample todo data
  const mockTodos: Todo[] = [
    {
      id: "123e4567-e89b-12d3-a456-426614174000",
      title: "Integration Test Todo 1",
      completed: false,
    },
    {
      id: "123e4567-e89b-12d3-a456-426614174001",
      title: "Integration Test Todo 2",
      completed: true,
    },
  ];

  // Reset mocks and setup data before each test
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup route handlers on the mock app
    mockApp.get("/api/v1/todo", (_req: Request, res: Response) => {
      const todos = todoRepository.findAll();
      res.status(200).json({ success: true, data: todos });
    });

    mockApp.get("/api/v1/todo/:id", (req: Request, res: Response) => {
      const todo = todoRepository.findById(req.params.id);
      if (!todo) {
        res.status(404).json({
          success: false,
          message: "Todo not found",
        });
      }
      res.status(200).json({ success: true, data: todo });
    });

    mockApp.post("/api/v1/todo", (req: Request, res: Response) => {
      if (!req.body.title || req.body.title.trim() === "") {
        res.status(422).json({
          success: false,
          message: "Validation failed",
          errors: { title: ["Title is required"] },
        });
      }

      const newTodo = {
        id: uuidv4(),
        title: req.body.title,
        completed: false,
      };
      todoRepository.save(newTodo);
      res.status(201).json({ success: true, data: newTodo });
    });

    mockApp.put("/api/v1/todo/:id", (req: Request, res: Response) => {
      const updatedTodo = todoRepository.update(req.params.id, req.body);
      if (!updatedTodo) {
        res.status(404).json({
          success: false,
          message: "Todo not found",
        });
      }
      res.status(200).json({ success: true, data: updatedTodo });
    });

    mockApp.delete("/api/v1/todo/:id", (req: Request, res: Response) => {
      const removedTodo = todoRepository.remove(req.params.id);
      if (!removedTodo) {
        res.status(404).json({
          success: false,
          message: "Todo not found",
        });
      }
      res.status(200).json({ success: true, data: removedTodo });
    });

    mockApp.delete("/api/v1/todo", (_req: Request, res: Response) => {
      todoRepository.removeAll();
      res.status(200).json({
        success: true,
        message: "All todos deleted successfully",
      });
    });

    // Setup mock implementations for repository
    (todoRepository.findAll as jest.Mock).mockReturnValue([...mockTodos]);
    (todoRepository.findById as jest.Mock).mockImplementation((id: string) => {
      return mockTodos.find((todo) => todo.id === id) || undefined;
    });
    (todoRepository.save as jest.Mock).mockImplementation((todo: Todo) => {
      const newTodo = { ...todo };
      mockTodos.push(newTodo);
      return newTodo;
    });
    (todoRepository.update as jest.Mock).mockImplementation(
      (id: string, updatedTodo: Partial<Todo>) => {
        const index = mockTodos.findIndex((todo) => todo.id === id);
        if (index === -1) return undefined;

        mockTodos[index] = { ...mockTodos[index], ...updatedTodo };
        return mockTodos[index];
      },
    );
    (todoRepository.remove as jest.Mock).mockImplementation((id: string) => {
      const index = mockTodos.findIndex((todo) => todo.id === id);
      if (index === -1) return undefined;

      const removedTodo = mockTodos[index];
      mockTodos.splice(index, 1);
      return removedTodo;
    });
    (todoRepository.removeAll as jest.Mock).mockImplementation(() => {
      const allTodos = [...mockTodos];
      mockTodos.length = 0;
      return allTodos;
    });
  });

  describe("GET /api/v1/todo", () => {
    it("should return all todos", async () => {
      // Act
      const response = await request(mockApp).get("/api/v1/todo");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: mockTodos,
      });
      expect(todoRepository.findAll).toHaveBeenCalled();
    });
  });

  describe("GET /api/v1/todo/:id", () => {
    it("should return a specific todo by ID", async () => {
      // Arrange
      const todo = mockTodos[0];

      // Act
      const response = await request(mockApp).get(`/api/v1/todo/${todo.id}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: todo,
      });
      expect(todoRepository.findById).toHaveBeenCalledWith(todo.id);
    });

    it("should return 404 when todo not found", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";
      (todoRepository.findById as jest.Mock).mockReturnValueOnce(undefined);

      // Act
      const response = await request(mockApp).get(
        `/api/v1/todo/${nonExistentId}`,
      );

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: false,
          message: expect.any(String),
        }),
      );
    });
  });

  describe("POST /api/v1/todo", () => {
    it("should create a new todo", async () => {
      // Arrange
      const newTodo = { title: "New Integration Test Todo" };

      // Act
      const response = await request(mockApp)
        .post("/api/v1/todo")
        .send(newTodo);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        data: expect.objectContaining({
          id: expect.any(String),
          title: newTodo.title,
          completed: false,
        }),
      });
      expect(todoRepository.save).toHaveBeenCalled();
    });

    it("should return 422 for invalid todo data", async () => {
      // Arrange
      const invalidTodo = { title: "" };

      // Act
      const response = await request(mockApp)
        .post("/api/v1/todo")
        .send(invalidTodo);

      // Assert
      expect(response.status).toBe(422);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: false,
          errors: expect.any(Object),
        }),
      );
    });
  });

  describe("PUT /api/v1/todo/:id", () => {
    it("should update an existing todo", async () => {
      // Arrange
      const todo = mockTodos[0];
      const updateData = {
        title: "Updated Integration Test Todo",
        completed: true,
      };

      // Act
      const response = await request(mockApp)
        .put(`/api/v1/todo/${todo.id}`)
        .send(updateData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: expect.objectContaining({
          id: todo.id,
          title: updateData.title,
          completed: updateData.completed,
        }),
      });
      expect(todoRepository.update).toHaveBeenCalledWith(todo.id, updateData);
    });

    it("should return 404 when updating non-existent todo", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";
      (todoRepository.update as jest.Mock).mockReturnValueOnce(undefined);

      // Act
      const response = await request(mockApp)
        .put(`/api/v1/todo/${nonExistentId}`)
        .send({ title: "Updated Title" });

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: false,
          message: expect.any(String),
        }),
      );
    });
  });

  describe("DELETE /api/v1/todo/:id", () => {
    it("should delete a specific todo", async () => {
      // Arrange
      const todo = mockTodos[0];

      // Act
      const response = await request(mockApp).delete(`/api/v1/todo/${todo.id}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: todo,
      });
      expect(todoRepository.remove).toHaveBeenCalledWith(todo.id);
    });

    it("should return 404 when deleting non-existent todo", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";
      (todoRepository.remove as jest.Mock).mockReturnValueOnce(undefined);

      // Act
      const response = await request(mockApp).delete(
        `/api/v1/todo/${nonExistentId}`,
      );

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: false,
          message: expect.any(String),
        }),
      );
    });
  });

  describe("DELETE /api/v1/todo", () => {
    it("should delete all todos", async () => {
      // Act
      const response = await request(mockApp).delete("/api/v1/todo");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: expect.any(String),
      });
      expect(todoRepository.removeAll).toHaveBeenCalled();
    });
  });
});
