import React, { Component } from 'react';
import { default as MUIIconButton } from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import { withPluginContext } from 'core/app/withPluginContext';
import { GA_DEFAULT_PLUGIN_ID, GA_DEFAULT_PLUGIN_OWNER } from 'shared/apis/events/GoogleAnalyticsEvent';
import { getGAContext, sendGAEvent, GoogleAnalyticsEvent } from 'shared/apis/events';

class IconButton extends Component {
  static propTypes = {
    onClick: PropTypes.func, // a click handler
    gaprops: PropTypes.shape({
      label: PropTypes.string, // string e.g. link text
      value: PropTypes.number, // integer
    }),
  };

  render() {
    return <MUIIconButton {...this.props} onClick={this.button_onClickHandler} />;
  }

  button_onClickHandler = e => {
    this.trackEvent();

    if (this.props.onClick && typeof this.props.onClick === 'function') {
      this.props.onClick(e);
    }
  };

  trackEvent = () => {
    const { plugin, children, gaprops = {} } = this.props;

    const pluginId = plugin && plugin.id ? plugin.id : GA_DEFAULT_PLUGIN_ID;
    const btnLabel = gaprops.label || this.props.alt || (children.props && children.props.alt);

    if (!btnLabel) {
      return;
    }

    const eventCategory = pluginId;
    const eventAction = GoogleAnalyticsEvent.BTN_CLICK;
    const eventLabel = btnLabel;
    const eventValue = gaprops.value;
    const eventOwner = plugin && plugin.owner ? plugin.owner : GA_DEFAULT_PLUGIN_OWNER;
    const eventContext = getGAContext(this);

    sendGAEvent(eventCategory, eventAction, eventLabel, eventValue, eventOwner, eventContext);
  };
}

export default withPluginContext(IconButton);
