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

import React, { Dispatch, SetStateAction } from 'react';
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
import { deleteEntity } from '../../util/dbRequests';
import {
  useApi,
  configApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';

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
  openDelete: boolean;
  handleClose: () => void;
  setIsBazaar: Dispatch<SetStateAction<boolean>>;
};

export const DeleteProjectDialog = ({
  entity,
  openDelete,
  handleClose,
  setIsBazaar,
}: Props) => {
  const baseUrl = useApi(configApiRef)
    .getConfig('backend')
    .getString('baseUrl');

  const handleCloseAndClear = () => {
    handleClose();
  };

  const identity = useApi(identityApiRef);

  const handleSubmit = async () => {
    await deleteEntity(baseUrl, entity, identity);
    setIsBazaar(false);
    handleCloseAndClear();
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      onClose={handleCloseAndClear}
      aria-labelledby="customized-dialog-title"
      open={openDelete}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleCloseAndClear}>
        Delete project
      </DialogTitle>

      <DialogContent dividers>
        Are you sure you want to delete this project from the Bazaar?
      </DialogContent>

      <DialogActions>
        <Button onClick={handleSubmit} color="primary" type="submit">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
