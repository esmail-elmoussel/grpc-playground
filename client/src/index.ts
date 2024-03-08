const PROTO_PATH = __dirname + "/../../common/protos/todo.proto";
const PORT = 40000;

import {
  CreateTodoRequestDto,
  CreateTodoResponseDto,
} from "../../common/types/todo.types";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const protoLoaderOptions: protoLoader.Options = {};

const packageDefinition = protoLoader.loadSync(PROTO_PATH, protoLoaderOptions);

const todoPackage = grpc.loadPackageDefinition(packageDefinition).todoPackage;

// @ts-ignore
const client = new todoPackage.TodoService(
  `localhost:${PORT}`,
  grpc.credentials.createInsecure()
);

const requestDto: CreateTodoRequestDto = { text: "Test" };

client.createTodo(
  requestDto,
  (
    error: Partial<grpc.StatusObject> | grpc.ServerErrorResponse | null,
    data?: CreateTodoResponseDto | null
  ) => {
    if (error || !data) {
      return console.error(
        `Error while creating todo: ${JSON.stringify(error)}`
      );
    }

    console.info(`Successfully created todo: ${JSON.stringify(data)}`);
  }
);
