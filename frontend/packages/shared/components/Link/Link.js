import React, { Component } from 'react';
import { HashLink } from 'react-router-hash-link';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import classNames from 'classnames';
import textContent from 'react-addons-text-content';

import { validateValue } from 'shared/components/Error/util/errorUtil';

import { withPluginContext } from 'core/app/withPluginContext';
import { getGAContext, GoogleAnalyticsEvent, sendGAEvent, sendGAOutboundLinkEvent } from 'shared/apis/events';
import {
  GA_DEFAULT_PLUGIN_ID,
  GA_DEFAULT_PLUGIN_OWNER,
  GA_LABEL_UNKNOWN,
} from 'shared/apis/events/GoogleAnalyticsEvent';

const NEW_WINDOW_TARGET = '_blank';
const NEW_WINDOW_REL = 'noopener noreferrer';

const styles = theme => ({
  alwaysHighlight: {
    color: theme.palette.link,
    '&:hover': {
      color: theme.palette.linkHover,
    },
  },
  hoverHighlight: {
    '&:hover': {
      color: theme.palette.linkHover,
    },
  },
});

function isAbsoluteUrl(url) {
  return /^([a-z]+:\/\/|\/\/)/i.test(url);
}

/**
 * Use Link to render:
 *
 * - Internal links (defaults to _self)
 * - External links (defaults to _blank)
 * - Email / mailtos
 * - Slack Channel redirects (automatically injects url for Slack site)
 * - Slack User redirects (automatically injects url for Slack site)
 *
 * Under the hood, Link proxies internal links to the underlying react-router NavLink class, and
 * other types to a regular anchor.
 */
export class Link extends Component {
  //-----------------------------------
  // PropTypes
  //-----------------------------------
  static propTypes = {
    to: PropTypes.string, // a regular href, either internal or external
    email: PropTypes.string, // an email address
    slackChannel: PropTypes.string, // a slack channel name
    slackUser: PropTypes.string, // a slack user name
    gaprops: PropTypes.shape({
      label: PropTypes.string, // string e.g. link text
      value: PropTypes.number, // integer
    }),
    highlight: PropTypes.oneOf(['always', 'hover', 'none']), // when to highlight
    classes: PropTypes.object, // theme/style classes
  };

  static defaultProps = {
    highlight: 'always',
    classes: {},
  };

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  render() {
    const {
      to,
      email,
      slackChannel,
      slackUser,
      gaprops,
      children,
      target,
      rel,
      className,
      highlight,
      classes,
      ...otherProps
    } = this.props;
    delete otherProps.onClick;

    // Common properties
    const highlightClassName = classNames({
      [classes.alwaysHighlight]: highlight === 'always',
      [classes.hoverHighlight]: highlight === 'hover',
    });
    const commonProps = {
      className: `${className || ''} ${highlightClassName}`,
      gaprops,
      ...otherProps,
    };

    // Email
    if (email || (to && to.startsWith('mailto:'))) {
      const content = children || email || to.replace(/^mailto:/, '');
      const props = {
        href: to || `mailto:${email}`,
        ...commonProps,
      };
      return <a {...props}>{content}</a>;
    }

    // Slack channel
    if (slackChannel) {
      const channelWithoutPrefix = slackChannel.replace(/^#/, '');
      const content = children || `#${channelWithoutPrefix}`;
      const props = {
        href: `https://spotify.slack.com/app_redirect?channel=${channelWithoutPrefix}`,
        target: NEW_WINDOW_TARGET,
        rel: NEW_WINDOW_REL,
        ...commonProps,
      };
      return <a {...props}>{content}</a>;
    }

    // Slack user
    if (slackUser) {
      const userWithoutPrefix = slackUser.replace(/^@/, '');
      const content = children || `@${userWithoutPrefix}`;
      const props = {
        href: `https://spotify.slack.com/messages/${userWithoutPrefix}`,
        target: NEW_WINDOW_TARGET,
        rel: NEW_WINDOW_REL,
        ...commonProps,
      };
      return <a {...props}>{content}</a>;
    }

    // External link
    if (to && to.match(/^([a-z]+:)?\/\//i)) {
      const content = children || to;
      const props = {
        href: to,
        target: NEW_WINDOW_TARGET,
        rel: NEW_WINDOW_REL,
        ...commonProps,
      };
      return <a {...props}>{content}</a>;
    }

    // Internal link
    const url = to || '#';
    const LinkClass = url.indexOf('#') >= 0 ? HashLink : NavLink;
    const content = children || to || null;
    const props = {
      to: url,
      target,
      rel,
      onClick: this.link_onClickHandler,
      ...commonProps,
    };
    return <LinkClass {...props}>{content}</LinkClass>;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  link_onClickHandler = event => {
    this.trackEvent();

    if (typeof this.props.onClick === 'function') {
      this.props.onClick(event);
    }
  };

  trackEvent = () => {
    const { to, plugin, gaprops = {} } = this.props;

    const pluginId = plugin && plugin.id ? plugin.id : GA_DEFAULT_PLUGIN_ID;

    const eventCategory = pluginId;
    const eventAction = GoogleAnalyticsEvent.LINK_CLICK;
    const eventLabel = gaprops.label || this.getLinkLabel();
    const eventValue = gaprops.value;
    const eventOwner = plugin && plugin.owner ? plugin.owner : GA_DEFAULT_PLUGIN_OWNER;
    const eventContext = getGAContext(this);

    sendGAEvent(eventCategory, eventAction, eventLabel, eventValue, eventOwner, eventContext);
    sendGAOutboundLinkEvent(to);
  };

  getLinkLabel = () => {
    const { children, to } = this.props;

    // (children.props && (children.props.body || children.props.label || children.props.alt))
    // this is a hack for now to extract text from Links which passes link text as a prop
    // to a child component. Eg: <BreakHints body="text" /> or <Icon alt="text" />

    const linkLabel =
      textContent(children) ||
      (children.props && (children.props.body || children.props.label || children.props.alt)) ||
      to ||
      GA_LABEL_UNKNOWN;

    return linkLabel;
  };

  static getCssClasses(classes, highlight) {
    return classNames({
      [classes.alwaysHighlight]: highlight === 'always',
      [classes.hoverHighlight]: highlight === 'hover',
    });
  }

  /**
   * This method is needed - sadly - because the autosuggest component allows
   * the enter key to be used to click an item. The thing is that the autosuggest doesn't
   * actually focus the <a> tag when using the arrow keys. As a result, when you press enter it
   * calls its own handler rather than the default of clicking the <a>. So the SearchBox calls
   * our imitateClickOnSearchItem so we can imitate what would happen if the user had clicked
   * the <Link> with their mouse.
   *
   * @param searchItem See src/core/app/AppBar/SearchBox/SearchBox.js
   */
  static imitateClickOnSearchItem(searchItem, history) {
    validateValue(history, true, undefined, 'history');

    if (searchItem.url) {
      if (isAbsoluteUrl(searchItem.url)) {
        window.open(searchItem.url, '_blank');
      } else {
        history.push(searchItem.url);
      }
    }
  }
}

export default withPluginContext(withStyles(styles)(Link));
