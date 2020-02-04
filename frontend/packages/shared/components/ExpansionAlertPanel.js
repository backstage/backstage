import React from 'react';
import PropTypes from 'prop-types';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
  Box,
  makeStyles,
} from '@material-ui/core';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import ExpandMore from '@material-ui/icons/ExpandMore';

// TODO: Less custom styling, this is a bit ugly
const useStyles = makeStyles(theme => ({
  panel: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  gutterBottom: {
    marginBottom: theme.spacing(2),
  },
  info: {
    backgroundColor: theme.palette.infoBackground,
    color: theme.palette.infoText,
  },
  warning: {
    backgroundColor: theme.palette.warningBackground,
    color: theme.palette.warningText,
  },
  error: {
    backgroundColor: theme.palette.errorBackground,
    color: theme.palette.errorText,
  },
  details: {
    paddingBottom: theme.spacing(1),
  },
  icon: {
    marginRight: theme.spacing(2),
  },
}));

const ExpansionAlertPanel = ({ type, title, elevation, gutterBottom, children }) => {
  const classes = useStyles();

  return (
    <div className={gutterBottom ? classes.gutterBottom : ''}>
      <ExpansionPanel elevation={elevation}>
        <ExpansionPanelSummary expandIcon={<ExpandMore />} className={`${classes[type]} ${classes.panel}`}>
          <ErrorOutline className={classes.icon} />
          <Typography variant="subtitle1">
            <Box fontWeight="bold">{title}</Box>
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>{children}</ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

ExpansionAlertPanel.propTypes = {
  type: PropTypes.oneOf(['warning', 'error', 'info']),
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};
ExpansionAlertPanel.defaultProps = {
  type: 'info',
  elevation: 1,
};

export default ExpansionAlertPanel;
