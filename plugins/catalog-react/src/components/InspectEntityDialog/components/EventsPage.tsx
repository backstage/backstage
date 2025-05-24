/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import {
  CodeSnippet,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import {
  discoveryApiRef,
  fetchApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { assertError, ResponseError } from '@backstage/errors';
import { JsonObject } from '@backstage/types';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import DialogContentText from '@material-ui/core/DialogContentText';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import useMountedState from 'react-use/esm/useMountedState';
import { catalogReactTranslationRef } from '../../../translation';
import { sortKeys } from './util';

// copied from plugins/catalog-backend-module-history/src/emitter/types.ts
export interface CatalogHistoryEvent {
  eventId: string;
  eventAt: string;
  eventType: string;
  entityId?: string;
  entityRef?: string;
  entityJson?: JsonObject;
  locationId?: string;
  locationRef?: string;
}

export interface CatalogHistoryEventsResponse {
  items: CatalogHistoryEvent[];
  pageInfo: {
    cursor?: string;
  };
}
export function useEntityEvents(entityRef: string): {
  loading: boolean;
  error?: Error;
  items: CatalogHistoryEvent[];
} {
  const isMounted = useMountedState();
  const { fetch } = useApi(fetchApiRef);
  const discoveryApi = useApi(discoveryApiRef);
  const [state, setState] = useState<{
    loading: boolean;
    error?: Error;
    items: CatalogHistoryEvent[];
  }>({
    loading: false,
    items: [],
  });

  useEffect(() => {
    let cancel = false;
    setState({ loading: true, items: [] });

    async function streamHistoryEvents() {
      try {
        let cursor: string | undefined;
        for (;;) {
          const baseUrl = await discoveryApi.getBaseUrl('catalog');
          const query = new URLSearchParams(
            cursor ? { cursor } : { entityRef, block: 'true' },
          ).toString();
          const response = await fetch(`${baseUrl}/history/v1/events?${query}`);
          if (!response.ok) {
            throw await ResponseError.fromResponse(response);
          }
          if (cancel) {
            return;
          }

          // Mark as no longer loading when we start getting blocking 202s
          setState(old =>
            old.loading && response.status !== 200
              ? {
                  loading: false,
                  items: old.items,
                }
              : old,
          );

          const body = (await response.json()) as CatalogHistoryEventsResponse;
          if (cancel) {
            return;
          }
          cursor = body.pageInfo.cursor;

          // Only mutate the state if we actually got some items
          setState(old =>
            body.items.length
              ? {
                  loading: old.loading,
                  items: old.items.concat(body.items),
                }
              : old,
          );
        }
      } catch (error) {
        if (isMounted() && !cancel) {
          assertError(error);
          setState(old => ({
            loading: false,
            error,
            items: old.items,
          }));
        }
      }
    }

    streamHistoryEvents();

    return () => {
      cancel = true;
      if (isMounted()) {
        setState({ loading: false, items: [] });
      }
    };
  }, [entityRef, isMounted, discoveryApi, fetch]);

  return state;
}

const useStyles = makeStyles(theme =>
  createStyles({
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  }),
);

export function Timestamp(props: { timestamp: string }) {
  function getText(t: string): string {
    const ts = DateTime.fromISO(t);
    const actualStr = ts.toLocaleString(DateTime.DATETIME_MED);
    const deltaStr = ts.toRelative({ style: 'short' });
    return `${actualStr} (${deltaStr})`;
  }

  const [text, setText] = useState(() => getText(props.timestamp));

  useEffect(() => {
    const interval = setInterval(() => {
      setText(getText(props.timestamp));
    }, 5000);
    return () => clearInterval(interval);
  }, [props.timestamp]);

  return <Typography>{text}</Typography>;
}

export function EventsPage(props: { entity: Entity }) {
  const classes = useStyles();
  const { t } = useTranslationRef(catalogReactTranslationRef);
  const events = useEntityEvents(stringifyEntityRef(props.entity));
  const [selectedEventId, setSelectedEventId] = useState<string>('');

  const handleClick = (eventId: string) => () => {
    setSelectedEventId(old => (old === eventId ? '' : eventId));
  };

  return (
    <>
      <DialogContentText variant="h2">
        {t('inspectEntityDialog.eventsPage.title')}
      </DialogContentText>
      <DialogContentText>
        {t('inspectEntityDialog.eventsPage.description')}
      </DialogContentText>
      <DialogContentText>
        <div>
          {events.items.map(event => (
            <Accordion
              key={event.eventId}
              expanded={selectedEventId === event.eventId}
              onChange={handleClick(event.eventId)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography className={classes.heading}>
                  {event.eventType}
                </Typography>
                <Typography className={classes.secondaryHeading}>
                  <Timestamp timestamp={event.eventAt} />
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <CodeSnippet
                    text={JSON.stringify(
                      sortKeys(event.entityJson ?? {}),
                      null,
                      2,
                    )}
                    customStyle={{
                      width: '100%',
                    }}
                    language="yaml"
                    showCopyCodeButton
                  />
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
        {events.loading ? <Progress /> : null}
        {events.error ? <ResponseErrorPanel error={events.error} /> : null}
      </DialogContentText>
    </>
  );
}
