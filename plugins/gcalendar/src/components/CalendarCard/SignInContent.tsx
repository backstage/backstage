/*
 * Copyright 2022 The Backstage Authors
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
import React from 'react';

import { Box, Button, styled } from '@material-ui/core';

import { CalendarEvent } from './CalendarEvent';
import { eventsMock } from './signInEventMock';
import { GCalendarEvent } from '../..';

type Props = {
  handleAuthClick: React.MouseEventHandler<HTMLElement>;
  events?: GCalendarEvent[];
};

const TransparentBox = styled(Box)({
  opacity: 0.3,
  filter: 'blur(1.5px)',
});

export const SignInContent = ({
  handleAuthClick,
  events = eventsMock,
}: Props) => {
  return (
    <Box position="relative" height="100%" width="100%">
      <TransparentBox p={1}>
        {events.map(event => (
          <CalendarEvent key={event.id} event={event} />
        ))}
      </TransparentBox>

      <Box
        height="100%"
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        position="absolute"
        left={0}
        top={0}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleAuthClick}
          size="large"
        >
          Sign in
        </Button>
      </Box>
    </Box>
  );
};
