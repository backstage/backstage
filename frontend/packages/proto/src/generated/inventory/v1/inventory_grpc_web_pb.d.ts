import * as grpcWeb from 'grpc-web';

import {
  CreateEntityReply,
  CreateEntityRequest,
  GetEntityReply,
  GetEntityRequest,
  GetFactReply,
  GetFactRequest,
  ListEntitiesReply,
  ListEntitiesRequest,
  SetFactReply,
  SetFactRequest} from './inventory_pb';

export class InventoryClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  listEntities(
    request: ListEntitiesRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: ListEntitiesReply) => void
  ): grpcWeb.ClientReadableStream<ListEntitiesReply>;

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

  setFact(
    request: SetFactRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: SetFactReply) => void
  ): grpcWeb.ClientReadableStream<SetFactReply>;

  getFact(
    request: GetFactRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: GetFactReply) => void
  ): grpcWeb.ClientReadableStream<GetFactReply>;

}

export class InventoryPromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  listEntities(
    request: ListEntitiesRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<ListEntitiesReply>;

  getEntity(
    request: GetEntityRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<GetEntityReply>;

  createEntity(
    request: CreateEntityRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<CreateEntityReply>;

  setFact(
    request: SetFactRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<SetFactReply>;

  getFact(
    request: GetFactRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<GetFactReply>;

}

