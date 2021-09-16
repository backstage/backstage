/*
 * Copyright 2021 The Backstage Authors
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

import React, { createContext, ReactNode, useContext } from 'react';
import { AnalyticsContextValue } from './types';

const AnalyticsReactContext = createContext<AnalyticsContextValue>({
  routeRef: 'unknown',
  pluginId: 'root',
  extension: 'App',
});

/**
 * A "private" (to this package) hook that enables context inheritance and a
 * way to read Analytics Context values at event capture-time.
 * @private
 */
export const useAnalyticsContext = () => {
  return useContext(AnalyticsReactContext);
};

/**
 * Provides components in the child react tree an Analytics Context, ensuring
 * all analytics events captured within the context have relevant attributes.
 *
 * Analytics contexts are additive, meaning the context ultimately emitted with
 * an event is the combination of all contexts in the parent tree.
 */
export const AnalyticsContext = ({
  attributes,
  children,
}: {
  attributes: AnalyticsContextValue;
  children: ReactNode;
}) => {
  const parentValues = useAnalyticsContext();
  const combinedValue = {
    ...parentValues,
    ...attributes,
  };

  return (
    <AnalyticsReactContext.Provider value={combinedValue}>
      {children}
    </AnalyticsReactContext.Provider>
  );
};

/**
 * Returns an HOC wrapping the provided component in an Analytics context with
 * the given values.
 *
 * @param Component - Component to be wrapped with analytics context attributes
 * @param values - Analytics context key/value pairs.
 */
export function withAnalyticsContext<P>(
  Component: React.ComponentType<P>,
  values: AnalyticsContextValue,
) {
  const ComponentWithAnalyticsContext = (props: P) => {
    return (
      <AnalyticsContext attributes={values}>
        <Component {...props} />
      </AnalyticsContext>
    );
  };
  ComponentWithAnalyticsContext.displayName = `WithAnalyticsContext(${
    Component.displayName || Component.name || 'Component'
  })`;
  return ComponentWithAnalyticsContext;
}
