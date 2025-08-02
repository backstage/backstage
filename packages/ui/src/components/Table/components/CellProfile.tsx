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

import clsx from 'clsx';
import { CellProfileProps } from '../types';
import { Text } from '../../Text/Text';
import { Link } from '../../Link/Link';
import { Avatar } from '@base-ui-components/react/avatar';
import { useStyles } from '../../../hooks/useStyles';
import { Cell as ReactAriaCell } from 'react-aria-components';

/** @public */
export const CellProfile = (props: CellProfileProps) => {
  const {
    className,
    src,
    name,
    href,
    description,
    color = 'primary',
    ...rest
  } = props;
  const { classNames } = useStyles('Table');

  return (
    <ReactAriaCell className={clsx(classNames.cell, className)} {...rest}>
      <div className={classNames.cellContentWrapper}>
        <div className={classNames.cellIcon}>
          {src && (
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
        </div>
        <div className={classNames.cellContent}>
          {name && href ? (
            <Link href={href}>{name}</Link>
          ) : (
            <Text as="p" variant="body-medium" color={color}>
              {name}
            </Text>
          )}
          {description && (
            <Text variant="body-medium" color="secondary">
              {description}
            </Text>
          )}
        </div>
      </div>
    </ReactAriaCell>
  );
};
