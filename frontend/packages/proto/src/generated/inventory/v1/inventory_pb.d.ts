import * as jspb from "google-protobuf"

export class ListEntitiesRequest extends jspb.Message {
  getUriprefix(): string;
  setUriprefix(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListEntitiesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListEntitiesRequest): ListEntitiesRequest.AsObject;
  static serializeBinaryToWriter(message: ListEntitiesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListEntitiesRequest;
  static deserializeBinaryFromReader(message: ListEntitiesRequest, reader: jspb.BinaryReader): ListEntitiesRequest;
}

export namespace ListEntitiesRequest {
  export type AsObject = {
    uriprefix: string,
  }
}

export class ListEntitiesReply extends jspb.Message {
  getEntitiesList(): Array<GetEntityReply>;
  setEntitiesList(value: Array<GetEntityReply>): void;
  clearEntitiesList(): void;
  addEntities(value?: GetEntityReply, index?: number): GetEntityReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListEntitiesReply.AsObject;
  static toObject(includeInstance: boolean, msg: ListEntitiesReply): ListEntitiesReply.AsObject;
  static serializeBinaryToWriter(message: ListEntitiesReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListEntitiesReply;
  static deserializeBinaryFromReader(message: ListEntitiesReply, reader: jspb.BinaryReader): ListEntitiesReply;
}

export namespace ListEntitiesReply {
  export type AsObject = {
    entitiesList: Array<GetEntityReply.AsObject>,
  }
}

export class GetEntityRequest extends jspb.Message {
  getEntity(): Entity | undefined;
  setEntity(value?: Entity): void;
  hasEntity(): boolean;
  clearEntity(): void;

  getIncludeFactsList(): Array<string>;
  setIncludeFactsList(value: Array<string>): void;
  clearIncludeFactsList(): void;
  addIncludeFacts(value: string, index?: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEntityRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetEntityRequest): GetEntityRequest.AsObject;
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
  getEntity(): Entity | undefined;
  setEntity(value?: Entity): void;
  hasEntity(): boolean;
  clearEntity(): void;

  getFactsList(): Array<Fact>;
  setFactsList(value: Array<Fact>): void;
  clearFactsList(): void;
  addFacts(value?: Fact, index?: number): Fact;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEntityReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetEntityReply): GetEntityReply.AsObject;
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
  getEntity(): Entity | undefined;
  setEntity(value?: Entity): void;
  hasEntity(): boolean;
  clearEntity(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateEntityRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateEntityRequest): CreateEntityRequest.AsObject;
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
  getEntity(): Entity | undefined;
  setEntity(value?: Entity): void;
  hasEntity(): boolean;
  clearEntity(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateEntityReply.AsObject;
  static toObject(includeInstance: boolean, msg: CreateEntityReply): CreateEntityReply.AsObject;
  static serializeBinaryToWriter(message: CreateEntityReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateEntityReply;
  static deserializeBinaryFromReader(message: CreateEntityReply, reader: jspb.BinaryReader): CreateEntityReply;
}

export namespace CreateEntityReply {
  export type AsObject = {
    entity?: Entity.AsObject,
  }
}

export class SetFactRequest extends jspb.Message {
  getEntityuri(): string;
  setEntityuri(value: string): void;

  getName(): string;
  setName(value: string): void;

  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetFactRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetFactRequest): SetFactRequest.AsObject;
  static serializeBinaryToWriter(message: SetFactRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetFactRequest;
  static deserializeBinaryFromReader(message: SetFactRequest, reader: jspb.BinaryReader): SetFactRequest;
}

export namespace SetFactRequest {
  export type AsObject = {
    entityuri: string,
    name: string,
    value: string,
  }
}

export class SetFactReply extends jspb.Message {
  getFact(): Fact | undefined;
  setFact(value?: Fact): void;
  hasFact(): boolean;
  clearFact(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetFactReply.AsObject;
  static toObject(includeInstance: boolean, msg: SetFactReply): SetFactReply.AsObject;
  static serializeBinaryToWriter(message: SetFactReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetFactReply;
  static deserializeBinaryFromReader(message: SetFactReply, reader: jspb.BinaryReader): SetFactReply;
}

export namespace SetFactReply {
  export type AsObject = {
    fact?: Fact.AsObject,
  }
}

export class GetFactRequest extends jspb.Message {
  getEntityuri(): string;
  setEntityuri(value: string): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFactRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetFactRequest): GetFactRequest.AsObject;
  static serializeBinaryToWriter(message: GetFactRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFactRequest;
  static deserializeBinaryFromReader(message: GetFactRequest, reader: jspb.BinaryReader): GetFactRequest;
}

export namespace GetFactRequest {
  export type AsObject = {
    entityuri: string,
    name: string,
  }
}

export class GetFactReply extends jspb.Message {
  getFact(): Fact | undefined;
  setFact(value?: Fact): void;
  hasFact(): boolean;
  clearFact(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFactReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetFactReply): GetFactReply.AsObject;
  static serializeBinaryToWriter(message: GetFactReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFactReply;
  static deserializeBinaryFromReader(message: GetFactReply, reader: jspb.BinaryReader): GetFactReply;
}

export namespace GetFactReply {
  export type AsObject = {
    fact?: Fact.AsObject,
  }
}

export class Entity extends jspb.Message {
  getUri(): string;
  setUri(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Entity.AsObject;
  static toObject(includeInstance: boolean, msg: Entity): Entity.AsObject;
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

