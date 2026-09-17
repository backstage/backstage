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

import {
  RangeCalendar,
  CalendarGrid,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarGridBody,
  CalendarCell,
  Heading,
  Button,
} from 'react-aria-components';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import { useDefinition } from '../../hooks/useDefinition';
import { DateRangePickerCalendarDefinition } from './definition';

/**
 * Calendar popover content for DateRangePicker — renders the RangeCalendar
 * with navigation and a full calendar grid.
 *
 * @internal
 */
export const DateRangePickerCalendar = () => {
  const { ownProps } = useDefinition(DateRangePickerCalendarDefinition, {});
  const { classes } = ownProps;

  return (
    <RangeCalendar className={classes.root}>
      <header className={classes.header}>
        <Button slot="previous" className={classes.navButton}>
          <RiArrowLeftSLine size={16} aria-hidden="true" />
        </Button>
        <Heading className={classes.heading} />
        <Button slot="next" className={classes.navButton}>
          <RiArrowRightSLine size={16} aria-hidden="true" />
        </Button>
      </header>
      <CalendarGrid className={classes.grid}>
        <CalendarGridHeader className={classes.gridHeader}>
          {day => (
            <CalendarHeaderCell className={classes.headerCell}>
              {day}
            </CalendarHeaderCell>
          )}
        </CalendarGridHeader>
        <CalendarGridBody className={classes.gridBody}>
          {date => <CalendarCell className={classes.cell} date={date} />}
        </CalendarGridBody>
      </CalendarGrid>
    </RangeCalendar>
  );
};
