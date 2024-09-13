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
import { Entity } from '@backstage/catalog-model';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  humanizeEntityRef,
} from '@backstage/plugin-catalog-react';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import React, { useCallback, useState } from 'react';
import useAsync from 'react-use/esm/useAsync';
import yaml from 'yaml';
import {
  LayoutOptions,
  FieldExtensionOptions,
  FormProps,
} from '@backstage/plugin-scaffolder-react';
import { TemplateEditorForm } from './TemplateEditorForm';
import { TemplateEditorTextArea } from './TemplateEditorTextArea';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../translation';

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

type TemplateOption = {
  label: string;
  value: Entity;
};

/** @public */
export type ScaffolderTemplateFormPreviewerClassKey =
  | 'root'
  | 'controls'
  | 'textArea'
  | 'preview';

const useStyles = makeStyles(
  theme => ({
    root: {
      gridArea: 'pageContent',
      display: 'grid',
      gridTemplateAreas: `
      "controls controls"
      "textArea preview"
    `,
      gridTemplateRows: 'auto 1fr',
      gridTemplateColumns: '1fr 1fr',
    },
    controls: {
      gridArea: 'controls',
      display: 'flex',
      flexFlow: 'row nowrap',
      alignItems: 'center',
      margin: theme.spacing(1),
    },
    textArea: {
      gridArea: 'textArea',
    },
    preview: {
      gridArea: 'preview',
    },
  }),
  { name: 'ScaffolderTemplateFormPreviewer' },
);

export const TemplateFormPreviewer = ({
  defaultPreviewTemplate = EXAMPLE_TEMPLATE_PARAMS_YAML,
  customFieldExtensions = [],
  onClose,
  layouts = [],
  formProps,
}: {
  defaultPreviewTemplate?: string;
  customFieldExtensions?: FieldExtensionOptions<any, any>[];
  onClose?: () => void;
  layouts?: LayoutOptions[];
  formProps?: FormProps;
}) => {
  const classes = useStyles();
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const alertApi = useApi(alertApiRef);
  const catalogApi = useApi(catalogApiRef);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [errorText, setErrorText] = useState<string>();
  const [templateOptions, setTemplateOptions] = useState<TemplateOption[]>([]);
  const [templateYaml, setTemplateYaml] = useState(defaultPreviewTemplate);

  const { loading } = useAsync(
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
            message: `Error loading exisiting templates: ${e.message}`,
            severity: 'error',
          }),
        ),
    [catalogApi],
  );

  const handleSelectChange = useCallback(
    // TODO(Rugvip): Afaik this should be Entity, but didn't want to make runtime changes while fixing types
    (selected: any) => {
      setSelectedTemplate(selected);
      setTemplateYaml(yaml.stringify(selected.spec));
    },
    [setTemplateYaml],
  );

  return (
    <>
      {loading && <LinearProgress />}
      <main className={classes.root}>
        <div className={classes.controls}>
          <FormControl variant="outlined" size="small" fullWidth>
            <InputLabel id="select-template-label">
              {t('templateEditorPage.templateFormPreviewer.title')}
            </InputLabel>
            <Select
              value={selectedTemplate}
              label={t('templateEditorPage.templateFormPreviewer.title')}
              labelId="select-template-label"
              onChange={e => handleSelectChange(e.target.value)}
            >
              {templateOptions.map((option, idx) => (
                <MenuItem key={idx} value={option.value as any}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <IconButton size="medium" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className={classes.textArea}>
          <TemplateEditorTextArea
            content={templateYaml}
            onUpdate={setTemplateYaml}
            errorText={errorText}
          />
        </div>
        <div className={classes.preview}>
          <TemplateEditorForm
            content={templateYaml}
            contentIsSpec
            fieldExtensions={customFieldExtensions}
            setErrorText={setErrorText}
            layouts={layouts}
            formProps={formProps}
          />
        </div>
      </main>
    </>
  );
};
