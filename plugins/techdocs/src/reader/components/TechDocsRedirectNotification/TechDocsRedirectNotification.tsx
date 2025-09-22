/*
 * Copyright 2024 The Backstage Authors
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
import { useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';

type TechDocsRedirectNotificationProps = {
  handleButtonClick: () => void;
  message: string;
  autoHideDuration: number;
};

const useStyles = makeStyles(theme => ({
  button: {
    color: theme.palette.primary.light,
    textDecoration: 'underline',
  },
}));

export const TechDocsRedirectNotification = ({
  message,
  handleButtonClick,
  autoHideDuration,
}: TechDocsRedirectNotificationProps) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  const handleClose = () => setOpen(false);

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={autoHideDuration}
      color="primary"
      onClose={handleClose}
      message={message}
      action={
        <Button
          classes={{ root: classes.button }}
          size="small"
          onClick={() => {
            handleClose();
            handleButtonClick();
          }}
        >
          Redirect now
        </Button>
      }
    />
  );
};
