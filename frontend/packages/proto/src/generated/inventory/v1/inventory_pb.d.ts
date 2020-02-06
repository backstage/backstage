// package: spotify.backstage.inventory.v1
// file: inventory/v1/inventory.proto

import * as jspb from "google-protobuf";

export class GetEntityRequest extends jspb.Message {
  hasEntity(): boolean;
  clearEntity(): void;
  getEntity(): Entity | undefined;
  setEntity(value?: Entity): void;

  clearIncludeFactsList(): void;
  getIncludeFactsList(): Array<string>;
  setIncludeFactsList(value: Array<string>): void;
  addIncludeFacts(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEntityRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetEntityRequest): GetEntityRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetEntityRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetEntityRequest;
  static deserializeBinaryFromReader(message: GetEntityRequest, reader: jspb.BinaryReader): GetEntityRequest;
}

export namespace GetEntityRequest {
  export type AsObject = {
    entity?: Entity.AsObject,
    includeFactsList: Array<string>,
  }
}

export class GetEntityReply extends jspb.Message {
  hasEntity(): boolean;
  clearEntity(): void;
  getEntity(): Entity | undefined;
  setEntity(value?: Entity): void;

  clearFactsList(): void;
  getFactsList(): Array<Fact>;
  setFactsList(value: Array<Fact>): void;
  addFacts(value?: Fact, index?: number): Fact;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEntityReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetEntityReply): GetEntityReply.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetEntityReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetEntityReply;
  static deserializeBinaryFromReader(message: GetEntityReply, reader: jspb.BinaryReader): GetEntityReply;
}

export namespace GetEntityReply {
  export type AsObject = {
    entity?: Entity.AsObject,
    factsList: Array<Fact.AsObject>,
  }
}

export class CreateEntityRequest extends jspb.Message {
  hasEntity(): boolean;
  clearEntity(): void;
  getEntity(): Entity | undefined;
  setEntity(value?: Entity): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateEntityRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateEntityRequest): CreateEntityRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateEntityRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateEntityRequest;
  static deserializeBinaryFromReader(message: CreateEntityRequest, reader: jspb.BinaryReader): CreateEntityRequest;
}

export namespace CreateEntityRequest {
  export type AsObject = {
    entity?: Entity.AsObject,
  }
}

export class CreateEntityReply extends jspb.Message {
  hasEntity(): boolean;
  clearEntity(): void;
  getEntity(): Entity | undefined;
  setEntity(value?: Entity): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateEntityReply.AsObject;
  static toObject(includeInstance: boolean, msg: CreateEntityReply): CreateEntityReply.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateEntityReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateEntityReply;
  static deserializeBinaryFromReader(message: CreateEntityReply, reader: jspb.BinaryReader): CreateEntityReply;
}

export namespace CreateEntityReply {
  export type AsObject = {
    entity?: Entity.AsObject,
  }
}

export class Entity extends jspb.Message {
  getUri(): string;
  setUri(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Entity.AsObject;
  static toObject(includeInstance: boolean, msg: Entity): Entity.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Entity, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Entity;
  static deserializeBinaryFromReader(message: Entity, reader: jspb.BinaryReader): Entity;
}

export namespace Entity {
  export type AsObject = {
    uri: string,
  }
}

export class Fact extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Fact.AsObject;
  static toObject(includeInstance: boolean, msg: Fact): Fact.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Fact, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Fact;
  static deserializeBinaryFromReader(message: Fact, reader: jspb.BinaryReader): Fact;
}

export namespace Fact {
  export type AsObject = {
    name: string,
    value: string,
  }
}

