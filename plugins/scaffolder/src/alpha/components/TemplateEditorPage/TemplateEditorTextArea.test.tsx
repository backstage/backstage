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

import { renderInTestApp } from '@backstage/test-utils';
import { screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TemplateEditorTextArea } from './TemplateEditorTextArea';
import { DirectoryEditorProvider } from './DirectoryEditorContext';
import {
  TemplateDirectoryAccess,
  TemplateFileAccess,
} from '../../../lib/filesystem';

describe('TemplateEditorTextArea', () => {
  it('enables Save and Reload when not disabled and handles Ctrl+S', async () => {
    const onSave = jest.fn();
    const onReload = jest.fn();

    await renderInTestApp(
      <TemplateEditorTextArea
        content="hello: world"
        onSave={onSave}
        onReload={onReload}
        disabled={false}
      />,
    );

    const saveButton = screen.getByRole('button', { name: 'Save file' });
    const reloadButton = screen.getByRole('button', { name: 'Reload file' });

    expect(saveButton).toBeEnabled();
    expect(reloadButton).toBeEnabled();

    await userEvent.click(saveButton);
    expect(onSave).toHaveBeenCalledTimes(1);

    await userEvent.click(reloadButton);
    expect(onReload).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: 's', ctrlKey: true });
    expect(onSave).toHaveBeenCalledTimes(2);
  });

  it('disables Save, Reload, and keyboard shortcut when disabled is true', async () => {
    const onSave = jest.fn();
    const onReload = jest.fn();

    await renderInTestApp(
      <TemplateEditorTextArea
        content="hello: world"
        onSave={onSave}
        onReload={onReload}
        disabled
      />,
    );

    const saveButton = screen.getByRole('button', { name: 'Save file' });
    const reloadButton = screen.getByRole('button', { name: 'Reload file' });

    expect(saveButton).toBeDisabled();
    expect(reloadButton).toBeDisabled();

    fireEvent.keyDown(window, { key: 's', ctrlKey: true });
    fireEvent.keyDown(window, { key: 's', metaKey: true });
    expect(onSave).not.toHaveBeenCalled();
  });

  it('renders and enables reload when selected file finishes loading', async () => {
    let resolveFile!: (file: File) => void;
    const filePromise = new Promise<File>(resolve => {
      resolveFile = resolve;
    });

    const mockFile: TemplateFileAccess = {
      path: 'template.yaml',
      file: () => filePromise,
      save: jest.fn(),
    };

    const mockDirectory: TemplateDirectoryAccess = {
      listFiles: jest.fn().mockResolvedValue([mockFile]),
      createFile: jest.fn(),
    };

    await renderInTestApp(
      <DirectoryEditorProvider directory={mockDirectory}>
        <TemplateEditorTextArea.DirectoryEditor />
      </DirectoryEditorProvider>,
    );

    await act(async () => {
      const blob = new Blob(['name: template\n']);
      resolveFile(
        Object.assign(blob, {
          name: 'template.yaml',
          lastModified: Date.now(),
          webkitRelativePath: 'template.yaml',
        }),
      );
      await new Promise<void>(resolve => setTimeout(resolve, 0));
    });

    const reloadButton = await screen.findByRole('button', {
      name: 'Reload file',
    });
    expect(reloadButton).toBeEnabled();
  });
});
