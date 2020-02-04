import React from 'react';
import PropTypes from 'prop-types';
import { InfoStyled } from 'core/app/styledMUIComponents';
import { withStyles } from '@material-ui/core';
import { SnackbarContent } from '@material-ui/core';

const snackbarContentStyles = theme => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      flexGrow: 1,
      maxWidth: '100%',
    },
    margin: theme.spacing(2, 0),
    backgroundColor: theme.palette.infoBackground,
    marginBottom: 10,
  },
  message: {
    color: theme.palette.infoText,
  },
});
const SnackbarContentStyled = withStyles(snackbarContentStyles)(SnackbarContent);

/**
 * InfoPanel. Show a user friendly info message to a user.
 */
class InfoPanel extends React.Component {
  static propTypes = {
    message: PropTypes.node.isRequired,
    showInfoIcon: PropTypes.bool,
  };

  static defaultProps = {
    showInfoIcon: true,
  };

  render() {
    const { message, action, showInfoIcon } = this.props;

    return (
      <SnackbarContentStyled
        elevation={0}
        action={action}
        message={
          <React.Fragment>
            {showInfoIcon && <InfoStyled />}
            {message}
          </React.Fragment>
        }
      />
    );
  }
}

export default InfoPanel;
