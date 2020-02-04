import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, withStyles } from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';

import { IconButton } from 'shared/components';
import { getFromStore, saveToStore } from 'shared/apis/storage/persistentStore';

const styles = theme => ({
  nav: {
    gridArea: 'pageNav',
    width: 62,
    marginLeft: theme.spacing(3),
    marginTop: theme.spacing(3),
    transition: 'width 0.07s, height 0s',
    transitionTimingFunction: 'ease-in',
  },
  item: {
    display: 'block',
  },
  list: {
    padding: 0,
    border: '0px solid #333333',
    borderRadius: 6,
    backgroundColor: '#333333',
  },
  buttonContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing(0.5),
    width: 48,
  },
  button: {
    color: '#888',
  },
});

class Navigation extends Component {
  static propTypes = {
    condensable: PropTypes.bool,
  };

  state = {
    condensed: false,
  };

  constructor(props) {
    super(props);

    const condensedPref = getFromStore('navigation', 'condensed', false);
    this.state.condensed = this.props.condensable && condensedPref;
  }

  buttonClicked = () => {
    const condensed = !this.state.condensed;
    saveToStore('navigation', 'condensed', condensed);
    this.setState({ condensed });
  };

  render() {
    const { classes, condensable } = this.props;
    const { condensed } = this.state;

    const ExpandButton = condensable && (
      <div className={classes.buttonContainer}>
        <IconButton className={classes.button} onClick={this.buttonClicked} data-testid="nav-expand-toggle">
          {condensed ? <ChevronRight alt="nav-expand" /> : <ChevronLeft alt="nav-reduce" />}
        </IconButton>
      </div>
    );

    const children = React.Children.map(this.props.children, child => {
      if (!child) return null;
      return React.cloneElement(child, {
        condensed: condensed,
      });
    });

    return (
      <nav className={classes.nav} style={condensed ? {} : { width: 220 }}>
        <List className={classes.list} gacontext="Navigation">
          {children}
        </List>
        {ExpandButton}
      </nav>
    );
  }
}

export default withStyles(styles)(Navigation);
