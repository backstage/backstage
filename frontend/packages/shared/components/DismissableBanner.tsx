import React, { FC, ReactNode } from 'react';
import classNames from 'classnames';
import { makeStyles, Theme } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
import Setting from 'shared/apis/settings/Setting';
import { useSetting } from 'core/settings';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'relative',
    padding: theme.spacing(1),
    marginBottom: theme.spacing(3),
    marginTop: -theme.spacing(3),
    zIndex: 'auto',
    display: 'flex',
    flexFlow: 'row nowrap',
  },
  icon: {
    fontSize: 20,
  },
  content: {
    width: '100%',
    maxWidth: 'inherit',
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
}));

type Props = {
  variant: 'info' | 'error';
  setting: Setting<boolean>;
  message: ReactNode;
};

const DismissableBanner: FC<Props> = ({ variant, setting, message }) => {
  const [show, setShown, loading] = useSetting(setting);
  const classes = useStyles();

  const handleClick = () => {
    if (setShown) {
      setShown(false);
    }
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={show && !loading}
      classes={{ root: classes.root }}
    >
      <SnackbarContent
        classes={{
          root: classNames(classes.content, classes[variant]),
          message: classes.message,
        }}
        message={message}
        action={[
          <IconButton key="dismiss" title="Permanently dismiss this message" color="inherit" onClick={handleClick}>
            <Close className={classes.icon} />
          </IconButton>,
        ]}
      />
    </Snackbar>
  );
};

export default DismissableBanner;
