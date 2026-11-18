/*
 * Copyright 2026 The Backstage Authors
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
import {
  Heading,
  Sheet as RASheet,
  SheetBackdrop,
  SheetContent,
  SheetOverlay,
  SheetTrigger as RASheetTrigger,
} from 'react-aria-components';
import { RiCloseLine } from '@remixicon/react';
import { Button } from '../Button';
import { Box } from '../Box';
import { BgReset } from '../../hooks/useBg';
import { Flex } from '../Flex';
import { useDefinition } from '../../hooks/useDefinition';
import {
  SheetBodyDefinition,
  SheetDefinition,
  SheetFooterDefinition,
  SheetHeaderDefinition,
} from './definition';
import type {
  SheetBodyProps,
  SheetFooterProps,
  SheetHeaderProps,
  SheetProps,
  SheetTriggerProps,
} from './types';

/**
 * A wrapper that connects a trigger element to a Sheet, controlling its open
 * and close state.
 *
 * @public
 */
export const SheetTrigger = (props: SheetTriggerProps) => {
  return <RASheetTrigger {...props} />;
};

/**
 * A swipeable overlay that slides in from the edge of the viewport.
 *
 * @remarks
 * The Sheet is built on the React Aria Sheet primitives and supports logical
 * `start` and `end` positions, controlled open state, snap points, swipe
 * dismissal, and nested sheets. Content is composed with {@link SheetHeader},
 * {@link SheetBody}, and {@link SheetFooter}.
 *
 * @example
 * ```tsx
 * <SheetTrigger>
 *   <Button>Open details</Button>
 *   <Sheet position="end">
 *     <SheetHeader>Details</SheetHeader>
 *     <SheetBody>Sheet content</SheetBody>
 *     <SheetFooter>
 *       <Button slot="close">Close</Button>
 *     </SheetFooter>
 *   </Sheet>
 * </SheetTrigger>
 * ```
 *
 * @public
 */
export const Sheet = forwardRef<HTMLDivElement, SheetProps>((props, ref) => {
  const { ownProps, restProps } = useDefinition(SheetDefinition, props, {
    classNameTarget: 'container',
  });
  const {
    classes,
    children,
    width,
    height,
    style,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    swipeAnimation,
    swipeAnimationRange,
    stackAnimation,
    overscrollPadding,
  } = ownProps;
  const { snapPoints } = restProps;

  return (
    <SheetOverlay className={classes.root} {...restProps}>
      <SheetBackdrop
        className={classes.backdrop}
        swipeAnimation="bui-sheet-backdrop"
        swipeAnimationRange={
          snapPoints ? { start: snapPoints.length - 1 } : undefined
        }
      />
      <RASheet
        ref={ref}
        className={classes.container}
        overscrollPadding={overscrollPadding}
        swipeAnimation={swipeAnimation}
        swipeAnimationRange={swipeAnimationRange}
        stackAnimation={stackAnimation}
        style={{
          ...(width !== undefined
            ? {
                ['--bui-sheet-width' as keyof React.CSSProperties]:
                  typeof width === 'number' ? `${width}px` : width,
              }
            : {}),
          ...(height !== undefined
            ? {
                ['--bui-sheet-height' as keyof React.CSSProperties]:
                  typeof height === 'number' ? `${height}px` : height,
              }
            : {}),
          ...style,
        }}
      >
        <SheetContent
          className={classes.content}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
        >
          <BgReset>
            <Box bg="neutral" className={classes.inner}>
              {children}
            </Box>
          </BgReset>
        </SheetContent>
      </RASheet>
    </SheetOverlay>
  );
});

Sheet.displayName = 'Sheet';

/**
 * The header section of a Sheet, containing the title and a close button.
 *
 * @public
 */
export const SheetHeader = forwardRef<HTMLDivElement, SheetHeaderProps>(
  (props, ref) => {
    const { ownProps, restProps } = useDefinition(SheetHeaderDefinition, props);
    const { classes, children, level } = ownProps;

    return (
      <Flex ref={ref} className={classes.root} {...restProps}>
        <Heading slot="title" level={level} className={classes.title}>
          {children}
        </Heading>
        <Button name="close" aria-label="Close" variant="tertiary" slot="close">
          <RiCloseLine />
        </Button>
      </Flex>
    );
  },
);
SheetHeader.displayName = 'SheetHeader';

/**
 * The main content area of a Sheet.
 *
 * @public
 */
export const SheetBody = forwardRef<HTMLDivElement, SheetBodyProps>(
  (props, ref) => {
    const { ownProps, restProps } = useDefinition(SheetBodyDefinition, props);
    const { classes, children } = ownProps;

    return (
      <div className={classes.root} ref={ref} {...restProps}>
        {children}
      </div>
    );
  },
);
SheetBody.displayName = 'SheetBody';

/**
 * The footer section of a Sheet, typically used to place action buttons.
 *
 * @public
 */
export const SheetFooter = forwardRef<HTMLDivElement, SheetFooterProps>(
  (props, ref) => {
    const { ownProps, restProps } = useDefinition(SheetFooterDefinition, props);
    const { classes, children } = ownProps;

    return (
      <div ref={ref} className={classes.root} {...restProps}>
        {children}
      </div>
    );
  },
);
SheetFooter.displayName = 'SheetFooter';
