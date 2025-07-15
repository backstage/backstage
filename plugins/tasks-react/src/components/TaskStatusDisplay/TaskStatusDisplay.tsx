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
import { Typography, makeStyles, type Theme } from '@material-ui/core';

/**
 * @internal
 */
const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'flex',
      gap: theme.spacing(2),
      alignItems: 'center',
      color: theme.palette.text.secondary,
      // Responsive design for small screens
      [theme.breakpoints.down('sm')]: {
        flexWrap: 'wrap',
        gap: theme.spacing(1),
      },
    },
    statusItem: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(0.5),
    },
  }),
  { name: 'TaskStatusDisplay' },
);

/**
 * @public
 */
export interface TaskStatusItem {
  count: number;
  label: string;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

/**
 * @public
 */
export interface TaskStatusDisplayProps {
  items: TaskStatusItem[];
  variant?: 'summary' | 'detailed';
  className?: string;
}

/**
 * TaskStatusDisplay - Shared component for displaying task status information
 * Used for both summary views and detailed status breakdowns
 *
 * @public
 */
export const TaskStatusDisplay = memo<TaskStatusDisplayProps>(
  ({ items, variant = 'summary', className }) => {
    const classes = useStyles();

    // Filter out items with zero count
    const visibleItems = items.filter(item => item.count > 0);

    if (visibleItems.length === 0) {
      return null;
    }

    return (
      <div className={`${classes.root} ${className || ''}`}>
        {visibleItems.map((item, index) => (
          <div key={`${item.label}-${index}`} className={classes.statusItem}>
            <Typography component="span" variant="body2">
              {variant === 'detailed'
                ? `${item.count} ${item.label}`
                : `${item.count} ${item.label}`}
            </Typography>
          </div>
        ))}
      </div>
    );
  },
);

TaskStatusDisplay.displayName = 'TaskStatusDisplay';
