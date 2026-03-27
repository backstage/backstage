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
import CodeMirror from '@uiw/react-codemirror';
import { useCallback, useMemo, useState } from 'react';
import yaml from 'yaml';
import { Form } from '@backstage/plugin-scaffolder-react/alpha';
import { TemplateEditorForm } from './TemplateEditorForm';
import validator from '@rjsf/validator-ajv8';
import { FieldExtensionOptions } from '@backstage/plugin-scaffolder-react';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';
import {
  cn,
  ShadcnButton as Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@backstage/core-components';
import { Search } from 'lucide-react';

/** @public */
export type ScaffolderCustomFieldExplorerClassKey =
  | 'root'
  | 'controls'
  | 'fieldForm'
  | 'preview';

export const CustomFieldExplorer = ({
  customFieldExtensions = [],
}: {
  customFieldExtensions?: FieldExtensionOptions<any, any>[];
}) => {
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const [open, setOpen] = useState(false);
  const fieldOptions = customFieldExtensions.filter(field => !!field.schema);
  const [selectedField, setSelectedField] = useState(fieldOptions?.[0]);
  const [fieldFormState, setFieldFormState] = useState({});
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const [errorText, setErrorText] = useState<string>();
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
      setErrorText(undefined);
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
    <main
      className={cn(
        'grid grid-cols-1 gap-4',
        'md:[grid-template-areas:_"controls_controls"_"fieldForm_preview"] md:grid-rows-[auto_1fr] md:grid-cols-2',
        '[grid-template-areas:_"controls"_"fieldForm"_"preview"]',
      )}
      style={{ gridArea: 'pageContent' }}
    >
      <div className="[grid-area:controls] flex flex-row flex-nowrap items-center">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-label={t(
                'templateEditorPage.customFieldExplorer.selectFieldLabel',
              )}
              className="w-full justify-between"
            >
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              {selectedField?.name ??
                t('templateEditorPage.customFieldExplorer.selectFieldLabel')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput
                placeholder={t(
                  'templateEditorPage.customFieldExplorer.selectFieldLabel',
                )}
              />
              <CommandList>
                <CommandEmpty>No field found.</CommandEmpty>
                <CommandGroup>
                  {fieldOptions.map(option => (
                    <CommandItem
                      key={option.name}
                      value={option.name}
                      onSelect={() => {
                        handleSelectionChange(option);
                        setOpen(false);
                      }}
                    >
                      {option.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="[grid-area:fieldForm]">
        <Card>
          <CardHeader>
            <CardTitle>
              {t('templateEditorPage.customFieldExplorer.fieldForm.title')}
            </CardTitle>
          </CardHeader>
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
      <div className="[grid-area:preview] grid gap-4 content-start">
        <Card>
          <CardHeader>
            <CardTitle>
              {t('templateEditorPage.customFieldExplorer.preview.title')}
            </CardTitle>
          </CardHeader>
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
          setErrorText={setErrorText}
        />
        {errorText && (
          <div
            role="alert"
            className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <p className="font-medium">Field preview error</p>
            <p className="mt-1">{errorText}</p>
          </div>
        )}
      </div>
    </main>
  );
};
