import { AppNode } from '../apis';
import { PortableSchema } from '../schema';
import { Expand } from '../types';
import {
  AnyExtensionDataMap,
  AnyExtensionInputMap,
  ExtensionDataValues,
  ResolvedExtensionInputs,
  createExtension,
} from './createExtension';

/*
 * Copyright 2024 The Backstage Authors
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
interface ExtensionKindOptions<
  TProps,
  TInputs extends AnyExtensionInputMap,
  TOutput extends AnyExtensionDataMap,
  TConfig,
> {
  kind: string;
  namespace?: string;
  name?: string;
  attachTo: { id: string; input: string };
  disabled?: boolean;
  inputs?: TInputs;
  output: TOutput;
  configSchema?: PortableSchema<TConfig>;
  factory(
    options: {
      node: AppNode;
      config: TConfig;
      inputs: Expand<ResolvedExtensionInputs<TInputs>>;
    },
    props: TProps,
  ): Expand<ExtensionDataValues<TOutput>>;
}

class ExtensionKind<
  TProps,
  TInputs extends AnyExtensionInputMap,
  TOutput extends AnyExtensionDataMap,
  TConfig,
> {
  static create<
    TProps,
    TInputs extends AnyExtensionInputMap,
    TOutput extends AnyExtensionDataMap,
    TConfig,
  >(
    options: ExtensionKindOptions<TProps, TInputs, TOutput, TConfig>,
  ): ExtensionKind<TProps, TInputs, TOutput, TConfig> {
    return new ExtensionKind(options);
  }

  private constructor(
    private readonly options: ExtensionKindOptions<
      TProps,
      TInputs,
      TOutput,
      TConfig
    >,
  ) {}

  public new(options: {
    namespace?: string;
    name?: string;
    attachTo?: { id: string; input: string };
    disabled?: boolean;
    inputs?: TInputs;
    output?: TOutput;
    configSchema?: PortableSchema<TConfig>;
    props: TProps;
    factory?(
      options: {
        node: AppNode;
        config: TConfig;
        inputs: Expand<ResolvedExtensionInputs<TInputs>>;
        orignalFactory(
          options?: {
            node?: AppNode;
            config?: TConfig;
            inputs?: Expand<ResolvedExtensionInputs<TInputs>>;
          },
          props?: TProps,
        ): Expand<ExtensionDataValues<TOutput>>;
      },
      props: TProps,
    ): Expand<ExtensionDataValues<TOutput>>;
  }) {
    return createExtension({
      kind: this.options.kind,
      namespace: options.namespace ?? this.options.namespace,
      name: options.name ?? this.options.name,
      attachTo: options.attachTo ?? this.options.attachTo,
      disabled: options.disabled ?? this.options.disabled,
      inputs: options.inputs ?? this.options.inputs,
      output: options.output ?? this.options.output,
      configSchema: options.configSchema ?? this.options.configSchema, // TODO: some config merging or smth
      factory: ({ node, config, inputs }) => {
        if (options.factory) {
          return options.factory(
            {
              node,
              config,
              inputs,
              orignalFactory: (
                innerOptions?: {
                  node?: AppNode;
                  config?: TConfig;
                  inputs?: Expand<ResolvedExtensionInputs<TInputs>>;
                },
                innerProps?: TProps,
              ) =>
                this.options.factory(
                  {
                    node: innerOptions?.node ?? node,
                    config: innerOptions?.config ?? config,
                    inputs: innerOptions?.inputs ?? inputs,
                  },
                  innerProps ?? options.props,
                ),
            },
            options.props,
          );
        }

        return this.options.factory(
          {
            node,
            config,
            inputs,
          },
          options.props,
        );
      },
    });
  }
}

/**
 * A simpler replacement for wrapping up `createExtension` inside a kind or type. This allows for a cleaner API for creating
 * types and instances of those types.
 */
export function createExtensionKind<
  TProps,
  TInputs extends AnyExtensionInputMap,
  TOutput extends AnyExtensionDataMap,
  TConfig,
>(options: ExtensionKindOptions<TProps, TInputs, TOutput, TConfig>) {
  return ExtensionKind.create(options);
}
