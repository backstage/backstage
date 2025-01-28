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
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRouteRef } from '@backstage/core-plugin-api';
import type {
  FormProps,
  LayoutOptions,
  FieldExtensionOptions,
} from '@backstage/plugin-scaffolder-react';

import { editRouteRef } from '../../../routes';

import { useTemplateDirectory } from './useTemplateDirectory';
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
import { TemplateEditorTextArea } from './TemplateEditorTextArea';
import { TemplateEditorForm } from './TemplateEditorForm';
import { DryRunProvider } from './DryRunContext';
import { DryRunResults } from './DryRunResults';

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
  const navigate = useNavigate();
  const editLink = useRouteRef(editRouteRef);
  const {
    directory,
    openDirectory: handleOpenDirectory,
    createDirectory: handleCreateDirectory,
    closeDirectory,
  } = useTemplateDirectory();

  const handleCloseDirectory = useCallback(() => {
    closeDirectory().then(() => navigate(editLink()));
  }, [closeDirectory, navigate, editLink]);

  return (
    <DirectoryEditorProvider directory={directory}>
      <DryRunProvider>
        <TemplateEditorLayout>
          <TemplateEditorLayoutToolbar>
            <TemplateEditorToolbar fieldExtensions={fieldExtensions}>
              <TemplateEditorToolbarFileMenu
                onOpenDirectory={handleOpenDirectory}
                onCreateDirectory={handleCreateDirectory}
                onCloseDirectory={handleCloseDirectory}
              />
            </TemplateEditorToolbar>
          </TemplateEditorLayoutToolbar>
          <TemplateEditorLayoutBrowser>
            <TemplateEditorBrowser onClose={closeDirectory} />
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
