/*
 * Copyright 2024 The Backstage Authors
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

import { forwardRef } from 'react';
import clsx from 'clsx';
import { TableCellTextProps } from './types';
import { Text } from '../../Text/Text';
import { useStyles } from '../../../hooks/useStyles';

/** @public */
const TableCellText = forwardRef<HTMLDivElement, TableCellTextProps>(
  ({ className, title, description, ...props }, ref) => {
    const { classNames } = useStyles('Table');

    return (
      <div
        ref={ref}
        className={clsx(classNames.cellText, className)}
        {...props}
      >
        {title && <Text variant="body-medium">{title}</Text>}
        {description && (
          <Text variant="body-medium" color="secondary">
            {description}
          </Text>
        )}
      </div>
    );
  },
);
TableCellText.displayName = 'TableCellText';

export { TableCellText };
