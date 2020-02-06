import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles, Tooltip } from '@material-ui/core';
import { Theme } from '../Page/Page';
// import { Link } from 'shared/components';
import Burst from './Burst';
import Helmet from 'react-helmet';

class Header extends Component {
  static propTypes = {
    type: PropTypes.string,
    typeLink: PropTypes.string,
    title: PropTypes.node.isRequired,
    tooltip: PropTypes.string,
    subtitle: PropTypes.node,
    pageTitleOverride: PropTypes.string,
    style: PropTypes.object,
    component: PropTypes.object,
  };

  typeFragment() {
    const { type, typeLink, classes } = this.props;
    if (!type) {
      return null;
    }

    return typeLink ? (
      // <Link to={typeLink}>
      <Typography className={classes.type}>{type}</Typography>
    ) : (
      // </Link>
      <Typography className={classes.type}>{type}</Typography>
    );
  }

  titleFragment() {
    const { title, pageTitleOverride, classes, tooltip } = this.props;
    const FinalTitle = (
      <Typography className={classes.title} variant="h4">
        {title || pageTitleOverride}
      </Typography>
    );
    if (tooltip) {
      return (
        <Tooltip title={tooltip} placement="top-start">
          {FinalTitle}
        </Tooltip>
      );
    }
    return FinalTitle;
  }

  subtitleFragment() {
    const { subtitle, classes } = this.props;
    if (!subtitle) {
      return null;
    } else if (typeof subtitle !== 'string') {
      return subtitle;
    } else {
      return (
        <Typography className={classes.subtitle} variant="subtitle1">
          {subtitle}
        </Typography>
      );
    }
  }

  render() {
    const { title, pageTitleOverride, children, style, classes } = this.props;
    const pageTitle = pageTitleOverride || title;
    if (typeof pageTitle !== 'string') {
      console.warn(
        '<Header/> title prop is not a string, pageTitleOverride should be provided.',
      );
    }

    return (
      <Fragment>
        <Helmet
          titleTemplate={`${pageTitle} | %s | Backstage`}
          defaultTitle={`${pageTitle} | Backstage`}
        />
        <Theme.Consumer>
          {theme => (
            <header style={style} className={classes.header}>
              <Burst theme={theme} />
              <div className={classes.leftItemsBox}>
                {this.typeFragment()}
                {this.titleFragment()}
                {this.subtitleFragment()}
              </div>
              <div className={classes.rightItemsBox}>{children}</div>
            </header>
          )}
        </Theme.Consumer>
      </Fragment>
    );
  }
}

const styles = theme => ({
  header: {
    gridArea: 'pageHeader',
    padding: theme.spacing(3),
    minHeight: 118,
    width: '100vw',
    boxShadow: '0 0 8px 3px rgba(20, 20, 20, 0.3)',
    position: 'relative',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  leftItemsBox: {
    flex: '1 1 auto',
  },
  rightItemsBox: {
    flex: '0 1 auto',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginRight: theme.spacing(6),
  },
  title: {
    color: theme.palette.bursts.fontColor,
    lineHeight: '1.0em',
    wordBreak: 'break-all',
    fontSize: 'calc(24px + 6 * ((100vw - 320px) / 680))',
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '1.0em',
  },
  type: {
    textTransform: 'uppercase',
    fontSize: 9,
    opacity: 0.8,
    marginBottom: 10,
    color: theme.palette.bursts.fontColor,
  },
});

export default withStyles(styles)(Header);
