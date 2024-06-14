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

import { AppNode } from '../apis';
import { PortableSchema } from '../schema';
import { Expand } from '../types';
import {
  AnyExtensionDataMap,
  AnyExtensionInputMap,
  ExtensionDataValues,
  ResolvedExtensionInputs,
  createExtension,
  createExtensionDataRef,
} from '../wiring';

/**
 * Helper for creating extensions for a nav logos.
 * @public
 */
export function createNavLogoExtension(options: {
  name?: string;
  namespace?: string;
  logoIcon: JSX.Element;
  logoFull: JSX.Element;
}) {
  const { logoIcon, logoFull } = options;
  return createExtension({
    kind: 'nav-logo',
    name: options?.name,
    namespace: options?.namespace,
    attachTo: { id: 'app/nav', input: 'logos' },
    output: {
      logos: createNavLogoExtension.logoElementsDataRef,
    },
    factory: () => {
      return {
        logos: {
          logoIcon,
          logoFull,
        },
      };
    },
  });
}

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

  /** Creates an extension of this type */
  public create(options: {
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

function createExtensionKind<
  TProps,
  TInputs extends AnyExtensionInputMap,
  TOutput extends AnyExtensionDataMap,
  TConfig,
>(options: ExtensionKindOptions<TProps, TInputs, TOutput, TConfig>) {
  return ExtensionKind.create(options);
}

const NavLogoExtension = createExtensionKind({
  kind: 'nav-logo',
  attachTo: { id: 'app/nav', input: 'logos' }, // tbd, this could be a reference instead of string values.
  output: {
    logos: createNavLogoExtension.logoElementsDataRef,
  },
  factory: (
    { inputs },
    props: { logoIcon: JSX.Element; logoFull: JSX.Element },
  ) => {
    return {
      logos: {
        logoIcon: props.logoIcon,
        logoFull: props.logoFull,
      },
    };
  },
});

const myLogoExtension = NavLogoExtension.create({
  name: 'test',
  props: {
    logoFull: <div>Logo Full</div>,
    logoIcon: <div>Logo Icon</div>,
  },
});

/** @public */
export namespace createNavLogoExtension {
  export const logoElementsDataRef = createExtensionDataRef<{
    logoIcon?: JSX.Element;
    logoFull?: JSX.Element;
  }>('core.nav-logo.logo-elements');
}
