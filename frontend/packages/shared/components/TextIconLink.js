import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Link from 'shared/components/Link';

// JSS styles which are default in Material design v1.
// https://material-ui-next.com/customization/css-in-js/
const styles = {
  wrapper: {
    color: '#509BF5',
    display: 'inline-flex',
    justifyItems: 'center',
    whiteSpace: 'nowrap',
    lineHeight: 1,
  },
  icon: {
    width: '1em',
    height: '1em',
    display: 'inline-block',
    marginRight: 6,
  },
  iconSmall: {
    width: '0.8em',
    height: '0.8em',
    display: 'inline-block',
    marginRight: 6,
  },
  leftText: {
    marginRight: 5,
  },
};

// A Notification component
const TextIconLink = ({ classes, href, text, icon, target, iconPosition, iconSize }) => {
  let iconClass = classes.icon;
  if (iconSize && iconSize === 'small') {
    iconClass = classes.iconSmall;
  }

  return (
    <Link className={classes.wrapper} to={href} target={target}>
      {iconPosition && iconPosition === 'right' ? <span className={classes.leftText}>{text}</span> : null}
      <img className={iconClass} src={icon} alt={text} />
      {!iconPosition || iconPosition !== 'right' ? <span>{text}</span> : null}
    </Link>
  );
};

TextIconLink.propTypes = {
  classes: PropTypes.object.isRequired,
  href: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  iconPosition: PropTypes.string,
  iconSize: PropTypes.string,
  target: PropTypes.string,
};

export default withStyles(styles)(TextIconLink);
