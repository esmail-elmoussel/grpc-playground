const PORT = 40000;

import * as grpc from "@grpc/grpc-js";
import { promisify } from "util";
import { TodoServiceClient } from "../../build/todo_grpc_pb";
import {
  CreateTodoRequestDto,
  CreateTodoResponseDto,
  GetTodoRequestDto,
  GetTodoResponseDto,
  GetTodosRequestDto,
  GetTodosResponseDto,
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

const createTodoRpc = promisify<CreateTodoRequestDto, CreateTodoResponseDto>(
  client.createTodo
).bind(client);

const getTodosRpc = promisify<GetTodosRequestDto, GetTodosResponseDto>(
  client.getTodos
).bind(client);

const getTodoRpc = promisify<GetTodoRequestDto, GetTodoResponseDto>(
  client.getTodo
).bind(client);

const createTodo = async (text: string) => {
  const request: CreateTodoRequestDto = new CreateTodoRequestDto().setText(
    text
  );

  try {
    const response = await createTodoRpc(request);

    console.info(
      `Successfully created todo: ${JSON.stringify(response.toObject())}`
    );
  } catch (error) {
    console.error(`Error while creating todo: ${error}`);
  }
};

const getTodos = async () => {
  const request: GetTodosRequestDto = new GetTodosRequestDto();

  try {
    const response = await getTodosRpc(request);

    console.info(
      `Successfully got todos: ${JSON.stringify(response.toObject())}`
    );
  } catch (error) {
    return console.error(`Error while getting todos: ${error}`);
  }
};

const getTodo = async (id: number) => {
  try {
    const request: GetTodoRequestDto = new GetTodoRequestDto().setId(id);
    const response = await getTodoRpc(request);

    console.info(
      `Successfully got todo with id ${request.getId()}: ${JSON.stringify(
        response.toObject()
      )}`
    );
  } catch (error) {
    console.error(`Error while getting todo with id ${id}: ${error}`);
  }
};

const main = async () => {
  await createTodo("Play with code!");
  createTodo("Watch match!");
  createTodo("Random!!");
  createTodo("Random!!");
  createTodo("Random!!");

  getTodos();

  getTodo(1);
};

main();
