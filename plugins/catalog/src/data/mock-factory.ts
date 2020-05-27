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
import { DescriptorEnvelope } from '../../../catalog-backend/src/ingestion/types';

function transformEnvelopeToComponent(data: DescriptorEnvelope): Component {
  return {
    name: data.metadata?.name ?? '',
    status: data.metadata?.labels?.status ?? 'Up and running',
  };
}

let inMemoryStore: Promise<Component[]>;

export const MockComponentFactory: ComponentFactory = {
  getAllComponents(): Promise<Component[]> {
    inMemoryStore =
      inMemoryStore ??
      fetch('//localhost:3000/catalog/api/entities')
        .then(response => response.json())
        .then(data => data.map(transformEnvelopeToComponent));
    return inMemoryStore;
  },
  async getComponentByName(name: string): Promise<Component | undefined> {
    const components = await this.getAllComponents();
    const mockComponent = components.find(component => component.name === name);
    if (mockComponent) return mockComponent;
    throw new Error(`'Component not found: ${name}`);
  },
  async removeComponentByName(_: string): Promise<boolean> {
    return true;
  },
};
