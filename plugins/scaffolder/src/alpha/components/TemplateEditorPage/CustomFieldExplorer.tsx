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
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { makeStyles } from '@material-ui/core/styles';
import CodeMirror from '@uiw/react-codemirror';
import { useCallback, useMemo, useState } from 'react';
import yaml from 'yaml';
import { Form } from '@backstage/plugin-scaffolder-react/alpha';
import { TemplateEditorForm } from './TemplateEditorForm';
import validator from '@rjsf/validator-ajv8';
import { FieldExtensionOptions } from '@backstage/plugin-scaffolder-react';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';

/** @public */
export type ScaffolderCustomFieldExplorerClassKey =
  | 'root'
  | 'controls'
  | 'fieldForm'
  | 'preview';

const useStyles = makeStyles(
  theme => ({
    root: {
      gridArea: 'pageContent',
      display: 'grid',
      gridGap: theme.spacing(2),
      gridTemplateAreas: `
      "controls"
      "fieldForm"
      "preview"
    `,
      [theme.breakpoints.up('md')]: {
        gridTemplateAreas: `
      "controls controls"
      "fieldForm preview"
    `,
        gridTemplateRows: 'auto 1fr',
        gridTemplateColumns: '1fr 1fr',
      },
    },
    controls: {
      gridArea: 'controls',
      display: 'flex',
      flexFlow: 'row nowrap',
      alignItems: 'center',
    },
    fieldForm: {
      gridArea: 'fieldForm',
    },
    preview: {
      gridArea: 'preview',
      display: 'grid',
      gridGap: theme.spacing(2),
      alignContent: 'start',
    },
  }),
  { name: 'ScaffolderCustomFieldExplorer' },
);

export const CustomFieldExplorer = ({
  customFieldExtensions = [],
}: {
  customFieldExtensions?: FieldExtensionOptions<any, any>[];
}) => {
  const classes = useStyles();
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const fieldOptions = customFieldExtensions.filter(field => !!field.schema);
  const [selectedField, setSelectedField] = useState(fieldOptions?.[0]);
  const [fieldFormState, setFieldFormState] = useState({});
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const sampleFieldTemplate = useMemo(() => {
    if (!selectedField) {
      return '';
    }
    return yaml.stringify({
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
    });
  }, [fieldFormState, selectedField]);

  const fieldComponents = useMemo(() => {
    return Object.fromEntries(
      customFieldExtensions.map(({ name, component }) => [name, component]),
    );
  }, [customFieldExtensions]);

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
        <Autocomplete
          id="custom-fields-autocomplete"
          value={selectedField}
          options={fieldOptions}
          getOptionLabel={option => option.name}
          renderInput={params => (
            <TextField
              {...params}
              aria-label={t(
                'templateEditorPage.customFieldExplorer.selectFieldLabel',
              )}
              placeholder={t(
                'templateEditorPage.customFieldExplorer.selectFieldLabel',
              )}
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
          onChange={(_event, option) => {
            if (option) {
              handleSelectionChange(option);
            }
          }}
          disableClearable
          fullWidth
        />
      </div>
      <div className={classes.fieldForm}>
        <Card>
          <CardHeader
            title={t('templateEditorPage.customFieldExplorer.fieldForm.title')}
          />
          <CardContent>
            <Form
              showErrorList={false}
              fields={{ ...fieldComponents }}
              noHtml5Validate
              formData={fieldFormState}
              formContext={{ fieldFormState }}
              onSubmit={e => handleFieldConfigChange(e.formData)}
              validator={validator}
              schema={selectedField?.schema?.uiOptions || {}}
              experimental_defaultFormStateBehavior={{
                allOf: 'populateDefaults',
              }}
            >
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!selectedField?.schema?.uiOptions}
              >
                {t(
                  'templateEditorPage.customFieldExplorer.fieldForm.applyButtonTitle',
                )}
              </Button>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className={classes.preview}>
        <Card>
          <CardHeader
            title={t('templateEditorPage.customFieldExplorer.preview.title')}
          />
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
          setErrorText={() => null}
        />
      </div>
    </main>
  );
};
