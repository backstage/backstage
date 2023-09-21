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

import { PortableSchema } from '../schema';
import { coreExtensionData } from './coreExtensionData';
import { ExtensionDataRef } from './createExtensionDataRef';
import { ExtensionInput, createExtensionInput } from './createExtensionInput';
import { BackstagePlugin } from './createPlugin';

/** @public */
export type AnyExtensionDataMap = {
  [name in string]: ExtensionDataRef<unknown, string, { optional?: true }>;
};

/** @public */
export type AnyExtensionInputMap = {
  [inputName in string]: ExtensionInput<
    AnyExtensionDataMap,
    { optional: boolean; singleton: boolean }
  >;
};

// TODO(Rugvip): This might be a quite useful utility type, maybe add to @backstage/types?
/**
 * Utility type to expand type aliases into their equivalent type.
 * @ignore
 */
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

/**
 * Converts an extension data map into the matching concrete data values type.
 * @public
 */
export type ExtensionDataValues<TExtensionData extends AnyExtensionDataMap> = {
  [DataName in keyof TExtensionData as TExtensionData[DataName]['config'] extends {
    optional: true;
  }
    ? never
    : DataName]: TExtensionData[DataName]['T'];
} & {
  [DataName in keyof TExtensionData as TExtensionData[DataName]['config'] extends {
    optional: true;
  }
    ? DataName
    : never]?: TExtensionData[DataName]['T'];
};

/**
 * Converts an extension input map into the matching concrete input values type.
 * @public
 */
export type ExtensionInputValues<
  TInputs extends { [name in string]: ExtensionInput<any, any> },
> = {
  [InputName in keyof TInputs]: false extends TInputs[InputName]['config']['singleton']
    ? Array<Expand<ExtensionDataValues<TInputs[InputName]['extensionData']>>>
    : false extends TInputs[InputName]['config']['optional']
    ? Expand<ExtensionDataValues<TInputs[InputName]['extensionData']>>
    : Expand<
        ExtensionDataValues<TInputs[InputName]['extensionData']> | undefined
      >;
};

/** @public */
export interface CreateExtensionOptions<
  TOutput extends AnyExtensionDataMap,
  TInputs extends AnyExtensionInputMap,
  TConfig,
> {
  id: string;
  at: string;
  disabled?: boolean;
  inputs?: TInputs;
  output: TOutput;
  configSchema?: PortableSchema<TConfig>;
  factory(options: {
    source?: BackstagePlugin;
    bind(values: Expand<ExtensionDataValues<TOutput>>): void;
    config: TConfig;
    inputs: Expand<ExtensionInputValues<TInputs>>;
  }): void;
}

/** @public */
export interface Extension<
  TOutput extends AnyExtensionDataMap,
  TInputs extends AnyExtensionInputMap,
  TConfig,
> {
  $$type: '@backstage/Extension';
  id: string;
  at: string;
  disabled: boolean;
  inputs: TInputs;
  output: TOutput;
  configSchema?: PortableSchema<TConfig>;
  factory(options: {
    source?: BackstagePlugin;
    bind(values: ExtensionInputValues<any>): void;
    config: TConfig;
    inputs: Record<
      string,
      undefined | Record<string, unknown> | Array<Record<string, unknown>>
    >;
  }): void;
}

/** @public */
export interface ExtensionConfiguration<
  TOutput extends { [id in string]: true },
> {
  id: string;
  outputIds: TOutput;

  config?: unknown;
  disabled?: boolean;
  attachments?: { [inputName in string]: string[] };
}

export type ExtensionConfigurer<
  TOutput extends AnyExtensionDataMap,
  TInputs extends AnyExtensionInputMap,
  TConfig,
> = (options?: {
  config?: TConfig;
  disabled?: boolean;
  attachments?: {
    [inputName in keyof TInputs]: TInputs[inputName]['config']['singleton'] extends true
      ? ExtensionConfiguration<{
          [name in keyof TInputs[inputName]['extensionData'] as TInputs[inputName]['extensionData'][name]['id']]: true;
        }>
      : Array<
          ExtensionConfiguration<{
            [name in keyof TInputs[inputName]['extensionData'] as TInputs[inputName]['extensionData'][name]['id']]: true;
          }>
        >;
  };
}) => ExtensionConfiguration<{
  [name in keyof TOutput as TOutput[name]['id']]: true;
}>;

/** @public */
export function createExtension<
  TOutput extends AnyExtensionDataMap,
  TInputs extends AnyExtensionInputMap,
  TConfig = never,
>(
  options: CreateExtensionOptions<TOutput, TInputs, TConfig>,
): Extension<TOutput, TInputs, TConfig> &
  ExtensionConfigurer<TOutput, TInputs, TConfig> {
  return Object.assign<
    ExtensionConfigurer<TOutput, TInputs, TConfig>,
    Extension<TOutput, TInputs, TConfig>
  >(
    configuredOptions => {
      const attachmentIds =
        configuredOptions?.attachments &&
        Object.fromEntries(
          Object.entries(configuredOptions?.attachments).map(
            ([inputName, attachments]) => [
              inputName,
              [attachments].flat().map(attachment => attachment.id),
            ],
          ),
        );
      return {
        id: options.id,
        outputIds: null as any, // Only used for type safety, ignored at runtime
        config: configuredOptions?.config,
        disabled: configuredOptions?.disabled,
        output: options.output,
        attachments: attachmentIds,
      };
    },
    {
      $$type: '@backstage/Extension',
      id: options.id,
      at: options.at,
      disabled: options.disabled ?? false,
      inputs: options.inputs ?? ({} as TInputs),
      output: options.output,
      configSchema: options.configSchema,
      factory({ bind, config, inputs }) {
        // TODO: Simplify this, but TS wouldn't infer the input type for some reason
        return options.factory({
          bind,
          config,
          inputs: inputs as Expand<ExtensionInputValues<TInputs>>,
        });
      },
    },
  );
}

const a = createExtension({
  id: 'a',
  at: 'root/default',
  inputs: {
    one: createExtensionInput(
      {
        a: coreExtensionData.reactElement,
      },
      { singleton: true },
    ),
    many: createExtensionInput({
      a: coreExtensionData.reactElement,
    }),
  },
  output: {
    a: coreExtensionData.navTarget,
  },
  factory() {},
});

const b = createExtension({
  id: 'b',
  at: 'root/default',
  output: {
    b: coreExtensionData.reactElement,
  },
  factory() {},
});
const c = createExtension({
  id: 'c',
  at: 'root/default',
  output: {
    c: coreExtensionData.routePath,
  },
  factory() {},
});

a({
  attachments: {
    one: b(),
    many: [b()],
  },
});

a({
  attachments: {
    one: [b()], // error, expects a single extension
    many: b(), // error, expects an array of extensions
  },
});

a({
  attachments: {
    one: c(), // error, extension data mismatch
    many: [c()], // error, extension data mismatch
  },
});
