/*
 * Copyright 2020 Spotify AB
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

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  const mockNavigate = jest.fn();
  return {
    ...actual,
    useNavigate: jest.fn(() => mockNavigate),
    useParams: jest.fn(),
  };
});

import { ApiProvider, ApiRegistry, errorApiRef } from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import { wrapInTestApp } from '@backstage/test-utils';
import { render, waitFor } from '@testing-library/react';
import * as React from 'react';
import { CatalogApi, catalogApiRef } from '../../api/types';
import { EntityPage, getPageTheme } from './EntityPage';

const {
  useParams,
  useNavigate,
}: { useParams: jest.Mock; useNavigate: () => jest.Mock } = jest.requireMock(
  'react-router-dom',
);

const errorApi = { post: () => {} };

describe('EntityPage', () => {
  it('should redirect to catalog page when name is not provided', async () => {
    useParams.mockReturnValue({
      kind: 'Component',
      optionalNamespaceAndName: '',
    });

    render(
      wrapInTestApp(
        <ApiProvider
          apis={ApiRegistry.from([
            [errorApiRef, errorApi],
            [
              catalogApiRef,
              ({
                async getEntityByName() {},
              } as Partial<CatalogApi>) as CatalogApi,
            ],
          ])}
        >
          <EntityPage />
        </ApiProvider>,
      ),
    );

    await waitFor(() => expect(useNavigate()).toHaveBeenCalledWith('/catalog'));
  });
});

describe('getPageTheme', () => {
  const defaultPageTheme = getPageTheme();
  it.each(['service', 'app', 'library', 'tool', 'documentation', 'website'])(
    'should select right theme for predefined type: %p ̰ ',
    type => {
      const theme = getPageTheme(({
        spec: {
          type,
        },
      } as any) as Entity);
      expect(theme).toBeDefined();
      expect(theme).not.toBe(defaultPageTheme);
    },
  );

  it('should select default theme for unknown/unspecified types', () => {
    const theme1 = getPageTheme(({
      spec: {
        type: 'unknown-type',
      },
    } as any) as Entity);
    const theme2 = getPageTheme(({
      spec: {},
    } as any) as Entity);
    expect(theme1).toBe(defaultPageTheme);
    expect(theme2).toBe(defaultPageTheme);
  });
});
