// GENERATED CODE -- DO NOT EDIT!

// package: spotify.backstage.hello.v1alpha1
// file: hello.proto

import * as hello_pb from "./hello_pb";
import * as grpc from "grpc";

interface IHelloService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  hello: grpc.MethodDefinition<hello_pb.HelloRequest, hello_pb.HelloReply>;
}

export const HelloService: IHelloService;

export class HelloClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  hello(argument: hello_pb.HelloRequest, callback: grpc.requestCallback<hello_pb.HelloReply>): grpc.ClientUnaryCall;
  hello(argument: hello_pb.HelloRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<hello_pb.HelloReply>): grpc.ClientUnaryCall;
  hello(argument: hello_pb.HelloRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<hello_pb.HelloReply>): grpc.ClientUnaryCall;
}
