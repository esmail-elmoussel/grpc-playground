const PORT = 40000;

import * as grpc from "@grpc/grpc-js";
import { TodoServiceClient } from "../../build/todo_grpc_pb";
import {
  CreateTodoRequestDto,
  GetTodoRequestDto,
  GetTodosRequestDto,
} from "../../build/todo_pb";

const client = new TodoServiceClient(
  `localhost:${PORT}`,
  grpc.credentials.createInsecure()
);

const createTodoRequestDto: CreateTodoRequestDto =
  new CreateTodoRequestDto().setText("Test");

client.createTodo(createTodoRequestDto, (error, response) => {
  if (error) {
    return console.error(`Error while creating todo: ${JSON.stringify(error)}`);
  }

  console.info(
    `Successfully created todo: ${JSON.stringify(response.toObject())}`
  );
});

const getTodosRequestDto: GetTodosRequestDto = new GetTodosRequestDto();

client.getTodos(getTodosRequestDto, (error, response) => {
  if (error) {
    return console.error(`Error while getting todos: ${JSON.stringify(error)}`);
  }

  console.info(
    `Successfully got todos: ${JSON.stringify(response.toObject())}`
  );
});

const getTodoRequestDto: GetTodoRequestDto = new GetTodoRequestDto().setId(
  9999
);

client.getTodo(getTodoRequestDto, (error, response) => {
  if (error) {
    return console.error(
      `Error while getting todo with id ${getTodoRequestDto.getId()}: ${JSON.stringify(
        error
      )}`
    );
  }

  console.info(
    `Successfully got todo with id ${getTodoRequestDto.getId()}: ${JSON.stringify(
      response.toObject()
    )}`
  );
});
