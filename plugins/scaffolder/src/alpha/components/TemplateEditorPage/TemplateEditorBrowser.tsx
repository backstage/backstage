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
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import RefreshIcon from '@material-ui/icons/Refresh';
import SaveIcon from '@material-ui/icons/Save';
import { useDirectoryEditor } from './DirectoryEditorContext';
import { FileBrowser } from '../../../components/FileBrowser';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';

const useStyles = makeStyles(
  theme => ({
    grid: {
      '& svg': {
        margin: theme.spacing(1),
      },
    },
    closeButton: {
      marginLeft: 'auto',
    },
  }),
  { name: 'ScaffolderTemplateEditorBrowser' },
);

/** The local file browser for the template editor */
export function TemplateEditorBrowser(props: { onClose?: () => void }) {
  const classes = useStyles();
  const directoryEditor = useDirectoryEditor();
  const changedFiles = directoryEditor?.files.filter(file => file.dirty);
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const handleClose = () => {
    if (!props.onClose) {
      return;
    }
    if (changedFiles?.length) {
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

  if (!directoryEditor) {
    return null;
  }

  return (
    <>
      <Grid className={classes.grid} container spacing={0} alignItems="center">
        <Tooltip
          title={t('templateEditorPage.templateEditorBrowser.saveIconTooltip')}
        >
          <IconButton
            size="small"
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
          <IconButton size="small" onClick={() => directoryEditor.reload()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={t('templateEditorPage.templateEditorBrowser.closeIconTooltip')}
        >
          <IconButton
            size="small"
            className={classes.closeButton}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </Grid>
      <Divider />
      <FileBrowser
        selected={directoryEditor.selectedFile?.path ?? ''}
        onSelect={directoryEditor.setSelectedFile}
        filePaths={directoryEditor.files.map(file => file.path) ?? []}
      />
    </>
  );
}
