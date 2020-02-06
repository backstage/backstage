import * as grpcWeb from 'grpc-web';

import {
  CreateEntityReply,
  CreateEntityRequest,
  GetEntityReply,
  GetEntityRequest} from './inventory_pb';

export class InventoryClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  getEntity(
    request: GetEntityRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: GetEntityReply) => void
  ): grpcWeb.ClientReadableStream<GetEntityReply>;

  createEntity(
    request: CreateEntityRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: CreateEntityReply) => void
  ): grpcWeb.ClientReadableStream<CreateEntityReply>;

}

export class InventoryPromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  getEntity(
    request: GetEntityRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<GetEntityReply>;

  createEntity(
    request: CreateEntityRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<CreateEntityReply>;

}

