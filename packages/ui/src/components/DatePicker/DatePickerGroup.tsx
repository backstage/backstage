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

import { Group, DateInput, DateSegment, Button } from 'react-aria-components';
import { RiCalendarLine } from '@remixicon/react';
import { useDefinition } from '../../hooks/useDefinition';
import { DatePickerGroupDefinition } from './definition';

/**
 * Custom field group for DatePicker — renders a single DateInput field
 * and a calendar trigger button.
 *
 * @internal
 */
export const DatePickerGroup = ({ dataSize }: { dataSize?: string }) => {
  const { ownProps, dataAttributes } = useDefinition(
    DatePickerGroupDefinition,
    {},
  );
  const { classes } = ownProps;

  return (
    <Group
      className={classes.root}
      {...dataAttributes}
      {...(dataSize ? { 'data-size': dataSize } : {})}
    >
      <DateInput className={classes.dateInput}>
        {segment => (
          <DateSegment segment={segment} className={classes.segment} />
        )}
      </DateInput>
      <Button className={classes.button} aria-label="Open calendar">
        <RiCalendarLine size={16} aria-hidden="true" />
      </Button>
    </Group>
  );
};
