import React, { Component, Suspense } from 'react';

import { Route } from 'react-router-dom';

import { PluginBase } from 'shared/pluginApi';
import PluginContext from 'shared/pluginApi/PluginContext';

import Progress from 'shared/components/Progress';

class PageLayoutWrapperAndContextInjector extends Component {
  render() {
    const Page = this.props.componentDef;

    const contextValue = {
      plugin: this.props.pluginRoute.pluginOwner,
      page: this.props.pluginRoute.pageModel,
      route: this.props.pluginRoute,
    };

    /**
     * Two methods to access the plugin or the pluginRoute:
     *
     * 1) Via the context API (for deeply nested situations)
     * 2) Via the props passed to the root page component (for simpler use cases)
     */
    return (
      <PluginContext.Provider value={contextValue}>
        <Suspense fallback={<Progress />}>
          <Page {...this.props} {...contextValue} />
        </Suspense>
      </PluginContext.Provider>
    );
  }
}

/**
 * Routes in Backstage fall into two categories:
 *
 * 1) Root Routes
 * 2) Subroutes
 *
 * Root routes are any route that is managed by a plugin and extends PluginRoute. There must always be one root route.
 *
 * Subroutes are managed by a plugin by their own internal implementation of <Route /> somewhere in their view. As
 * much as is possible avoid subroutes since you will not get all the sweet benefits (like metrics) of a PluginRoute.
 *
 * For information on creating a root route, see the examples in _example/ExamplePlugin.js or the documentation in
 * Backstage at https://backstage.spotify.net/docs/developing-a-plugin.
 *
 * When creating a Backstage Plugin you can register root routes in your extension of PluginBase in
 * either the initialize() method. If you want to use subroutes for a root route, make sure you set
 * exact to false!
 *
 * @author jjung
 */
export default class PluginRoute {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(pluginOwner, path, exact, component, pluginProps) {
    if (!(pluginOwner instanceof PluginBase)) {
      throw new Error('PluginRoute: pluginOwner must extend PluginBase');
    }

    this.pluginOwner = pluginOwner;
    this.path = path;
    this.exact = exact;
    this.component = component;
    this.pluginProps = pluginProps || {};
    this.timeEntered = undefined;
  }

  //-----------------------------------
  // Properties
  //-----------------------------------
  get pluginManager() {
    return this.pluginOwner.pluginManager;
  }

  get debug() {
    return {
      href: window.location.href,
      path: this.path,
      timeEntered: this.timeEntered,
    };
  }

  render() {
    let Page = this.component;

    let paths = this.path instanceof Array ? this.path : [this.path];

    return paths.map(path => (
      <Route
        key={path}
        path={path}
        exact={this.exact}
        render={props => {
          this.switchToThisRoute(props);
          return (
            <PageLayoutWrapperAndContextInjector
              {...props}
              {...this.pluginProps}
              pluginRoute={this}
              componentDef={Page}
            />
          );
        }}
      />
    ));
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  switchToThisRoute() {
    // This is necessary while we still have routes that are NOT handled by the plugin
    // API.
    this.pluginManager._routeChangeHandledByPluginRoute = this;

    // Here we check if this is the first time we entered this route.
    if (this.pluginManager.activeRootPluginRoute !== this) {
      this.pluginManager.activePlugin = this.pluginOwner;
      this.pluginManager.activeRootPluginRoute = this;
    }
  }
}
