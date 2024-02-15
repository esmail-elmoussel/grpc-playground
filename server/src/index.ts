import { Todo } from "./types/todo.types";

const todos: Todo[] = [];

const createTodo = (text: string): Todo => {
  const todo = { id: todos.length + 1, text };

  todos.push(todo);

  return todo;
};

const getTodos = (): Todo[] => {
  return todos;
};

createTodo("Watch Match!");

console.log(getTodos());
