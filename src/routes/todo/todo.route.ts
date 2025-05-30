import { Router, Request, Response } from "express";
import * as todoController from "./../../controllers/todo/todo.controller";
import { errorHandler } from "../../middlewares/error.middleware";
import {
  validateCreateTodo,
  validateId,
  validateUpdateTodo,
} from "../../validators/todo/todo.validator";

const router = Router();

router.get("/", errorHandler(todoController.getAllTodos));

router.get("/:id", validateId, errorHandler(todoController.getDetailTodos));

router.post("/", validateCreateTodo, errorHandler(todoController.createTodo));

router.put(
  "/:id",
  validateId,
  validateUpdateTodo,
  errorHandler(todoController.updateTodo),
);

// Delete todo
router.delete("/:id", validateId, errorHandler(todoController.deleteTodo));

// Delete all todos
router.delete("/", errorHandler(todoController.deleteAllTodo));

export default router;
