import { Request, Response } from "express";
import * as todoService from "../../services/todo/todo.service";
import { ApiResponse } from "../../types/api/response";
import { Todo } from "../../types/todo/todo.type";

export const getAllTodos = (
  req: Request,
  res: Response<ApiResponse<Todo[]>>,
) => {
  const todos = todoService.getAll();
  res.json({ success: true, data: todos });
};

export const getDetailTodos = (
  req: Request,
  res: Response<ApiResponse<Todo>>,
) => {
  const id = req.params.id;
  const todo = todoService.getDetail(id) || undefined;
  res.json({ success: true, data: todo });
};

export const createTodo = (req: Request, res: Response<ApiResponse<Todo>>) => {
  const todo = todoService.create(req.body.title);
  res.status(201).json({ success: true, data: todo });
};

export const updateTodo = (req: Request, res: Response<ApiResponse<Todo>>) => {
  const id = req.params.id;

  const todo = todoService.update(id, req.body) || undefined;
  res.status(200).json({ success: true, data: todo });
};

export const deleteTodo = (req: Request, res: Response<ApiResponse<Todo>>) => {
  const id = req.params.id;

  const todo = todoService.remove(id) || undefined;
  res.status(200).json({ success: true, data: todo });
};

export const deleteAllTodo = (
  req: Request,
  res: Response<ApiResponse<null>>,
) => {
  const todo = todoService.removeAll();
  res
    .status(200)
    .json({ success: true, message: "All todos deleted successfully." });
};
