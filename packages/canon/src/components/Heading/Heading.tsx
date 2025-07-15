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
import type { ElementType } from 'react';
import type { HeadingProps } from './types';
import { useStyles } from '../../hooks/useStyles';

function HeadingComponent<T extends ElementType = 'h1'>(
  {
    as,
    variant = 'title1',
    color = 'primary',
    truncate,
    className,
    style,
    ...restProps
  }: HeadingProps<T>,
  ref: React.Ref<any>,
) {
  const Component = as || 'h1';

  const { classNames, dataAttributes } = useStyles('Heading', {
    variant,
    color,
  });

  return (
    <Component
      ref={ref}
      className={clsx(classNames.root, className)}
      data-truncate={truncate}
      {...dataAttributes}
      style={style}
      {...restProps}
    />
  );
}

HeadingComponent.displayName = 'Heading';

/** @public */
export const Heading = forwardRef(HeadingComponent) as {
  <T extends ElementType = 'h1'>(
    props: HeadingProps<T> & { ref?: React.ComponentPropsWithRef<T>['ref'] },
  ): React.ReactElement<HeadingProps<T>, T>;
  displayName: string;
};

Heading.displayName = 'Heading';
