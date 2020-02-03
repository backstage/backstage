// package: spotify.backstage.scaffolder.v1alpha1
// file: scaffolder.proto

import * as jspb from "google-protobuf";

export class ScaffolderRequest extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ScaffolderRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ScaffolderRequest): ScaffolderRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ScaffolderRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ScaffolderRequest;
  static deserializeBinaryFromReader(message: ScaffolderRequest, reader: jspb.BinaryReader): ScaffolderRequest;
}

export namespace ScaffolderRequest {
  export type AsObject = {
    name: string,
  }
}

export class ScaffolderReply extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ScaffolderReply.AsObject;
  static toObject(includeInstance: boolean, msg: ScaffolderReply): ScaffolderReply.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ScaffolderReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ScaffolderReply;
  static deserializeBinaryFromReader(message: ScaffolderReply, reader: jspb.BinaryReader): ScaffolderReply;
}

export namespace ScaffolderReply {
  export type AsObject = {
    message: string,
  }
}

