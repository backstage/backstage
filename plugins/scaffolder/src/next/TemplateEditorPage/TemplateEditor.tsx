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
import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import type {
  FormProps,
  LayoutOptions,
} from '@backstage/plugin-scaffolder-react';
import { FieldExtensionOptions } from '@backstage/plugin-scaffolder-react';

import { TemplateDirectoryAccess } from '../../lib/filesystem';

import { DirectoryEditorProvider } from './DirectoryEditorContext';
import { DryRunProvider } from './DryRunContext';
import { DryRunResults } from './DryRunResults';
import { TemplateEditorBrowser } from './TemplateEditorBrowser';
import { TemplateEditorToolbar } from './TemplateEditorToolbar';
import { TemplateEditorTextArea } from './TemplateEditorTextArea';
import { TemplateEditorForm } from './TemplateEditorForm';

/** @public */
export type ScaffolderTemplateEditorClassKey =
  | 'root'
  | 'browser'
  | 'editor'
  | 'preview'
  | 'results';

const useStyles = makeStyles(
  theme => ({
    // Reset and fix sizing to make sure scrolling behaves correctly
    root: {
      gridArea: 'pageContent',
      display: 'grid',
      gridTemplateAreas: `
      "toolbar toolbar toolbar"
      "browser editor preview"
      "results results results"
    `,
      gridTemplateColumns: '1fr 3fr 2fr',
      gridTemplateRows: 'auto 1fr auto',
    },
    toolbar: {
      gridArea: 'toolbar',
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    browser: {
      gridArea: 'browser',
      overflow: 'auto',
    },
    editor: {
      gridArea: 'editor',
      overflow: 'auto',
      borderLeft: `1px solid ${theme.palette.divider}`,
    },
    preview: {
      gridArea: 'preview',
      position: 'relative',
      borderLeft: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.default,
    },
    scroll: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      padding: theme.spacing(1.5),
      overflow: 'auto',
    },
    results: {
      gridArea: 'results',
    },
  }),
  { name: 'ScaffolderTemplateEditor' },
);

export const TemplateEditor = (props: {
  directory: TemplateDirectoryAccess;
  fieldExtensions?: FieldExtensionOptions<any, any>[];
  layouts?: LayoutOptions[];
  onClose?: () => void;
  formProps?: FormProps;
  customFieldExtensions?: FieldExtensionOptions<any, any>[];
}) => {
  const {
    directory,
    fieldExtensions,
    layouts,
    onClose,
    formProps,
    customFieldExtensions = [],
  } = props;
  const classes = useStyles();
  const [errorText, setErrorText] = useState<string>();

  return (
    <DirectoryEditorProvider directory={directory}>
      <DryRunProvider>
        <Paper className={classes.root} variant="outlined" square>
          <section className={classes.toolbar}>
            <TemplateEditorToolbar
              customFieldExtensions={customFieldExtensions}
            />
          </section>
          <section className={classes.browser}>
            <TemplateEditorBrowser onClose={onClose} />
          </section>
          <section className={classes.editor}>
            <TemplateEditorTextArea.DirectoryEditor errorText={errorText} />
          </section>
          <section className={classes.preview}>
            <div className={classes.scroll}>
              <TemplateEditorForm.DirectoryEditorDryRun
                setErrorText={setErrorText}
                fieldExtensions={fieldExtensions}
                layouts={layouts}
                formProps={formProps}
              />
            </div>
          </section>
          <section className={classes.results}>
            <DryRunResults />
          </section>
        </Paper>
      </DryRunProvider>
    </DirectoryEditorProvider>
  );
};
