// package: spotify.backstage.scaffolder.v1
// file: scaffolder/v1/scaffolder.proto

import * as jspb from "google-protobuf";
import * as identity_v1_identity_pb from "../../identity/v1/identity_pb";

export class Empty extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Empty.AsObject;
  static toObject(includeInstance: boolean, msg: Empty): Empty.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Empty, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Empty;
  static deserializeBinaryFromReader(message: Empty, reader: jspb.BinaryReader): Empty;
}

export namespace Empty {
  export type AsObject = {
  }
}

export class GetAllTemplatesResponse extends jspb.Message {
  clearTemplatesList(): void;
  getTemplatesList(): Array<Template>;
  setTemplatesList(value: Array<Template>): void;
  addTemplates(value?: Template, index?: number): Template;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllTemplatesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllTemplatesResponse): GetAllTemplatesResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetAllTemplatesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllTemplatesResponse;
  static deserializeBinaryFromReader(message: GetAllTemplatesResponse, reader: jspb.BinaryReader): GetAllTemplatesResponse;
}

export namespace GetAllTemplatesResponse {
  export type AsObject = {
    templatesList: Array<Template.AsObject>,
  }
}

export class Template extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getName(): string;
  setName(value: string): void;

  hasUser(): boolean;
  clearUser(): void;
  getUser(): identity_v1_identity_pb.User | undefined;
  setUser(value?: identity_v1_identity_pb.User): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Template.AsObject;
  static toObject(includeInstance: boolean, msg: Template): Template.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Template, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Template;
  static deserializeBinaryFromReader(message: Template, reader: jspb.BinaryReader): Template;
}

export namespace Template {
  export type AsObject = {
    id: string,
    name: string,
    user?: identity_v1_identity_pb.User.AsObject,
  }
}

