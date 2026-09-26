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

import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import {
  scaffolderApiRef,
  SecretsContextProvider,
} from '@backstage/plugin-scaffolder-react';
import {
  TemplateDirectoryAccess,
  TemplateFileAccess,
} from '../../../lib/filesystem';
import { formDecoratorsApiRef } from '../../api';
import {
  DirectoryEditorProvider,
  useDirectoryEditor,
} from './DirectoryEditorContext';
import { DryRunProvider } from './DryRunContext';
import { TemplateEditorForm } from './TemplateEditorForm';

const EMPTY_PREVIEW_TEXT =
  'There are no spec parameters in the template to preview.';

const TEMPLATE_YAML = `
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: test-template
spec:
  type: service
`;

function createMockFile(path: string, content = 'content'): File {
  const blob = new Blob([content]);
  return Object.assign(blob, {
    name: path.split('/').pop()!,
    lastModified: Date.now(),
    webkitRelativePath: path,
  });
}

function ReloadTrigger() {
  const editor = useDirectoryEditor();
  return (
    <button type="button" onClick={() => editor?.reload()}>
      Trigger reload
    </button>
  );
}

const mockApis = [
  [
    scaffolderApiRef,
    {
      dryRun: async () => ({
        directoryContents: [],
        log: [],
        output: {},
        steps: [],
      }),
    },
  ],
  [
    formDecoratorsApiRef,
    {
      getFormDecorators: async () => [],
    },
  ],
] as const;

async function renderForm(directory?: TemplateDirectoryAccess) {
  return renderInTestApp(
    <TestApiProvider apis={mockApis}>
      <SecretsContextProvider>
        <DryRunProvider>
          <DirectoryEditorProvider directory={directory}>
            <ReloadTrigger />
            <TemplateEditorForm.DirectoryEditorDryRun setErrorText={() => {}} />
          </DirectoryEditorProvider>
        </DryRunProvider>
      </SecretsContextProvider>
    </TestApiProvider>,
  );
}

describe('TemplateEditorForm.DirectoryEditorDryRun', () => {
  it('does not show the empty preview while the initial directory load is in progress', async () => {
    const mockDirectory: TemplateDirectoryAccess = {
      listFiles: jest.fn().mockResolvedValue([
        {
          path: 'template.yaml',
          file: () => new Promise<File>(() => {}),
          save: jest.fn(),
        } as TemplateFileAccess,
      ]),
      createFile: jest.fn(),
    };

    await renderForm(mockDirectory);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
    });

    expect(screen.queryByText(EMPTY_PREVIEW_TEXT)).not.toBeInTheDocument();
  });

  it('keeps the preview mounted while a directory reload is in progress', async () => {
    let filePromise = Promise.resolve(
      createMockFile('template.yaml', TEMPLATE_YAML),
    );
    const mockFile: TemplateFileAccess = {
      path: 'template.yaml',
      file: jest.fn(() => filePromise),
      save: jest.fn(),
    };
    const mockDirectory: TemplateDirectoryAccess = {
      listFiles: jest.fn().mockResolvedValue([mockFile]),
      createFile: jest.fn(),
    };

    await renderForm(mockDirectory);

    expect(await screen.findByText(EMPTY_PREVIEW_TEXT)).toBeInTheDocument();

    let resolveReload!: (file: File) => void;
    filePromise = new Promise<File>(resolve => {
      resolveReload = resolve;
    });

    await userEvent.click(
      screen.getByRole('button', { name: 'Trigger reload' }),
    );

    expect(screen.getByText(EMPTY_PREVIEW_TEXT)).toBeInTheDocument();

    await act(async () => {
      resolveReload(createMockFile('template.yaml', TEMPLATE_YAML));
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(screen.getByText(EMPTY_PREVIEW_TEXT)).toBeInTheDocument();
    });
  });
});
