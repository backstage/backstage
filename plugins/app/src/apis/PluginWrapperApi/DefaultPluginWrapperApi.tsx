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
  useCallback,
  useRef,
} from 'react';
import {
  PluginWrapperApi,
  PluginWrapperDefinition,
} from '@backstage/frontend-plugin-api';

type ComponentWithChild = (props: {
  children: ReactNode;
}) => JSX.Element | null;

type HookRegistration = {
  key: any;
  hook: () => unknown;
  setter: (value: unknown) => void;
};

type HookRegistryContextValue = {
  registerHook: (registration: HookRegistration) => void;
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
        const [container, setValue] = useState<[value: unknown] | undefined>();

        useEffect(
          () =>
            hookContext.registerHook({
              key: loader,
              setter: (value: unknown) => setValue([value]),
              hook: useWrapperValue,
            }),
          [hookContext, loader, useWrapperValue],
        );

        if (!container) {
          return null;
        }

        return (
          <WrapperComponent value={container[0]}>{children}</WrapperComponent>
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

    type HookRenderer = {
      key: any;
      element: JSX.Element;
      subscribe: (setter: (value: unknown) => void) => void;
      unsubscribe: (setter: (value: unknown) => void) => void;
    };

    let rendererCounter = 1;

    const createHookRenderer = (reg: HookRegistration) => {
      const setters = new Set([reg.setter]);
      let latestValue: unknown = undefined;
      let ranOnce = false;

      const HookRenderer = () => {
        latestValue = reg.hook();
        for (const setter of setters) {
          setter(latestValue);
        }
        ranOnce = true;
        return null;
      };
      return {
        key: reg.key,
        element: <HookRenderer key={`hook-renderer-${rendererCounter++}`} />,
        subscribe(setter: (value: unknown) => void) {
          setters.add(setter);
          if (ranOnce) {
            setter(latestValue);
          }
        },
        unsubscribe(setter: (value: unknown) => void) {
          setters.delete(setter);
        },
      };
    };

    const RootWrapper = (props: { children: ReactNode }) => {
      const renderers = useRef<Array<HookRenderer>>([]); // Array for stable ordering
      const [elements, setElements] = useState<Array<JSX.Element>>([]);

      const registerHook = useCallback((reg: HookRegistration) => {
        let renderer = renderers.current.find(r => r.key === reg.key);
        if (renderer) {
          renderer.subscribe(reg.setter);
        } else {
          renderer = createHookRenderer(reg);
          renderers.current.push(renderer);
          setElements(renderers.current.map(r => r.element));
        }
        return () => {
          renderer.unsubscribe(reg.setter);
        };
      }, []);

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
