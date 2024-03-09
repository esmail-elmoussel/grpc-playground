const PORT = 40000;

import { Todo } from "./types/todo.types";
import * as grpc from "@grpc/grpc-js";
import {
  CreateTodoRequestDto,
  CreateTodoResponseDto,
  GetTodosRequestDto,
  GetTodosResponseDto,
  TodoDto,
} from "../../build/todo_pb";
import { TodoServiceService } from "../../build/todo_grpc_pb";

const todos: Todo[] = [];

const createTodo = (
  call: grpc.ServerUnaryCall<CreateTodoRequestDto, CreateTodoResponseDto>,
  callback: grpc.sendUnaryData<CreateTodoResponseDto>
): void => {
  const request = call.request.toObject();

  console.info(
    `[createTodo]: trying to create todo with request ${JSON.stringify(
      request
    )}`
  );

  const todo: TodoDto = new TodoDto()
    .setId(todos.length + 1)
    .setText(request.text);

  todos.push(todo.toObject());

  console.info(
    `[createTodo]: Successfully created todo: ${JSON.stringify(
      todo.toObject()
    )}`
  );

  const response = new CreateTodoResponseDto();

  response.setTodo(todo);

  return callback(null, response);
};

const getTodos = (
  _: grpc.ServerUnaryCall<GetTodosRequestDto, GetTodosResponseDto>,
  callback: grpc.sendUnaryData<GetTodosResponseDto>
): void => {
  console.info(
    `[getTodos]: Successfully getting todos: ${JSON.stringify(todos)}`
  );

  const response = new GetTodosResponseDto();

  response.setTodosList(
    todos.map((todo) => new TodoDto().setId(todo.id).setText(todo.text))
  );

  return callback(null, response);
};

const startServer = () => {
  console.info("[startServer]: Starting server...");
  const server = new grpc.Server();

  server.addService(TodoServiceService, { createTodo, getTodos });

  server.bindAsync(
    `localhost:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        console.error(JSON.stringify(error));

        throw error;
      }

      console.info(`[startServer]: gRPC server listening on port ${port}`);
    }
  );
};

startServer();
