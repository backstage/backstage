/* global gapi */

import { googleAuth } from 'shared/apis/googleAuthV2';

// Using the Google API Client Library for JavaScript
//  https://github.com/google/google-api-javascript-client

export const googleClientApi = {
  async load({ api, version, scope }) {
    await gapi.client.load(api, version);
    const accessToken = await googleAuth.getAccessToken(scope);
    gapi.client.setToken({ access_token: accessToken });
  },
  analytics: {
    getGaData(query) {
      return gapi.client.analytics.data.ga.get(query);
    },
  },
  compute: {
    getUrlMaps(project) {
      return gapi.client.compute.urlMaps.list({
        project,
      });
    },
    getFwdRules(project, filter = null) {
      return gapi.client.compute.globalForwardingRules.list({
        project,
        filter,
      });
    },
    getHttpProxies(project, filter = null) {
      return gapi.client.compute.targetHttpProxies.list({
        project,
        filter,
      });
    },
    getHttpsProxies(project, filter = null) {
      return gapi.client.compute.targetHttpsProxies.list({
        project,
        filter,
      });
    },
    getBackends(project, filter = null) {
      return gapi.client.compute.backendServices.list({
        project,
        filter,
      });
    },
    getBackendHealth(project, backendService, group) {
      return gapi.client.compute.backendServices.getHealth({
        project,
        backendService,
        resource: {
          group,
        },
      });
    },
  },
};
