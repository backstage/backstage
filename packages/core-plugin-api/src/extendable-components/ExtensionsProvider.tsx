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

import React, { useContext, PropsWithChildren, useMemo } from 'react';
import {
  createVersionedValueMap,
  createVersionedContext,
} from '@backstage/version-bridge';

import {
  ComponentExtension,
  ExtendableComponentPropsInterceptor,
  ExtendableComponentProvider,
  ExtendableComponentRef,
} from './types';

/**
 * Prop types for the ApiProvider component.
 * @public
 */
export type ExtensionsProviderProps = {
  /**
   * An extension or an array of extensions
   */
  extensions: ComponentExtension<any, any>[] | ComponentExtension<any, any>;
};

type WrapExtension<T> = T & { extension: ComponentExtension<any, any> };

type PropsInterceptor<Props extends {}> = WrapExtension<{
  propsInterceptor: ExtendableComponentPropsInterceptor<Props>;
}>;

type Provider<Props extends {}, Context extends {}> = WrapExtension<{
  provider: ExtendableComponentProvider<Props, Context>;
}>;

type ExtensionMapKey = ExtendableComponentRef<any, any, any>;
type ExtensionMapValue<Props extends {}, Context extends {}> = {
  propsInterceptors: PropsInterceptor<Props>[];
  providers: Provider<Props, Context>[];
};

/**
 * The context stores a map between the component ref and an object with a list
 * of props-interceptors and providers.
 *
 * A map and pre-flattened arrays that makes it very fast to lookup whether a
 * component has extensions, and if so, iterating its props-interceptors and
 * providers.
 */
type ContextType = {
  extensionMap: Map<ExtensionMapKey, ExtensionMapValue<any, any>>;
};

const VersionedContext = createVersionedContext<{ 1: ContextType }>(
  'extension-context',
);

/**
 * Provides an {@link @backstage/core-plugin-api#ApiHolder} for consumption in
 * the React tree.
 *
 * @public
 */
export function ExtensionsProvider(
  props: PropsWithChildren<ExtensionsProviderProps>,
) {
  const { extensions, children } = props;
  const parentContext = useContext(VersionedContext)?.atVersion(1);

  const contextValue = useMemo((): ContextType => {
    const extensionMap = cloneExtensionMap(parentContext?.extensionMap);

    appendExtensionMap(
      extensionMap,
      Array.isArray(extensions) ? extensions : [extensions],
    );

    return { extensionMap };
  }, [parentContext?.extensionMap, extensions]);

  const versionedValue = useMemo(
    () => createVersionedValueMap({ 1: contextValue }),
    [contextValue],
  );

  return (
    <VersionedContext.Provider value={versionedValue} children={children} />
  );
}

/** Deep-clones an extension map */
function cloneExtensionMap(
  parent: Map<ExtensionMapKey, ExtensionMapValue<any, any>> | undefined,
): Map<ExtensionMapKey, ExtensionMapValue<any, any>> {
  // Clone map, and create new arrays for the values so we can mutate them
  const flatMap = [...(parent?.entries() ?? [])].map(
    ([key, val]): [ExtensionMapKey, ExtensionMapValue<any, any>] => [
      key,
      {
        providers: [...val.providers],
        propsInterceptors: [...val.propsInterceptors],
      },
    ],
  );
  return new Map(flatMap);
}

/**
 * Flatten the providers and propsInterceptors per component ref. This makes it
 * fast to use them.
 *
 * If two or more of the same extension is found for a certain component ref,
 * only the first one should be used. Duplicate extensions of the same component
 * will likely lead to undefined behaviour.
 */
function appendExtensionMap(
  extensionMap: Map<ExtensionMapKey, ExtensionMapValue<any, any>>,
  extensions: ComponentExtension<any, any>[],
): void {
  extensions.forEach(extension => {
    const { ref, spec, key } = extension;
    const value = ensureMapValue(extensionMap, ref);

    if (
      spec.Provider &&
      !value.providers.find(provider => provider.extension.key === key)
    ) {
      value.providers.push({ provider: spec.Provider, extension });
    }
    if (
      spec.interceptProps &&
      !value.propsInterceptors.find(
        interceptor => interceptor.extension.key === key,
      )
    ) {
      value.propsInterceptors.push({
        propsInterceptor: spec.interceptProps,
        extension,
      });
    }
  });
}

const noExtensions: ExtensionMapValue<any, any> = {
  propsInterceptors: [],
  providers: [],
};

export function useComponentExtensions<Props extends {} = any, Context = any>(
  componentRef: ExtendableComponentRef<Props, Context, any>,
): ExtensionMapValue<any, any> {
  const { extensionMap } = useContext(VersionedContext)?.atVersion(1) ?? {};

  return extensionMap?.get(componentRef) ?? noExtensions;
}

export function ensureMapValue(
  map: Map<ExtensionMapKey, ExtensionMapValue<any, any>>,
  key: ExtensionMapKey,
) {
  const value = map.get(key);

  if (value) {
    return value;
  }

  const newValue: ExtensionMapValue<any, any> = {
    propsInterceptors: [],
    providers: [],
  };
  map.set(key, newValue);
  return newValue;
}
