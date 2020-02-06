import * as grpcWeb from 'grpc-web';

import {
  GetBuildReply,
  GetBuildRequest,
  ListBuildsReply,
  ListBuildsRequest} from './builds_pb';

export class BuildsClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  listBuilds(
    request: ListBuildsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: ListBuildsReply) => void
  ): grpcWeb.ClientReadableStream<ListBuildsReply>;

  getBuild(
    request: GetBuildRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: GetBuildReply) => void
  ): grpcWeb.ClientReadableStream<GetBuildReply>;

}

export class BuildsPromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  listBuilds(
    request: ListBuildsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<ListBuildsReply>;

  getBuild(
    request: GetBuildRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<GetBuildReply>;

}

