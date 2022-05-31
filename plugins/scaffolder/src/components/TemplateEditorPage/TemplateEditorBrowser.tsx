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
import React from 'react';
import { FileBrowser } from '../FileBrowser';
import { useDirectoryEditor } from './DirectoryEditorContext';

const useStyles = makeStyles(theme => ({
  button: {
    padding: theme.spacing(1),
  },
  buttons: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  buttonsGap: {
    flex: '1 1 auto',
  },
  buttonsDivider: {
    marginBottom: theme.spacing(1),
  },
}));

/** The local file browser for the template editor */
export function TemplateEditorBrowser(props: { onClose?: () => void }) {
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
      <div className={classes.buttons}>
        <Tooltip title="Save all files">
          <IconButton
            className={classes.button}
            disabled={directoryEditor.files.every(file => !file.dirty)}
            onClick={() => directoryEditor.save()}
          >
            <SaveIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Reload directory">
          <IconButton
            className={classes.button}
            onClick={() => directoryEditor.reload()}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <div className={classes.buttonsGap} />
        <Tooltip title="Close directory">
          <IconButton className={classes.button} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </div>
      <Divider className={classes.buttonsDivider} />
      <FileBrowser
        selected={directoryEditor.selectedFile?.path ?? ''}
        onSelect={directoryEditor.setSelectedFile}
        filePaths={directoryEditor.files.map(file => file.path)}
      />
    </>
  );
}
