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
import { AnalyticsDomainValue, AnyAnalyticsDomain } from './types';

export const AnalyticsDomainContext = createContext<AnalyticsDomainValue>({
  routeRef: 'unknown',
  pluginId: 'root',
  componentName: 'App',
});

/**
 * A "private" (to this package) hook that enables context inheritance and a
 * way to read Analytics Domain values at event capture-time.
 * @private
 */
export const useAnalyticsDomain = () => {
  return useContext(AnalyticsDomainContext);
};

/**
 * Provides components in the child react tree an Analytics Domain, ensuring
 * all analytics events captured within the domain have relevant contextual
 * attributes.
 *
 * Analytics domains are additive, meaning the domain ultimately emitted with
 * an event is the combination of all domains in the parent tree.
 */
export const AnalyticsDomain = ({
  attributes,
  children,
}: {
  attributes: AnalyticsDomainValue;
  children: ReactNode;
}) => {
  const parentValues = useAnalyticsDomain();
  const combinedValue = {
    ...parentValues,
    ...attributes,
  };

  return (
    <AnalyticsDomainContext.Provider value={combinedValue}>
      {children}
    </AnalyticsDomainContext.Provider>
  );
};

/**
 * Returns an HOC wrapping the provided component in an Analytics Domain with
 * the given values.
 *
 * @param Component - Component to be wrapped with analytics domain attributes.
 * @param domain - Analytics domain key/value pairs.
 */
export function withAnalyticsDomain<P>(
  Component: React.ComponentType<P>,
  domain: AnyAnalyticsDomain,
) {
  const ComponentWithAnalyticsDomain = (props: P) => {
    return (
      <AnalyticsDomain attributes={domain}>
        <Component {...props} />
      </AnalyticsDomain>
    );
  };
  ComponentWithAnalyticsDomain.displayName = `WithAnalyticsDomain(${
    Component.displayName || Component.name || 'Component'
  })`;
  return ComponentWithAnalyticsDomain;
}
