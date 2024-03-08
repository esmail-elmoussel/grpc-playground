const PORT = 40000;

import * as grpc from "@grpc/grpc-js";
import { TodoServiceClient } from "../../build/todo_grpc_pb";
import { CreateTodoDto, Empty } from "../../build/todo_pb";

const client = new TodoServiceClient(
  `localhost:${PORT}`,
  grpc.credentials.createInsecure()
);

const requestDto: CreateTodoDto = new CreateTodoDto().setText("Test");

client.createTodo(requestDto, (error, data) => {
  if (error) {
    return console.error(`Error while creating todo: ${JSON.stringify(error)}`);
  }

  console.info(`Successfully created todo: ${JSON.stringify(data.toObject())}`);
});

const emptyDto: Empty = new Empty();

client.getTodos(emptyDto, (error, data) => {
  if (error) {
    return console.error(`Error while getting todos: ${JSON.stringify(error)}`);
  }

  console.info(`Successfully got todos: ${JSON.stringify(data.toObject())}`);
});
