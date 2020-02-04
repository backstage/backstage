import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import ERROR_MESSAGE_MAPPING from 'ErrorMessageMapping';
import { errorReducer } from './util/errorUtil';
import { safeStringify } from './util/JSON';
import { consoleStack } from './util/console';
import { copyTextToClipboard } from './util/clipboard';
import { getAllReactComponentAncestors } from './util/react';
import Link from 'shared/components/Link';
import FeatureFlags from 'shared/apis/featureFlags/featureFlags';

import { history } from 'core/store';

import moment from 'moment';
import { env } from 'shared/apis/env';

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  contents: {
    position: 'relative',
    overflow: 'hidden',
    background: 'white',
    border: `5px solid ${theme.palette.errorBackground}`,
    borderRadius: 10,
    maxWidth: 600,
    maxHeight: 600,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
    padding: 20,
    paddingTop: 75,
  },
  contentsChild: {
    margin: '10px 0',
    flex: '1 1 auto',
  },
  copyToClipboard: {
    fontSize: '1.2em',
    color: theme.palette.link,
    cursor: 'pointer',
    fontWeight: 'bold',
    border: 'none',
  },
  copySuccess: {
    fontSize: '1.2em',
    color: 'green',
    fontWeight: 'bold',
    border: 'none',
  },
  title: {
    maxWidth: '100%',
    whiteSpace: 'pre-wrap',
  },
  details: {
    whiteSpace: 'pre-wrap',
    fontFamily: 'monospace',
    fontSize: '0.8em',
    maxWidth: '100%',
  },
  owner: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    background: theme.palette.errorBackground,
    color: theme.palette.errorText,
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '1.5em',
    padding: 10,
  },
});

let pluginManager;

/**
 * The Error class displays a error in a stylistic way with the ability to provide a ton of debugging information:
 *
 * - Timestamp
 * - Timezone
 * - Console logs
 * - Owner (either of active plugin or by checking the 'owner' prop of the next highest react component that has one)
 * - Active Route / HREF
 * - Error
 * - Browser History
 * - React Component Stack (to find the Component for Debugging)
 */
export class Error extends Component {
  static propTypes = {
    error: PropTypes.any,
    errorInfo: PropTypes.any,
    slackChannel: PropTypes.string,
  };

  state = {
    copiedToClipboard: false,
  };

  constructor(props) {
    super(props);

    /**
     * Code path in tests is short-circuited to not use pluginManager instance.
     * This is because Jest invalidates module cache between tests, causing the
     * below import to take several seconds and making tests time out.
     *
     * TODO: figure out a solution for the above so we can't properly test this component.
     */
    if (!env.isTest) {
      /**
       * Okay, here's the deal. I hate this, you hate this, everyone, well... pretty much everyone hates this.
       *
       * But see here's the thing. If we import the pluginManager normally at the top of the file, this
       * creates an cycle in the import graph, because PluginRoute imports SidebarPage which imports
       * ErrorBoundary which imports Error which import Link which imports PluginBase which imports PluginRoute...
       *
       * It's a mess. So we do this so the tests actually run.
       *
       * The only alternative would be to import the pluginManager at the top of every test. This just will not do.
       */
      import('plugins/pluginManagerBootstrap').then(_pluginManager => {
        pluginManager = _pluginManager.default;
        this.forceUpdate();
      });
    }
  }

  renderTitle(mappedError) {
    const { classes, error } = this.props;

    if (!mappedError) {
      console.error('Error:', error);

      let errorString = 'Something went wrong!';

      if (error) {
        errorString = error.toString();
      }

      return <p className={classes.title}>{errorString}</p>;
    } else {
      return <p className={classes.title}>{mappedError.message}</p>;
    }
  }

  renderDetails(mappedError) {
    if (!mappedError) {
      const { classes } = this.props;

      if (this.props.errorInfo) {
        return (
          <div className={classes.contentsChild}>
            <details className={classes.details}>{this.props.errorInfo.componentStack}</details>
          </div>
        );
      }
    }

    return undefined;
  }

  renderCopyToClipboardButton() {
    const { classes } = this.props;
    const { copiedToClipboard } = this.state;

    return (
      <div className={classes.contentsChild}>
        {!copiedToClipboard ? (
          <button className={classes.copyToClipboard} onClick={this.copyToClipboardButton_onClickHandler}>
            Copy Debug Information to Clipboard
          </button>
        ) : (
          undefined
        )}
        {copiedToClipboard ? <div className={classes.copySuccess}>Copied to clipboard!</div> : undefined}
      </div>
    );
  }

