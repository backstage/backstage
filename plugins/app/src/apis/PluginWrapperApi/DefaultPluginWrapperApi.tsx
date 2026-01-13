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
  ComponentType,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  PluginWrapperApi,
  PluginWrapperDefinition,
} from '@backstage/frontend-plugin-api';

export type HookRegistryContextValue = {
  registerHooks: (pluginId: string, hooks: Array<() => unknown>) => void;
  getHooks: (pluginId: string) => Array<() => unknown> | undefined;
  getAllHooks: () => Map<string, Array<() => unknown>>;
  getValues: (pluginId: string) => Array<unknown> | undefined;
  setValues: (pluginId: string, values: Array<unknown>) => void;
  hookRegistry: Map<string, Array<() => unknown>>;
};

export const HookRegistryContext = createContext<
  HookRegistryContextValue | undefined
>(undefined);

export function useHookRegistry(): HookRegistryContextValue {
  const context = useContext(HookRegistryContext);
  if (!context) {
    throw new Error(
      'HookRegistryContext must be used within a HookRegistryProvider',
    );
  }
  return context;
}

type WrapperInput = {
  loader: () => Promise<PluginWrapperDefinition>;
  pluginId: string;
};

/**
 * Default implementation of PluginWrapperApi.
 *
 * @internal
 */
export class DefaultPluginWrapperApi implements PluginWrapperApi {
  constructor(
    private readonly rootWrapper: (props: {
      children: ReactNode;
    }) => JSX.Element,
    private readonly pluginWrappers: Map<
      string,
      (props: { children: ReactNode }) => JSX.Element
    >,
  ) {}

  getRootWrapper(): (props: { children: ReactNode }) => JSX.Element {
    return this.rootWrapper;
  }

  getPluginWrapper(
    pluginId: string,
  ): ((props: { children: ReactNode }) => JSX.Element) | undefined {
    return this.pluginWrappers.get(pluginId);
  }

  static fromWrappers(wrappers: Array<WrapperInput>): DefaultPluginWrapperApi {
    const loadersByPlugin = new Map<
      string,
      Array<() => Promise<PluginWrapperDefinition>>
    >();

    for (const wrapper of wrappers) {
      if (!loadersByPlugin.has(wrapper.pluginId)) {
        loadersByPlugin.set(wrapper.pluginId, []);
      }
      loadersByPlugin.get(wrapper.pluginId)!.push(wrapper.loader);
    }

    const pluginContexts = new Map<
      string,
      React.Context<Array<unknown> | undefined>
    >();
    const valueProvidersWithIds: Array<{
      pluginId: string;
      component: (props: { children: ReactNode }) => JSX.Element;
    }> = [];
    const composedWrappers = new Map<
      string,
      (props: { children: ReactNode }) => JSX.Element
    >();

    const HookRegistryProvider = (props: { children: ReactNode }) => {
      const [hookRegistry, setHookRegistry] = useState<
        Map<string, Array<() => unknown>>
      >(new Map());
      const [valueCache, setValueCache] = useState<Map<string, Array<unknown>>>(
        new Map(),
      );

      const registerHooks = useCallback(
        (pluginId: string, hooks: Array<() => unknown>) => {
          setHookRegistry(prev => {
            const next = new Map(prev);
            next.set(pluginId, hooks);
            return next;
          });
        },
        [],
      );

      const getHooks = useCallback(
        (pluginId: string) => {
          return hookRegistry.get(pluginId);
        },
        [hookRegistry],
      );

      const getAllHooks = useCallback(() => {
        return hookRegistry;
      }, [hookRegistry]);

      const getValues = useCallback(
        (pluginId: string) => {
          return valueCache.get(pluginId);
        },
        [valueCache],
      );

      const setValues = useCallback(
        (pluginId: string, values: Array<unknown>) => {
          setValueCache(prev => {
            const next = new Map(prev);
            next.set(pluginId, values);
            return next;
          });
        },
        [],
      );

      const contextValue: HookRegistryContextValue = {
        registerHooks,
        getHooks,
        getAllHooks,
        getValues,
        setValues,
        hookRegistry,
      };

      return (
        <HookRegistryContext.Provider value={contextValue}>
          {props.children}
        </HookRegistryContext.Provider>
      );
    };

    for (const [pluginId, loaders] of loadersByPlugin) {
      if (loaders.length === 0) continue;

      const PluginWrapperValuesContext = createContext<
        Array<unknown> | undefined
      >(undefined);
      pluginContexts.set(pluginId, PluginWrapperValuesContext);

      const ValueProvider = (props: { children: ReactNode }) => {
        const { getValues } = useContext(HookRegistryContext) || {};
        const values = getValues?.(pluginId);

        return (
          <PluginWrapperValuesContext.Provider value={values}>
            {props.children}
          </PluginWrapperValuesContext.Provider>
        );
      };

      valueProvidersWithIds.push({ pluginId, component: ValueProvider });

      const ComposedWrapper = (props: { children: ReactNode }) => {
        const [loadedWrappers, setLoadedWrappers] = useState<Array<{
          component: ComponentType<{ children: ReactNode; value?: unknown }>;
          useWrapperValue?: () => unknown;
        }> | null>(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<Error | null>(null);
        const hookRegistry = useContext(HookRegistryContext);

        useEffect(() => {
          Promise.all(loaders.map(loader => loader()))
            .then(results => {
              setLoadedWrappers(results);

              const hooks = results
                .map(wrapper => wrapper.useWrapperValue)
                .filter((hook): hook is () => unknown => hook !== undefined);

              if (hooks.length > 0 && hookRegistry) {
                hookRegistry.registerHooks(pluginId, hooks);
              }

              setLoading(false);
            })
            .catch(err => {
              setError(err);
              setLoading(false);
            });
        }, [hookRegistry]);

        if (error) {
          throw error;
        }

        const values = useContext(PluginWrapperValuesContext);

        if (loading || !loadedWrappers) {
          return <>{props.children}</>;
        }

        if (!values) {
          return <>{props.children}</>;
        }

        let content = props.children;

        for (let i = loadedWrappers.length - 1; i >= 0; i--) {
          const { component: WrapperComponent } = loadedWrappers[i];
          const value = values[i];
          content = (
            <WrapperComponent value={value}>{content}</WrapperComponent>
          );
        }

        return <>{content}</>;
      };

      composedWrappers.set(pluginId, ComposedWrapper);
    }

    const HookCaller = ({ children }: { children: ReactNode }) => {
      const hookRegistryContext = useContext(HookRegistryContext);
      if (!hookRegistryContext) {
        return <>{children}</>;
      }

      const allHooks = hookRegistryContext.hookRegistry;

      for (const [pluginId, hooks] of allHooks) {
        const values = hooks.map(hook => hook());
        hookRegistryContext.setValues(pluginId, values);
      }

      return <>{children}</>;
    };

    const RootWrapper = (props: { children: ReactNode }) => {
      let content = props.children;

      for (let i = valueProvidersWithIds.length - 1; i >= 0; i--) {
        const ValueProvider = valueProvidersWithIds[i].component;
        content = <ValueProvider>{content}</ValueProvider>;
      }

      return <HookCaller>{content}</HookCaller>;
    };

    const WrappedRootWrapper = (props: { children: ReactNode }) => {
      return (
        <HookRegistryProvider>
          <RootWrapper>{props.children}</RootWrapper>
        </HookRegistryProvider>
      );
    };

    return new DefaultPluginWrapperApi(WrappedRootWrapper, composedWrappers);
  }
}
