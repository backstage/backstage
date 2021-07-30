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

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  ChangeEvent,
  MouseEvent,
} from 'react';
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
import { InputMultiSelector } from '../InputMultiSelector';
import { createPullRequest, getBranches } from '../../util/githubUtils';
import { editBazaarProperties } from '../../util/editBazaarProperties';
import { InputField } from '../InputField';
import { InputSelector } from '../InputSelector';
import { ProjectSelector } from '../ProjectSelector';
import { AlertBanner } from '../AlertBanner';

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
  entities?: Entity[];
  openAdd: boolean;
  handleClose: () => void;
};

export const AddProjectDialog = ({ entities, openAdd, handleClose }: Props) => {
  const auth = useApi(githubAuthApiRef);
  const [selectedEntity, setSelectedEntity] = useState(
    entities ? entities[0] : null,
  );
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('proposed');

  const { value, loading } = useAsync(async (): Promise<string[]> => {
    return selectedEntity ? await getBranches(auth, selectedEntity) : [];
  }, [selectedEntity]);

  const [openNoBranches, setOpenNoBranches] = useState(
    value?.length === 0 && !loading,
  );

  useEffect(() => {
    setOpenNoBranches(value?.length === 0 && !loading && openAdd);
  }, [openAdd, value, loading]);

  const handleCloseNoBranches = () => {
    setOpenNoBranches(false);
  };

  const branch = useRef(value?.[0] || '');
  const [, setBranchState] = useState(branch.current);

  const predefinedTags = [
    'java',
    'javascript',
    'go',
    'python',
    'kubernetes',
    'docker',
  ];

  const [title, setTitle] = useState('Add project to the Bazaar');
  const [commitMessage, setCommitMessage] = useState(
    'update catalog-info.yaml',
  );
  const isInvalid = useRef(false);
  const [isFormInvalid, setIsFormInvalid] = useState(false);
  const [tags, setTags] = useState<string[]>(
    selectedEntity?.metadata?.tags
      ? selectedEntity?.metadata?.tags?.filter(tag => tag !== 'bazaar')
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

  const handleTagChange = (
    event: MouseEvent<HTMLInputElement>,
    values: string[],
  ) => {
    setTags(values);
  };

  const handleBranchChange = (branchName: string) => {
    branch.current = branchName;
    setBranchState(branchName);
  };

  const clearForm = useCallback(() => {
    setDescription('');
    setStatus('proposed');

    setTags(
      selectedEntity?.metadata?.tags
        ? selectedEntity?.metadata?.tags?.filter(
            (tag: string) => tag !== 'bazaar',
          )
        : [],
    );
    setTitle('Add project to the Bazaar');
    setCommitMessage('update catalog-info.yaml');
    setIsFormInvalid(false);
    isInvalid.current = false;
    branch.current = '';
    setBranchState('');
  }, [selectedEntity]);

  useEffect(() => {
    clearForm();
  }, [selectedEntity, clearForm]);

  const handleCloseAndClear = () => {
    handleClose();
    clearForm();
  };

  const handleListItemClick = (entity: Entity) => {
    if (value?.length === 0) {
      setOpenNoBranches(true);
    }
    setSelectedEntity(entity);
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

    if (!isInvalid.current && selectedEntity) {
      const clonedEntity = editBazaarProperties(
        selectedEntity,
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
    <div>
      <AlertBanner
        open={openNoBranches}
        message={`No branches available for ${selectedEntity?.metadata?.name}. Please create a branch.`}
        handleClose={handleCloseNoBranches}
      />

      <Dialog
        fullWidth
        maxWidth="xs"
        onClose={handleCloseAndClear}
        aria-labelledby="customized-dialog-title"
        open={openAdd}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleCloseAndClear}>
          Add project
        </DialogTitle>

        <DialogContent dividers>
          <ProjectSelector
            value={selectedEntity?.metadata.name || ''}
            onChange={handleListItemClick}
            isFormInvalid={isFormInvalid}
            entities={entities || []}
          />

          <InputField
            value={description}
            onChange={handleDescriptionChange}
            isFormInvalid={isFormInvalid}
            inputType="Bazaar description"
            placeholder="Describe who you are and what skills you are looking for"
          />

          <InputSelector
            value={status}
            onChange={handleStatusChange}
            isFormInvalid={isFormInvalid}
            options={['proposed', 'ongoing']}
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
    </div>
  );
};
