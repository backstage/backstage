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

import React from 'react';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import {
  AnalyticsDomain,
  useAnalyticsDomain,
  withAnalyticsDomain,
} from './AnalyticsDomain';

const DomainSpy = () => {
  const domain = useAnalyticsDomain();
  return (
    <>
      <div data-testid="route-ref">{domain.routeRef}</div>
      <div data-testid="plugin-id">{domain.pluginId}</div>
      <div data-testid="component-name">{domain.componentName}</div>
      <div data-testid="custom">{domain.custom}</div>
    </>
  );
};

describe('AnalyticsDomain', () => {
  describe('useAnalyticsDomain', () => {
    it('returns default values', () => {
      const { result } = renderHook(() => useAnalyticsDomain());
      expect(result.current).toEqual({
        componentName: 'App',
        pluginId: 'root',
        routeRef: 'unknown',
      });
    });
  });

  describe('AnalyticsDomain', () => {
    it('uses default analytics domain', () => {
      const result = render(
        <AnalyticsDomain attributes={{}}>
          <DomainSpy />
        </AnalyticsDomain>,
      );

      expect(result.getByTestId('component-name')).toHaveTextContent('App');
      expect(result.getByTestId('plugin-id')).toHaveTextContent('root');
      expect(result.getByTestId('route-ref')).toHaveTextContent('unknown');
    });

    it('uses provided analytics domain', () => {
      const result = render(
        <AnalyticsDomain attributes={{ pluginId: 'custom' }}>
          <DomainSpy />
        </AnalyticsDomain>,
      );

      expect(result.getByTestId('component-name')).toHaveTextContent('App');
      expect(result.getByTestId('plugin-id')).toHaveTextContent('custom');
      expect(result.getByTestId('route-ref')).toHaveTextContent('unknown');
    });

    it('uses nested analytics domain', () => {
      const result = render(
        <AnalyticsDomain attributes={{ pluginId: 'custom' }}>
          <AnalyticsDomain attributes={{ componentName: 'DomainSpy' }}>
            <DomainSpy />
          </AnalyticsDomain>
        </AnalyticsDomain>,
      );

      expect(result.getByTestId('component-name')).toHaveTextContent(
        'DomainSpy',
      );
      expect(result.getByTestId('plugin-id')).toHaveTextContent('custom');
      expect(result.getByTestId('route-ref')).toHaveTextContent('unknown');
    });
  });

  describe('withAnalyticsDomain', () => {
    it('wraps component with analytics domain', () => {
      const DomainSpyHOC = withAnalyticsDomain(DomainSpy, { custom: 'attr' });
      const result = render(<DomainSpyHOC />);
      expect(result.getByTestId('custom')).toHaveTextContent('attr');
      expect(DomainSpyHOC.displayName).toBe('WithAnalyticsDomain(DomainSpy)');
    });
  });
});
