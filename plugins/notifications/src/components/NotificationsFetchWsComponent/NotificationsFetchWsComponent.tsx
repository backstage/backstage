/*
 * Copyright 2021 The Backstage Authors
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
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import Typography from '@material-ui/core/Typography';
import { Notifications } from '../../types';
import moment from 'moment';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const useStyles = makeStyles(() => ({
  oppositeContent: {
    // TODO: adjust this value accordingly
    flex: 0.1,
  },
}));

type Status = 'success' | 'failure' | 'inprogress' | 'waiting';

const notificationTypeToColor: { [key in Status]: string } = {
  success: 'primary',
  failure: 'secondary',
  inprogress: 'grey',
  waiting: 'grey',
};

const timeDisplay = (timestamp: number) => {
  if (moment(timestamp).isAfter(moment().subtract(3, 'days'))) {
    return moment(timestamp).fromNow();
  }
  return moment(timestamp).format('DD-MM-YYYY');
};

const notificationSortFn = (a: Notification, b: Notification) => {
  return moment(b.timestamp).diff(moment(a.timestamp));
};

const ContentTimeline = () => {
  const classes = useStyles();
  const [socketUrl, _setSocketUrl] = useState(
    'ws://localhost:7000/websockets?userId=raghu',
  );
  const [notifications, setNotifications] = useState<Notifications>([]);

  const { lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage) {
      setNotifications(state => state.concat(JSON.parse(lastMessage.data)));
    }
  }, [lastMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <>
      <Typography>Websocket connection status: {connectionStatus}</Typography>
      <Timeline>
        {notifications
          .sort(notificationSortFn)
          .map(({ message, type, timestamp }, index) => {
            return (
              <TimelineItem key={index}>
                <TimelineOppositeContent className={classes.oppositeContent}>
                  <Typography color="textSecondary">
                    {timeDisplay(timestamp)}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot
                    variant="outlined"
                    color={notificationTypeToColor[type]}
                  />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography>
                    <div dangerouslySetInnerHTML={{ __html: message }} />
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            );
          })}
      </Timeline>
    </>
  );
};

export const NotificationsFetchWsComponent = ({ userId: string }) => {
  return <ContentTimeline />;
};
