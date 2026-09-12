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
import { renderInTestApp } from '@backstage/test-utils';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  TemplateDirectoryAccess,
  TemplateFileAccess,
} from '../../../lib/filesystem';
import { MockFileSystemAccess } from '../../../lib/filesystem/MockFileSystemAccess';
import { DirectoryEditorProvider } from './DirectoryEditorContext';
import { TemplateEditorBrowser } from './TemplateEditorBrowser';

describe('TemplateEditorBrowser', () => {
  it('should render files and expand dirs without exploding', async () => {
    await renderInTestApp(
      <DirectoryEditorProvider
        directory={MockFileSystemAccess.createMockDirectory({
          'foo.txt': 'le foo',
          'dir/bar.txt': 'le bar',
          'dir/baz.txt': 'le baz',
        })}
      >
        <TemplateEditorBrowser />
      </DirectoryEditorProvider>,
    );

    await expect(screen.findByText('foo.txt')).resolves.toBeInTheDocument();
    expect(screen.getByText('dir')).toBeInTheDocument();
    expect(screen.queryByText('bar.txt')).not.toBeInTheDocument();
    expect(screen.queryByText('baz.txt')).not.toBeInTheDocument();

    await userEvent.click(screen.getByText('dir'));
    expect(screen.getByText('bar.txt')).toBeInTheDocument();
    expect(screen.getByText('baz.txt')).toBeInTheDocument();
  });

  it('does not render a stale error if the directory is cleared mid-reload', async () => {
    let rejectFilePromise!: (reason: Error) => void;
    const pendingFilePromise = new Promise<File>((_, reject) => {
      rejectFilePromise = reject;
    });

    const mockFileAccess: TemplateFileAccess = {
      path: 'template.yaml',
      file: () => pendingFilePromise,
      save: jest.fn(),
    };

    const mockDirectory: TemplateDirectoryAccess = {
      listFiles: jest.fn().mockResolvedValue([mockFileAccess]),
      createFile: jest.fn(),
    };

    const { rerender } = await renderInTestApp(
      <DirectoryEditorProvider directory={mockDirectory}>
        <TemplateEditorBrowser />
      </DirectoryEditorProvider>,
    );

    rerender(
      <DirectoryEditorProvider directory={undefined}>
        <TemplateEditorBrowser />
      </DirectoryEditorProvider>,
    );

    await act(async () => {
      rejectFilePromise(new Error('Stale reload error'));
      await new Promise<void>(resolve => setTimeout(resolve, 0));
    });

    expect(screen.queryByText('Stale reload error')).not.toBeInTheDocument();
  });

  it('displays loading progress spinner and text, and disables Save, Reload, and Close actions while loading', async () => {
    function createMockFile(path: string, content = 'content'): File {
      const blob = new Blob([content]);
      return Object.assign(blob, {
        name: path.split('/').pop()!,
        lastModified: Date.now(),
        webkitRelativePath: path,
      });
    }

    let resolveFile1!: (file: File) => void;
    let resolveFile2!: (file: File) => void;
    const file1Promise = new Promise<File>(resolve => {
      resolveFile1 = resolve;
    });
    const file2Promise = new Promise<File>(resolve => {
      resolveFile2 = resolve;
    });

    const mockFiles: TemplateFileAccess[] = [
      {
        path: 'template.yaml',
        file: () => file1Promise,
        save: jest.fn(),
      },
      {
        path: 'docs/index.md',
        file: () => file2Promise,
        save: jest.fn(),
      },
    ];

    const mockDirectory: TemplateDirectoryAccess = {
      listFiles: jest.fn().mockResolvedValue(mockFiles),
      createFile: jest.fn(),
    };

    const onClose = jest.fn();

    await renderInTestApp(
      <DirectoryEditorProvider directory={mockDirectory}>
        <TemplateEditorBrowser onClose={onClose} />
      </DirectoryEditorProvider>,
    );

    expect(await screen.findByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Loading 2 files...')).toBeInTheDocument();

    const saveButton = screen.getByRole('button', { name: 'Save all files' });
    const reloadButton = screen.getByRole('button', {
      name: 'Reload directory',
    });
    const closeButton = screen.getByRole('button', {
      name: 'Close directory',
    });

    expect(saveButton).toBeDisabled();
    expect(reloadButton).toBeDisabled();
    expect(closeButton).toBeDisabled();
    expect(onClose).not.toHaveBeenCalled();

    await act(async () => {
      resolveFile1(createMockFile('template.yaml', 'content1'));
      await new Promise<void>(resolve => setTimeout(resolve, 0));
    });

    expect(
      await screen.findByText('Loading 1 of 2 files...'),
    ).toBeInTheDocument();
    expect(reloadButton).toBeDisabled();
    expect(closeButton).toBeDisabled();

    await act(async () => {
      resolveFile2(createMockFile('docs/index.md', 'content2'));
      await new Promise<void>(resolve => setTimeout(resolve, 0));
    });

    expect(await screen.findByText('template.yaml')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.queryByText(/Loading.*files/)).not.toBeInTheDocument();

    expect(reloadButton).toBeEnabled();
    expect(closeButton).toBeEnabled();
    expect(saveButton).toBeDisabled();

    await userEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('displays singular loading message when directory contains exactly one file', async () => {
    function createMockFile(path: string, content = 'content'): File {
      const blob = new Blob([content]);
      return Object.assign(blob, {
        name: path.split('/').pop()!,
        lastModified: Date.now(),
        webkitRelativePath: path,
      });
    }

    let resolveFile!: (file: File) => void;
    const filePromise = new Promise<File>(resolve => {
      resolveFile = resolve;
    });

    const mockFiles: TemplateFileAccess[] = [
      {
        path: 'template.yaml',
        file: () => filePromise,
        save: jest.fn(),
      },
    ];

    const mockDirectory: TemplateDirectoryAccess = {
      listFiles: jest.fn().mockResolvedValue(mockFiles),
      createFile: jest.fn(),
    };

    await renderInTestApp(
      <DirectoryEditorProvider directory={mockDirectory}>
        <TemplateEditorBrowser />
      </DirectoryEditorProvider>,
    );

    expect(await screen.findByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Loading 1 file...')).toBeInTheDocument();

    await act(async () => {
      resolveFile(createMockFile('template.yaml', 'content'));
      await new Promise<void>(resolve => setTimeout(resolve, 0));
    });

    expect(await screen.findByText('template.yaml')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.queryByText(/Loading.*file/)).not.toBeInTheDocument();
  });
});
