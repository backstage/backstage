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

import { useAsync, useMountEffect } from '@react-hookz/web';
import { useCallback, useMemo } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Content } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { makeStyles } from '@material-ui/core/styles';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { templateManagementPermission } from '@backstage/plugin-scaffolder-common/alpha';
import {
  type FieldExtensionOptions,
  SecretsContextProvider,
} from '@backstage/plugin-scaffolder-react';
import type { FormField } from '@backstage/plugin-scaffolder-react/alpha';
import { OpaqueFormField } from '@internal/scaffolder';
import { DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS } from '../../extensions/default';
import { formFieldsApiRef } from '../formFieldsApi';
import { TemplateEditorIntro } from './TemplateEditorPage/TemplateEditorIntro';
import { TemplateEditor } from './TemplateEditorPage/TemplateEditor';
import { TemplateFormPreviewer } from './TemplateEditorPage/TemplateFormPreviewer';
import { CustomFieldExplorer } from './TemplateEditorPage/CustomFieldExplorer';
import { useTemplateDirectory } from './TemplateEditorPage/useTemplateDirectory';

const useEditorStyles = makeStyles({
  editorContent: {
    padding: 0,
    height: 'calc(100dvh - var(--bui-header-height, 0px))',
  },
  formContent: {
    padding: 0,
    height: 'calc(100dvh - var(--bui-header-height, 0px))',
  },
});

function EditorIntroContent() {
  const navigate = useNavigate();
  const { openDirectory, createDirectory } = useTemplateDirectory();

  const handleSelect = useCallback(
    (option: 'create-template' | 'local' | 'form' | 'field-explorer') => {
      if (option === 'local') {
        openDirectory()
          .then(() => navigate('template'))
          .catch(() => {});
      } else if (option === 'create-template') {
        createDirectory()
          .then(() => navigate('template'))
          .catch(() => {});
      } else if (option === 'form') {
        navigate('template-form');
      } else if (option === 'field-explorer') {
        navigate('custom-fields');
      }
    },
    [openDirectory, createDirectory, navigate],
  );

  return (
    <Content>
      <TemplateEditorIntro onSelect={handleSelect} />
    </Content>
  );
}

export function buildEditorFieldExtensions(
  formFields: FieldExtensionOptions[] = [],
): FieldExtensionOptions[] {
  return [
    ...formFields,
    ...(DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS.filter(
      ({ name }) => !formFields.some(formField => formField.name === name),
    ) as FieldExtensionOptions[]),
  ];
}

export function toFieldExtensionOptions(
  formField: FormField,
): FieldExtensionOptions {
  const internal = OpaqueFormField.toInternal(formField);

  return {
    ...internal,
    schema: internal.schema?.schema ?? internal.schema,
  } as FieldExtensionOptions;
}

function EditorContent(props: { fieldExtensions: FieldExtensionOptions[] }) {
  const classes = useEditorStyles();
  return (
    <Content className={classes.editorContent}>
      <TemplateEditor fieldExtensions={props.fieldExtensions} />
    </Content>
  );
}

function FormPreviewContent(props: {
  fieldExtensions: FieldExtensionOptions[];
}) {
  const classes = useEditorStyles();
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    navigate('..');
  }, [navigate]);

  return (
    <Content className={classes.formContent}>
      <TemplateFormPreviewer
        customFieldExtensions={props.fieldExtensions}
        onClose={handleClose}
      />
    </Content>
  );
}

function CustomFieldsContent(props: {
  fieldExtensions: FieldExtensionOptions[];
}) {
  return (
    <Content>
      <CustomFieldExplorer customFieldExtensions={props.fieldExtensions} />
    </Content>
  );
}

/**
 * Sub-page for the template editor tab. Renders the editor intro at the index,
 * with sub-routes for the full editor, form previewer, and custom fields explorer.
 *
 * @internal
 */
export function EditorSubPage() {
  const formFieldsApi = useApi(formFieldsApiRef);
  const [{ result: customFieldExtensions = [] }, { execute }] = useAsync(
    async () => {
      const formFields = await formFieldsApi.loadFormFields();
      return formFields.map(toFieldExtensionOptions);
    },
  );

  useMountEffect(execute);

  const fieldExtensions = useMemo(
    () => buildEditorFieldExtensions(customFieldExtensions),
    [customFieldExtensions],
  );

  return (
    <RequirePermission permission={templateManagementPermission}>
      <SecretsContextProvider>
        <Routes>
          <Route index element={<EditorIntroContent />} />
          <Route
            path="template"
            element={<EditorContent fieldExtensions={fieldExtensions} />}
          />
          <Route
            path="template-form"
            element={<FormPreviewContent fieldExtensions={fieldExtensions} />}
          />
          <Route
            path="custom-fields"
            element={<CustomFieldsContent fieldExtensions={fieldExtensions} />}
          />
        </Routes>
      </SecretsContextProvider>
    </RequirePermission>
  );
}
