import React from 'react';
import PropTypes from 'prop-types';
import {
  Collapse,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
  withStyles,
  Typography,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { CopyIcon } from 'shared/icons';

const errorEntryStyles = theme => ({
  nested: {
    flexFlow: 'column nowrap',
    alignItems: 'flex-start',
    paddingLeft: theme.spacing(9),
    paddingTop: 0,
    paddingBottom: theme.spacing(2),
  },
  errorDetail: {
    margin: 0,
    marginTop: theme.spacing(1),
  },
  message: {
    '&:hover': {
      backgroundColor: theme.palette.highlight,
      cursor: 'pointer',
    },
  },
  timestamp: {
    fontSize: '12px',
  },
});

const ErrorLogEntry = ({ message, error, timestamp, longMessage, highlight, classes }) => {
  const [open, setOpen] = React.useState(highlight);
  const clipboardInputRef = React.useRef(null);

  React.useLayoutEffect(() => {
    setOpen(highlight);
  }, [highlight]);

  const handleClick = () => {
    setOpen(open => !open);
  };

  const handleCopyClick = e => {
    e.stopPropagation();
    clipboardInputRef.current.select();
    document.execCommand('copy');
  };

  const errorForClipboard = JSON.stringify({
    message,
    timestamp,
    error,
    longMessage,
  });

  return (
    <div style={{ background: highlight ? '#FFFBCC' : 'transparent' }}>
      <ListItem onClick={handleClick} className={classes.message}>
        <ListItemIcon>{open ? <ExpandLess /> : <ExpandMore />}</ListItemIcon>
        <ListItemText
          primary={message || 'Unknown error'}
          secondary={timestamp}
          classes={{ secondary: classes.timestamp }}
        />
        <Tooltip id="tooltip-left" title="Copy to clipboard" placement="left">
          <ListItemSecondaryAction onClick={handleCopyClick}>
            <IconButton aria-label="Copy to clipboard">
              <CopyIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </Tooltip>
        {/* Adding the styles below seems to be the only way to copy text from the input to
         clipboard and keep the input hidden from the view. */}
        <input
          ref={clipboardInputRef}
          onChange={() => {}}
          value={errorForClipboard}
          type="text"
          style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}
        />
      </ListItem>
      <Collapse in={open} mountOnEnter timeout="auto">
        <ListItem dense className={classes.nested}>
          {longMessage ? <Typography className={classes.errorDetail}>{longMessage}</Typography> : null}
          <pre className={classes.errorDetail}>{error}</pre>
        </ListItem>
      </Collapse>
    </div>
  );
};

ErrorLogEntry.propTypes = {
  error: PropTypes.string.isRequired,
  message: PropTypes.string,
  timestamp: PropTypes.string,
  longMessage: PropTypes.string,
  highlight: PropTypes.bool,
};

export default withStyles(errorEntryStyles)(ErrorLogEntry);
