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

import { useCallback, useMemo, useState } from 'react';
import yaml from 'yaml';
import validator from '@rjsf/validator-ajv8';
import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
import { yaml as yamlSupport } from '@codemirror/legacy-modes/mode/yaml';

import {
  cn,
  ShadcnButton as Button,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
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

import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { Form } from '@backstage/plugin-scaffolder-react/alpha';
import { FieldExtensionOptions } from '@backstage/plugin-scaffolder-react';

import { scaffolderTranslationRef } from '../../../translation';
import { TemplateEditorForm } from './TemplateEditorForm';

export const CustomFieldPlayground = ({
  fieldExtensions = [],
}: {
  fieldExtensions?: FieldExtensionOptions<any, any>[];
}) => {
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const fieldOptions = fieldExtensions.filter(field => !!field.schema);
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const [fieldFormState, setFieldFormState] = useState({});
  const [selectedField, setSelectedField] = useState(fieldOptions[0]);
  const [open, setOpen] = useState(false);
  const [errorText, setErrorText] = useState<string>();
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
      className={cn('grid grid-rows-[auto_1fr]', '[grid-area:pageContent]')}
    >
      <div className="mb-6">
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
      <div>
        <Accordion
          type="multiple"
          defaultValue={['code', 'preview', 'options']}
        >
          <AccordionItem value="code">
            <AccordionTrigger>
              <span className="text-lg font-semibold">
                {t('templateEditorPage.customFieldExplorer.preview.title')}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="w-full">
                <CodeMirror
                  readOnly
                  theme="dark"
                  height="100%"
                  width="100%"
                  extensions={[StreamLanguage.define(yamlSupport)]}
                  value={sampleFieldTemplate}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="preview">
            <AccordionTrigger>
              <span className="text-lg font-semibold">
                {t('templateEditorPage.customFieldExplorer.fieldPreview.title')}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <TemplateEditorForm
                key={refreshKey}
                content={sampleFieldTemplate}
                contentIsSpec
                fieldExtensions={fieldExtensions}
                setErrorText={setErrorText}
              />
              {errorText && (
                <div
                  role="alert"
                  className="mt-2 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                  <p className="font-medium">Field preview error</p>
                  <p className="mt-1">{errorText}</p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="options">
            <AccordionTrigger>
              <span className="text-lg font-semibold">
                {t('templateEditorPage.customFieldExplorer.fieldForm.title')}
              </span>
            </AccordionTrigger>
            <AccordionContent>
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
                  type="submit"
                  disabled={!selectedField.schema?.uiOptions}
                >
                  {t(
                    'templateEditorPage.customFieldExplorer.fieldForm.applyButtonTitle',
                  )}
                </Button>
              </Form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </main>
  );
};
