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
import { ScrollArea } from '../ScrollArea';
import clsx from 'clsx';
import { useStyles } from '../../hooks/useStyles';
import type {
  CardProps,
  CardHeaderProps,
  CardBodyProps,
  CardFooterProps,
} from './types';

/**
 * Card component.
 *
 * @public
 */
export const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const { className, ...rest } = props;
  const { classNames } = useStyles('Card');

  return (
    <div ref={ref} className={clsx(classNames.root, className)} {...rest} />
  );
});

/**
 * CardHeader component.
 *
 * @public
 */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  (props, ref) => {
    const { className, ...rest } = props;
    const { classNames } = useStyles('Card');

    return (
      <div ref={ref} className={clsx(classNames.header, className)} {...rest} />
    );
  },
);

/**
 * CardBody component.
 *
 * @public
 */
export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  (props, ref) => {
    const { children, className, ...rest } = props;
    const { classNames } = useStyles('Card');

    return (
      <ScrollArea.Root
        ref={ref}
        className={clsx(classNames.body, className)}
        {...rest}
      >
        <ScrollArea.Viewport style={{ paddingInline: 'var(--bui-space-3)' }}>
          {children}
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          orientation="vertical"
          style={{ margin: '0 0.25rem' }}
        >
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    );
  },
);

/**
 * CardFooter component.
 *
 * @public
 */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  (props, ref) => {
    const { className, ...rest } = props;
    const { classNames } = useStyles('Card');

    return (
      <div ref={ref} className={clsx(classNames.footer, className)} {...rest} />
    );
  },
);
