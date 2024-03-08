export interface Todo {
  id: number;
  text: string;
}

export interface CreateTodoRequestDto {
  text: string;
}

export type CreateTodoResponseDto = Todo;

export type GetTodosRequestDto = null;

export type GetTodosResponseDto = { todos: Todo[] };
