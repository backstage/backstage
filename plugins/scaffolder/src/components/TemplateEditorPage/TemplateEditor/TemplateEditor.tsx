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
import { Divider, IconButton, makeStyles, Tooltip } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import RefreshIcon from '@material-ui/icons/Refresh';
import SaveIcon from '@material-ui/icons/Save';
import React, {
  Component,
  ReactNode,
  useMemo,
  useReducer,
  useState,
} from 'react';
import useDebounce from 'react-use/lib/useDebounce';
import yaml from 'yaml';
import { FieldExtensionOptions } from '../../../extensions';
import { TemplateDirectoryAccess } from '../../../lib/filesystem';
import { TemplateParameterSchema } from '../../../types';
import { FileBrowser } from '../../FileBrowser';
import { MultistepJsonForm } from '../../MultistepJsonForm';
import { createValidator } from '../../TemplatePage';
import {
  DirectoryEditorProvider,
  useDirectoryEditor,
} from './DirectoryEditorContext';
import { DryRunProvider, useDryRun } from './DryRunContext';
import { DryRunResults } from './DryRunResults';
import { TemplateEditorTextArea } from './TemplateEditorTextArea';

const useStyles = makeStyles(theme => ({
  // Reset and fix sizing to make sure scrolling behaves correctly
  rootWrapper: {
    gridArea: 'pageContent',
    position: 'relative',
    width: '100%',
  },
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,

    display: 'grid',
    gridTemplateAreas: `
      "browser editor preview"
      "results results results"
    `,
    gridTemplateColumns: '1fr 3fr 2fr',
    gridTemplateRows: '1fr auto',
  },
  browser: {
    gridArea: 'browser',
    overflow: 'auto',
  },
  browserButton: {
    padding: theme.spacing(1),
  },
  browserButtons: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  browserButtonsGap: {
    flex: '1 1 auto',
  },
  browserButtonsDivider: {
    marginBottom: theme.spacing(1),
  },
  editor: {
    gridArea: 'editor',
    overflow: 'auto',
  },
  preview: {
    gridArea: 'preview',
    overflow: 'auto',
  },
  results: {
    gridArea: 'results',
  },
}));

export const TemplateEditor = (props: {
  directory: TemplateDirectoryAccess;
  fieldExtensions?: FieldExtensionOptions<any, any>[];
  onClose?: () => void;
}) => {
  const classes = useStyles();

  const [errorText, setErrorText] = useState<string>();

  return (
    <DirectoryEditorProvider directory={props.directory}>
      <DryRunProvider>
        <div className={classes.rootWrapper}>
          <main className={classes.root}>
            <section className={classes.browser}>
              <TemplateEditorBrowser onClose={props.onClose} />
            </section>
            <section className={classes.editor}>
              <TemplateEditorTextArea.DirectoryEditor errorText={errorText} />
            </section>
            <section className={classes.preview}>
              <TemplateEditorForm
                setErrorText={setErrorText}
                fieldExtensions={props.fieldExtensions}
              />
            </section>
            <section className={classes.results}>
              <DryRunResults />
            </section>
          </main>
        </div>
      </DryRunProvider>
    </DirectoryEditorProvider>
  );
};

