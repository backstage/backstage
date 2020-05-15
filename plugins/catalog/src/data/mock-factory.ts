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
import { Component, ComponentFactory } from './component';
import mock from './mock-factory-data.json';

const ARTIFICIAL_TIMEOUT = 800;
let inMemoryStore = [...mock];
export const MockComponentFactory: ComponentFactory = {
  getAllComponents(): Promise<Component[]> {
    return new Promise((resolve) =>
      setTimeout(() => resolve(inMemoryStore), ARTIFICIAL_TIMEOUT),
    );
  },
  getComponentByName(name: string): Promise<Component | undefined> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const mockComponent = inMemoryStore.find(
          (component) => component.name === name,
        );
        if (mockComponent) return resolve(mockComponent);
        return reject({ code: 'Component not found!' });
      }, ARTIFICIAL_TIMEOUT),
    );
  },
  removeComponentByName(name: string): Promise<boolean> {
    return new Promise((resolve) =>
      setTimeout(() => {
        inMemoryStore = inMemoryStore.filter(
          (component) => component.name !== name,
        );
        resolve(true);
      }, ARTIFICIAL_TIMEOUT),
    );
  },
};
