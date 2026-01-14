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

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  useMemo,
} from 'react';
import {
  PluginWrapperApi,
  PluginWrapperDefinition,
} from '@backstage/frontend-plugin-api';

type ComponentWithChild = (props: {
  children: ReactNode;
}) => JSX.Element | null;

type HookStore = {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => { value: unknown } | undefined;
};

type HookRegistryContextValue = {
  registerHook: (key: any, hook: () => unknown) => HookStore;
};

const HookRegistryContext = createContext<HookRegistryContextValue | undefined>(
  undefined,
);

type WrapperInput = {
  loader: () => Promise<PluginWrapperDefinition<any>>;
  pluginId: string;
};

/**
 * Default implementation of PluginWrapperApi.
 *
 * @internal
 */
export class DefaultPluginWrapperApi implements PluginWrapperApi {
  constructor(
    private readonly rootWrapper: ComponentWithChild,
    private readonly pluginWrappers: Map<string, ComponentWithChild>,
  ) {}

  getRootWrapper(): ComponentWithChild {
    return this.rootWrapper;
  }

  getPluginWrapper(pluginId: string): ComponentWithChild | undefined {
    return this.pluginWrappers.get(pluginId);
  }

  static fromWrappers(wrappers: Array<WrapperInput>): DefaultPluginWrapperApi {
    const loadersByPlugin = new Map<
      string,
      Array<() => Promise<PluginWrapperDefinition>>
    >();

    for (const wrapper of wrappers) {
      let loaders = loadersByPlugin.get(wrapper.pluginId);
      if (!loaders) {
        loaders = [];
        loadersByPlugin.set(wrapper.pluginId, loaders);
      }
      loaders.push(wrapper.loader);
    }

    const composedWrappers = new Map<string, ComponentWithChild>();

    for (const [pluginId, loaders] of loadersByPlugin) {
      if (loaders.length === 0) {
        continue;
      }

      const WrapperWithState = ({
        loader,
        component: WrapperComponent,
        useWrapperValue,
        children,
      }: {
        loader: () => Promise<PluginWrapperDefinition<any>>;
        component: (props: {
          children: ReactNode;
          value: unknown;
        }) => JSX.Element | null;
        useWrapperValue: () => unknown;
        children: ReactNode;
      }) => {
        const hookContext = useContext(HookRegistryContext);
        if (!hookContext) {
          throw new Error(
            'Attempted to render a wrapped plugin component without a root wrapper context',
          );
        }
        const store = useMemo(() => {
          return hookContext.registerHook(loader, useWrapperValue);
        }, [hookContext, loader, useWrapperValue]);
        const container = useSyncExternalStore(
          store.subscribe,
          store.getSnapshot,
        );

        if (!container) {
          return null;
        }

        return (
          <WrapperComponent value={container.value}>
            {children}
          </WrapperComponent>
        );
      };

      const ComposedWrapper = (props: { children: ReactNode }) => {
        const [loadedWrappers, setLoadedWrappers] = useState<
          Array<ComponentWithChild> | undefined
        >(undefined);
        const [error, setError] = useState<Error | undefined>(undefined);

        useEffect(() => {
          Promise.all(loaders.map(loader => loader()))
            .then(results => {
              const normalizedResults = results.map(
                ({ component, useWrapperValue }, index) => {
                  const loader = loaders[index];

                  if (!useWrapperValue) {
                    return component as (props: {
                      children: ReactNode;
                    }) => JSX.Element | null;
                  }

                  return ({ children }: { children: ReactNode }) => (
                    <WrapperWithState
                      loader={loader}
                      component={component}
                      useWrapperValue={useWrapperValue}
                    >
                      {children}
                    </WrapperWithState>
                  );
                },
              );

              setLoadedWrappers(normalizedResults);
            })
            .catch(setError);
        }, []);

        if (error) {
          throw error;
        }

        if (!loadedWrappers) {
          return null;
        }

        let content = props.children;

        for (const Wrapper of loadedWrappers) {
          content = <Wrapper>{content}</Wrapper>;
        }

        return <>{content}</>;
      };

      composedWrappers.set(pluginId, ComposedWrapper);
    }

    const renderers = new Map<any, HookStore>();
    const renderUpdateListeners = new Set<() => void>();

    let renderElements = new Array<JSX.Element>();

    const createHookRenderer = (hook: () => unknown): HookStore => {
      const listeners = new Set<() => void>();
      let container: { value: unknown } | undefined = undefined;

      const HookRenderer = () => {
        container = { value: hook() };
        useEffect(() => {
          for (const listener of listeners) {
            listener();
          }
        });
        return null;
      };

      renderElements = [
        ...renderElements,
        <HookRenderer key={`hook-renderer-${renderElements.length + 1}`} />,
      ];

      return {
        getSnapshot: () => container,
        subscribe(listener: () => void) {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
      };
    };

    const registerHook = (key: any, hook: () => unknown) => {
      let renderer = renderers.get(key);
      if (!renderer) {
        renderer = createHookRenderer(hook);
        renderers.set(key, renderer);

        queueMicrotask(() => {
          for (const listener of renderUpdateListeners) {
            listener();
          }
        });
      }
      return renderer;
    };

    const subscribeToRenderUpdates = (listener: () => void) => {
      renderUpdateListeners.add(listener);
      return () => renderUpdateListeners.delete(listener);
    };
    const getRenderElements = () => renderElements;

    const RootWrapper = (props: { children: ReactNode }) => {
      const elements = useSyncExternalStore(
        subscribeToRenderUpdates,
        getRenderElements,
      );

      return (
        <>
          <>{elements}</>
          <HookRegistryContext.Provider
            value={{
              registerHook,
            }}
          >
            {props.children}
          </HookRegistryContext.Provider>
        </>
      );
    };

    return new DefaultPluginWrapperApi(RootWrapper, composedWrappers);
  }
}
