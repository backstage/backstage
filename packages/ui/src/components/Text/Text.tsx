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
import type { TextProps } from './types';
import { useStyles } from '../../hooks/useStyles';

function TextComponent<T extends ElementType = 'span'>(
  {
    as,
    variant = 'body-medium',
    weight = 'regular',
    color = 'primary',
    className,
    truncate,
    style,
    ...restProps
  }: TextProps<T>,
  ref: React.Ref<any>,
) {
  const Component = as || 'span';

  const { classNames, dataAttributes } = useStyles('Text', {
    variant,
    weight,
    color,
  });

  return (
    <Component
      ref={ref}
      className={clsx(classNames.root, className)}
      data-truncate={truncate}
      data-as={as}
      {...dataAttributes}
      style={style}
      {...restProps}
    />
  );
}

TextComponent.displayName = 'Text';

/** @public */
export const Text = forwardRef(TextComponent) as {
  <T extends ElementType = 'p'>(
    props: TextProps<T> & { ref?: React.ComponentPropsWithRef<T>['ref'] },
  ): React.ReactElement<TextProps<T>, T>;
  displayName: string;
};

Text.displayName = 'Text';
