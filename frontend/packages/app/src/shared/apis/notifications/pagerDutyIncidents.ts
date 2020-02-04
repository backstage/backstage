import React from 'react';
import gql from 'graphql-tag';
import _ from 'lodash';
import { ApolloClient } from 'apollo-client';
import { useApolloClient } from '@apollo/react-hooks';
import { useUser } from 'shared/apis/user';

const POLL_INTERVAL_MS = 30000;

const query = gql`
  query($username: String!) {
    user(username: $username) {
      components {
        id
        pagerDutyService {
          id
          ...PD
        }
      }
      dataEndpoints {
        id
        warningPagerDutyService {
          ...PD
        }
        errorPagerDutyService {
          ...PD
        }
      }
      workflows {
        id
        component {
          id
          pagerDutyService {
            ...PD
          }
        }
      }
    }
  }
  fragment PD on PagerDutyService {
    id
    name
    homepageUrl
    activeIncidents {
      id
      homepageUrl
      status
      title
      createdAt
    }
  }
`;

function getIncidentsFor({ components, dataEndpoints, workflows }: any) {
  const incidents = [
    ...components.map((c: any) => getServiceIncidents(c.pagerDutyService)),
    ...dataEndpoints.map((d: any) => getServiceIncidents(d.warningPagerDutyService)),
    ...dataEndpoints.map((d: any) => getServiceIncidents(d.errorPagerDutyService)),
    ...workflows.map((w: any) => getServiceIncidents(w.component.pagerDutyService)),
  ];

  return _.chain(incidents)
    .flatten()
    .uniqBy('id')
    .orderBy('createdAt')
    .value();
}

function getServiceIncidents(service: any) {
  if (!service) {
    return [];
  }

  return service.activeIncidents.map((incident: any) => ({
    ...incident,
    service,
  }));
}

async function getPagerDutyIncidents(client: ApolloClient<any>, username: string): Promise<any[]> {
  try {
    let { data, errors } = await client.query({ query, variables: { username } });

    if (errors) {
      console.warn('Failed to fetch PagerDuty incidents', errors);
      return [];
    }

    if (!data || !data.user) {
      return [];
    }

    return getIncidentsFor(data.user);
  } catch (error) {
    console.error('Failed to fetch PagerDuty incidents', error);
    return [];
  }
}

/*
 * A hook that repeatedly polls the backend for all incident-capable entities, and returns
 * an array with all active incidents.
 */
export function usePagerDutyIncidents() {
  const { id: username } = useUser();
  const client = useApolloClient();
  const [incidents, setIncidents] = React.useState<any[]>([]);
  const timeoutIdRef = React.useRef<NodeJS.Timer>();

  const [broadcastChannel] = React.useState(() => {
    // Broadcast messages to other channels open on the same origin in any window, not available in Safari.
    if ((window as any).BroadcastChannel) {
      return new (window as any).BroadcastChannel('pager-duty-refresh');
    }
    return;
  });

  React.useEffect(
    () => () => {
      if (broadcastChannel) {
        broadcastChannel.close(); // Cleanup on unmount
      }
    },
    [broadcastChannel],
  );

  React.useEffect(() => {
    let didCancel = false;

    // Updates incidents, but doesn't replace empty arrays to avoid rerendering
    const handleNewIncidents = (newIncidents: any[]) => {
      setIncidents(incidents => {
        if (newIncidents.length !== 0 || incidents.length !== 0) {
          return newIncidents;
        } else {
          return incidents;
        }
      });
    };

    // Handle incidents received from another window, restart the timout with some extra time added
    // to give time for another update, and a random component for conflict resolution if the window is closed.
    const handleIncidentsFromOtherTab = ({ data }: any) => {
      scheduleFetch(1000 + Math.random() * 2000);
      handleNewIncidents(data.incidents);
    };

    const fetchIncidents = async () => {
      const newIncidents = await getPagerDutyIncidents(client, username);

      if (didCancel) {
        return;
      }

      // Broadcast the incidents we fetched to other tabs, so they won't need to fetch themselves.
      if (broadcastChannel) {
        broadcastChannel.postMessage({ incidents: newIncidents });
      }
      handleNewIncidents(newIncidents);
    };

    const scheduleFetch = (extraWaitMs = 0) => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      timeoutIdRef.current = setTimeout(() => {
        fetchIncidents();
        scheduleFetch();
      }, POLL_INTERVAL_MS + extraWaitMs);
    };

    // Fetch initial incidents and start fetch loop
    fetchIncidents();
    scheduleFetch();

    if (broadcastChannel) {
      broadcastChannel.addEventListener('message', handleIncidentsFromOtherTab);
    }

    return () => {
      didCancel = true;
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      if (broadcastChannel) {
        broadcastChannel.removeEventListener('message', handleIncidentsFromOtherTab);
      }
    };
  }, [client, username, broadcastChannel]);

  return incidents;
}
