import * as grpcWeb from 'grpc-web';

import {
  HelloReply,
  HelloRequest} from './hello_pb';

export class HelloClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  hello(
    request: HelloRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: HelloReply) => void
  ): grpcWeb.ClientReadableStream<HelloReply>;

}

export class HelloPromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  hello(
    request: HelloRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<HelloReply>;

}

