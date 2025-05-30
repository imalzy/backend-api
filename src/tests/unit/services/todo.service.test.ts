import * as todoRepo from "../../../repository/todo/todo.repository";
import * as todoService from "../../../services/todo/todo.service";
import { Todo } from "../../../types/todo/todo.type";

// Mock the todoRepo
jest.mock("../../../repository/todo/todo.repository");

describe("Todo Service", () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return all todos from repository", () => {
      // Arrange
      const mockTodos: Todo[] = [
        { id: "1", title: "Test Todo 1", completed: false },
        { id: "2", title: "Test Todo 2", completed: true },
      ];

      (todoRepo.findAll as jest.Mock).mockReturnValue(mockTodos);

      // Act
      const result = todoService.getAll();

      // Assert
      expect(todoRepo.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockTodos);
    });

    it("should return empty array when no todos exist", () => {
      // Arrange
      (todoRepo.findAll as jest.Mock).mockReturnValue([]);

      // Act
      const result = todoService.getAll();

      // Assert
      expect(todoRepo.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  describe("getDetail", () => {
    it("should return a specific todo by id", () => {
      // Arrange
      const mockTodo: Todo = { id: "1", title: "Test Todo", completed: false };

      (todoRepo.findById as jest.Mock).mockReturnValue(mockTodo);

      // Act
      const result = todoService.getDetail("1");

      // Assert
      expect(todoRepo.findById).toHaveBeenCalledWith("1");
      expect(result).toEqual(mockTodo);
    });

    it("should return undefined when todo is not found", () => {
      // Arrange
      (todoRepo.findById as jest.Mock).mockReturnValue(undefined);

      // Act
      const result = todoService.getDetail("non-existent");

      // Assert
      expect(todoRepo.findById).toHaveBeenCalledWith("non-existent");
      expect(result).toBeUndefined();
    });
  });

  describe("create", () => {
    it("should create a new todo with the given title", () => {
      // Arrange
      const title = "New Todo";

      (todoRepo.save as jest.Mock).mockImplementation(() => {});

      // Act
      const result = todoService.create(title);
      console.log("***result unit testing", result);

      // Assert
      expect(todoRepo.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(
        expect.objectContaining({
          title,
          completed: false,
        }),
      );
      // Verify UUID format (this is a loose check)
      const uuidV4Regex = /^test-uuid-\d+$/;

      expect(result.id).toMatch(uuidV4Regex);
    });
  });

  describe("update", () => {
    it("should update an existing todo", () => {
      // Arrange
      const todoId = "1";
      const updateData: Partial<Todo> = {
        title: "Updated Title",
        completed: true,
      };
      const updatedTodo: Todo = {
        id: todoId,
        title: "Updated Title",
        completed: true,
      };

      (todoRepo.update as jest.Mock).mockReturnValue(updatedTodo);

      // Act
      const result = todoService.update(todoId, updateData);

      // Assert
      expect(todoRepo.update).toHaveBeenCalledWith(todoId, updateData);
      expect(result).toEqual(updatedTodo);
    });

    it("should return undefined when updating non-existent todo", () => {
      // Arrange
      const todoId = "non-existent";
      const updateData: Partial<Todo> = { title: "Updated Title" };

      (todoRepo.update as jest.Mock).mockReturnValue(undefined);

      // Act
      const result = todoService.update(todoId, updateData);

      // Assert
      expect(todoRepo.update).toHaveBeenCalledWith(todoId, updateData);
      expect(result).toBeUndefined();
    });
  });

  describe("remove", () => {
    it("should remove an existing todo", () => {
      // Arrange
      const todoId = "1";
      const removedTodo: Todo = {
        id: todoId,
        title: "Test Todo",
        completed: false,
      };

      (todoRepo.remove as jest.Mock).mockReturnValue(removedTodo);

      // Act
      const result = todoService.remove(todoId);

      // Assert
      expect(todoRepo.remove).toHaveBeenCalledWith(todoId);
      expect(result).toEqual(removedTodo);
    });

    it("should return undefined when removing non-existent todo", () => {
      // Arrange
      const todoId = "non-existent";

      (todoRepo.remove as jest.Mock).mockReturnValue(undefined);

      // Act
      const result = todoService.remove(todoId);

      // Assert
      expect(todoRepo.remove).toHaveBeenCalledWith(todoId);
      expect(result).toBeUndefined();
    });
  });

  describe("removeAll", () => {
    it("should remove all todos", () => {
      // Arrange
      const mockTodos: Todo[] = [
        { id: "1", title: "Test Todo 1", completed: false },
        { id: "2", title: "Test Todo 2", completed: true },
      ];

      (todoRepo.removeAll as jest.Mock).mockReturnValue(mockTodos);

      // Act
      const result = todoService.removeAll();

      // Assert
      expect(todoRepo.removeAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockTodos);
    });

    it("should return empty array when no todos to remove", () => {
      // Arrange
      (todoRepo.removeAll as jest.Mock).mockReturnValue([]);

      // Act
      const result = todoService.removeAll();

      // Assert
      expect(todoRepo.removeAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });
});
