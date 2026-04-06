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

import { forwardRef, useCallback, useRef } from 'react';
import { Button as RAButton } from 'react-aria-components';
import { useDefinition } from '../../hooks/useDefinition';
import {
  CardDefinition,
  CardHeaderDefinition,
  CardBodyDefinition,
  CardFooterDefinition,
} from './definition';
import type {
  CardProps,
  CardHeaderProps,
  CardBodyProps,
  CardFooterProps,
} from './types';
import { Box } from '../Box/Box';
import { Link } from '../Link';

const INTERACTIVE_ELEMENT_SELECTOR =
  'a[href],button,input,select,textarea,[role="button"],[role="link"],[tabindex]:not([tabindex="-1"])';

/**
 * Card component.
 *
 * @public
 */
export const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const { ownProps, restProps, dataAttributes } = useDefinition(
    CardDefinition,
    props,
  );
  const {
    classes,
    children,
    onPress,
    href,
    label,
    target: linkTarget,
    rel,
    download,
  } = ownProps;
  const isInteractive = !!(onPress || href);

  const triggerRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isInteractive || !triggerRef.current) return;

      // Don't delegate if the click target is the trigger itself
      if (triggerRef.current.contains(e.target as Node)) return;

      // Don't delegate if the user clicked a nested interactive element
      const targetNode = e.target as Node | null;
      const targetElement =
        targetNode instanceof Element ? targetNode : targetNode?.parentElement;
      if (targetElement?.closest(INTERACTIVE_ELEMENT_SELECTOR)) return;

      // Don't delegate if the user is selecting text
      if (window.getSelection()?.toString()) return;

      triggerRef.current.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          ctrlKey: e.ctrlKey,
          metaKey: e.metaKey,
          shiftKey: e.shiftKey,
        }),
      );
    },
    [isInteractive],
  );

  return (
    <Box
      as="article"
      bg="neutral"
      ref={ref}
      className={classes.root}
      data-interactive={isInteractive || undefined}
      {...dataAttributes}
      {...restProps}
      onClick={isInteractive ? handleClick : undefined}
    >
      {href && (
        <Link
          ref={triggerRef as React.Ref<HTMLAnchorElement>}
          className={classes.trigger}
          href={href}
          target={linkTarget}
          rel={rel}
          download={download}
          aria-label={label}
        />
      )}
      {onPress && !href && (
        <RAButton
          ref={triggerRef as React.Ref<HTMLButtonElement>}
          className={classes.trigger}
          onPress={onPress}
          aria-label={label}
        />
      )}
      {children}
    </Box>
  );
});

Card.displayName = 'Card';

/**
 * CardHeader component.
 *
 * @public
 */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  (props, ref) => {
    const { ownProps, restProps } = useDefinition(CardHeaderDefinition, props);
    const { classes, children } = ownProps;

    return (
      <div ref={ref} className={classes.root} {...restProps}>
        {children}
      </div>
    );
  },
);

CardHeader.displayName = 'CardHeader';

/**
 * CardBody component.
 *
 * @public
 */
export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  (props, ref) => {
    const { ownProps, restProps } = useDefinition(CardBodyDefinition, props);
    const { classes, children } = ownProps;

    return (
      <div ref={ref} className={classes.root} {...restProps}>
        {children}
      </div>
    );
  },
);

CardBody.displayName = 'CardBody';

/**
 * CardFooter component.
 *
 * @public
 */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  (props, ref) => {
    const { ownProps, restProps } = useDefinition(CardFooterDefinition, props);
    const { classes, children } = ownProps;

    return (
      <div ref={ref} className={classes.root} {...restProps}>
        {children}
      </div>
    );
  },
);

CardFooter.displayName = 'CardFooter';
