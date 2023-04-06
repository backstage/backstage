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
import { StreamLanguage } from '@codemirror/language';
import { yaml as yamlSupport } from '@codemirror/legacy-modes/mode/yaml';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  IconButton,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { withTheme } from '@rjsf/core';
import { Theme as MuiTheme } from '@rjsf/material-ui';
import CodeMirror from '@uiw/react-codemirror';
import React, { useCallback, useMemo, useState } from 'react';
import yaml from 'yaml';
import { FieldExtensionOptions } from '@backstage/plugin-scaffolder-react';
import * as fieldOverrides from '../MultistepJsonForm/FieldOverrides';
import { TemplateEditorForm } from './TemplateEditorForm';

const Form = withTheme(MuiTheme);

const useStyles = makeStyles(theme => ({
  root: {
    gridArea: 'pageContent',
    display: 'grid',
    gridTemplateAreas: `
      "controls controls"
      "fieldForm preview"
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
  fieldForm: {
    gridArea: 'fieldForm',
  },
  preview: {
    gridArea: 'preview',
  },
}));

export const CustomFieldExplorer = ({
  customFieldExtensions = [],
  onClose,
}: {
  customFieldExtensions?: FieldExtensionOptions<any, any>[];
  onClose?: () => void;
}) => {
  const classes = useStyles();
  const fieldOptions = customFieldExtensions.filter(field => !!field.schema);
  const [selectedField, setSelectedField] = useState(fieldOptions[0]);
  const [fieldFormState, setFieldFormState] = useState({});
  const [formState, setFormState] = useState({});
  const [refreshKey, setRefreshKey] = useState(Date.now());
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
      customFieldExtensions.map(({ name, component }) => [name, component]),
    );
  }, [customFieldExtensions]);

  const handleSelectionChange = useCallback(
    selection => {
      setSelectedField(selection);
      setFieldFormState({});
      setFormState({});
    },
    [setFieldFormState, setFormState, setSelectedField],
  );

  const handleFieldConfigChange = useCallback(
    state => {
      setFieldFormState(state);
      setFormState({});
      // Force TemplateEditorForm to re-render since some fields
      // may not be responsive to ui:option changes
      setRefreshKey(Date.now());
    },
    [setFieldFormState, setRefreshKey],
  );

  return (
    <main className={classes.root}>
      <div className={classes.controls}>
        <FormControl variant="outlined" size="small" fullWidth>
          <InputLabel id="select-field-label">
            Choose Custom Field Extension
          </InputLabel>
          <Select
            value={selectedField}
            label="Choose Custom Field Extension"
            labelId="select-field-label"
            onChange={e => handleSelectionChange(e.target.value)}
          >
            {fieldOptions.map((option, idx) => (
              <MenuItem key={idx} value={option as any}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <IconButton size="medium" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>
      <div className={classes.fieldForm}>
        <Card>
          <CardHeader title="Field Options" />
          <CardContent>
            <Form
              showErrorList={false}
              fields={{ ...fieldOverrides, ...fieldComponents }}
              noHtml5Validate
              formData={fieldFormState}
              formContext={{ fieldFormState }}
              onSubmit={e => handleFieldConfigChange(e.formData)}
              schema={selectedField.schema?.uiOptions || {}}
            >
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!selectedField.schema?.uiOptions}
              >
                Apply
              </Button>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className={classes.preview}>
        <Card>
          <CardHeader title="Example Template Spec" />
          <CardContent>
            <CodeMirror
              readOnly
              theme="dark"
              height="100%"
              extensions={[StreamLanguage.define(yamlSupport)]}
              value={sampleFieldTemplate}
            />
          </CardContent>
        </Card>
        <TemplateEditorForm
          key={refreshKey}
          content={sampleFieldTemplate}
          contentIsSpec
          fieldExtensions={customFieldExtensions}
          data={formState}
          onUpdate={setFormState}
          setErrorText={() => null}
        />
      </div>
    </main>
  );
};