function TemplateEditorBrowser(props: { onClose?: () => void }) {
  const classes = useStyles();
  const directoryEditor = useDirectoryEditor();
  const changedFiles = directoryEditor.files.filter(file => file.dirty);

  const handleClose = () => {
    if (!props.onClose) {
      return;
    }
    if (changedFiles.length > 0) {
      // eslint-disable-next-line no-alert
      const accepted = window.confirm(
        'Are you sure? Unsaved changes will be lost',
      );
      if (!accepted) {
        return;
      }
    }
    props.onClose();
  };

  return (
    <>
      <div className={classes.browserButtons}>
        <Tooltip title="Save all files">
          <IconButton
            className={classes.browserButton}
            onClick={() => directoryEditor.save()}
          >
            <SaveIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Reload directory">
          <IconButton
            className={classes.browserButton}
            onClick={() => directoryEditor.reload()}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <div className={classes.browserButtonsGap} />
        <Tooltip title="Close directory">
          <IconButton className={classes.browserButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </div>
      <Divider className={classes.browserButtonsDivider} />
      <FileBrowser
        selected={directoryEditor.selectedFile?.path ?? ''}
        onSelect={directoryEditor.setSelectedFile}
        filePaths={directoryEditor.files.map(file => file.path)}
      />
    </>
  );
}

interface ErrorBoundaryProps {
  generation: number;
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

  componentDidUpdate(prevProps: { generation: number }) {
    if (prevProps.generation !== this.props.generation) {
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

interface TemplateFormState {
  filePath?: string;
  content?: string;
  steps?: TemplateParameterSchema['steps'];
  formData: JsonObject;
  schemaGeneration: number;
}

type TemplateFormAction =
  | {
      type: 'reset';
    }
  | {
      type: 'updateData';
      formData: JsonObject;
    }
  | {
      type: 'updateSchema';
      steps: TemplateParameterSchema['steps'];
      filePath: string;
    };

const initialTemplateFormState: TemplateFormState = {
  steps: undefined,
  filePath: undefined,
  formData: {},
  // Used to reset the error boundary in edit
  schemaGeneration: 0,
};

function templateFormReducer(
  state: TemplateFormState,
  action: TemplateFormAction,
): TemplateFormState {
  switch (action.type) {
    case 'reset': {
      return initialTemplateFormState;
    }
    case 'updateData': {
      return {
        ...state,
        formData: action.formData,
      };
    }
    case 'updateSchema': {
      const { filePath, steps } = action;

      return {
        steps,
        filePath,
        formData: state.filePath === filePath ? state.formData : {},
        schemaGeneration: state.schemaGeneration + 1,
      };
    }
    default:
      return state;
  }
}

interface TemplateEditorFormProps {
  setErrorText: (errorText?: string) => void;
  fieldExtensions?: FieldExtensionOptions<any, any>[];
}

function isJsonObject(value: JsonValue | undefined): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function TemplateEditorForm(props: TemplateEditorFormProps) {
  const { setErrorText, fieldExtensions = [] } = props;
  const dryRun = useDryRun();

  const apiHolder = useApiHolder();
  const directoryEditor = useDirectoryEditor();
  const { selectedFile } = directoryEditor;
  const [state, dispatch] = useReducer(
    templateFormReducer,
    initialTemplateFormState,
  );

  useDebounce(
    () => {
      try {
        if (!selectedFile || !selectedFile.path.match(/\.ya?ml$/)) {
          dispatch({ type: 'reset' });
          return;
        }
        const parsed: JsonValue = yaml.parse(selectedFile.content);
        const isTemplate =
          typeof parsed === 'object' &&
          parsed !== null &&
          'kind' in parsed &&
          typeof parsed.kind === 'string' &&
          parsed.kind.toLocaleLowerCase('en-US') === 'template';

        if (!isTemplate) {
          dispatch({ type: 'reset' });
          return;
        }

        const spec = parsed.spec;
        const parameters = isJsonObject(spec) && spec.parameters;
        if (!Array.isArray(parameters)) {
          setErrorText('Template parameters must be an array');
          return;
        }

        const fieldValidators = Object.fromEntries(
          fieldExtensions.map(({ name, validation }) => [name, validation]),
        );

        setErrorText();

        dispatch({
          type: 'updateSchema',
          filePath: selectedFile.path,
          steps: parameters.flatMap(param =>
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
        });
      } catch (e) {
        setErrorText(e.message);
      }
    },
    250,
    [selectedFile?.path, selectedFile?.content, apiHolder],
  );

  const fields = useMemo(() => {
    return Object.fromEntries(
      fieldExtensions.map(({ name, component }) => [name, component]),
    );
  }, [fieldExtensions]);

  if (!state.steps) {
    return null;
  }

  const handleDryRun = async () => {
    if (!selectedFile) {
      return;
    }

    await dryRun.execute({
      templateContent: selectedFile.content,
      values: state.formData,
      files: directoryEditor.files,
    });
  };

  return (
    <ErrorBoundary
      generation={state.schemaGeneration}
      setErrorText={setErrorText}
    >
      <MultistepJsonForm
        steps={state.steps}
        fields={fields}
        formData={state.formData}
        onChange={e => dispatch({ type: 'updateData', formData: e.formData })}
        onReset={() => dispatch({ type: 'updateData', formData: {} })}
        finishButtonLabel="Try It"
        onFinish={handleDryRun}
      />
    </ErrorBoundary>
  );
}
