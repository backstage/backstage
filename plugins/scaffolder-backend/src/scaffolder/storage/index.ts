import { Logger } from "winston";

/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export interface Template {
  id: string;
  name: string;
  description: string;
  ownerId: string;
}

export abstract class StorageBase {
  // lists all templates available
  abstract async list(): Promise<Template[]>;
  // can be used to build an index of the available templates;
  abstract async reindex(): Promise<void>;
  // returns a directory to run the templaterin
  abstract async prepare(id: string): Promise<string>;
}

export interface StorageConfig {
  store?: StorageBase;
  logger?: Logger;
}

class Storage implements StorageBase {
  store?: StorageBase;

  constructor({ store }: StorageConfig) {
    this.store = store;
  }

  list = () => this.store!.list();
  prepare = (id: string) => this.store!.prepare(id);
  reindex = () => this.store!.reindex();
}

export const createStorage = (
  storageConfig: StorageConfig,
): StorageBase => {
  return new Storage(storageConfig);
};
