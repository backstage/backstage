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

import React from 'react';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import { Button, Dialog, Typography, IconButton } from '@material-ui/core';
import { useForm, SubmitHandler } from 'react-hook-form';
import { InputField } from '../InputField/InputField';
import { InputSelector } from '../InputSelector/InputSelector';
import { FormValues } from '../../types';

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
  handleSave: (getValues: any, reset: any) => SubmitHandler<FormValues>;
  isAddForm: boolean;
  title: string;
  defaultValues: FormValues;
  open: boolean;
  projectSelector?: JSX.Element;
  handleClose: () => void;
};

export const ProjectDialog = ({
  handleSave,
  isAddForm,
  title,
  defaultValues,
  open,
  projectSelector,
  handleClose,
}: Props) => {
  const {
    handleSubmit,
    reset,
    control,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: defaultValues,
  });

  const handleCloseAndClear = () => {
    handleClose();
    reset(defaultValues);
  };

  const handleSaveProject = () => {
    handleSave(getValues, reset);
  };

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="xs"
        onClose={handleCloseAndClear}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleCloseAndClear}>
          {title}
        </DialogTitle>

        <DialogContent dividers>
          {isAddForm && projectSelector}

          <InputField
            error={errors.announcement}
            control={control}
            rules={{
              required: true,
            }}
            inputType="announcement"
            helperText="please enter an announcement"
            placeholder="Describe who you are and what skills you are looking for"
          />

          <InputField
            error={errors.community}
            control={control}
            rules={{
              required: false,
              pattern: RegExp('^(https?)://[^s$.?#].[^s]*$'),
            }}
            inputType="community"
            helperText="please enter a link starting with http/https"
            placeholder="Community link to e.g. Teams or Discord"
          />

          <InputSelector
            control={control}
            name="status"
            options={['proposed', 'ongoing']}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleSubmit(handleSaveProject)}
            color="primary"
            type="submit"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
