import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, withStyles } from '@material-ui/core';
import { ErrorOutlineStyled } from 'core/app/styledMUIComponents/index';
import { SnackbarContent } from '@material-ui/core';

import { errorLogOpen, errorLogAdd } from 'shared/apis/errorLog/actions';

const snackbarContentStyles = theme => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      flexGrow: 1,
      maxWidth: '100%',
    },
    backgroundColor: theme.palette.errorBackground,
  },
  message: {
    color: theme.palette.errorText,
  },
});
const SnackbarContentStyled = withStyles(snackbarContentStyles)(SnackbarContent);

/**
 * ErrorPanel. Show a user friendly error message to a user. Pass an error object
 * and a "view logs" button will show, opening the Error Log that'll contain the error details.
 */
class ErrorPanel extends React.Component {
  static propTypes = {
    onViewLogsClick: PropTypes.func,
    message: PropTypes.string.isRequired,
    errorId: PropTypes.string,
    longFailureMessage: PropTypes.string,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  };

  constructor(props) {
    super(props);

    if (props.errorId) {
      this.errorId = props.errorId;
    } else {
      // TODO: this will be replace by a "new LogItem(...)"
      // https://ghe.spotify.net/system-z/system-z-frontend/blob/add-global-log-mgmt/src/core/logging/LogItem.js
      this.errorId = Math.random()
        .toString(36)
        .substring(7);
    }
  }

  handleViewLogsClick = errorId => {
    const { errorLogOpen, onViewLogsClick } = this.props;
    errorLogOpen(errorId);
    if (onViewLogsClick) {
      onViewLogsClick();
    }
  };

  componentDidMount() {
    const { message, error = '', errorLogAdd, longFailureMessage } = this.props;
    if (error) {
      errorLogAdd(message, error, this.errorId, longFailureMessage);
    }
  }

  render() {
    const { message, action, error } = this.props;
    return (
      <SnackbarContentStyled
        elevation={0}
        action={
          action ||
          (error && (
            <Button color="primary" onClick={(...args) => this.handleViewLogsClick(this.errorId, ...args)}>
              View logs
            </Button>
          ))
        }
        message={
          <React.Fragment>
            <ErrorOutlineStyled />
            {message}
          </React.Fragment>
        }
      />
    );
  }
}

export default connect(null, { errorLogOpen, errorLogAdd })(ErrorPanel);
