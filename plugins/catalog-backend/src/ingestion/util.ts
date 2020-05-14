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

import { Location } from '../catalog/types';
import { ComponentDescriptor } from '../descriptors';
import { readFileLocation } from './fileLocation';

export async function readLocation(
  location: Location,
): Promise<ComponentDescriptor[]> {
  switch (location.type) {
    case 'file':
      return await readFileLocation(location.target);
    default:
      throw new Error(`Unknown type "${location.type}"`);
  }
}
