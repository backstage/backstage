/*
 * Copyright 2026 The Backstage Authors
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
  createExtensionTester,
  mockApis,
  renderInTestApp,
  type TestAppOptions,
} from '@backstage/frontend-test-utils';
import {
  dialogApiRef,
  type DialogApiDialog,
  type ExtensionDefinition,
} from '@backstage/frontend-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import {
  EntityContextMenuItemBlueprint,
  type EntityContextMenuItemData,
} from '@backstage/plugin-catalog-react/alpha';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import useCopyToClipboardUnmocked from 'react-use/esm/useCopyToClipboard';
import { SWRConfig } from 'swr';
import { convertLegacyRouteRef } from '@backstage/core-compat-api';
import {
  RiBugLine,
  RiDeleteBinLine,
  RiFileCopyLine,
  type RemixiconComponentType,
} from '@remixicon/react';
import {
  copyEntityUrlContextMenuItem,
  inspectEntityContextMenuItem,
  unregisterEntityContextMenuItem,
} from './contextMenuItems';
import { rootRouteRef, unregisterRedirectRouteRef } from '../routes';
import { EntityContextMenu } from './components/EntityContextMenu';

const useCopyToClipboard = jest.mocked(useCopyToClipboardUnmocked);
jest.mock('react-use/esm/useCopyToClipboard', () => jest.fn());
jest.mock('@backstage/plugin-catalog-react', () => ({
  ...jest.requireActual('@backstage/plugin-catalog-react'),
  UnregisterEntityDialog: () => null,
}));

const entity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: { name: 'artist-lookup' },
};

let navigateTo: ReturnType<typeof useNavigate>;

function RouterProbe() {
  const { pathname } = useLocation();
  navigateTo = useNavigate();
  const [searchParams] = useSearchParams();

  return (
    <>
      <output aria-label="pathname">{pathname}</output>
      <output aria-label="search params">{searchParams.toString()}</output>
    </>
  );
}

function renderMenuItem(
  extension: ExtensionDefinition,
  options: TestAppOptions = {},
) {
  const tester = createExtensionTester(extension);
  const item = {
    data: tester.get(EntityContextMenuItemBlueprint.dataRefs.data),
    node: tester.query(extension).node,
  };

  return renderInTestApp(
    <SWRConfig value={{ provider: () => new Map() }}>
      <EntityProvider entity={entity}>
        <EntityContextMenu contextMenuItems={[item]} />
        <RouterProbe />
      </EntityProvider>
    </SWRConfig>,
    { initialRouteEntries: ['/entity'], ...options },
  );
}

async function findMenuItem(name: string) {
  await userEvent.click(screen.getByRole('button', { name: 'More actions' }));
  return screen.findByRole('menuitem', { name });
}

function createDialog(close: jest.Mock): DialogApiDialog {
  return {
    close,
    update: jest.fn(),
    result: jest.fn(),
  };
}

function expectIcon(
  extension: ExtensionDefinition,
  Icon: RemixiconComponentType,
) {
  const tester = createExtensionTester(extension);
  const data: EntityContextMenuItemData = tester.get(
    EntityContextMenuItemBlueprint.dataRefs.data,
  );

  expect(data.icon?.type).toBe(Icon);
}

describe('context menu items', () => {
  const copyToClipboard = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useCopyToClipboard.mockReturnValue([
      { noUserInteraction: false },
      copyToClipboard,
    ]);
  });

  it('copies the entity URL', async () => {
    renderMenuItem(copyEntityUrlContextMenuItem, {
      apis: [mockApis.alert()],
    });

    const menuItem = await findMenuItem('Copy entity URL');
    expectIcon(copyEntityUrlContextMenuItem, RiFileCopyLine);
    await userEvent.click(menuItem);

    expect(copyToClipboard).toHaveBeenCalledWith(window.location.toString());
  });

  it('posts a transient alert when the entity URL was copied', async () => {
    const alertApi = mockApis.alert();
    useCopyToClipboard.mockReturnValue([
      { noUserInteraction: false, value: 'copied' },
      copyToClipboard,
    ]);

    renderMenuItem(copyEntityUrlContextMenuItem, { apis: [alertApi] });

    await findMenuItem('Copy entity URL');
    await waitFor(() =>
      expect(alertApi.getAlerts()).toContainEqual({
        message: 'Copied!',
        severity: 'info',
        display: 'transient',
      }),
    );
  });

  it('opens the inspect dialog through search params', async () => {
    renderMenuItem(inspectEntityContextMenuItem);

    const menuItem = await findMenuItem('Inspect entity');
    expectIcon(inspectEntityContextMenuItem, RiBugLine);
    await userEvent.click(menuItem);

    expect(screen.getByLabelText('search params')).toHaveTextContent(
      'inspect=',
    );
  });

  it('disables unregister when delete permission is denied', async () => {
    const open = jest.fn();
    renderMenuItem(unregisterEntityContextMenuItem, {
      apis: [
        mockApis.permission({ authorize: AuthorizeResult.DENY }),
        [dialogApiRef, { open }],
      ],
      mountedRoutes: {
        '/catalog': convertLegacyRouteRef(rootRouteRef),
      },
    });

    const menuItem = await findMenuItem('Unregister entity');
    expectIcon(unregisterEntityContextMenuItem, RiDeleteBinLine);
    await waitFor(() =>
      expect(menuItem).toHaveAttribute('aria-disabled', 'true'),
    );
    await userEvent.click(menuItem);

    expect(open).not.toHaveBeenCalled();
  });

  it('opens unregister and falls back to the catalog route after confirmation', async () => {
    const close = jest.fn();
    const open = jest.fn();
    renderMenuItem(unregisterEntityContextMenuItem, {
      apis: [mockApis.permission(), [dialogApiRef, { open }]],
      mountedRoutes: {
        '/catalog': convertLegacyRouteRef(rootRouteRef),
      },
    });

    const menuItem = await findMenuItem('Unregister entity');
    await waitFor(() => expect(menuItem).not.toHaveAttribute('aria-disabled'));
    await userEvent.click(menuItem);

    const renderDialog = open.mock.calls[0][0] as (props: {
      dialog: DialogApiDialog;
    }) => JSX.Element;
    const dialog = renderDialog({ dialog: createDialog(close) });
    act(() => dialog.props.onConfirm());

    expect(close).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(screen.getByLabelText('pathname')).toHaveTextContent('/catalog'),
    );
  });

  it('closes unregister when navigating to another entity', async () => {
    const close = jest.fn();
    const open = jest.fn();
    const { unmount } = renderMenuItem(unregisterEntityContextMenuItem, {
      apis: [mockApis.permission(), [dialogApiRef, { open }]],
      mountedRoutes: {
        '/catalog': convertLegacyRouteRef(rootRouteRef),
      },
    });

    const menuItem = await findMenuItem('Unregister entity');
    await waitFor(() => expect(menuItem).not.toHaveAttribute('aria-disabled'));
    await userEvent.click(menuItem);

    const renderDialog = open.mock.calls[0][0] as (props: {
      dialog: DialogApiDialog;
    }) => JSX.Element;
    const dialog = {
      close,
      update: jest.fn(),
      result: jest.fn(),
    } satisfies DialogApiDialog;
    unmount();
    await renderInTestApp(
      <>
        {renderDialog({ dialog })}
        <RouterProbe />
      </>,
      { initialRouteEntries: ['/entity'] },
    );
    expect(close).not.toHaveBeenCalled();
    act(() => navigateTo('/catalog/default/component/other'));

    await waitFor(() => expect(close).toHaveBeenCalledTimes(1));
  });

  it('prefers the unregister redirect route after confirmation', async () => {
    const close = jest.fn();
    const open = jest.fn();
    renderMenuItem(unregisterEntityContextMenuItem, {
      apis: [mockApis.permission(), [dialogApiRef, { open }]],
      mountedRoutes: {
        '/catalog': convertLegacyRouteRef(rootRouteRef),
        '/after-unregister': convertLegacyRouteRef(unregisterRedirectRouteRef),
      },
    });

    const menuItem = await findMenuItem('Unregister entity');
    await waitFor(() => expect(menuItem).not.toHaveAttribute('aria-disabled'));
    await userEvent.click(menuItem);

    const renderDialog = open.mock.calls[0][0] as (props: {
      dialog: DialogApiDialog;
    }) => JSX.Element;
    const dialog = renderDialog({ dialog: createDialog(close) });
    act(() => dialog.props.onConfirm());

    expect(close).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(screen.getByLabelText('pathname')).toHaveTextContent(
        '/after-unregister',
      ),
    );
  });
});
