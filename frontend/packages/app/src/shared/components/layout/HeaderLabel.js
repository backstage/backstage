import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles } from '@material-ui/core';
import Link from 'shared/components/Link';

const style = theme => ({
  root: {
    textAlign: 'left',
    margin: theme.spacing(2),
    display: 'inline-block',
  },
  label: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    lineHeight: '16px',
    letterSpacing: 0,
    fontSize: 14,
    height: '16px',
    marginBottom: 2,
  },
  value: {
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '16px',
    fontSize: 14,
    height: '16px',
  },
});

class HeaderLabel extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.node,
    url: PropTypes.string,
  };

  render() {
    const { label, value, url, classes } = this.props;
    const content = <Typography className={classes.value}>{value || '<Unknown>'}</Typography>;
    return (
      <span className={classes.root}>
        <Typography className={classes.label}>{label}</Typography>
        {url ? <Link to={url}>{content}</Link> : content}
      </span>
    );
  }
}

export default withStyles(style)(HeaderLabel);
