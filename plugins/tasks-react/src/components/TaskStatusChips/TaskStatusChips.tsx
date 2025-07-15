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
import { memo } from 'react';
import { Chip, makeStyles, type Theme } from '@material-ui/core';

/**
 * @internal
 */
const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'flex',
      gap: theme.spacing(0.25),
      marginLeft: theme.spacing(0.5),
    },
    chip: {
      height: 20,
    },
  }),
  { name: 'TaskStatusChips' },
);

/**
 * @public
 */
export interface TaskStatusChipItem {
  count: number;
  label: string;
  color?: 'default' | 'primary' | 'secondary';
  variant?: 'default' | 'outlined';
}

/**
 * @public
 */
export interface TaskStatusChipsProps {
  items: TaskStatusChipItem[];
  className?: string;
}

/**
 * TaskStatusChips - Shared component for displaying task status as chips
 * Used in accordion headers and other compact status displays
 *
 * @public
 */
export const TaskStatusChips = memo<TaskStatusChipsProps>(
  ({ items, className }) => {
    const classes = useStyles();

    // Filter out items with zero count
    const visibleItems = items.filter(item => item.count > 0);

    if (visibleItems.length === 0) {
      return null;
    }

    return (
      <div className={`${classes.root} ${className || ''}`}>
        {visibleItems.map((item, index) => (
          <Chip
            key={`${item.label}-${index}`}
            label={`${item.count} ${item.label}`}
            size="small"
            color={item.color || 'default'}
            variant={item.variant || 'default'}
            className={classes.chip}
          />
        ))}
      </div>
    );
  },
);

TaskStatusChips.displayName = 'TaskStatusChips';
