import { v4 as uuidv4 } from "uuid";
import { Todo } from "../../types/todo/todo.type";
import * as todoRepo from "../../repository/todo/todo.repository";

export const getAll = (): Todo[] => {
  return todoRepo.findAll();
};

export const getDetail = (id: string): Todo | undefined => {
  return todoRepo.findById(id);
};

export const create = (title: string): Todo => {
  const newTodo: Todo = { id: uuidv4(), title, completed: false };
  todoRepo.save(newTodo);
  return newTodo;
};

export const update = (
  id: string,
  updatedTodo: Partial<Todo>,
): Todo | undefined => {
  return todoRepo.update(id, updatedTodo);
};

export const remove = (id: string): Todo | undefined => {
  return todoRepo.remove(id);
};

export const removeAll = (): Todo[] => {
  return todoRepo.removeAll();
};
