import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { Button, IconButton, Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import { errorLogOpen } from 'shared/apis/errorLog/actions';
import { snackbarClose } from './actions';

import {
  StatusError as ErrorIcon,
  StatusOK as SuccessIcon,
  StatusWarning as WarningIcon,
} from 'shared/components/Status';

const SNACKBAR_TYPES = {
  default: 'default',
  info: 'info',
  success: 'success',
  error: 'error',
  warning: 'warning',
};

const SNACKBAR_ICONS = {
  default: '',
  info: '',
  success: <SuccessIcon />,
  error: <ErrorIcon />,
  warning: <WarningIcon />,
};

const useMessageContainerStyles = makeStyles(theme => ({
  message: {
    '& a': {
      color: theme.palette.link,
    },
  },
  icon: {
    display: 'inline-block',
    verticalAlign: 'middle',
    marginRight: '5px',
  },
  error: {
    color: theme.palette.status.error,
  },
  success: {
    color: theme.palette.status.ok,
  },
  warning: {
    color: theme.palette.status.warning,
  },
}));

const MessageContainer = ({ message, type }) => {
  const classes = useMessageContainerStyles();
  const messageIcon = SNACKBAR_ICONS[type] || '';
  const messageIconStyle = classes[type] || '';

  // TODO: use react nodes in messages with <strong> instead
  const styledMessage =
    typeof message !== 'string'
      ? message
      : message
          .split(/<strong>(.*?)<\/strong>/)
          .map((part, index) => (index % 2 ? <strong key={index}>{part}</strong> : part));

  return (
    <>
      {messageIcon && <span className={`${classes.icon} ${messageIconStyle}`}>{messageIcon}</span>}
      <span className={`${classes.message}`}>{styledMessage}</span>
    </>
  );
};

const useStyles = makeStyles({
  anchorOriginTopCenter: {
    top: '73px',
  },
});

/**
 * Global snack bar. There can only be one instance of this shown at any time.
 */
const GlobalSnackbar = ({ snackbar, onClose, onErrorLogOpen }) => {
  const classes = useStyles();
  const { open, message, type, errorId, duration } = snackbar;

  const handleClose = (_ignored, reason) => {
    if (reason !== 'clickaway' && onClose) {
      onClose();
    }
  };

  const handleViewLogClick = () => {
    if (onClose) {
      onClose();
    }
    if (onErrorLogOpen) {
      onErrorLogOpen(errorId);
    }
  };

  return (
    <div>
      <Snackbar
        open={open}
        classes={classes}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        autoHideDuration={type === SNACKBAR_TYPES.error ? null : duration}
        message={<MessageContainer message={message} type={type} />}
        action={
          <>
            {errorId && (
              <Button key="undo" color="secondary" size="small" onClick={handleViewLogClick}>
                VIEW LOG
              </Button>
            )}
            <IconButton key="close" aria-label="Close" color="inherit" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </>
        }
      />
    </div>
  );
};

export default connect(({ snackbar }) => ({ snackbar }), { onClose: snackbarClose, onErrorLogOpen: errorLogOpen })(
  GlobalSnackbar,
);
