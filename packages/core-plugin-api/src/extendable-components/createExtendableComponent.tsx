/*
 * Copyright 2022 The Backstage Authors
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

import React, {
  createContext,
  useContext,
  useMemo,
  ComponentType,
  forwardRef,
} from 'react';

import { useComponentExtensions } from './ExtensionsProvider';
import {
  ExtendableComponentDescriptor,
  ExtendableComponentProvider,
  ExtendableComponentRef,
  ExtendableComponentRefConfig,
  ExtendableComponentRefConfigForwardRef,
  OpaqueComponentProps,
  RefInfoProps,
} from './types';

export function _createExtendableComponent<Props extends {}, Context>(
  config: ExtendableComponentRefConfig<Props, Context>,
  useRef: boolean,
): ExtendableComponentDescriptor<Props, Context> {
  if (config.id.match(/^[a-z](-?[a-z0-9]+)*$/)) {
    throw new Error(
      `Invalid extendable component id "${config.id}": ` +
        'must only contain lowercase alpha numeric values and dashes (-)',
    );
  }

  const componentRef = useRef
    ? ({ ...config } as ExtendableComponentRef<Props, Context, RefInfoProps>)
    : ({ ...config } as ExtendableComponentRef<Props, Context>);

  const ctx = createContext<Context | undefined>(undefined);

  const ComponentProvider = ctx.Provider;

  const Component = (props: Props, ref: any) => {
    const { providers, propsInterceptors } =
      useComponentExtensions(componentRef);

    const { props: newProps } = useMemo(
      () => ({
        props: ((p: Props) =>
          propsInterceptors.reduce(
            (prev, cur) => cur.propsInterceptor(prev),
            p,
          ))(props),
      }),
      [props, propsInterceptors],
    );

    // Turn the list of extensions, and the final inner component, into a
    // component tree.
    const { ExtendedComponent } = useMemo(() => {
      function InnerMostComponent() {
        const value = useContext(ctx)!;
        const info = useMemo(() => (useRef ? { ref } : {}), []);

        return (
          <componentRef.Component info={info} props={newProps} value={value} />
        );
      }

      function makeIntermediateComponent(
        Inner: React.ComponentType<{}>,
        Extension: ExtendableComponentProvider<any, any>,
      ): ComponentType<{}> {
        return function IntermediateComponent() {
          const currentValue = useContext(ctx);

          function OpaqueComponent({
            value,
          }: Partial<OpaqueComponentProps<Context>>) {
            if (value === undefined) {
              return <Inner />;
            }
            return (
              <ComponentProvider value={value}>
                <Inner />
              </ComponentProvider>
            );
          }

          return (
            <Extension
              Component={OpaqueComponent}
              props={newProps}
              value={currentValue}
            />
          );
        };
      }

      return {
        ExtendedComponent: providers
          .reverse()
          .reduce<ComponentType<{}>>(
            (prev, cur) => makeIntermediateComponent(prev, cur.provider),
            InnerMostComponent,
          ),
      };
    }, [providers, newProps, ref]);

    function OuterComponent({ value }: OpaqueComponentProps<Context>) {
      if (!value) {
        throw new Error(
          `Invalid extendable component. No context value provided.`,
        );
      }

      return (
        <ComponentProvider value={value}>
          <ExtendedComponent />
        </ComponentProvider>
      );
    }

    return (
      <componentRef.Provider props={newProps} Component={OuterComponent} />
    );
  };

  return {
    Component: useRef
      ? (forwardRef(Component) as any as typeof Component)
      : Component,
    componentRef,
  };
}

/**
 * Create an extendable component, by providing a Provider component and a
 * Component component.
 *
 * @returns ExtendableComponentDescriptor
 */
export function createExtendableComponent<Props extends {}, Context>(
  config: ExtendableComponentRefConfig<Props, Context>,
): ExtendableComponentDescriptor<Props, Context> {
  return _createExtendableComponent(config, false);
}

/**
 * Create an extendable component, by providing a Provider component and a
 * Component component. The component can take a React ref, which will be the
 * `ref` property of the `info` prop in the inner Component.
 *
 * @returns ExtendableComponentDescriptor
 */
export function createExtendableComponentForwardRef<Props extends {}, Context>(
  config: ExtendableComponentRefConfigForwardRef<Props, Context>,
): ExtendableComponentDescriptor<Props, Context, RefInfoProps> {
  return _createExtendableComponent(config, true);
}
