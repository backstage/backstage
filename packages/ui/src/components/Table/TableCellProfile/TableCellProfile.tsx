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
import { TableCellProfileProps } from './types';
import { Text } from '../../Text/Text';
import { Link } from '../../Link/Link';
import { Avatar } from '@base-ui-components/react/avatar';
import { useStyles } from '../../../hooks/useStyles';

/** @public */
const TableCellProfile = forwardRef<HTMLDivElement, TableCellProfileProps>(
  ({ className, src, name, to, withImage = true, ...rest }, ref) => {
    const { classNames } = useStyles('Table');

    return (
      <div
        ref={ref}
        className={clsx(classNames.cellProfile, className)}
        {...rest}
      >
        {withImage && (
          <Avatar.Root className={classNames.cellProfileAvatar}>
            <Avatar.Image
              src={src}
              width="20"
              height="20"
              className={classNames.cellProfileAvatarImage}
            />
            <Avatar.Fallback className={classNames.cellProfileAvatarFallback}>
              {(name || '')
                .split(' ')
                .map(word => word[0])
                .join('')
                .toLocaleUpperCase('en-US')
                .slice(0, 1)}
            </Avatar.Fallback>
          </Avatar.Root>
        )}
        {name && to ? (
          <Link href={to}>{name}</Link>
        ) : (
          <Text variant="body">{name}</Text>
        )}
      </div>
    );
  },
);
TableCellProfile.displayName = 'TableCellProfile';

export { TableCellProfile };
