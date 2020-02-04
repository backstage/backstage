import { ApolloClient } from 'apollo-client';
import { execute, makePromise } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import axios from 'axios';
// Needed for PhantomJS, which does not have fetch (should be a null operation on browsers)
import 'whatwg-fetch';
import { urls } from 'shared/apis/baseUrls';
import FeatureFlags from 'shared/apis/featureFlags/featureFlags';
import { getGraphqlBackendRegion } from 'core/app/AppBar/LoggedIn/OverrideRegion';
import { GoogleAnalyticsEvent, sendGAEvent } from 'shared/apis/events';

export function getGraphQlApiHost() {
  if (FeatureFlags.getItem('graphql-backend-region-switcher')) {
    const region = getGraphqlBackendRegion();
    return `http://backstage-backend.services.${region}.spotify.net/graphql`;
  }
  const backstageOpenProxyHost = urls.openProxy;
  return process.env.REACT_APP_GRAPHQL_API || `${backstageOpenProxyHost}/api/backend/graphql`;
}

function getClientOptions() {
  if (FeatureFlags.getItem('graphql-backend-no-cache')) {
    return {
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    };
  } else {
    return {};
  }
}

export const graphqlLink = createHttpLink({
  uri: getGraphQlApiHost(),
});

export const graphqlClient = new ApolloClient({
  link: graphqlLink,
  cache: new InMemoryCache(),
  defaultOptions: getClientOptions(),
});

export function graphqlRequest(query, variables) {
  return makePromise(
    execute(graphqlLink, {
      query,
      variables,
    }),
  );
}

export function evictGraphqlCacheEntity(entity) {
  sendGAEvent(
    'GraphqlEviction',
    GoogleAnalyticsEvent.IMPRESSION,
    'Evict graphql cache for type',
    entity,
    'tools',
    null,
  );
  return axios.post(`${getGraphQlApiHost()}/evict/${entity}`);
}
