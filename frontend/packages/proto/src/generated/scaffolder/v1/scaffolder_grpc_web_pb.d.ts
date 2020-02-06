import * as grpcWeb from 'grpc-web';

import * as identity_v1_identity_pb from '../../identity/v1/identity_pb';
import * as google_protobuf_struct_pb from 'google-protobuf/google/protobuf/struct_pb';

import {
  CreateReply,
  CreateRequest,
  Empty,
  ListTemplatesReply} from './scaffolder_pb';

export class ScaffolderClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  listTemplates(
    request: Empty,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: ListTemplatesReply) => void
  ): grpcWeb.ClientReadableStream<ListTemplatesReply>;

  create(
    request: CreateRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: CreateReply) => void
  ): grpcWeb.ClientReadableStream<CreateReply>;

}

export class ScaffolderPromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  listTemplates(
    request: Empty,
    metadata?: grpcWeb.Metadata
  ): Promise<ListTemplatesReply>;

  create(
    request: CreateRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<CreateReply>;

}

