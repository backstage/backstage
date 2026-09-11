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
import {
  DirectoryEditorProvider,
  useDirectoryEditor,
} from './DirectoryEditorContext';
import {
  TemplateEditorLayout,
  TemplateEditorLayoutToolbar,
  TemplateEditorLayoutBrowser,
  TemplateEditorLayoutFiles,
  TemplateEditorLayoutPreview,
  TemplateEditorLayoutConsole,
  TemplateEditorPanels,
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

const TemplateEditorContent = (props: {
  layouts?: LayoutOptions[];
  formProps?: FormProps;
  fieldExtensions?: FieldExtensionOptions<any, any>[];
  openDirectory: () => void;
  createDirectory: () => void;
  closeDirectory: () => Promise<void>;
}) => {
  const {
    layouts,
    formProps,
    fieldExtensions,
    openDirectory: handleOpenDirectory,
    createDirectory: handleCreateDirectory,
    closeDirectory,
  } = props;
  const [errorText, setErrorText] = useState<string>();
  const navigate = useNavigate();
  const editLink = useRouteRef(editRouteRef);
  const directoryEditor = useDirectoryEditor();

  const handleCloseDirectory = useCallback(() => {
    if (directoryEditor?.loading) {
      return;
    }
    closeDirectory().then(() => navigate(editLink()));
  }, [closeDirectory, navigate, editLink, directoryEditor?.loading]);

  const handleCloseBrowser = useCallback(() => {
    if (directoryEditor?.loading) {
      return;
    }
    closeDirectory();
  }, [closeDirectory, directoryEditor?.loading]);

  return (
    <DryRunProvider>
      <TemplateEditorLayout>
        <TemplateEditorLayoutToolbar>
          <TemplateEditorToolbar fieldExtensions={fieldExtensions}>
            <TemplateEditorToolbarFileMenu
              onOpenDirectory={handleOpenDirectory}
              onCreateDirectory={handleCreateDirectory}
              onCloseDirectory={handleCloseDirectory}
              disabled={directoryEditor?.loading}
            />
          </TemplateEditorToolbar>
        </TemplateEditorLayoutToolbar>
        <TemplateEditorLayoutBrowser>
          <TemplateEditorBrowser onClose={handleCloseBrowser} />
        </TemplateEditorLayoutBrowser>
        <TemplateEditorPanels
          autoSaveId="template-editor"
          files={
            <TemplateEditorLayoutFiles>
              <TemplateEditorTextArea.DirectoryEditor errorText={errorText} />
            </TemplateEditorLayoutFiles>
          }
          preview={
            <TemplateEditorLayoutPreview>
              <TemplateEditorForm.DirectoryEditorDryRun
                setErrorText={setErrorText}
                fieldExtensions={fieldExtensions}
                layouts={layouts}
                formProps={formProps}
              />
            </TemplateEditorLayoutPreview>
          }
        />
        <TemplateEditorLayoutConsole>
          <DryRunResults />
        </TemplateEditorLayoutConsole>
      </TemplateEditorLayout>
    </DryRunProvider>
  );
};

export const TemplateEditor = (props: {
  layouts?: LayoutOptions[];
  formProps?: FormProps;
  fieldExtensions?: FieldExtensionOptions<any, any>[];
}) => {
  const { layouts, formProps, fieldExtensions } = props;
  const {
    directory,
    openDirectory: handleOpenDirectory,
    createDirectory: handleCreateDirectory,
    closeDirectory,
  } = useTemplateDirectory();

  return (
    <DirectoryEditorProvider directory={directory}>
      <TemplateEditorContent
        layouts={layouts}
        formProps={formProps}
        fieldExtensions={fieldExtensions}
        openDirectory={handleOpenDirectory}
        createDirectory={handleCreateDirectory}
        closeDirectory={closeDirectory}
      />
    </DirectoryEditorProvider>
  );
};
