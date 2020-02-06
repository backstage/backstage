import * as grpcWeb from 'grpc-web';

import * as identity_v1_identity_pb from '../../identity/v1/identity_pb';

import {
  Empty,
  GetAllTemplatesReply} from './scaffolder_pb';

export class ScaffolderClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  getAllTemplates(
    request: Empty,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: GetAllTemplatesReply) => void
  ): grpcWeb.ClientReadableStream<GetAllTemplatesReply>;

}

export class ScaffolderPromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  getAllTemplates(
    request: Empty,
    metadata?: grpcWeb.Metadata
  ): Promise<GetAllTemplatesReply>;

}

