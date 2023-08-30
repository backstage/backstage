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

import React from 'react';
import { ConfigReader } from '@backstage/config';
import {
  BackstagePlugin,
  coreExtensionData,
} from '@backstage/frontend-plugin-api';
import { RouteExtension } from './extensions/RouteExtension';
import {
  createExtensionInstance,
  ExtensionInstance,
} from './createExtensionInstance';
import {
  ExtensionInstanceParameters,
  mergeExtensionParameters,
  readAppExtensionParameters,
} from './wiring/parameters';

/** @public */
export function createApp(options: { plugins: BackstagePlugin[] }): {
  createRoot(): JSX.Element;
} {
  const appConfig = ConfigReader.fromConfigs(process.env.APP_CONFIG as any);

  const builtinExtensions = [RouteExtension];

  // pull in default extension instance from discovered packages
  // apply config to adjust default extension instances and add more
  const extensionParams = mergeExtensionParameters(
    [
      ...options.plugins.flatMap(plugin => plugin.defaultExtensions),
      ...builtinExtensions,
    ],
    readAppExtensionParameters(appConfig),
  );

  // TODO: validate the config of all extension instances
  // We do it at this point to ensure that merging (if any) of config has already happened

  // Create attachment map so that we can look attachments up during instance creation
  const attachmentMap = new Map<
    string,
    Map<string, ExtensionInstanceParameters[]>
  >();
  for (const instanceParams of extensionParams) {
    const [extensionId, pointId = 'default'] = instanceParams.at.split('/');

    let pointMap = attachmentMap.get(extensionId);
    if (!pointMap) {
      pointMap = new Map();
      attachmentMap.set(extensionId, pointMap);
    }

    let instances = pointMap.get(pointId);
    if (!instances) {
      instances = [];
      pointMap.set(pointId, instances);
    }

    instances.push(instanceParams);
  }

  const instances = new Map<string, ExtensionInstance>();

  function createInstance(
    instanceParams: ExtensionInstanceParameters,
  ): ExtensionInstance {
    const existingInstance = instances.get(instanceParams.extension.id);
    if (existingInstance) {
      return existingInstance;
    }

    const attachments = Object.fromEntries(
      Array.from(
        attachmentMap.get(instanceParams.extension.id)?.entries() ?? [],
      ).map(([inputName, attachmentConfigs]) => [
        inputName,
        attachmentConfigs.map(createInstance),
      ]),
    );

    return createExtensionInstance({
      extension: instanceParams.extension,
      config: instanceParams.config,
      attachments,
    });
  }

  const rootConfigs = attachmentMap.get('root')?.get('default') ?? [];
  const rootInstances = rootConfigs.map(instanceParams =>
    createInstance(instanceParams),
  );

  return {
    createRoot() {
      const rootComponents = rootInstances.map(
        e =>
          e.data.get(
            coreExtensionData.reactComponent.id,
          ) as typeof coreExtensionData.reactComponent.T,
      );
      return (
        <>
          {rootComponents.map(Component => (
            <Component />
          ))}
        </>
      );
    },
  };
}
