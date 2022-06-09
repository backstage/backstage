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
  ComponentProps,
} from 'react';
import { useAsync } from 'react-use';

import { useComponentAdaptations } from './AdaptationProvider';
import { ensureValidId } from './id';
import {
  AdaptableComponentDescriptor,
  AdaptableComponentAdaptation,
  AdaptableComponentRef,
  AdaptableComponentConfig,
  AdaptableComponentConfigSyncProvider,
  AdaptableComponentConfigAsyncProvider,
  AdaptableComponentConfigSyncComponent,
  AdaptableComponentConfigAsyncComponent,
  OpaqueComponentProps,
  RefInfoProps,
  UnimplementedAdaptableComponentRefConfig,
} from './types';

/**
 * Creates a reference to an unimplemented component.
 *
 * The component must be implemented using {@link implementAdaptableComponent()}.
 *
 * @param config - The descriptor of the component to reference.
 * @returns An adaptable component reference.
 * @public
 */
export function createAdaptableComponentRef<
  Props extends {},
  Context extends {},
>(
  config: UnimplementedAdaptableComponentRefConfig,
): AdaptableComponentRef<Props, Context> {
  ensureValidId(config.id, `Invalid adaptable component id "${config.id}"`);

  return {
    id: config.id,
    forwardable: false,
    Provider: undefined as any,
    Component: undefined as any,
  };
}

/**
 * Creates a reference to an unimplemented component with support for forwarding
 * ref.
 *
 * The component must be implemented using
 * {@link implementAdaptableComponent()}.
 *
 * @param config - The descriptor of the component to reference.
 * @returns An adaptable component reference.
 * @public
 */
export function createAdaptableForwardableComponentRef<
  Props extends {},
  Context extends {},
>(
  config: UnimplementedAdaptableComponentRefConfig,
): AdaptableComponentRef<Props, Context, RefInfoProps> {
  const ref = createAdaptableComponentRef(config) as AdaptableComponentRef<
    Props,
    Context,
    RefInfoProps
  >;
  ref.forwardable = true;
  return ref;
}

// Makes sure we have a sync Provider (or turns the asyncProvider into a sync component), and the same for Component
function handleAsyncComponents<
  Props extends {},
  Context extends {},
  ExtraProps extends {},
>(
  config: Omit<AdaptableComponentConfig<Props, Context, ExtraProps>, 'id'>,
  id: string,
): Pick<
  AdaptableComponentRef<Props, Context, ExtraProps>,
  'Provider' | 'Component'
> {
  const configSyncProvider = config as AdaptableComponentConfigSyncProvider<
    Props,
    Context
  >;

  const configAsyncProvider = config as AdaptableComponentConfigAsyncProvider<
    Props,
    Context
  >;

  const configSyncComponent = config as AdaptableComponentConfigSyncComponent<
    Props,
    Context,
    ExtraProps
  >;

  const configAsyncComponent = config as AdaptableComponentConfigAsyncComponent<
    Props,
    Context,
    ExtraProps
  >;

  if (configSyncProvider.Provider && !!configAsyncProvider.asyncProvider) {
    throw new Error(
      `Cannot implement adaptable component "${id}": ` +
        `Both Provider and asyncProvider are specified`,
    );
  }
  if (configSyncComponent.Component && !!configAsyncComponent.asyncComponent) {
    throw new Error(
      `Cannot implement adaptable component "${id}": ` +
        `Both Component and asyncComponent are specified`,
    );
  }

  const LazyProvider: typeof configSyncProvider.Provider = props => {
    const { error, value: AsyncProvider } = useAsync(() =>
      configAsyncProvider.asyncProvider(),
    );

    if (error) {
      throw error;
    } else if (!AsyncProvider) {
      return null;
    }
    return <AsyncProvider {...props} />;
  };

  const LazyComponent: typeof configSyncComponent.Component = props => {
    const { error, value: AsyncComponent } = useAsync(() =>
      configAsyncComponent.asyncComponent(),
    );

    if (error) {
      throw error;
    } else if (!AsyncComponent) {
      return null;
    }
    return <AsyncComponent {...props} />;
  };

  const Provider = configSyncProvider.Provider ?? LazyProvider;
  const Component = configSyncComponent.Component ?? LazyComponent;

  return {
    Provider,
    Component,
  };
}

