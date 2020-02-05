// package: spotify.backstage.identity.v1
// file: identity/v1/identity.proto

import * as identity_v1_identity_pb from "../../identity/v1/identity_pb";
import {grpc} from "@improbable-eng/grpc-web";

type IdentityGetUser = {
  readonly methodName: string;
  readonly service: typeof Identity;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof identity_v1_identity_pb.GetUserRequest;
  readonly responseType: typeof identity_v1_identity_pb.GetUserReply;
};

type IdentityGetGroup = {
  readonly methodName: string;
  readonly service: typeof Identity;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof identity_v1_identity_pb.GetGroupRequest;
  readonly responseType: typeof identity_v1_identity_pb.GetGroupReply;
};

export class Identity {
  static readonly serviceName: string;
  static readonly GetUser: IdentityGetUser;
  static readonly GetGroup: IdentityGetGroup;
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

export class IdentityClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  getUser(
    requestMessage: identity_v1_identity_pb.GetUserRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: identity_v1_identity_pb.GetUserReply|null) => void
  ): UnaryResponse;
  getUser(
    requestMessage: identity_v1_identity_pb.GetUserRequest,
    callback: (error: ServiceError|null, responseMessage: identity_v1_identity_pb.GetUserReply|null) => void
  ): UnaryResponse;
  getGroup(
    requestMessage: identity_v1_identity_pb.GetGroupRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: identity_v1_identity_pb.GetGroupReply|null) => void
  ): UnaryResponse;
  getGroup(
    requestMessage: identity_v1_identity_pb.GetGroupRequest,
    callback: (error: ServiceError|null, responseMessage: identity_v1_identity_pb.GetGroupReply|null) => void
  ): UnaryResponse;
}

