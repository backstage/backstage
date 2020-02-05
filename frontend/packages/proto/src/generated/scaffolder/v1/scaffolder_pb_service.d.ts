// package: spotify.backstage.scaffolder.v1
// file: scaffolder/v1/scaffolder.proto

import * as scaffolder_v1_scaffolder_pb from "../../scaffolder/v1/scaffolder_pb";
import {grpc} from "@improbable-eng/grpc-web";

type ScaffolderGetAllTemplates = {
  readonly methodName: string;
  readonly service: typeof Scaffolder;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof scaffolder_v1_scaffolder_pb.Empty;
  readonly responseType: typeof scaffolder_v1_scaffolder_pb.GetAllTemplatesResponse;
};

export class Scaffolder {
  static readonly serviceName: string;
  static readonly GetAllTemplates: ScaffolderGetAllTemplates;
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

export class ScaffolderClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  getAllTemplates(
    requestMessage: scaffolder_v1_scaffolder_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: scaffolder_v1_scaffolder_pb.GetAllTemplatesResponse|null) => void
  ): UnaryResponse;
  getAllTemplates(
    requestMessage: scaffolder_v1_scaffolder_pb.Empty,
    callback: (error: ServiceError|null, responseMessage: scaffolder_v1_scaffolder_pb.GetAllTemplatesResponse|null) => void
  ): UnaryResponse;
}

