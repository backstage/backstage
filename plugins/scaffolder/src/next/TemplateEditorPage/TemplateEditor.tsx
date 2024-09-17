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
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import type {
  FormProps,
  LayoutOptions,
} from '@backstage/plugin-scaffolder-react';
import { FieldExtensionOptions } from '@backstage/plugin-scaffolder-react';
import { TemplateDirectoryAccess } from '../../lib/filesystem';
import { DirectoryEditorProvider } from './DirectoryEditorContext';
import { TemplateEditorBrowser } from './TemplateEditorBrowser';
import { DryRunProvider } from './DryRunContext';
import { TemplateEditorTextArea } from './TemplateEditorTextArea';
import { TemplateEditorForm } from './TemplateEditorForm';
import { DryRunResults } from './DryRunResults';

/** @public */
export type ScaffolderTemplateEditorClassKey =
  | 'root'
  | 'browser'
  | 'editor'
  | 'preview'
  | 'results';

const useStyles = makeStyles(
  {
    // Reset and fix sizing to make sure scrolling behaves correctly
    root: {
      gridArea: 'pageContent',
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
  },
  { name: 'ScaffolderTemplateEditor' },
);

export const TemplateEditor = (props: {
  directory: TemplateDirectoryAccess;
  fieldExtensions?: FieldExtensionOptions<any, any>[];
  layouts?: LayoutOptions[];
  onClose?: () => void;
  formProps?: FormProps;
}) => {
  const classes = useStyles();

  const [errorText, setErrorText] = useState<string>();

  return (
    <DirectoryEditorProvider directory={props.directory}>
      <DryRunProvider>
        <main className={classes.root}>
          <section className={classes.browser}>
            <TemplateEditorBrowser onClose={props.onClose} />
          </section>
          <section className={classes.editor}>
            <TemplateEditorTextArea.DirectoryEditor errorText={errorText} />
          </section>
          <section className={classes.preview}>
            <TemplateEditorForm.DirectoryEditorDryRun
              setErrorText={setErrorText}
              fieldExtensions={props.fieldExtensions}
              layouts={props.layouts}
              formProps={props.formProps}
            />
          </section>
          <section className={classes.results}>
            <DryRunResults />
          </section>
        </main>
      </DryRunProvider>
    </DirectoryEditorProvider>
  );
};
