import React, { Component, Fragment } from 'react';
import { matchPath } from 'react-router';
import { ListItem, ListItemIcon, ListItemText, Typography, withStyles, Tooltip, IconButton } from '@material-ui/core';
import { AlphaLabel, BetaLabel } from 'shared/components/Lifecycle';
import Link from 'shared/components/Link';
import { Theme } from 'shared/components/layout/Page';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';

const styles = theme => ({
  root: {
    display: 'block',
    overflow: 'hidden',
    '&:first-child': {
      borderTopRightRadius: 6,
      borderTopLeftRadius: 6,
    },
    '&:last-child': {
      borderBottomRightRadius: 6,
      borderBottomLeftRadius: 6,
    },
  },
  child: {
    paddingLeft: theme.spacing(7),
    '&:last-child': {
      borderBottom: '1px solid #727272',
    },
  },
  boldLabel: {
    color: '#FFFFFF',
    fontWeight: 'bolder',
  },
  childLabel: {
    color: theme.palette.textVerySubtle,
    fontSize: 14,
  },
  label: {
    whiteSpace: 'nowrap',
    lineHeight: 1.0,
  },
  iconImg: {
    width: 24,
    height: 24,
  },
  icon: {
    margin: theme.spacing(0.5, 2, 0.5, 0),
    minWidth: 0,
  },
  expand: {
    color: 'white',
  },
});

class NavItem extends Component {
  static defaultProps = {
    title: 'Mystery Link',
    href: '/',
    exact: true, // Only used for react-router matchPath to see if this sidebar item is active
    icon: null,
    isAlpha: false,
    isBeta: false,
    type: 'other', // Provided by Navigation
    child: false, // Whether this is a child of another NavItem (for indenting)
  };

  // If NavItem has React children, the sub-navigation can be expanded or collapsed
  state = {
    expanded: false,
  };

  static isActive(href, exact) {
    return matchPath(window.location.pathname, { path: href, exact: exact });
  }

  maybeActiveNavStyle(theme) {
    return NavItem.isActive(this.props.href, this.props.exact)
      ? {
          background: `linear-gradient(to right, ${theme.activeNavLinkColor} 0px, ${theme.activeNavLinkColor} 6px, #4F4F4F 6px, #4F4F4F 100%)`,
        }
      : {};
  }

  renderIcon = (condensed, iconElement, title, classes) => {
    if (!iconElement) return null;
    const listItemIcon = <ListItemIcon className={classes.icon}>{iconElement}</ListItemIcon>;
    return condensed ? (
      <Tooltip title={title} placement="right">
        {listItemIcon}
      </Tooltip>
    ) : (
      listItemIcon
    );
  };

  render() {
    const { title, href, icon, isAlpha, isBeta, classes, condensed, child, children } = this.props;
    const { expanded } = this.state;
    const isSection = !!children;

    // Automatically expand nested nav if one of the child elements is active
    const isChildActive = React.Children.toArray(children).some(c => NavItem.isActive(c.props.href, c.props.exact));
    const isExpanded = expanded || isChildActive;
    const selfAwareChildren = children && React.Children.map(children, c => React.cloneElement(c, { child: true }));

    let iconElement;

    if (icon) {
      iconElement = typeof icon === 'object' ? icon : <img src={icon} className={classes.iconImg} alt={title} />;
    }

    return (
      <Theme.Consumer>
        {theme => (
          <>
            <Link className={classes.root} style={this.maybeActiveNavStyle(theme)} to={href} gaprops={{ label: title }}>
              <ListItem button className={`${classes.listItemGutters} ${child && classes.child}`}>
                {this.renderIcon(condensed, iconElement, title, classes)}
                {!condensed && (
                  <>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          className={`${child ? classes.childLabel : classes.boldLabel} ${classes.label}`}
                        >
                          {title}
                          {isAlpha && (
                            <Fragment>
                              &nbsp;
                              <AlphaLabel isShorthand />
                            </Fragment>
                          )}
                          {isBeta && (
                            <Fragment>
                              &nbsp;
                              <BetaLabel isShorthand />
                            </Fragment>
                          )}
                        </Typography>
                      }
                      disableTypography
                    />
                    {isSection && (
                      <IconButton
                        onClick={() => this.setState(prev => ({ expanded: !prev.expanded }))}
                        style={{ padding: 4 }}
                        data-testid="expand-toggle"
                      >
                        {isExpanded ? (
                          <ArrowDropUp className={classes.expand} />
                        ) : (
                          <ArrowDropDown className={classes.expand} />
                        )}
                      </IconButton>
                    )}
                  </>
                )}
              </ListItem>
            </Link>
            {isExpanded && selfAwareChildren}
          </>
        )}
      </Theme.Consumer>
    );
  }
}

export default withStyles(styles)(NavItem);
