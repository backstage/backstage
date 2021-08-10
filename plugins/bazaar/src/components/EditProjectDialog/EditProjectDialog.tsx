/*
 * Copyright 2021 The Backstage Authors
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

import React, { useState, useRef, ChangeEvent } from 'react';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { Entity } from '@backstage/catalog-model';
import { useApi, githubAuthApiRef } from '@backstage/core-plugin-api';
import { useAsync } from 'react-use';
import { InputField } from '../InputField';
import { InputMultiSelector } from '../InputMultiSelector';
import { createPullRequest, getBranches } from '../../util/githubUtils';
import { editBazaarProperties } from '../../util/editBazaarProperties';
import { InputSelector } from '../InputSelector';
import { JsonObject } from '@backstage/config';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  });

/*
  DialogTitleProps, DialogTitle, DialogContent and DialogActions 
  are copied from the git-release plugin
*/
export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

type Props = {
  entity: Entity;
  openEdit: boolean;
  handleClose: () => void;
};

const predefinedTags = [
  'java',
  'javascript',
  'go',
  'python',
  'kubernetes',
  'docker',
];

export const EditProjectDialog = ({ entity, openEdit, handleClose }: Props) => {
  const auth = useApi(githubAuthApiRef);

  const bazaarInfo = entity.metadata.bazaar as JsonObject;

  const [description, setDescription] = useState(
    (bazaarInfo.bazaar_description as string) || '',
  );

  const [status, setStatus] = useState(bazaarInfo.status as string);

  const { value } = useAsync(async (): Promise<string[]> => {
    return await getBranches(auth, entity);
  }, []);

  const branch = useRef(value?.[0] || '');
  const [, setBranchState] = useState(branch.current);
  const [title, setTitle] = useState('Edit project');
  const [commitMessage, setCommitMessage] = useState(
    'update catalog-info.yaml',
  );
  const isInvalid = useRef(false);
  const [isFormInvalid, setIsFormInvalid] = useState(false);
  const [tags, setTags] = useState<string[]>(
    entity.metadata?.tags
      ? entity.metadata?.tags?.filter(tag => tag !== 'bazaar')
      : [],
  );

  const handleDescriptionChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setDescription(event.target.value);
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setTitle(event.target.value);
  };

  const handleCommitMessageChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setCommitMessage(event.target.value);
  };

  const handleStatusChange = (selectedStatus: string): void => {
    setStatus(selectedStatus);
  };

  const handleTagChange = ({}, values: string[]) => {
    setTags(values);
  };

  const handleBranchChange = (branchName: string) => {
    branch.current = branchName;
    setBranchState(branchName);
  };

  const clearForm = () => {
    setDescription((bazaarInfo?.bazaar_description as string) || '');
    setStatus(bazaarInfo.status as string);
    setTags(
      entity.metadata?.tags
        ? entity.metadata?.tags?.filter((tag: string) => tag !== 'bazaar')
        : [],
    );
    setTitle('Edit project');
    setCommitMessage('update catalog-info.yaml');
    setIsFormInvalid(false);
    isInvalid.current = false;
    setBranchState('');
  };

  const handleCloseAndClear = () => {
    handleClose();
    clearForm();
  };

  const validate = () => {
    if (
      commitMessage === '' ||
      title === '' ||
      description === '' ||
      status === '' ||
      branch.current === ''
    ) {
      isInvalid.current = true;
      setIsFormInvalid(true);
    } else {
      isInvalid.current = false;
      setIsFormInvalid(false);
    }
  };

  const handleSubmit = async () => {
    validate();

    if (!isInvalid.current) {
      const clonedEntity = editBazaarProperties(
        entity,
        description,
        tags,
        status,
      );

      await createPullRequest(
        auth,
        title,
        commitMessage,
        branch.current,
        clonedEntity,
      );
      handleCloseAndClear();
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      onClose={handleCloseAndClear}
      aria-labelledby="customized-dialog-title"
      open={openEdit}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleCloseAndClear}>
        Edit project
      </DialogTitle>

      <DialogContent dividers>
        <InputField
          value={description as string}
          onChange={handleDescriptionChange}
          isFormInvalid={isFormInvalid}
          inputType="Bazaar description"
        />

        <InputSelector
          options={['proposed', 'ongoing']}
          value={status as string}
          onChange={handleStatusChange}
          isFormInvalid={isFormInvalid}
          label="Status"
        />

        <InputMultiSelector
          value={tags}
          onChange={handleTagChange}
          options={predefinedTags}
          label="Tags"
        />

        <InputField
          value={title}
          onChange={handleTitleChange}
          isFormInvalid={isFormInvalid}
          inputType="pull request title"
        />

        <InputSelector
          options={value || []}
          value={branch.current}
          onChange={handleBranchChange}
          isFormInvalid={isFormInvalid}
          label="Branch"
        />

        <InputField
          value={commitMessage}
          onChange={handleCommitMessageChange}
          isFormInvalid={isFormInvalid}
          inputType="commit message"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={clearForm} color="primary">
          Clear
        </Button>
        <Button onClick={handleSubmit} color="primary" type="submit">
          Create pull request
        </Button>
      </DialogActions>
    </Dialog>
  );
};
