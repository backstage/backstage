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
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MockFileSystemAccess } from '../../lib/filesystem/MockFileSystemAccess';
import { DirectoryEditorProvider } from './DirectoryEditorContext';
import { TemplateEditorBrowser } from './TemplateEditorBrowser';

Blob.prototype.text = async function text() {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsText(this);
  });
};

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
});
