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
import { FlexProps } from './types';
import clsx from 'clsx';
import { useStyles } from '../../hooks/useStyles';
import { FlexDefinition } from './definition';
import styles from './Flex.module.css';
import { BgProvider, useBg } from '../../hooks/useBg';

/** @public */
export const Flex = forwardRef<HTMLDivElement, FlexProps>((props, ref) => {
  // Only establish bg context when an explicit bg prop is provided.
  // Flex is a layout primitive — it should be transparent to the bg system by default.
  const { bg: resolvedBg } = useBg(
    props.bg !== undefined ? { mode: 'container', bg: props.bg } : undefined,
  );

  const { classNames, dataAttributes, utilityClasses, style, cleanedProps } =
    useStyles(FlexDefinition, {
      gap: '4',
      ...props,
      bg: resolvedBg, // Use resolved bg for data attribute
    });

  const { className, bg, ...rest } = cleanedProps;

  const content = (
    <div
      ref={ref}
      className={clsx(
        classNames.root,
        utilityClasses,
        styles[classNames.root],
        className,
      )}
      style={style}
      {...dataAttributes}
      {...rest}
    />
  );

  return resolvedBg ? (
    <BgProvider bg={resolvedBg}>{content}</BgProvider>
  ) : (
    content
  );
});
