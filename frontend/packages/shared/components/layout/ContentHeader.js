import React, { Component, Fragment } from 'react';
import { Typography, withStyles } from '@material-ui/core';
import Helmet from 'react-helmet';
import FavoriteButton from 'shared/components/layout/FavoriteButton';

const styles = theme => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  leftItemsBox: {
    flex: '1 1 auto',
    marginBottom: theme.spacing(1),
    minWidth: 0,
    overflow: 'visible',
  },
  rightItemsBox: {
    flex: '0 1 auto',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
    minWidth: 0,
    overflow: 'visible',
  },
  description: {},
  title: {
    display: 'inline-flex',
  },
});

class ContentHeader extends Component {
  static defaultProps = {
    favoriteable: true,
    title: 'Unknown page',
  };

  render() {
    const { title, description, favoriteable, children, classes } = this.props;

    return (
      <Fragment>
        <Helmet title={title} />
        <div className={classes.container}>
          <div className={classes.leftItemsBox}>
            <Typography variant="h3" className={classes.title} data-testid="header-title">
              {title}
            </Typography>
            {favoriteable && <FavoriteButton />}
            {description && (
              <Typography className={classes.description} variant="body2">
                {description}
              </Typography>
            )}
          </div>
          <div className={classes.rightItemsBox}>{children}</div>
        </div>
      </Fragment>
    );
  }
}

export default withStyles(styles)(ContentHeader);
