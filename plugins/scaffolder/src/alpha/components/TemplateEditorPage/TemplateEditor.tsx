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
import React, { useState } from 'react';
import type {
  FormProps,
  LayoutOptions,
} from '@backstage/plugin-scaffolder-react';
import { FieldExtensionOptions } from '@backstage/plugin-scaffolder-react';
import { DirectoryEditorProvider } from './DirectoryEditorContext';
import {
  TemplateEditorLayout,
  TemplateEditorLayoutToolbar,
  TemplateEditorLayoutBrowser,
  TemplateEditorLayoutFiles,
  TemplateEditorLayoutPreview,
  TemplateEditorLayoutConsole,
} from './TemplateEditorLayout';
import { TemplateEditorToolbar } from './TemplateEditorToolbar';
import { TemplateEditorToolbarFileMenu } from './TemplateEditorToolbarFileMenu';
import { TemplateEditorBrowser } from './TemplateEditorBrowser';
import { DryRunProvider } from './DryRunContext';
import { TemplateEditorTextArea } from './TemplateEditorTextArea';
import { TemplateEditorForm } from './TemplateEditorForm';
import { DryRunResults } from './DryRunResults';
import { useTemplateDirectory } from './useTemplateDirectory';

/** @public */
export type ScaffolderTemplateEditorClassKey =
  | 'root'
  | 'toolbar'
  | 'browser'
  | 'editor'
  | 'preview'
  | 'results';

export const TemplateEditor = (props: {
  layouts?: LayoutOptions[];
  formProps?: FormProps;
  fieldExtensions?: FieldExtensionOptions<any, any>[];
}) => {
  const { layouts, formProps, fieldExtensions } = props;
  const [errorText, setErrorText] = useState<string>();
  const {
    directory,
    handleOpenDirectory,
    handleCreateDirectory,
    handleCloseDirectory,
  } = useTemplateDirectory();

  return (
    <DirectoryEditorProvider directory={directory}>
      <DryRunProvider>
        <TemplateEditorLayout>
          <TemplateEditorLayoutToolbar>
            <TemplateEditorToolbar fieldExtensions={fieldExtensions}>
              <TemplateEditorToolbarFileMenu
                onOpenDirectory={handleOpenDirectory}
                onCloseDirectory={handleCloseDirectory}
                onCreateDirectory={handleCreateDirectory}
              />
            </TemplateEditorToolbar>
          </TemplateEditorLayoutToolbar>
          <TemplateEditorLayoutBrowser>
            <TemplateEditorBrowser onClose={handleCloseDirectory} />
          </TemplateEditorLayoutBrowser>
          <TemplateEditorLayoutFiles>
            <TemplateEditorTextArea.DirectoryEditor errorText={errorText} />
          </TemplateEditorLayoutFiles>
          <TemplateEditorLayoutPreview>
            <TemplateEditorForm.DirectoryEditorDryRun
              setErrorText={setErrorText}
              fieldExtensions={fieldExtensions}
              layouts={layouts}
              formProps={formProps}
            />
          </TemplateEditorLayoutPreview>
          <TemplateEditorLayoutConsole>
            <DryRunResults />
          </TemplateEditorLayoutConsole>
        </TemplateEditorLayout>
      </DryRunProvider>
    </DirectoryEditorProvider>
  );
};
