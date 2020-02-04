import React, { Component } from 'react';
import { Button as MUIButton } from '@material-ui/core';
import PropTypes from 'prop-types';
import {
  GA_DEFAULT_PLUGIN_ID,
  GA_DEFAULT_PLUGIN_OWNER,
  GA_LABEL_UNKNOWN,
} from 'shared/apis/events/GoogleAnalyticsEvent';
import textContent from 'react-addons-text-content';
import { withPluginContext } from 'core/app/withPluginContext';
import { getGAContext, GoogleAnalyticsEvent, sendGAEvent } from 'shared/apis/events';

class Button extends Component {
  static propTypes = {
    onClick: PropTypes.func, // a click handler
    gaprops: PropTypes.shape({
      label: PropTypes.string, // string e.g. link text
      value: PropTypes.number, // integer
    }),
  };

  render() {
    const { children, ...otherProps } = this.props;
    return (
      <MUIButton {...otherProps} onClick={this.button_onClickHandler}>
        {children}
      </MUIButton>
    );
  }

  button_onClickHandler = e => {
    this.trackEvent();

    if (this.props.onClick && typeof this.props.onClick === 'function') {
      this.props.onClick(e);
    }
  };

  trackEvent = () => {
    const { children, plugin, gaprops = {} } = this.props;

    const pluginId = plugin && plugin.id ? plugin.id : GA_DEFAULT_PLUGIN_ID;
    const btnLabel = textContent(children) || GA_LABEL_UNKNOWN;

    const eventCategory = pluginId;
    const eventAction = GoogleAnalyticsEvent.BTN_CLICK;
    const eventLabel = gaprops.label || btnLabel;
    const eventValue = gaprops.value;
    const eventOwner = plugin && plugin.owner ? plugin.owner : GA_DEFAULT_PLUGIN_OWNER;
    const eventContext = getGAContext(this);

    sendGAEvent(eventCategory, eventAction, eventLabel, eventValue, eventOwner, eventContext);
  };
}

export default withPluginContext(Button);
