/*
 * Copyright 2021 Spotify AB
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
import { UrlReader } from '@backstage/backend-common';
import { LocationSpec } from '@backstage/catalog-model';
import {
  results,
  CatalogProcessor,
  CatalogProcessorEmit,
} from '@backstage/plugin-catalog-backend';

type CapabilityInterface = {
  id: string;
  rootId: string;
  name: string;
  description: string;
  members: [];
  contexts: [];
};

// A processor that reads from the fictional System-X
export class CapabilityProcessor implements CatalogProcessor {
  constructor(private readonly reader: UrlReader) {}

  async readLocation(
    location: LocationSpec,
    _optional: boolean,
    emit: CatalogProcessorEmit,
  ): Promise<boolean> {
    // Pick a custom location type string. A location will be
    // registered later with this type.
    if (location.type !== 'dfds-capability') {
      return false;
    }

    try {
      // Use the builtin reader facility to grab data from the
      // API. If you prefer, you can just use plain fetch here
      // (from the cross-fetch package), or any other method of
      // your choosing.
      const data = await this.reader.read(location.target);
      const json = JSON.parse(data.toString());
      json.items.forEach((item: CapabilityInterface) => {
        emit(
          results.entity(location, {
            apiVersion: 'build.dfds.cloud/v1alpha1',
            kind: 'Capability',
            spec: {
              identifier: item.rootId || item.id,
              rootId: item.rootId,
              id: item.id,
              description: item.description || '',
              name: item.name,
              members: item.members,
              contexts: item.contexts,
            },
            metadata: { name: `${item.rootId || item.name}` },
          }),
        );
      });
    } catch (error) {
      const message = `Unable to read ${location.type}, ${error}`;
      emit(results.generalError(location, message));
    }

    return true;
  }
}
