import ReactGA from 'react-ga';
import { GA_ALL_TRACKERS } from 'shared/apis/events/GoogleAnalyticsEvent';
import { matchPath } from 'react-router';
import { env } from 'shared/apis/env';

// The following is in line with the recommended way of adding GA tracking in a react App
// https://github.com/react-ga/react-ga/wiki/React-Router-v4-Redux-Middleware

export const trackPage = (page, info = {}) => {
  // Report Google Analytics pageview
  ReactGA.set({ page, ...info }, GA_ALL_TRACKERS);
  ReactGA.pageview(page, GA_ALL_TRACKERS);
};

let currentPage = '';

export const googleAnalytics = store => next => action => {
  if (env.isProduction) {
    if (action.type === '@@router/LOCATION_CHANGE') {
      const reduxStore = store.getState();
      const route = reduxStore.routes.find(r => matchPath(action.payload.location.pathname, r));

      let pluginInfo = {
        dimension1: null,
        dimension2: null,
        dimension3: null,
        dimension4: null,
      };

      if (route && route.pluginOwner && route.pluginOwner.manifest) {
        const { name, manifest } = route.pluginOwner;
        const { id, owner, facts } = manifest;

        pluginInfo = {
          dimension1: owner || null,
          dimension2: name || null,
          dimension4: id || null,
          dimension3: facts ? facts.support_channel : null,
        };
      }

      const nextPage = `${action.payload.location.pathname}${action.payload.location.search}`;

      if (currentPage !== nextPage) {
        currentPage = nextPage;
        trackPage(nextPage, pluginInfo);
      }
    }
  }
  return next(action);
};
