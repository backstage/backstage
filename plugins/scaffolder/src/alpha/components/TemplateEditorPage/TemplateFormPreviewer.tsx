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

import yaml from 'yaml';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAsync from 'react-use/esm/useAsync';

import { cn } from '@backstage/core-components';

import { alertApiRef, useApi, useRouteRef } from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  humanizeEntityRef,
} from '@backstage/plugin-catalog-react';
import {
  LayoutOptions,
  FieldExtensionOptions,
  FormProps,
} from '@backstage/plugin-scaffolder-react';

import { editRouteRef } from '../../../routes';

import {
  TemplateEditorLayout,
  TemplateEditorLayoutToolbar,
  TemplateEditorLayoutFiles,
  TemplateEditorLayoutPreview,
  TemplateEditorPanels,
} from './TemplateEditorLayout';
import { TemplateEditorToolbar } from './TemplateEditorToolbar';
import { TemplateEditorToolbarFileMenu } from './TemplateEditorToolbarFileMenu';
import {
  TemplateOption,
  TemplateEditorToolbarTemplatesMenu,
} from './TemplateEditorToolbarTemplatesMenu';
import { TemplateEditorForm } from './TemplateEditorForm';
import { TemplateEditorTextArea } from './TemplateEditorTextArea';

const EXAMPLE_TEMPLATE_PARAMS_YAML = `# Edit the template parameters below to see how they will render in the scaffolder form UI
parameters:
  - title: Fill in some steps
    required:
      - name
    properties:
      name:
        title: Name
        type: string
        description: Unique name of the component
      owner:
        title: Owner
        type: string
        description: Owner of the component
        ui:field: OwnerPicker
        ui:options:
          catalogFilter:
            kind: Group
  - title: Choose a location
    required:
      - repoUrl
    properties:
      repoUrl:
        title: Repository Location
        type: string
        ui:field: RepoUrlPicker
        ui:options:
          allowedHosts:
            - github.com
steps:
  - id: fetch-base
    name: Fetch Base
    action: fetch:template
    input:
      url: ./template
      values:
        name: \${{parameters.name}}
`;

/** @public */
export type ScaffolderTemplateFormPreviewerClassKey =
  | 'root'
  | 'toolbar'
  | 'controls'
  | 'textArea'
  | 'preview';

/**
 * Tailwind class overrides for the TemplateFormPreviewer grid layout.
 *
 * These classes are passed to TemplateEditorLayout and TemplateEditorLayoutFiles
 * via their `classes` prop to override the default grid-template-areas. The
 * form previewer uses a simpler two-region layout (toolbar + textArea/preview)
 * instead of the full five-region editor layout.
 *
 * Mobile: single column — toolbar, textArea, preview stacked vertically.
 * md+: two-column — toolbar spans full width; textArea and preview side-by-side.
 */
const previewerRootClasses = cn(
  "[grid-template-areas:'toolbar'_'textArea'_'preview']",
  "md:[grid-template-areas:'toolbar_toolbar'_'textArea_preview']",
  'md:grid-rows-[auto_1fr] md:grid-cols-[1fr]',
);

const previewerFilesClasses = '[grid-area:textArea]';

export const TemplateFormPreviewer = ({
  defaultPreviewTemplate = EXAMPLE_TEMPLATE_PARAMS_YAML,
  customFieldExtensions = [],
  layouts = [],
  formProps,
}: {
  defaultPreviewTemplate?: string;
  customFieldExtensions?: FieldExtensionOptions<any, any>[];
  onClose?: () => void;
  layouts?: LayoutOptions[];
  formProps?: FormProps;
}) => {
  const alertApi = useApi(alertApiRef);
  const catalogApi = useApi(catalogApiRef);
  const navigate = useNavigate();
  const editLink = useRouteRef(editRouteRef);

  const [errorText, setErrorText] = useState<string>();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateOption>();
  const [templateOptions, setTemplateOptions] = useState<TemplateOption[]>([]);
  const [templateYaml, setTemplateYaml] = useState(defaultPreviewTemplate);

  const handleCloseDirectory = useCallback(() => {
    navigate(editLink());
  }, [navigate, editLink]);

  useAsync(
    () =>
      catalogApi
        .getEntities({
          filter: { kind: 'template' },
          fields: [
            'kind',
            'metadata.namespace',
            'metadata.name',
            'metadata.title',
            'spec.parameters',
            'spec.steps',
            'spec.output',
          ],
        })
        .then(({ items }) =>
          setTemplateOptions(
            items.map(template => ({
              label:
                template.metadata.title ??
                humanizeEntityRef(template, { defaultKind: 'template' }),
              value: template,
            })),
          ),
        )
        .catch(e =>
          alertApi.post({
            message: `Error loading existing templates: ${e.message}`,
            severity: 'error',
          }),
        ),
    [catalogApi],
  );

  const handleSelectChange = useCallback(
    // TODO(Rugvip): Afaik this should be Entity, but didn't want to make runtime changes while fixing types
    (selected: TemplateOption) => {
      setSelectedTemplate(selected);
      setTemplateYaml(yaml.stringify(selected.value.spec));
    },
    [setSelectedTemplate, setTemplateYaml],
  );

  return (
    <TemplateEditorLayout classes={{ root: previewerRootClasses }}>
      <TemplateEditorLayoutToolbar>
        <TemplateEditorToolbar fieldExtensions={customFieldExtensions}>
          <TemplateEditorToolbarFileMenu
            onCloseDirectory={handleCloseDirectory}
          />
          <TemplateEditorToolbarTemplatesMenu
            options={templateOptions}
            selectedOption={selectedTemplate}
            onSelectOption={handleSelectChange}
          />
        </TemplateEditorToolbar>
      </TemplateEditorLayoutToolbar>
      <TemplateEditorPanels
        autoSaveId="template-form-previewer"
        files={
          <TemplateEditorLayoutFiles classes={{ root: previewerFilesClasses }}>
            <TemplateEditorTextArea
              content={templateYaml}
              onUpdate={setTemplateYaml}
              errorText={errorText}
            />
          </TemplateEditorLayoutFiles>
        }
        preview={
          <TemplateEditorLayoutPreview>
            <TemplateEditorForm
              content={templateYaml}
              contentIsSpec
              fieldExtensions={customFieldExtensions}
              setErrorText={setErrorText}
              layouts={layouts}
              formProps={formProps}
            />
          </TemplateEditorLayoutPreview>
        }
      />
    </TemplateEditorLayout>
  );
};
