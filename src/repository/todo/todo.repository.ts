import { Todo } from "../../types/todo/todo.type";

let todos: Todo[] = [];

export const findAll = () => todos;

export const findById = (id: string): Todo | undefined => {
  return todos.find((todo) => todo.id === id) || undefined;
};

export const save = (todo: Todo) => {
  todos.push(todo);
};

export const update = (
  id: string,
  updatedTodo: Partial<Todo>,
): Todo | undefined => {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) return undefined;
  todos[index] = { ...todos[index], ...updatedTodo };
  return todos[index];
};

export const remove = (id: string): Todo | undefined => {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) return undefined;
  const removedTodo = todos[index];
  todos.splice(index, 1);
  return removedTodo;
};

export const removeAll = () => {
  const removedTodos = [...todos];
  todos = [];
  return removedTodos;
};
