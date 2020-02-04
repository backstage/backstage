import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, withStyles } from '@material-ui/core';
import { getGAContext, GoogleAnalyticsEvent, sendGAEvent } from 'shared/apis/events';
import { GA_DEFAULT_PLUGIN_ID, GA_DEFAULT_PLUGIN_OWNER } from 'shared/apis/events/GoogleAnalyticsEvent';
import { withPluginContext } from 'core/app/withPluginContext';

const styles = {
  tabs: {
    borderBottom: '1px solid #dedede',
    margin: '0 -16px 5px',
    padding: '0 16px',
  },
  tab: {
    color: 'rgba(0, 0, 0, 0.5)',
    '&:hover': {
      color: 'rgba(0, 0, 0, 0.5)',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
  },
  tabSelected: {
    color: '#000 !important',
  },
  indicator: {
    backgroundColor: '#af2996',
    height: 3,
  },
};

const tabType = PropTypes.oneOfType([
  PropTypes.node,
  PropTypes.shape({ href: PropTypes.string, label: PropTypes.node }),
]);

class TabbedContent extends Component {
  static propTypes = {
    // The names of the tabs
    tabs: PropTypes.arrayOf(tabType).isRequired,
    // which tab (of the `tabs` prop) should be the initial active one.
    initialTab: tabType,
  };

  constructor(props) {
    super(props);
    let tabValue = props.tabs.indexOf(props.initialTab);
    if (tabValue === -1) {
      tabValue = 0;
    }

    if ((window.location || {}).hash) {
      tabValue = props.tabs.findIndex(t => {
        if (typeof t === 'string') {
          return false;
        }
        return t.href === window.location.hash;
      });
    }

    this.state = { tabValue: tabValue };
  }

  trackEvent = tabValue => {
    const { plugin, tabs } = this.props;

    const eventCategory = plugin && plugin.id ? plugin.id : GA_DEFAULT_PLUGIN_ID;
    const eventAction = GoogleAnalyticsEvent.TAB_CLICK;
    const tab = tabs[tabValue];
    const eventLabel = tab && typeof tab === 'object' ? `${tab.label}` : tab;
    const eventValue = tabValue;
    const eventOwner = plugin && plugin.owner ? plugin.owner : GA_DEFAULT_PLUGIN_OWNER;
    const eventContext = getGAContext(this);

    sendGAEvent(eventCategory, eventAction, eventLabel, eventValue, eventOwner, eventContext);
  };

  handleTabChange = (e, tabValue) => {
    this.trackEvent(tabValue);
    this.setState({ tabValue });
  };

  render() {
    const { tabs = [], children = [], classes } = this.props;
    const { tabValue } = this.state;

    return (
      <Fragment>
        <Tabs
          value={tabValue}
          onChange={this.handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          classes={{ root: classes.tabs, indicator: classes.indicator }}
        >
          {tabs.map((tab, i) => {
            const label = typeof tab === 'object' ? tab.label : tab;
            const href = typeof tab === 'object' ? tab.href : null;
            return (
              <Tab
                classes={{ root: classes.tab, selected: classes.tabSelected }}
                key={`tab${i}`}
                label={label}
                href={href}
              />
            );
          })}
        </Tabs>
        {children && (children.length ? children[tabValue] : children)}
      </Fragment>
    );
  }
}

export default withStyles(styles)(withPluginContext(TabbedContent));
