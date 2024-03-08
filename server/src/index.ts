const PROTO_PATH = __dirname + "/../../protos/todo.proto";
const PORT = 40000;

import { Todo } from "./types/todo.types";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const protoLoaderOptions: protoLoader.Options = {};

const packageDefinition = protoLoader.loadSync(PROTO_PATH, protoLoaderOptions);

const todoPackage = grpc.loadPackageDefinition(packageDefinition).todoPackage;

const todos: Todo[] = [];

const createTodo = (
  call: grpc.ServerUnaryCall<string, Todo>,
  callback: grpc.sendUnaryData<Todo>
) => {
  console.log({ call, callback });

  const text = call.request;

  const todo = { id: todos.length + 1, text };

  todos.push(todo);

  return callback(null, todo);
};

// const getTodos = (): Todo[] => {
//   return todos;
// };

const startServer = () => {
  console.info("[startServer]: Starting server...");
  const server = new grpc.Server();

  // @ts-ignore
  server.addService(todoPackage.TodoService.service, { createTodo });

  server.bindAsync(
    `0.0.0.0:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        console.error(error);

        throw error;
      }

      console.info(`[startServer]: gRPC server listening on port ${port}`);
    }
  );
};

startServer();
