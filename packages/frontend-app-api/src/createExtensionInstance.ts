/*
 * Copyright 2023 The Backstage Authors
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

import { Extension } from '@backstage/frontend-plugin-api';
import mapValues from 'lodash/mapValues';

/** @internal */
export interface ExtensionInstance {
  id: string;
  data: Map<string, unknown>;
  $$type: 'extension-instance';
}

/** @internal */
export function createExtensionInstance(options: {
  id: string;
  extension: Extension;
  config: unknown;
  attachments: Record<string, ExtensionInstance[]>;
}): ExtensionInstance {
  const { extension, config, attachments } = options;
  const extensionData = new Map<string, unknown>();
  extension.factory({
    config,
    bind: mapValues(extension.output, ref => {
      return (value: unknown) => extensionData.set(ref.id, value);
    }),
    inputs: mapValues(
      extension.inputs,
      ({ extensionData: pointData }, inputName) => {
        // TODO: validation
        return (attachments[inputName] ?? []).map(attachment =>
          mapValues(pointData, ref => attachment.data.get(ref.id)),
        );
      },
    ),
  });
  return { id: options.id, data: extensionData, $$type: 'extension-instance' };
}
