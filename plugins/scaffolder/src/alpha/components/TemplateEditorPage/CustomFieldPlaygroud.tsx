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

import React, { useCallback, useMemo, useState } from 'react';
import yaml from 'yaml';
import validator from '@rjsf/validator-ajv8';
import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
import { yaml as yamlSupport } from '@codemirror/legacy-modes/mode/yaml';

import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { Form } from '@backstage/plugin-scaffolder-react/alpha';
import { FieldExtensionOptions } from '@backstage/plugin-scaffolder-react';

import { scaffolderTranslationRef } from '../../../translation';
import { TemplateEditorForm } from './TemplateEditorForm';

const useStyles = makeStyles(
  theme => ({
    root: {
      gridArea: 'pageContent',
      display: 'grid',
      gridTemplateRows: 'auto 1fr',
    },
    controls: {
      marginBottom: theme.spacing(2),
    },
    code: {
      width: '100%',
    },
  }),
  { name: 'ScaffolderCustomFieldExtensionsPlaygroud' },
);

export const CustomFieldPlaygroud = ({
  fieldExtensions = [],
}: {
  fieldExtensions?: FieldExtensionOptions<any, any>[];
}) => {
  const classes = useStyles();
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const fieldOptions = fieldExtensions.filter(field => !!field.schema);
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const [fieldFormState, setFieldFormState] = useState({});
  const [selectedField, setSelectedField] = useState(fieldOptions[0]);
  const sampleFieldTemplate = useMemo(
    () =>
      yaml.stringify({
        parameters: [
          {
            title: `${selectedField.name} Example`,
            properties: {
              [selectedField.name]: {
                type: selectedField.schema?.returnValue?.type,
                'ui:field': selectedField.name,
                'ui:options': fieldFormState,
              },
            },
          },
        ],
      }),
    [fieldFormState, selectedField],
  );

  const fieldComponents = useMemo(() => {
    return Object.fromEntries(
      fieldExtensions.map(({ name, component }) => [name, component]),
    );
  }, [fieldExtensions]);

  const handleSelectionChange = useCallback(
    (selection: FieldExtensionOptions) => {
      setSelectedField(selection);
      setFieldFormState({});
    },
    [setFieldFormState, setSelectedField],
  );

  const handleFieldConfigChange = useCallback(
    (state: {}) => {
      setFieldFormState(state);
      // Force TemplateEditorForm to re-render since some fields
      // may not be responsive to ui:option changes
      setRefreshKey(Date.now());
    },
    [setFieldFormState, setRefreshKey],
  );

  return (
    <main className={classes.root}>
      <div className={classes.controls}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="select-field-label">
            {t('templateEditorPage.customFieldExplorer.selectFieldLabel')}
          </InputLabel>
          <Select
            value={selectedField}
            label={t('templateEditorPage.customFieldExplorer.selectFieldLabel')}
            labelId="select-field-label"
            onChange={e =>
              handleSelectionChange(e.target.value as FieldExtensionOptions)
            }
          >
            {fieldOptions.map((option, idx) => (
              <MenuItem key={idx} value={option as any}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel-code-content"
            id="panel-code-header"
          >
            <Typography variant="h6">
              {t('templateEditorPage.customFieldExplorer.preview.title')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.code}>
              <CodeMirror
                readOnly
                theme="dark"
                height="100%"
                width="100%"
                extensions={[StreamLanguage.define(yamlSupport)]}
                value={sampleFieldTemplate}
              />
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel-preview-content"
            id="panel-preview-header"
          >
            <Typography variant="h6">
              {t('templateEditorPage.customFieldExplorer.fieldPreview.title')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TemplateEditorForm
              key={refreshKey}
              content={sampleFieldTemplate}
              contentIsSpec
              fieldExtensions={fieldExtensions}
              setErrorText={() => null}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel-options-content"
            id="panel-options-header"
          >
            <Typography variant="h6">
              {t('templateEditorPage.customFieldExplorer.fieldForm.title')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Form
              showErrorList={false}
              fields={{ ...fieldComponents }}
              noHtml5Validate
              formData={fieldFormState}
              formContext={{ fieldFormState }}
              onSubmit={e => handleFieldConfigChange(e.formData)}
              validator={validator}
              schema={selectedField.schema?.uiOptions || {}}
              experimental_defaultFormStateBehavior={{
                allOf: 'populateDefaults',
              }}
            >
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!selectedField.schema?.uiOptions}
              >
                {t(
                  'templateEditorPage.customFieldExplorer.fieldForm.applyButtonTitle',
                )}
              </Button>
            </Form>
          </AccordionDetails>
        </Accordion>
      </div>
    </main>
  );
};
