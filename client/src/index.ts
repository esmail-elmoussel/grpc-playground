const PORT = 40000;

import * as grpc from "@grpc/grpc-js";
import { promisify } from "util";
import { TodoClient } from "../../build/todo_grpc_pb";
import {
  CreateTodoRequestDto,
  CreateTodoResponseDto,
  GetTodoRequestDto,
  GetTodoResponseDto,
  GetTodosRequestDto,
  GetTodosResponseDto,
} from "../../build/todo_pb";
import { Todo } from "../../server/src/types/todo.types";

const createClient = (): TodoClient => {
  try {
    const client: TodoClient = new TodoClient(
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

const createTodo = async (text: string): Promise<Todo> => {
  const request: CreateTodoRequestDto = new CreateTodoRequestDto().setText(
    text
  );

  const response = await createTodoRpc(request);

  const todo = response.toObject().todo;

  if (!todo) {
    throw new Error("No todo where returned!");
  }

  console.info(
    `Successfully created todo: ${JSON.stringify(response.toObject())}`
  );

  return todo;
};

const getTodos = async (): Promise<Todo[]> => {
  const request: GetTodosRequestDto = new GetTodosRequestDto();

  const response = await getTodosRpc(request);

  console.info(
    `Successfully got todos: ${JSON.stringify(response.toObject())}`
  );

  return response.toObject().todosList;
};

const getTodo = async (id: number): Promise<Todo | null> => {
  const request: GetTodoRequestDto = new GetTodoRequestDto().setId(id);

  const response = await getTodoRpc(request);

  console.info(
    `Successfully got todo with id ${request.getId()}: ${JSON.stringify(
      response.toObject()
    )}`
  );

  return response.toObject().todo ?? null;
};

const main = async () => {
  await createTodo("Play with code!");
  await createTodo("Watch match!");
  await createTodo("Random!!");
  await createTodo("Random!!");
  await createTodo("Random!!");
  await getTodo(1);

  await getTodos();
};

main();