  findSlackChannel() {
    const componentStack = getAllReactComponentAncestors(this);

    const componentWithOwner = componentStack.find(component => {
      return component.props && component.props.slackChannel;
    });

    if (componentWithOwner) {
      return componentWithOwner.props.slackChannel;
    }

    if (pluginManager && pluginManager.activePlugin) {
      const { manifest, owner } = pluginManager.activePlugin;
      return (manifest.facts && manifest.facts['support_channel']) || owner;
    }
    return 'tools';
  }

  render() {
    const { classes, error, skipTestEnvOutput = false } = this.props;
    const slackChannel = this.findSlackChannel();

    let mappedError = errorReducer(error, ERROR_MESSAGE_MAPPING, {
      slackChannel,
    });

    if (env.isTest && !skipTestEnvOutput) {
      // This code is only for:
      //
      // 1) When running yarn test-react
      // 2) When you have not explicitly told the component to skip this with skipTestEnvOutput
      //
      // The purpose of this is to make the output in the console prettier if your test triggers
      // the ErrorBoundary to show up.
      return <div data-testid="error">{mappedError.message}</div>;
    }

    setTimeout(() => {
      // Browsers have a check in user interaction events for how long they take before they
      // copy to the clipboard. If the time it takes to copy to clipboard is too long, then deem
      // the action unsafe and don't allow the copy to take place.
      // We are saving the debugInformation before the users clicks to copy to clipboard so we
      // do not accidentally trigger that failure.
      //
      // We do this on the next frame so we don't lock up the rendering.
      this.cacheErrorDumpDebuggingInformation();
    }, 0);

    return (
      <div className={classes.container} data-testid="error">
        <div className={classes.contents}>
          <div className={classes.contentsChild}>
            <img className={classes.image} src="/aw_snap.png" alt="Aw snap" />
          </div>
          <div className={classes.contentsChild}>{this.renderTitle(mappedError)}</div>
          {this.renderDetails(mappedError)}
          {this.renderCopyToClipboardButton()}
          <div className={classes.owner}>
            <div>Error!</div>
            <div>
              Contact:&nbsp;
              <Link slackChannel={slackChannel} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  cacheErrorDumpDebuggingInformation() {
    const { error, errorInfo } = this.props;

    /**
     * We filter the console because if huge objects are output to it, they might be too large
     * to quickly convert to JSON. So we just try to be smart about picking only Error objects
     * or strings at this point and ignoring other stuff.
     */
    let filteredConsole = consoleStack.slice(consoleStack.length - 50).filter(c => {
      return typeof c.arguments[0] === 'string' || c.arguments[0] instanceof Error;
    });

    /**
     * Format the console data with some timestamp information that makes it easier to reason
     * about at a later point in time.
     */
    filteredConsole = consoleStack.map(c => {
      let ts = c.timestamp;
      let str = c.arguments.filter(a => typeof a === 'string').join(' | ');

      return `${moment(ts).format('YYYY/MM/DD HH:mm:ss:SSS')}:\t${str}`;
    });

    const reactComponentStack = getAllReactComponentAncestors(this)
      .map(c => (c.constructor ? c.constructor.name : c.name) || '[Unknown]')
      .filter(n => ['WithStyles'].indexOf(n) === -1);

    const timezone = new Date().getTimezoneOffset() / 60;

    /**
     * This is all the information that will be converted to JSON and copied to the clipboard.
     *
     * Feel free to add more contextual information to this if you think it would be helpful in debugging.
     */
    const debugInformation = {
      timestamp: moment(new Date()).format('YYYY/MM/DD HH:mm:ss:SSS'),
      timezone: timezone > 0 ? `+${timezone}` : timezone,
      responsible: {
        slackChannel: this.findSlackChannel(),
      },
      activeRootPluginRoute:
        pluginManager && pluginManager.activeRootPluginRoute
          ? pluginManager.activeRootPluginRoute.debug
          : {
              href: window.location.href,
            },
      history: history.stack,
      error,
      errorInfo,
      featureFlags: Object.keys(FeatureFlags.getFlags()),
      activePluginManifest: pluginManager ? pluginManager.activePlugin.manifest : undefined,
      reactComponentStack,
      console: filteredConsole,
    };

    try {
      debugInformation.activePluginDebug =
        pluginManager && pluginManager.activePlugin.getDebugInfo
          ? pluginManager.activePlugin.getDebugInfo()
          : undefined;
    } catch (e) {
      debugInformation.activePluginDebug = `getDebugInfo crashed with message: ${e.message}`;
    }

    /**
     * safeStringify ensures that if there are cycles in the data, they won't cause a crash.
     */
    this.errorDump = safeStringify(debugInformation, 2);

    console.error(debugInformation);
  }

  copyToClipboardButton_onClickHandler = () => {
    // See comment in copyTextToClipboard for why we aren't using the Clipboard API right now.
    const success = copyTextToClipboard(this.errorDump);

    if (success) {
      this.setState({
        copiedToClipboard: true,
      });
    }
  };
}

export default withStyles(styles)(Error);
