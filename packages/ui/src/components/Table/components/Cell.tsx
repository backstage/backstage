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
import { Text } from '../../Text';
import { Link } from '../../Link';
import { Cell as ReactAriaCell } from 'react-aria-components';
import type { CellProps } from '../types';
import { useStyles } from '../../../hooks/useStyles';

/** @public */
const Cell = (props: CellProps) => {
  const {
    className,
    title,
    description,
    color = 'primary',
    leadingIcon,
    href,
    ...rest
  } = props;

  const { classNames } = useStyles('Table');

  return (
    <ReactAriaCell className={clsx(classNames.cell, className)} {...rest}>
      <div className={classNames.cellContentWrapper}>
        {leadingIcon && (
          <div className={classNames.cellIcon}>{leadingIcon}</div>
        )}
        <div className={classNames.cellContent}>
          {href ? (
            <Link href={href} variant="body-medium" color={color}>
              {title}
            </Link>
          ) : (
            <Text as="p" variant="body-medium" color={color}>
              {title}
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

Cell.displayName = 'Cell';

export { Cell };
