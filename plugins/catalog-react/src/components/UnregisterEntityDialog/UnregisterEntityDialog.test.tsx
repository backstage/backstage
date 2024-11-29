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

jest.mock('./useUnregisterEntityDialogState');

import userEvent from '@testing-library/user-event';
import React from 'react';
import { UnregisterEntityDialog } from './UnregisterEntityDialog';
import { ANNOTATION_ORIGIN_LOCATION } from '@backstage/catalog-model';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { catalogApiRef } from '../../api';
import { entityRouteRef } from '../../routes';
import { screen, waitFor } from '@testing-library/react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import * as state from './useUnregisterEntityDialogState';
import { AlertApi, alertApiRef } from '@backstage/core-plugin-api';

describe('UnregisterEntityDialog', () => {
  const alertApi: AlertApi = {
    post() {
      return undefined;
    },
    alert$() {
      throw new Error('not implemented');
    },
  };

  beforeEach(() => {
    jest.spyOn(alertApi, 'post').mockImplementation(() => {});
  });

  const entity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'n',
      namespace: 'ns',
      annotations: {
        [ANNOTATION_ORIGIN_LOCATION]: 'url:http://example.com',
      },
    },
    spec: {},
  };

  const Wrapper = (props: { children?: React.ReactNode }) => (
    <TestApiProvider
      apis={[
        [catalogApiRef, catalogApiMock()],
        [alertApiRef, alertApi],
      ]}
    >
      {props.children}
    </TestApiProvider>
  );

  const stateSpy = jest.spyOn(state, 'useUnregisterEntityDialogState');

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('can cancel', async () => {
    const onClose = jest.fn();
    stateSpy.mockImplementation(() => ({
      type: 'bootstrap',
      location: '',
      deleteEntity: jest.fn(),
    }));

    await renderInTestApp(
      <Wrapper>
        <UnregisterEntityDialog
          open
          onClose={onClose}
          onConfirm={() => {}}
          entity={entity}
        />
      </Wrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );

    await userEvent.click(screen.getByText('Cancel'));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('handles the loading state', async () => {
    stateSpy.mockImplementation(() => ({ type: 'loading' }));

    await renderInTestApp(
      <Wrapper>
        <UnregisterEntityDialog
          open
          onClose={() => {}}
          onConfirm={() => {}}
          entity={entity}
        />
      </Wrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );

    await waitFor(() => {
      expect(screen.getByTestId('progress')).toBeInTheDocument();
    });
  });

  it('handles the error state', async () => {
    stateSpy.mockImplementation(() => ({
      type: 'error',
      error: new TypeError('eek!'),
    }));

    await renderInTestApp(
      <Wrapper>
        <UnregisterEntityDialog
          open
          onClose={() => {}}
          onConfirm={() => {}}
          entity={entity}
        />
      </Wrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );

    await waitFor(() => {
      expect(screen.getAllByText('eek!').length).toBeGreaterThan(0);
      expect(screen.getAllByText('TypeError').length).toBeGreaterThan(0);
    });
  });

  it('handles the bootstrap state', async () => {
    const deleteEntity = jest.fn();
    const onConfirm = jest.fn();

    stateSpy.mockImplementation(() => ({
      type: 'bootstrap',
      location: 'bootstrap:bootstrap',
      deleteEntity,
    }));

    await renderInTestApp(
      <Wrapper>
        <UnregisterEntityDialog
          open
          onClose={() => {}}
          onConfirm={onConfirm}
          entity={entity}
        />
      </Wrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );

    await waitFor(() => {
      expect(screen.getByText(/You cannot unregister/)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Advanced Options'));

    await waitFor(() => {
      expect(screen.getByText(/option to delete/)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Delete Entity'));

    await waitFor(() => {
      expect(deleteEntity).toHaveBeenCalled();
      expect(onConfirm).toHaveBeenCalled();
    });
  });

  it('handles the only-delete state', async () => {
    const deleteEntity = jest.fn();
    const onConfirm = jest.fn();

    stateSpy.mockImplementation(() => ({
      type: 'only-delete',
      location: 'url:http://example.com',
      deleteEntity,
    }));

    await renderInTestApp(
      <Wrapper>
        <UnregisterEntityDialog
          open
          onClose={() => {}}
          onConfirm={onConfirm}
          entity={entity}
        />
      </Wrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );

    await waitFor(() => {
      expect(
        screen.getByText(/You therefore only have the option to delete it/),
      ).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Delete Entity'));

    await waitFor(() => {
      expect(deleteEntity).toHaveBeenCalled();
      expect(onConfirm).toHaveBeenCalled();
    });
  });

  it('handles the unregister state, choosing to unregister', async () => {
    const unregisterLocation = jest.fn();
    const deleteEntity = jest.fn();
    const onConfirm = jest.fn();

    stateSpy.mockImplementation(() => ({
      type: 'unregister',
      location: 'url:http://example.com',
      colocatedEntities: [
        { kind: 'k1', namespace: 'ns1', name: 'n1' },
        { kind: 'k2', namespace: 'ns2', name: 'n2' },
      ],
      unregisterLocation,
      deleteEntity,
    }));

    await renderInTestApp(
      <Wrapper>
        <UnregisterEntityDialog
          open
          onClose={() => {}}
          onConfirm={onConfirm}
          entity={entity}
        />
      </Wrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );

    await waitFor(() => {
      expect(
        screen.getByText(/will unregister the following entities/),
      ).toBeInTheDocument();
      expect(screen.getByText(/ns1\/n1/)).toBeInTheDocument();
      expect(screen.getByText(/ns2\/n2/)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Unregister Location'));

    await waitFor(() => {
      expect(unregisterLocation).toHaveBeenCalled();
      expect(onConfirm).toHaveBeenCalled();
    });
  });

  it('handles the unregister state, choosing to delete', async () => {
    const unregisterLocation = jest.fn();
    const deleteEntity = jest.fn();
    const onConfirm = jest.fn();

    stateSpy.mockImplementation(() => ({
      type: 'unregister',
      location: 'url:http://example.com',
      colocatedEntities: [
        { kind: 'k1', namespace: 'ns1', name: 'n1' },
        { kind: 'k2', namespace: 'ns2', name: 'n2' },
      ],
      unregisterLocation,
      deleteEntity,
    }));

    await renderInTestApp(
      <Wrapper>
        <UnregisterEntityDialog
          open
          onClose={() => {}}
          onConfirm={onConfirm}
          entity={entity}
        />
      </Wrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );

    await waitFor(() => {
      expect(
        screen.getByText(/will unregister the following entities/),
      ).toBeInTheDocument();
      expect(screen.getByText(/ns1\/n1/)).toBeInTheDocument();
      expect(screen.getByText(/ns2\/n2/)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Advanced Options'));

    await waitFor(() => {
      expect(
        screen.getByText(/You also have the option to delete/),
      ).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Delete Entity'));

    await waitFor(() => {
      expect(deleteEntity).toHaveBeenCalled();
      expect(onConfirm).toHaveBeenCalled();
      expect(alertApi.post).toHaveBeenCalledWith({
        message: 'Removed entity n',
        severity: 'success',
        display: 'transient',
      });
    });
  });
});