/**
 * Implement an adaptable component given an unimplemented component ref.
 *
 * @returns AdaptableComponentDescriptor
 */
export function implementAdaptableComponent<
  Props extends {},
  Context extends {},
  ExtraProps extends {},
>(
  componentRef: AdaptableComponentRef<Props, Context, ExtraProps>,
  config: Omit<AdaptableComponentConfig<Props, Context, ExtraProps>, 'id'>,
): ComponentType<Props & ExtraProps> {
  if (componentRef.Component || componentRef.Provider) {
    throw new Error(`Component ref "${componentRef.id}" already implemented`);
  }

  const handled = handleAsyncComponents(config, componentRef.id);

  componentRef.Component = handled.Component;
  componentRef.Provider = handled.Provider;

  const useRef = componentRef.forwardable;

  const ctx = createContext<Context | undefined>(undefined);

  const ComponentProvider = ctx.Provider;

  const Component = (props: Props, ref: any) => {
    const { components, propsInterceptors } =
      useComponentAdaptations(componentRef);

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

    // Turn the list of adaptations, and the final inner component, into a
    // component tree.
    const { AdaptedComponent } = useMemo(() => {
      function InnerMostComponent() {
        type InfoType = ComponentProps<typeof componentRef.Component>['info'];

        const value = useContext(ctx)!;
        const info = useMemo(() => (useRef ? { ref } : {}) as InfoType, []);

        return (
          <componentRef.Component info={info} props={newProps} value={value} />
        );
      }

      function makeIntermediateComponent(
        Inner: React.ComponentType<{}>,
        Adaptation: AdaptableComponentAdaptation<any, any>,
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
            <Adaptation
              Component={OpaqueComponent}
              props={newProps}
              value={currentValue}
            />
          );
        };
      }

      return {
        AdaptedComponent: components
          .reverse()
          .reduce<ComponentType<{}>>(
            (prev, cur) => makeIntermediateComponent(prev, cur.component),
            InnerMostComponent,
          ),
      };
    }, [components, newProps, ref]);

    function OuterComponent({ value }: OpaqueComponentProps<Context>) {
      if (!value) {
        throw new Error(
          `Invalid adaptable component. No context value provided.`,
        );
      }

      return (
        <ComponentProvider value={value}>
          <AdaptedComponent />
        </ComponentProvider>
      );
    }

    return (
      <componentRef.Provider props={newProps} Component={OuterComponent} />
    );
  };

  return useRef
    ? (forwardRef(Component) as any as typeof Component)
    : Component;
}

function _createAdaptableComponent<Props extends {}, Context extends {}>(
  config: AdaptableComponentConfig<Props, Context>,
  useRef: boolean,
): AdaptableComponentDescriptor<Props, Context> {
  const componentRef = useRef
    ? createAdaptableForwardableComponentRef<Props, Context>(config)
    : createAdaptableComponentRef<Props, Context>(config);

  const Component = implementAdaptableComponent(componentRef, config);

  return { Component, componentRef };
}

/**
 * Create an adaptable component, by providing a Provider component and a
 * Component component.
 *
 * @returns AdaptableComponentDescriptor
 */
export function createAdaptableComponent<Props extends {}, Context>(
  config: AdaptableComponentConfig<Props, Context>,
): AdaptableComponentDescriptor<Props, Context> {
  return _createAdaptableComponent(config, false);
}

/**
 * Create an adaptable component, by providing a Provider component and a
 * Component component. The component can take a React ref, which will be the
 * `ref` property of the `info` prop in the inner Component.
 *
 * @returns AdaptableComponentDescriptor
 */
export function createAdaptableForwardableComponent<Props extends {}, Context>(
  config: AdaptableComponentConfig<Props, Context, RefInfoProps>,
): AdaptableComponentDescriptor<Props, Context, RefInfoProps> {
  return _createAdaptableComponent(config, true);
}
