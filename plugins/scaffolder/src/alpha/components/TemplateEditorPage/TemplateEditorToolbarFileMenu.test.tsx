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

import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderInTestApp } from '@backstage/test-utils';
import { DirectoryEditorProvider } from './DirectoryEditorContext';
import { TemplateEditorToolbarFileMenu } from './TemplateEditorToolbarFileMenu';
import { rootRouteRef } from '../../../routes';

describe('TemplateEditorToolbarFileMenu', () => {
  it('should disable open directory by default', async () => {
    await renderInTestApp(<TemplateEditorToolbarFileMenu />, {
      mountedRoutes: {
        '/': rootRouteRef,
      },
    });

    expect(
      screen.queryByRole('menuitem', { name: 'Open template directory' }),
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'File' }));

    expect(
      screen.getByRole('menuitem', { name: 'Open template directory' }),
    ).toHaveAttribute('aria-disabled', 'true');
  });

  it('should disable create directory by default', async () => {
    await renderInTestApp(<TemplateEditorToolbarFileMenu />, {
      mountedRoutes: {
        '/': rootRouteRef,
      },
    });

    expect(
      screen.queryByRole('menuitem', { name: 'Create template directory' }),
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'File' }));

    expect(
      screen.getByRole('menuitem', { name: 'Create template directory' }),
    ).toHaveAttribute('aria-disabled', 'true');
  });

  it('should disable close editor by default', async () => {
    await renderInTestApp(<TemplateEditorToolbarFileMenu />, {
      mountedRoutes: {
        '/': rootRouteRef,
      },
    });

    expect(
      screen.queryByRole('menuitem', { name: 'Close template editor' }),
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'File' }));

    expect(
      screen.getByRole('menuitem', { name: 'Close template editor' }),
    ).toHaveAttribute('aria-disabled', 'true');
  });

  it('should have an option to open the directory', async () => {
    const onOpenDirectory = jest.fn();

    await renderInTestApp(
      <TemplateEditorToolbarFileMenu onOpenDirectory={onOpenDirectory} />,
      {
        mountedRoutes: {
          '/': rootRouteRef,
        },
      },
    );

    expect(
      screen.queryByRole('menuitem', { name: 'Open template directory' }),
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'File' }));

    await userEvent.click(
      screen.getByRole('menuitem', { name: 'Open template directory' }),
    );

    expect(onOpenDirectory).toHaveBeenCalled();
  });

  it('should have an option to create the directory', async () => {
    const onCreateDirectory = jest.fn();

    await renderInTestApp(
      <TemplateEditorToolbarFileMenu onCreateDirectory={onCreateDirectory} />,
      {
        mountedRoutes: {
          '/': rootRouteRef,
        },
      },
    );

    expect(
      screen.queryByRole('menuitem', { name: 'Create template directory' }),
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'File' }));

    await userEvent.click(
      screen.getByRole('menuitem', { name: 'Create template directory' }),
    );

    expect(onCreateDirectory).toHaveBeenCalled();
  });

  it('should have an option to close the editor', async () => {
    const onCloseDirectory = jest.fn();

    await renderInTestApp(
      <TemplateEditorToolbarFileMenu onCloseDirectory={onCloseDirectory} />,
      {
        mountedRoutes: {
          '/': rootRouteRef,
        },
      },
    );

    expect(
      screen.queryByRole('menuitem', { name: 'Close template editor' }),
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'File' }));

    await userEvent.click(
      screen.getByRole('menuitem', { name: 'Close template editor' }),
    );

    expect(onCloseDirectory).toHaveBeenCalled();
  });

  it('should disable close editor when disabled prop is true', async () => {
    const onCloseDirectory = jest.fn();

    await renderInTestApp(
      <TemplateEditorToolbarFileMenu
        onCloseDirectory={onCloseDirectory}
        disabled
      />,
      {
        mountedRoutes: {
          '/': rootRouteRef,
        },
      },
    );

    await userEvent.click(screen.getByRole('button', { name: 'File' }));

    const closeItem = screen.getByRole('menuitem', {
      name: 'Close template editor',
    });
    expect(closeItem).toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(closeItem);
    expect(onCloseDirectory).not.toHaveBeenCalled();
  });

  it('should disable close editor when directory editor is loading', async () => {
    const onCloseDirectory = jest.fn();
    const mockDirectory = {
      listFiles: jest.fn(() => new Promise<never>(() => {})),
      createFile: jest.fn(),
    };

    await renderInTestApp(
      <DirectoryEditorProvider directory={mockDirectory}>
        <TemplateEditorToolbarFileMenu onCloseDirectory={onCloseDirectory} />
      </DirectoryEditorProvider>,
      {
        mountedRoutes: {
          '/': rootRouteRef,
        },
      },
    );

    await userEvent.click(screen.getByRole('button', { name: 'File' }));

    const closeItem = screen.getByRole('menuitem', {
      name: 'Close template editor',
    });
    expect(closeItem).toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(closeItem);
    expect(onCloseDirectory).not.toHaveBeenCalled();
  });
});
