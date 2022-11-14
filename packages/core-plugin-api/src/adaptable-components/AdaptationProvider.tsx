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
  ComponentAdaptation,
  AdaptableComponentPropsInterceptor,
  AdaptableComponentAdaptation,
  AdaptableComponentRef,
} from './types';

/**
 * Prop types for the ApiProvider component.
 * @public
 */
export type AdaptationProviderProps = {
  /**
   * An adaptation or an array of adaptations to apply from this provider and
   * downstream
   */
  adaptations?: ComponentAdaptation<any, any>[] | ComponentAdaptation<any, any>;

  /**
   * Reset (exclude) all previously registered adaptations
   */
  reset?: boolean;
};

type WrapAdaptation<T> = T & { adaptation: ComponentAdaptation<any, any> };

type PropsInterceptor<
  TProps extends {},
  TAdaptableKeys extends keyof TProps,
> = WrapAdaptation<{
  propsInterceptor: AdaptableComponentPropsInterceptor<TProps, TAdaptableKeys>;
}>;

type Adaptation<
  TProps extends {},
  TAdaptableKeys extends keyof TProps,
> = WrapAdaptation<{
  component: AdaptableComponentAdaptation<TProps, TAdaptableKeys>;
}>;

/** The component ref provider key is its id */
type AdaptationMapKey = string;
/**
 * The component ref provider value is a pre-flattened list of props
 * interceptors and adaptation components
 * */
type AdaptationMapValue<
  TProps extends {},
  TAdaptableKeys extends keyof TProps,
> = {
  propsInterceptors: PropsInterceptor<TProps, TAdaptableKeys>[];
  components: Adaptation<TProps, TAdaptableKeys>[];
};

/**
 * The context stores a map between the component ref and an object with a list
 * of props-interceptors and providers.
 *
 * A map and pre-flattened arrays that makes it very fast to lookup whether a
 * component has adaptations, and if so, iterating its props-interceptors and
 * providers.
 */
type ContextType = {
  adaptationMap: Map<AdaptationMapKey, AdaptationMapValue<any, any>>;
};

const VersionedContext = createVersionedContext<{ 1: ContextType }>(
  'adaptation-context',
);

/**
 * Provides an {@link @backstage/core-plugin-api#ApiHolder} for consumption in
 * the React tree.
 *
 * @public
 */
export function AdaptationProvider(
  props: PropsWithChildren<AdaptationProviderProps>,
) {
  const { adaptations, reset = false, children } = props;
  const parentContext = useContext(VersionedContext)?.atVersion(1);

  const contextValue = useMemo((): ContextType => {
    const adaptationMap = reset
      ? cloneAdaptationMap(undefined)
      : cloneAdaptationMap(parentContext?.adaptationMap);

    if (adaptations) {
      appendAdaptationMap(
        adaptationMap,
        Array.isArray(adaptations) ? adaptations : [adaptations],
      );
    }

    return { adaptationMap };
  }, [parentContext?.adaptationMap, adaptations, reset]);

  const versionedValue = useMemo(
    () => createVersionedValueMap({ 1: contextValue }),
    [contextValue],
  );

  return (
    <VersionedContext.Provider value={versionedValue} children={children} />
  );
}

/** Deep-clones an adaptation map */
function cloneAdaptationMap(
  parent: Map<AdaptationMapKey, AdaptationMapValue<any, any>> | undefined,
): Map<AdaptationMapKey, AdaptationMapValue<any, any>> {
  // Clone map, and create new arrays for the values so we can mutate them
  const flatMap = [...(parent?.entries() ?? [])].map(
    ([key, val]): [AdaptationMapKey, AdaptationMapValue<any, any>] => [
      key,
      {
        components: [...val.components],
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
 * If two or more of the same adaptation is found for a certain component ref,
 * only the first one should be used. Duplicate adaptations of the same component
 * will likely lead to undefined behaviour.
 */
function appendAdaptationMap(
  adaptationMap: Map<AdaptationMapKey, AdaptationMapValue<any, any>>,
  adaptations: ComponentAdaptation<any, any>[],
): void {
  adaptations.forEach(adaptation => {
    const { ref, spec, key } = adaptation;
    const value = ensureMapValue(adaptationMap, ref.id);

    if (
      spec.Adaptation &&
      !value.components.find(component => component.adaptation.key === key)
    ) {
      value.components.push({ component: spec.Adaptation, adaptation });
    }
    if (
      spec.interceptProps &&
      !value.propsInterceptors.find(
        interceptor => interceptor.adaptation.key === key,
      )
    ) {
      value.propsInterceptors.push({
        propsInterceptor: spec.interceptProps,
        adaptation,
      });
    }
  });
}

const noAdaptations: AdaptationMapValue<any, any> = {
  propsInterceptors: [],
  components: [],
};

export function useComponentAdaptations<
  TProps extends {} = any,
  TAdaptableKeys extends keyof TProps = any,
>(
  componentRef: AdaptableComponentRef<TProps, TAdaptableKeys, any>,
): AdaptationMapValue<any, any> {
  const { adaptationMap } = useContext(VersionedContext)?.atVersion(1) ?? {};

  return adaptationMap?.get(componentRef.id) ?? noAdaptations;
}

export function ensureMapValue(
  map: Map<AdaptationMapKey, AdaptationMapValue<any, any>>,
  key: AdaptationMapKey,
) {
  const value = map.get(key);

  if (value) {
    return value;
  }

  const newValue: AdaptationMapValue<any, any> = {
    propsInterceptors: [],
    components: [],
  };
  map.set(key, newValue);
  return newValue;
}
