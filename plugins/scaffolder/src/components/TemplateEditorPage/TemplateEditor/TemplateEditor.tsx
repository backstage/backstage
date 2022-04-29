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
import { Divider, IconButton, makeStyles, Tooltip } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import RefreshIcon from '@material-ui/icons/Refresh';
import SaveIcon from '@material-ui/icons/Save';
import React, { useState } from 'react';
import { FieldExtensionOptions } from '../../../extensions';
import { TemplateDirectoryAccess } from '../../../lib/filesystem';
import { FileBrowser } from '../../FileBrowser';
import {
  DirectoryEditorProvider,
  useDirectoryEditor,
} from './DirectoryEditorContext';
import { DryRunProvider } from './DryRunContext';
import { DryRunResults } from './DryRunResults';
import { TemplateEditorForm } from './TemplateEditorForm';
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
              <TemplateEditorForm.DirectoryEditorDryRun
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
