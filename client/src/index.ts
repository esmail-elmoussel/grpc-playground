const PORT = 40000;

import * as grpc from "@grpc/grpc-js";
import { promisify } from "util";
import { TodoServiceClient } from "../../build/todo_grpc_pb";
import {
  CreateTodoRequestDto,
  GetTodoRequestDto,
  GetTodosRequestDto,
} from "../../build/todo_pb";

const createClient = (): TodoServiceClient => {
  try {
    const client: TodoServiceClient = new TodoServiceClient(
      `localhost:${PORT}`,
      grpc.credentials.createInsecure()
    );

    console.info("[createClient]: successfully connected to gRPC server!");

    return client;
  } catch (error) {
    console.error(`[createClient]: error connecting to gRPC server: ${error}`);

    throw error;
  }
};

const client = createClient();

const createTodo = (text: string) => {
  const request: CreateTodoRequestDto = new CreateTodoRequestDto().setText(
    text
  );

  client.createTodo(request, (error, response) => {
    if (error) {
      return console.error(
        `Error while creating todo: ${JSON.stringify(error)}`
      );
    }

    console.info(
      `Successfully created todo: ${JSON.stringify(response.toObject())}`
    );
  });
};

const getTodos = () => {
  const request: GetTodosRequestDto = new GetTodosRequestDto();

  client.getTodos(request, (error, response) => {
    if (error) {
      return console.error(
        `Error while getting todos: ${JSON.stringify(error)}`
      );
    }

    console.info(
      `Successfully got todos: ${JSON.stringify(response.toObject())}`
    );
  });
};

const getTodo = (id: number) => {
  const request: GetTodoRequestDto = new GetTodoRequestDto().setId(id);

  client.getTodo(request, (error, response) => {
    if (error) {
      return console.error(
        `Error while getting todo with id ${request.getId()}: ${JSON.stringify(
          error
        )}`
      );
    }

    console.info(
      `Successfully got todo with id ${request.getId()}: ${JSON.stringify(
        response.toObject()
      )}`
    );
  });
};

createTodo("Play with code!");
createTodo("Watch match!");
createTodo("Random!!");
createTodo("Random!!");
createTodo("Random!!");

getTodos();

getTodo(1);
