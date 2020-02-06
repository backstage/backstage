import * as jspb from "google-protobuf"

import * as identity_v1_identity_pb from '../../identity/v1/identity_pb';

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

export class GetAllTemplatesReply extends jspb.Message {
  getTemplatesList(): Array<Template>;
  setTemplatesList(value: Array<Template>): void;
  clearTemplatesList(): void;
  addTemplates(value?: Template, index?: number): Template;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllTemplatesReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllTemplatesReply): GetAllTemplatesReply.AsObject;
  static serializeBinaryToWriter(message: GetAllTemplatesReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllTemplatesReply;
  static deserializeBinaryFromReader(message: GetAllTemplatesReply, reader: jspb.BinaryReader): GetAllTemplatesReply;
}

export namespace GetAllTemplatesReply {
  export type AsObject = {
    templatesList: Array<Template.AsObject>,
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

