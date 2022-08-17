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
import { useApiHolder } from '@backstage/core-plugin-api';
import { JsonObject, JsonValue } from '@backstage/types';
import { makeStyles } from '@material-ui/core/styles';
import React, { Component, ReactNode, useMemo, useState } from 'react';
import useDebounce from 'react-use/lib/useDebounce';
import yaml from 'yaml';
import { FieldExtensionOptions } from '../../extensions';
import { TemplateParameterSchema } from '../../types';
import { MultistepJsonForm } from '../MultistepJsonForm';
import { createValidator } from '../TemplatePage';
import { useDirectoryEditor } from './DirectoryEditorContext';
import { useDryRun } from './DryRunContext';

const useStyles = makeStyles({
  containerWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'auto',
  },
});

interface ErrorBoundaryProps {
  invalidator: unknown;
  setErrorText(errorText: string | undefined): void;
  children: ReactNode;
}

interface ErrorBoundaryState {
  shouldRender: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state = {
    shouldRender: true,
  };

  componentDidUpdate(prevProps: { invalidator: unknown }) {
    if (prevProps.invalidator !== this.props.invalidator) {
      this.setState({ shouldRender: true });
    }
  }

  componentDidCatch(error: Error) {
    this.props.setErrorText(error.message);
    this.setState({ shouldRender: false });
  }

  render() {
    return this.state.shouldRender ? this.props.children : null;
  }
}

interface TemplateEditorFormProps {
  content?: string;
  /** Setting this to true will cause the content to be parsed as if it is the template entity spec */
  contentIsSpec?: boolean;
  data: JsonObject;
  onUpdate: (data: JsonObject) => void;
  setErrorText: (errorText?: string) => void;

  onDryRun?: (data: JsonObject) => Promise<void>;
  fieldExtensions?: FieldExtensionOptions<any, any>[];
}

function isJsonObject(value: JsonValue | undefined): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Shows the a template form that is parsed from the provided content */
export function TemplateEditorForm(props: TemplateEditorFormProps) {
  const {
    content,
    contentIsSpec,
    data,
    onUpdate,
    onDryRun,
    setErrorText,
    fieldExtensions = [],
  } = props;
  const classes = useStyles();
  const apiHolder = useApiHolder();

  const [steps, setSteps] = useState<TemplateParameterSchema['steps']>();

  const fields = useMemo(() => {
    return Object.fromEntries(
      fieldExtensions.map(({ name, component }) => [name, component]),
    );
  }, [fieldExtensions]);

  useDebounce(
    () => {
      try {
        if (!content) {
          setSteps(undefined);
          return;
        }
        const parsed: JsonValue = yaml.parse(content);

        if (!isJsonObject(parsed)) {
          setSteps(undefined);
          return;
        }

        let rootObj = parsed;
        if (!contentIsSpec) {
          const isTemplate =
            String(parsed.kind).toLocaleLowerCase('en-US') === 'template';
          if (!isTemplate) {
            setSteps(undefined);
            return;
          }

          rootObj = isJsonObject(parsed.spec) ? parsed.spec : {};
        }

        const { parameters } = rootObj;
        if (!Array.isArray(parameters)) {
          setErrorText('Template parameters must be an array');
          setSteps(undefined);
          return;
        }

        const fieldValidators = Object.fromEntries(
          fieldExtensions.map(({ name, validation }) => [name, validation]),
        );

        setErrorText();
        setSteps(
          parameters.flatMap(param =>
            isJsonObject(param)
              ? [
                  {
                    title: String(param.title),
                    schema: param,
                    validate: createValidator(param, fieldValidators, {
                      apiHolder,
                    }),
                  },
                ]
              : [],
          ),
        );
      } catch (e) {
        setErrorText(e.message);
      }
    },
    250,
    [contentIsSpec, content, apiHolder],
  );

  if (!steps) {
    return null;
  }

  return (
    <div className={classes.containerWrapper}>
      <div className={classes.container}>
        <ErrorBoundary invalidator={steps} setErrorText={setErrorText}>
          <MultistepJsonForm
            steps={steps}
            fields={fields}
            formData={data}
            onChange={e => onUpdate(e.formData)}
            onReset={() => onUpdate({})}
            finishButtonLabel={onDryRun && 'Try It'}
            onFinish={onDryRun && (() => onDryRun(data))}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
}

/** A version of the TemplateEditorForm that is connected to the DirectoryEditor and DryRun contexts */
export function TemplateEditorFormDirectoryEditorDryRun(
  props: Pick<TemplateEditorFormProps, 'setErrorText' | 'fieldExtensions'>,
) {
  const { setErrorText, fieldExtensions = [] } = props;
  const dryRun = useDryRun();

  const directoryEditor = useDirectoryEditor();
  const { selectedFile } = directoryEditor;

  const [data, setData] = useState<JsonObject>({});

  const handleDryRun = async () => {
    if (!selectedFile) {
      return;
    }

    try {
      await dryRun.execute({
        templateContent: selectedFile.content,
        values: data,
        files: directoryEditor.files,
      });
      setErrorText();
    } catch (e) {
      setErrorText(String(e.cause || e));
      throw e;
    }
  };

  const content =
    selectedFile && selectedFile.path.match(/\.ya?ml$/)
      ? selectedFile.content
      : undefined;

  return (
    <TemplateEditorForm
      onDryRun={handleDryRun}
      fieldExtensions={fieldExtensions}
      setErrorText={setErrorText}
      content={content}
      data={data}
      onUpdate={setData}
    />
  );
}

TemplateEditorForm.DirectoryEditorDryRun =
  TemplateEditorFormDirectoryEditorDryRun;
