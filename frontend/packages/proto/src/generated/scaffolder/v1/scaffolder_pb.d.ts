import * as jspb from "google-protobuf"

import * as identity_v1_identity_pb from '../../identity/v1/identity_pb';
import * as google_protobuf_struct_pb from 'google-protobuf/google/protobuf/struct_pb';

export class Empty extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Empty.AsObject;
  static toObject(includeInstance: boolean, msg: Empty): Empty.AsObject;
  static serializeBinaryToWriter(message: Empty, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Empty;
  static deserializeBinaryFromReader(message: Empty, reader: jspb.BinaryReader): Empty;
}

export namespace Empty {
  export type AsObject = {
  }
}

export class ListTemplatesReply extends jspb.Message {
  getTemplatesList(): Array<Template>;
  setTemplatesList(value: Array<Template>): void;
  clearTemplatesList(): void;
  addTemplates(value?: Template, index?: number): Template;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListTemplatesReply.AsObject;
  static toObject(includeInstance: boolean, msg: ListTemplatesReply): ListTemplatesReply.AsObject;
  static serializeBinaryToWriter(message: ListTemplatesReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListTemplatesReply;
  static deserializeBinaryFromReader(message: ListTemplatesReply, reader: jspb.BinaryReader): ListTemplatesReply;
}

export namespace ListTemplatesReply {
  export type AsObject = {
    templatesList: Array<Template.AsObject>,
  }
}

export class CreateReply extends jspb.Message {
  getComponentId(): string;
  setComponentId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateReply.AsObject;
  static toObject(includeInstance: boolean, msg: CreateReply): CreateReply.AsObject;
  static serializeBinaryToWriter(message: CreateReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateReply;
  static deserializeBinaryFromReader(message: CreateReply, reader: jspb.BinaryReader): CreateReply;
}

export namespace CreateReply {
  export type AsObject = {
    componentId: string,
  }
}

export class CreateRequest extends jspb.Message {
  getTemplateId(): string;
  setTemplateId(value: string): void;

  getOrg(): string;
  setOrg(value: string): void;

  getComponentId(): string;
  setComponentId(value: string): void;

  getPrivate(): boolean;
  setPrivate(value: boolean): void;

  getMetadata(): google_protobuf_struct_pb.Struct | undefined;
  setMetadata(value?: google_protobuf_struct_pb.Struct): void;
  hasMetadata(): boolean;
  clearMetadata(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateRequest): CreateRequest.AsObject;
  static serializeBinaryToWriter(message: CreateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateRequest;
  static deserializeBinaryFromReader(message: CreateRequest, reader: jspb.BinaryReader): CreateRequest;
}

export namespace CreateRequest {
  export type AsObject = {
    templateId: string,
    org: string,
    componentId: string,
    pb_private: boolean,
    metadata?: google_protobuf_struct_pb.Struct.AsObject,
  }
}

export class Template extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getName(): string;
  setName(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getUser(): identity_v1_identity_pb.User | undefined;
  setUser(value?: identity_v1_identity_pb.User): void;
  hasUser(): boolean;
  clearUser(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Template.AsObject;
  static toObject(includeInstance: boolean, msg: Template): Template.AsObject;
  static serializeBinaryToWriter(message: Template, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Template;
  static deserializeBinaryFromReader(message: Template, reader: jspb.BinaryReader): Template;
}

export namespace Template {
  export type AsObject = {
    id: string,
    name: string,
    description: string,
    user?: identity_v1_identity_pb.User.AsObject,
  }
}

