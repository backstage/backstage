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
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import RefreshIcon from '@material-ui/icons/Refresh';
import SaveIcon from '@material-ui/icons/Save';
import React from 'react';
import { useDirectoryEditor } from './DirectoryEditorContext';
import { FileBrowser } from '../../components/FileBrowser';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../translation';

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
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const handleClose = () => {
    if (!props.onClose) {
      return;
    }
    if (changedFiles.length > 0) {
      // eslint-disable-next-line no-alert
      const accepted = window.confirm(
        t('templateEditorPage.templateEditorBrowser.closeConfirmMessage'),
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
        <Tooltip
          title={t('templateEditorPage.templateEditorBrowser.saveIconTooltip')}
        >
          <IconButton
            className={classes.button}
            disabled={directoryEditor.files.every(file => !file.dirty)}
            onClick={() => directoryEditor.save()}
          >
            <SaveIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={t(
            'templateEditorPage.templateEditorBrowser.reloadIconTooltip',
          )}
        >
          <IconButton
            className={classes.button}
            onClick={() => directoryEditor.reload()}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <div className={classes.buttonsGap} />
        <Tooltip
          title={t('templateEditorPage.templateEditorBrowser.closeIconTooltip')}
        >
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
