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
  forwardRef,
  ComponentProps,
  ComponentClass,
} from 'react';
import { useAsync } from 'react-use';

import { ComponentType } from '@backstage/types';

import { useComponentAdaptations } from './AdaptationProvider';
import { ensureValidId } from './id';
import {
  AdaptableComponentDescriptor,
  AdaptableComponentAdaptation,
  AdaptableComponentRef,
  AdaptableComponentConfig,
  AdaptableComponentConfigSyncPrepare,
  AdaptableComponentConfigAsyncPrepare,
  AdaptableComponentConfigSyncComponent,
  AdaptableComponentConfigAsyncComponent,
  OpaqueComponentProps,
  RefInfoProps,
  UnimplementedAdaptableComponentRefConfig,
  AdaptableForwardableComponentDescriptor,
  // AdaptableForwardableComponentDescriptor,
  // AdaptableForwardableComponentRef,
} from './types';
import { ensureArray } from '../utils/array';
import { useReusedObjectReference } from '../hooks';

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
  TProps extends {},
  TAdaptableKeys extends keyof TProps,
>(
  config: UnimplementedAdaptableComponentRefConfig,
): AdaptableComponentRef<TProps, TAdaptableKeys> {
  ensureValidId(config.id, `Invalid adaptable component id "${config.id}"`);

  return {
    id: config.id,
    forwardable: false,
    Prepare: undefined as any,
    Component: undefined as any,
    // This is a type helper:
    TAdaptation: undefined as any,
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
  TProps extends {},
  TAdaptableKeys extends keyof TProps,
>(
  config: UnimplementedAdaptableComponentRefConfig,
): AdaptableComponentRef<TProps, TAdaptableKeys, RefInfoProps, true> {
  const ref = createAdaptableComponentRef(config) as AdaptableComponentRef<
    TProps,
    TAdaptableKeys,
    RefInfoProps
  > as unknown as AdaptableComponentRef<
    TProps,
    TAdaptableKeys,
    RefInfoProps,
    true
  >;
  ref.forwardable = true;
  return ref;
}

// Makes sure we have a sync Prepare (or turns the asyncPrepare into a sync
// component), and the same for Component
function handleAsyncComponents<
  TProps extends {},
  TAdaptableKeys extends keyof TProps,
  TExtraProps extends {},
>(
  config: Omit<
    AdaptableComponentConfig<TProps, TAdaptableKeys, TExtraProps>,
    'id'
  >,
  id: string,
): Pick<
  AdaptableComponentRef<TProps, TAdaptableKeys, TExtraProps>,
  'Prepare' | 'Component'
> {
  const configSyncPrepare = config as AdaptableComponentConfigSyncPrepare<
    TProps,
    TAdaptableKeys
  >;

  const configAsyncPrepare = config as AdaptableComponentConfigAsyncPrepare<
    TProps,
    TAdaptableKeys
  >;

  const configSyncComponent = config as AdaptableComponentConfigSyncComponent<
    TProps,
    TExtraProps
  >;

  const configAsyncComponent = config as AdaptableComponentConfigAsyncComponent<
    TProps,
    TExtraProps
  >;

  if (configSyncPrepare.Prepare && !!configAsyncPrepare.asyncPrepare) {
    throw new Error(
      `Cannot implement adaptable component "${id}": ` +
        `Both Prepare and asyncPrepare are specified`,
    );
  }
  if (configSyncComponent.Component && !!configAsyncComponent.asyncComponent) {
    throw new Error(
      `Cannot implement adaptable component "${id}": ` +
        `Both Component and asyncComponent are specified`,
    );
  }

  const DefaultPrepare: typeof configSyncPrepare.Prepare = ({ Component }) => {
    return <Component />;
  };

  const LazyPrepare: typeof configSyncPrepare.Prepare = props => {
    const { error, value: AsyncPrepare } = useAsync(() =>
      configAsyncPrepare.asyncPrepare(),
    );

    if (error) {
      throw error;
    } else if (!AsyncPrepare) {
      return null;
    }
    return <AsyncPrepare {...props} />;
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

  const Prepare =
    configSyncPrepare.Prepare ??
    (config.asyncPrepare ? LazyPrepare : DefaultPrepare);
  const Component = configSyncComponent.Component ?? LazyComponent;

  return {
    Prepare,
    Component,
  };
}

interface AdaptableContext<TProps extends {}, TExtraProps extends {}> {
  props: TProps;
  curProps: TProps;
  extraProps: TExtraProps;
}

/**
 * Hook used in the outer Prepare component, and in each intermediate adaptation.
 *
 * It figures out whether or not to update the context based on set/unset props.
 */
function useNewContext<
  TProps extends {},
  TAdaptableKeys extends keyof TProps,
  TExtraProps extends {},
>(
  ctx: React.Context<AdaptableContext<TProps, TExtraProps> | undefined>,
  intermediateProps: OpaqueComponentProps<Pick<TProps, TAdaptableKeys>>,
) {
  const context = useContext(ctx)!;

  const set = useReusedObjectReference(intermediateProps.set);

  const unsetArray = useMemo(
    () => ensureArray(intermediateProps.unset),
    [intermediateProps.unset],
  );
  const setLength = useMemo(() => (!set ? 0 : Object.keys(set).length), [set]);

  const newContext = useMemo(() => {
    let curProps = context.curProps;
    if (unsetArray.length === 0 && setLength === 0) {
      // This adaptation doesn't remove or add/set any props
      return context;
    }

    curProps = { ...curProps };

    unsetArray.forEach(prop => {
      delete curProps[prop as TAdaptableKeys];
    });

    if (set) {
      Object.assign(curProps, set);
    }

    const anyChanged = (
      [
        ...new Set([...(set ? Object.keys(set) : []), ...unsetArray]),
      ] as (keyof TProps)[]
    ).some(prop => curProps[prop] !== context.curProps[prop]);

    if (!anyChanged) {
      // This adaptation sets/unsets props, but the result is the same
      // value as from before the adaptation, just flow through with the
      // (referentially) same context value
      return context;
    }

    return {
      ...context,
      curProps,
    };
  }, [context, unsetArray, set, setLength]);

  const unchanged = unsetArray.length === 0 && setLength === 0;

  return { newContext, unchanged };
}

type ImplementedAdaptableComponent<
  TClassBased extends boolean,
  TProps,
> = TClassBased extends true ? ComponentClass<TProps> : ComponentType<TProps>;

/**
 * Implement an adaptable component given an unimplemented component ref.
 *
 * @returns AdaptableComponentDescriptor
 */
export function implementAdaptableComponent<
  TProps extends {},
  TAdaptableKeys extends keyof TProps,
  TExtraProps extends {} = {},
  TForwardable extends boolean = boolean,
>(
  componentRef: AdaptableComponentRef<
    TProps,
    TAdaptableKeys,
    TExtraProps,
    TForwardable
  >,
  config: Omit<
    AdaptableComponentConfig<TProps, TAdaptableKeys, TExtraProps>,
    'id'
  >,
): ImplementedAdaptableComponent<TForwardable, TProps & TExtraProps> {
  if (componentRef.Component || componentRef.Prepare) {
    throw new Error(`Component ref "${componentRef.id}" already implemented`);
  }

  const handled = handleAsyncComponents(config, componentRef.id);

  componentRef.Component = React.memo(handled.Component);
  componentRef.Prepare = React.memo(handled.Prepare);

  const useRef = componentRef.forwardable;

  // This context is shared with the outer Prepare, the inner Component and all
  // adaptations inbetween.
  //
  // By e.g. moving the props into this context, means we don't need to depend
  // on props when constructing the component tree, and so the component tree
  // doesn't need to be re-created (causing _complete_ downstream component
  // reset) when props change. Only when the adaptation setup changes (which it
  // likely never will).
  type InfoType = ComponentProps<typeof componentRef.Component>['info'];
  type AdaptableContextType = AdaptableContext<TProps, InfoType>;
  const ctx = createContext<AdaptableContextType | undefined>(undefined);

  const ComponentProvider = ctx.Provider;

  const Component = (props: TProps, ref: any) => {
    const { components, propsInterceptors } =
      useComponentAdaptations(componentRef);

    const { props: newProps } = useMemo(
      () => ({
        props: ((p: TProps) =>
          propsInterceptors.reduce(
            (prev, cur) => ({ ...prev, ...cur.propsInterceptor(prev) }),
            p,
          ))(props),
      }),
      [props, propsInterceptors],
    );

    // Turn the list of adaptations, and the final inner component, into a
    // component tree.
    const { AdaptedComponent } = useMemo(() => {
      function InnerMostComponent() {
        const value = useContext(ctx)!;

        const refProps: any = !useRef
          ? {}
          : {
              ref: (value.extraProps as RefInfoProps).ref,
            };

        return (
          <componentRef.Component
            origProps={value.props}
            info={value.extraProps}
            props={value.curProps}
            {...refProps}
          />
        );
      }

      function makeIntermediateComponent(
        Inner: React.ComponentType<{}>,
        Adaptation: AdaptableComponentAdaptation<TProps, TAdaptableKeys>,
      ): ComponentType<{}> {
        const OpaqueComponent = React.memo(function OpaqueComponent(
          intermediateProps: OpaqueComponentProps<Pick<TProps, TAdaptableKeys>>,
        ) {
          const { newContext, unchanged } = useNewContext(
            ctx,
            intermediateProps,
          );

          if (unchanged) {
            return <Inner />;
          }

          return (
            <ComponentProvider value={newContext}>
              <Inner />
            </ComponentProvider>
          );
        });

        return React.memo(function IntermediateComponent() {
          const currentValue = useContext(ctx)!;

          return (
            <Adaptation
              Component={OpaqueComponent}
              props={currentValue.curProps}
              origProps={currentValue.props}
            />
          );
        });
      }

      return {
        AdaptedComponent: components
          .reverse()
          .reduce<ComponentType<{}>>(
            (prev, cur) => makeIntermediateComponent(prev, cur.component),
            InnerMostComponent,
          ),
      };
    }, [components]);

    const { OuterComponent } = useMemo(
      () => ({
        OuterComponent: React.memo(function Outer(
          intermediateProps: OpaqueComponentProps<Pick<TProps, TAdaptableKeys>>,
        ) {
          const { newContext, unchanged } = useNewContext(
            ctx,
            intermediateProps,
          );

          if (unchanged) {
            return <AdaptedComponent />;
          }

          return (
            <ComponentProvider value={newContext}>
              <AdaptedComponent />
            </ComponentProvider>
          );
        }),
      }),
      [AdaptedComponent],
    );

    const initialContext: AdaptableContextType = useMemo(
      () => ({
        curProps: newProps,
        extraProps: (useRef ? { ref } : {}) as InfoType,
        props: newProps,
      }),
      [newProps, ref],
    );

    return (
      <ComponentProvider value={initialContext}>
        <componentRef.Prepare props={newProps} Component={OuterComponent} />
      </ComponentProvider>
    );
  };

  return (
    useRef
      ? (forwardRef(Component) as unknown as ComponentType<
          TProps & TExtraProps
        >)
      : Component
  ) as ImplementedAdaptableComponent<TForwardable, TProps & TExtraProps>;
}

function _createAdaptableComponent<
  TProps extends {},
  TAdaptableKeys extends keyof TProps,
>(
  config: AdaptableComponentConfig<TProps, TAdaptableKeys>,
  useRef: boolean,
): AdaptableComponentDescriptor<TProps, TAdaptableKeys> {
  const componentRef = useRef
    ? createAdaptableForwardableComponentRef<TProps, TAdaptableKeys>(config)
    : createAdaptableComponentRef<TProps, TAdaptableKeys>(config);

  const Component = implementAdaptableComponent(componentRef, config);

  return {
    Component,
    componentRef,
  };
}

/**
 * Create an adaptable component, by providing a Provider component and a
 * Component component.
 *
 * @returns AdaptableComponentDescriptor
 */
export function createAdaptableComponent<
  TProps extends {},
  TAdaptableKeys extends keyof TProps,
>(
  config: AdaptableComponentConfig<TProps, TAdaptableKeys>,
): AdaptableComponentDescriptor<TProps, TAdaptableKeys> {
  return _createAdaptableComponent(config, false);
}

/**
 * Create an adaptable component, by providing a Provider component and a
 * Component component. The component can take a React ref, which will be the
 * `ref` property of the `info` prop in the inner Component.
 *
 * @returns AdaptableComponentDescriptor
 */
export function createAdaptableForwardableComponent<
  TProps extends {},
  TAdaptableKeys extends keyof TProps,
>(
  config: AdaptableComponentConfig<TProps, TAdaptableKeys, RefInfoProps>,
): AdaptableForwardableComponentDescriptor<
  TProps,
  TAdaptableKeys,
  RefInfoProps
> {
  return _createAdaptableComponent(
    config,
    true,
  ) as AdaptableForwardableComponentDescriptor<
    TProps,
    TAdaptableKeys,
    RefInfoProps
  >;
}
