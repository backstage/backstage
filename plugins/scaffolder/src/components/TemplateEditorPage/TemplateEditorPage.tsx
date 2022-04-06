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
import React, { useCallback, useState } from 'react';
import useAsync from 'react-use/lib/useAsync';
import useDebounce from 'react-use/lib/useDebounce';
import { Entity } from '@backstage/catalog-model';
import { Content, Header, InfoCard, Page } from '@backstage/core-components';
import { alertApiRef, useApi, useApiHolder } from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  humanizeEntityRef,
} from '@backstage/plugin-catalog-react';
import { JsonObject } from '@backstage/types';
import { yaml as yamlSupport } from '@codemirror/legacy-modes/mode/yaml';
import { showPanel } from '@codemirror/panel';
import { StreamLanguage } from '@codemirror/stream-parser';
import {
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  makeStyles,
  MenuItem,
  Select,
} from '@material-ui/core';
import { IChangeEvent } from '@rjsf/core';
import CodeMirror from '@uiw/react-codemirror';
import yaml from 'yaml';
import { FieldExtensionOptions } from '../../extensions';
import { TemplateParameterSchema } from '../../types';
import { MultistepJsonForm } from '../MultistepJsonForm';
import { createValidator } from '../TemplatePage';

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
          allowedKinds:
            - Group
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
`;

type TemplateOption = {
  label: string;
  value: Entity;
};

const useStyles = makeStyles({
  templateSelect: {
    marginBottom: '10px',
  },
  grid: {
    height: '100%',
  },
  codeMirror: {
    height: '95%',
  },
});

export const TemplateEditorPage = ({
  defaultPreviewTemplate = EXAMPLE_TEMPLATE_PARAMS_YAML,
  customFieldExtensions = [],
}: {
  defaultPreviewTemplate?: string;
  customFieldExtensions?: FieldExtensionOptions<any, any>[];
}) => {
  const classes = useStyles();
  const alertApi = useApi(alertApiRef);
  const catalogApi = useApi(catalogApiRef);
  const apiHolder = useApiHolder();
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [schema, setSchema] = useState<TemplateParameterSchema>({
    title: '',
    steps: [],
  });
  const [templateOptions, setTemplateOptions] = useState<TemplateOption[]>([]);
  const [templateYaml, setTemplateYaml] = useState(defaultPreviewTemplate);
  const [formState, setFormState] = useState({});

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

  const errorPanel = document.createElement('div');
  errorPanel.style.color = 'red';

  useDebounce(
    () => {
      try {
        const parsedTemplate = yaml.parse(templateYaml);

        setSchema({
          title: 'Preview',
          steps: parsedTemplate.parameters.map((param: JsonObject) => ({
            title: param.title,
            schema: param,
          })),
        });
        setFormState({});
      } catch (e) {
        errorPanel.textContent = e.message;
      }
    },
    250,
    [setFormState, setSchema, templateYaml],
  );

  const handleSelectChange = useCallback(
    selected => {
      setSelectedTemplate(selected);
      setTemplateYaml(yaml.stringify(selected.spec));
    },
    [setTemplateYaml],
  );

  const handleFormReset = () => setFormState({});
  const handleFormChange = useCallback(
    (e: IChangeEvent) => setFormState(e.formData),
    [setFormState],
  );

  const handleCodeChange = useCallback(
    (code: string) => {
      setTemplateYaml(code);
    },
    [setTemplateYaml],
  );

  const customFieldComponents = Object.fromEntries(
    customFieldExtensions.map(({ name, component }) => [name, component]),
  );

  const customFieldValidators = Object.fromEntries(
    customFieldExtensions.map(({ name, validation }) => [name, validation]),
  );

  return (
    <Page themeId="home">
      <Header
        title="Template Editor"
        subtitle="Preview your template parameter UI"
      />
      <Content>
        {loading && <LinearProgress />}
        <Grid container className={classes.grid}>
          <Grid item xs={6}>
            <FormControl
              className={classes.templateSelect}
              variant="outlined"
              fullWidth
            >
              <InputLabel id="select-template-label">
                Load Existing Template
              </InputLabel>
              <Select
                value={selectedTemplate}
                label="Load Existing Template"
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
            <CodeMirror
              className={classes.codeMirror}
              value={templateYaml}
              theme="dark"
              height="100%"
              extensions={[
                StreamLanguage.define(yamlSupport),
                showPanel.of(() => ({ dom: errorPanel, top: true })),
              ]}
              onChange={handleCodeChange}
            />
          </Grid>
          <Grid item xs={6}>
            {schema && (
              <InfoCard key={JSON.stringify(schema)}>
                <MultistepJsonForm
                  formData={formState}
                  fields={customFieldComponents}
                  onChange={handleFormChange}
                  onReset={handleFormReset}
                  steps={schema.steps.map(step => {
                    return {
                      ...step,
                      validate: createValidator(
                        step.schema,
                        customFieldValidators,
                        { apiHolder },
                      ),
                    };
                  })}
                />
              </InfoCard>
            )}
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
