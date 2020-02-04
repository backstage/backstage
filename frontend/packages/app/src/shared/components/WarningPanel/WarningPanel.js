import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles } from '@material-ui/core';
import ErrorOutline from '@material-ui/icons/ErrorOutline';

const errorOutlineStyles = theme => ({
  root: {
    marginRight: theme.spacing(1),
    fill: theme.palette.warningText,
  },
});
const ErrorOutlineStyled = withStyles(errorOutlineStyles)(ErrorOutline);

const styles = theme => ({
  message: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.warningBackground,
    color: theme.palette.warningText,
    verticalAlign: 'middle',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.spacing(1),
  },
  headerText: {
    color: theme.palette.warningText,
  },
  messageText: {
    color: theme.palette.warningText,
  },
});

/**
 * WarningPanel. Show a user friendly error message to a user similar to ErrorPanel except that the warning panel
 * only shows the warning message to the user
 */
class WarningPanel extends Component {
  static propTypes = {
    message: PropTypes.node.isRequired,
  };

  render() {
    const { classes, title, message, children } = this.props;
    return (
      <div className={classes.message}>
        <div className={classes.header}>
          <ErrorOutlineStyled />
          <Typography className={classes.headerText} variant="subtitle1">
            {title}
          </Typography>
        </div>
        {message && <Typography className={classes.messageText}>{message}</Typography>}
        {children}
      </div>
    );
  }
}

export default withStyles(styles)(WarningPanel);
