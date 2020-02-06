// package: spotify.backstage.inventory.v1
// file: inventory/v1/inventory.proto

import * as inventory_v1_inventory_pb from "../../inventory/v1/inventory_pb";
import {grpc} from "@improbable-eng/grpc-web";

type InventoryGetEntity = {
  readonly methodName: string;
  readonly service: typeof Inventory;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof inventory_v1_inventory_pb.GetEntityRequest;
  readonly responseType: typeof inventory_v1_inventory_pb.GetEntityReply;
};

type InventoryCreateEntity = {
  readonly methodName: string;
  readonly service: typeof Inventory;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof inventory_v1_inventory_pb.CreateEntityRequest;
  readonly responseType: typeof inventory_v1_inventory_pb.CreateEntityReply;
};

export class Inventory {
  static readonly serviceName: string;
  static readonly GetEntity: InventoryGetEntity;
  static readonly CreateEntity: InventoryCreateEntity;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class InventoryClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  getEntity(
    requestMessage: inventory_v1_inventory_pb.GetEntityRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: inventory_v1_inventory_pb.GetEntityReply|null) => void
  ): UnaryResponse;
  getEntity(
    requestMessage: inventory_v1_inventory_pb.GetEntityRequest,
    callback: (error: ServiceError|null, responseMessage: inventory_v1_inventory_pb.GetEntityReply|null) => void
  ): UnaryResponse;
  createEntity(
    requestMessage: inventory_v1_inventory_pb.CreateEntityRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: inventory_v1_inventory_pb.CreateEntityReply|null) => void
  ): UnaryResponse;
  createEntity(
    requestMessage: inventory_v1_inventory_pb.CreateEntityRequest,
    callback: (error: ServiceError|null, responseMessage: inventory_v1_inventory_pb.CreateEntityReply|null) => void
  ): UnaryResponse;
}

