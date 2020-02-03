// GENERATED CODE -- DO NOT EDIT!

// package: spotify.backstage.scaffolder.v1alpha1
// file: scaffolder.proto

import * as scaffolder_pb from "./scaffolder_pb";
import * as grpc from "grpc";

interface IScaffolderService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  scaffolder: grpc.MethodDefinition<scaffolder_pb.ScaffolderRequest, scaffolder_pb.ScaffolderReply>;
}

export const ScaffolderService: IScaffolderService;

export class ScaffolderClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  scaffolder(argument: scaffolder_pb.ScaffolderRequest, callback: grpc.requestCallback<scaffolder_pb.ScaffolderReply>): grpc.ClientUnaryCall;
  scaffolder(argument: scaffolder_pb.ScaffolderRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<scaffolder_pb.ScaffolderReply>): grpc.ClientUnaryCall;
  scaffolder(argument: scaffolder_pb.ScaffolderRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<scaffolder_pb.ScaffolderReply>): grpc.ClientUnaryCall;
}
