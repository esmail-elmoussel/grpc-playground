const PORT = 40000;

import { Todo } from "./types/todo.types";
import * as grpc from "@grpc/grpc-js";
import {
  CreateTodoRequestDto,
  CreateTodoResponseDto,
  GetTodoRequestDto,
  GetTodoResponseDto,
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

  const response = new CreateTodoResponseDto();

  response.setTodo(todo);

  console.info(
    `[createTodo]: Successfully created todo: ${JSON.stringify(
      response.toObject()
    )}`
  );

  return callback(null, response);
};

const getTodos = (
  _: grpc.ServerUnaryCall<GetTodosRequestDto, GetTodosResponseDto>,
  callback: grpc.sendUnaryData<GetTodosResponseDto>
): void => {
  console.info(`[getTodos]: trying to get todos`);

  const response = new GetTodosResponseDto();

  response.setTodosList(
    todos.map((todo) => new TodoDto().setId(todo.id).setText(todo.text))
  );

  console.info(
    `[getTodos]: Successfully got todos: ${JSON.stringify(response.toObject())}`
  );

  return callback(null, response);
};

const getTodo = (
  call: grpc.ServerUnaryCall<GetTodoRequestDto, GetTodoResponseDto>,
  callback: grpc.sendUnaryData<GetTodoResponseDto>
): void => {
  const request: GetTodoRequestDto.AsObject = call.request.toObject();

  console.info(`[getTodo]: trying to get todo with id ${request.id}`);

  const response = new GetTodoResponseDto();

  const todo = todos.find((todo) => todo.id === request.id);

  if (!todo) {
    throw new Error(`Todo with id ${request.id} not found`);
  }

  response.setTodo(new TodoDto().setId(todo.id).setText(todo.text));

  console.info(
    `[getTodo]: Successfully got todo with id ${request.id}: ${JSON.stringify(
      response.toObject()
    )}`
  );

  return callback(null, response);
};

const startServer = () => {
  console.info("[startServer]: Starting server...");
  const server = new grpc.Server();

  server.addService(TodoServiceService, { createTodo, getTodos, getTodo });

  server.bindAsync(
    `localhost:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        console.error(
          `[startServer]: Error starting gRPC server: ${JSON.stringify(error)}`
        );

        throw error;
      }

      console.info(`[startServer]: gRPC server listening on port ${port}`);
    }
  );
};

startServer();
