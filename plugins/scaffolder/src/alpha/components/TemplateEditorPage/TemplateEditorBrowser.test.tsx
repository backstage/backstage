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
});
