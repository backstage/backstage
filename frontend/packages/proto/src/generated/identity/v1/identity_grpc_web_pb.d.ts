import * as grpcWeb from 'grpc-web';

import {
  GetGroupReply,
  GetGroupRequest,
  GetUserReply,
  GetUserRequest} from './identity_pb';

export class IdentityClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  getUser(
    request: GetUserRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: GetUserReply) => void
  ): grpcWeb.ClientReadableStream<GetUserReply>;

  getGroup(
    request: GetGroupRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: GetGroupReply) => void
  ): grpcWeb.ClientReadableStream<GetGroupReply>;

}

export class IdentityPromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  getUser(
    request: GetUserRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<GetUserReply>;

  getGroup(
    request: GetGroupRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<GetGroupReply>;

}

