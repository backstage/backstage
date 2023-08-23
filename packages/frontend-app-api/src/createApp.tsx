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
import { Config, ConfigReader } from '@backstage/config';
import {
  ExtensionInstanceConfig,
  BackstagePlugin,
  coreExtensionData,
} from '@backstage/frontend-plugin-api';
import { RouteExtension } from './extensions/RouteExtension';
import {
  createExtensionInstance,
  ExtensionInstance,
} from './createExtensionInstance';

// Since we'll never merge arrays in config the config reader context
// isn't too much of a help. Fall back to manual config reading logic
// as the Config interface makes it quite hard for us otherwise.
function readAppExtensionConfigs(
  rootConfig: Config,
): Partial<ExtensionInstanceConfig>[] {
  const arr = rootConfig.getOptional('app.extensions');
  if (!Array.isArray(arr)) {
    if (arr === undefined) {
      return [];
    }
    // This will throw, and show which part of config had the wrong type
    rootConfig.getConfigArray('app.extensions');
    return [];
  }

  return arr.map((value, index) => {
    function errorMsg(msg: string, key?: string, prop?: string) {
      return `Invalid extension configuration at app.extensions[${index}]${
        key ? `[${key}]` : ''
      }${prop ? `.${prop}` : ''}, ${msg}`;
    }

    if (typeof value === 'string') {
      return { id: value };
    } else if (
      typeof value !== 'object' ||
      value === null ||
      Array.isArray(value)
    ) {
      throw new Error(errorMsg('must be a string or an object'));
    }

    const keys = Object.keys(value);
    if (keys.length !== 1) {
      const joinedKeys = `"${keys.join('", "')}"`;
      throw new Error(errorMsg(`must have exactly one key, got ${joinedKeys}`));
    }

    const key = keys[0];
    const obj = value[key];
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
      throw new Error(errorMsg('must be an object', key));
    }
    const at = obj.at;
    if (at !== undefined && typeof at !== 'string') {
      throw new Error(errorMsg('must be a string', key, 'at'));
    }
    const extension = obj.extension;
    if (extension !== undefined && typeof extension !== 'string') {
      throw new Error(errorMsg('must be a string', key, 'extension'));
    }
    if (extension) {
      throw new Error('TODO: implement extension resolution');
    }
    return { id: key, at, config: obj.config /* validate later */ };
  });
}

/** @public */
export function createApp(options: { plugins: BackstagePlugin[] }): {
  createRoot(): JSX.Element;
} {
  const appConfig = ConfigReader.fromConfigs(process.env.APP_CONFIG as any);

  // pull in default extension instance from discovered packages
  // apply config to adjust default extension instances and add more
  const extensionInstanceConfigs = [
    ...options.plugins.flatMap(plugin => plugin.defaultExtensionInstances),
    {
      id: 'core.router',
      at: 'root/default',
      extension: RouteExtension,
      config: undefined,
    },
  ];

  const appExtensionConfigs = readAppExtensionConfigs(appConfig);
  for (const appExtensionConfig of appExtensionConfigs) {
    const existingConfig = extensionInstanceConfigs.find(
      e => e.id === appExtensionConfig.id,
    );
    if (existingConfig) {
      if (appExtensionConfig.at) {
        existingConfig.at = appExtensionConfig.at;
      }
      if (appExtensionConfig.extension) {
        // TODO: do we want to reset config here? it might be completely
        // unrelated to the previous one
        existingConfig.extension = appExtensionConfig.extension;
      }
      if (appExtensionConfig.config) {
        // TODO: merge config?
        existingConfig.config = appExtensionConfig.config;
      }
    } else if (appExtensionConfig.id) {
      const { id, at, extension, config } = appExtensionConfig;
      if (!at || !extension) {
        throw new Error(`Extension ${appExtensionConfig.id} is incomplete`);
      }
      extensionInstanceConfigs.push({ id, at, extension, config });
    }
  }

  // Create attachment map so that we can look attachments up during instance creation
  const attachmentMap = new Map<
    string,
    Map<string, ExtensionInstanceConfig[]>
  >();
  for (const instanceConfig of extensionInstanceConfigs) {
    const [extensionId, pointId = 'default'] = instanceConfig.at.split('/');

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

    instances.push(instanceConfig);
  }

  const instances = new Map<string, ExtensionInstance>();

  function createInstance(
    instanceConfig: ExtensionInstanceConfig,
  ): ExtensionInstance {
    const existingInstance = instances.get(instanceConfig.id);
    if (existingInstance) {
      return existingInstance;
    }

    const attachments = Object.fromEntries(
      Array.from(attachmentMap.get(instanceConfig.id)?.entries() ?? []).map(
        ([inputName, attachmentConfigs]) => [
          inputName,
          attachmentConfigs.map(createInstance),
        ],
      ),
    );

    return createExtensionInstance({
      id: instanceConfig.id,
      config: instanceConfig.config,
      extension: instanceConfig.extension,
      attachments,
    });
  }

  const rootConfigs = attachmentMap.get('root')?.get('default') ?? [];
  const rootInstances = rootConfigs.map(instanceConfig =>
    createInstance(instanceConfig),
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
