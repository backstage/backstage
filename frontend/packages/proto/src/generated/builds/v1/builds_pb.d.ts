import * as jspb from "google-protobuf"

export class ListBuildsRequest extends jspb.Message {
  getEntityUri(): string;
  setEntityUri(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListBuildsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListBuildsRequest): ListBuildsRequest.AsObject;
  static serializeBinaryToWriter(message: ListBuildsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListBuildsRequest;
  static deserializeBinaryFromReader(message: ListBuildsRequest, reader: jspb.BinaryReader): ListBuildsRequest;
}

export namespace ListBuildsRequest {
  export type AsObject = {
    entityUri: string,
  }
}

export class ListBuildsReply extends jspb.Message {
  getEntityUri(): string;
  setEntityUri(value: string): void;

  getBuildsList(): Array<Build>;
  setBuildsList(value: Array<Build>): void;
  clearBuildsList(): void;
  addBuilds(value?: Build, index?: number): Build;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListBuildsReply.AsObject;
  static toObject(includeInstance: boolean, msg: ListBuildsReply): ListBuildsReply.AsObject;
  static serializeBinaryToWriter(message: ListBuildsReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListBuildsReply;
  static deserializeBinaryFromReader(message: ListBuildsReply, reader: jspb.BinaryReader): ListBuildsReply;
}

export namespace ListBuildsReply {
  export type AsObject = {
    entityUri: string,
    buildsList: Array<Build.AsObject>,
  }
}

export class GetBuildRequest extends jspb.Message {
  getBuildUri(): string;
  setBuildUri(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBuildRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetBuildRequest): GetBuildRequest.AsObject;
  static serializeBinaryToWriter(message: GetBuildRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBuildRequest;
  static deserializeBinaryFromReader(message: GetBuildRequest, reader: jspb.BinaryReader): GetBuildRequest;
}

export namespace GetBuildRequest {
  export type AsObject = {
    buildUri: string,
  }
}

export class GetBuildReply extends jspb.Message {
  getBuild(): Build | undefined;
  setBuild(value?: Build): void;
  hasBuild(): boolean;
  clearBuild(): void;

  getDetails(): BuildDetails | undefined;
  setDetails(value?: BuildDetails): void;
  hasDetails(): boolean;
  clearDetails(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBuildReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetBuildReply): GetBuildReply.AsObject;
  static serializeBinaryToWriter(message: GetBuildReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBuildReply;
  static deserializeBinaryFromReader(message: GetBuildReply, reader: jspb.BinaryReader): GetBuildReply;
}

export namespace GetBuildReply {
  export type AsObject = {
    build?: Build.AsObject,
    details?: BuildDetails.AsObject,
  }
}

export class Build extends jspb.Message {
  getUri(): string;
  setUri(value: string): void;

  getCommitId(): string;
  setCommitId(value: string): void;

  getMessage(): string;
  setMessage(value: string): void;

  getBranch(): string;
  setBranch(value: string): void;

  getStatus(): BuildStatus;
  setStatus(value: BuildStatus): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Build.AsObject;
  static toObject(includeInstance: boolean, msg: Build): Build.AsObject;
  static serializeBinaryToWriter(message: Build, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Build;
  static deserializeBinaryFromReader(message: Build, reader: jspb.BinaryReader): Build;
}

export namespace Build {
  export type AsObject = {
    uri: string,
    commitId: string,
    message: string,
    branch: string,
    status: BuildStatus,
  }
}

export class BuildDetails extends jspb.Message {
  getAuthor(): string;
  setAuthor(value: string): void;

  getOverviewUrl(): string;
  setOverviewUrl(value: string): void;

  getLogUrl(): string;
  setLogUrl(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BuildDetails.AsObject;
  static toObject(includeInstance: boolean, msg: BuildDetails): BuildDetails.AsObject;
  static serializeBinaryToWriter(message: BuildDetails, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BuildDetails;
  static deserializeBinaryFromReader(message: BuildDetails, reader: jspb.BinaryReader): BuildDetails;
}

export namespace BuildDetails {
  export type AsObject = {
    author: string,
    overviewUrl: string,
    logUrl: string,
  }
}

export enum BuildStatus { 
  NULL = 0,
  SUCCESS = 1,
  FAILURE = 2,
  PENDING = 3,
  RUNNING = 4,
}
