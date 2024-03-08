const PORT = 40000;

import { Todo } from "../types/todo.types";
import * as grpc from "@grpc/grpc-js";
import { CreateTodoDto, TodoDto, Empty, TodosDto } from "../../build/todo_pb";
import { TodoServiceService } from "../../build/todo_grpc_pb";

const todos: Todo[] = [];

const createTodo = (
  call: grpc.ServerUnaryCall<CreateTodoDto, TodoDto>,
  callback: grpc.sendUnaryData<TodoDto>
): void => {
  const request = call.request.toObject();

  console.info(
    `[createTodo]: trying to create todo with request ${JSON.stringify(
      request
    )}`
  );

  const todo: Todo = { id: todos.length + 1, text: request.text };

  todos.push(todo);

  console.info(
    `[createTodo]: Successfully created todo: ${JSON.stringify(todo)}`
  );

  const response = new TodoDto();

  response.setId(todo.id).setText(todo.text);

  return callback(null, response);
};

const getTodos = (
  _: grpc.ServerUnaryCall<Empty, TodosDto>,
  callback: grpc.sendUnaryData<TodosDto>
): void => {
  console.info(
    `[getTodos]: Successfully getting todos: ${JSON.stringify(todos)}`
  );

  const response = new TodosDto();

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
