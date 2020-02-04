import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

const styles = {
  icon: {
    marginRight: 4,
    fontSize: '1.1em',
    position: 'relative',
    top: 3,
  },
};

const InlineIcon = ({ icon, classes, className }) => {
  const IconComponent = icon;
  return <IconComponent className={className} classes={{ root: classes.icon }} />;
};

InlineIcon.propTypes = {
  icon: PropTypes.any.isRequired,
  classes: PropTypes.object,
  className: PropTypes.string,
};

export default withStyles(styles)(InlineIcon);
