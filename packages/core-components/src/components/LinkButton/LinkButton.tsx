/*
 * Copyright 2020 The Backstage Authors
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
import { Button as ShadcnButton, type ButtonProps as ShadcnButtonProps } from '../ui/button';
import { UnstyledLink, LinkProps } from '../Link/Link';
import { cn } from '../../lib/utils';

/**
 * Properties for {@link LinkButton}
 *
 * @public
 * @remarks
 *
 * See {@link https://ui.shadcn.com/docs/components/button | shadcn/ui Button} for button properties
 */
export type LinkButtonProps = Omit<ShadcnButtonProps, 'asChild'> &
  Omit<LinkProps, 'variant' | 'color'>;

/**
 * This wrapper forwards all props to UnstyledLink for router-aware navigation.
 */
const LinkWrapper = forwardRef<any, LinkProps>((props, ref) => (
  <UnstyledLink ref={ref} {...props} />
));

/**
 * Router-aware button component built on shadcn/ui Button with Radix Slot render delegation.
 * Uses the `asChild` pattern to compose button styling with React Router Link navigation.
 *
 * @public
 * @remarks
 */
export const LinkButton = forwardRef<any, LinkButtonProps>(
  ({ className, variant, size, disabled, ...linkProps }, ref) => (
    <ShadcnButton
      variant={variant}
      size={size}
      disabled={disabled}
      className={cn(className)}
      asChild
    >
      <LinkWrapper ref={ref} {...(linkProps as LinkProps)} />
    </ShadcnButton>
  ),
) as (props: LinkButtonProps) => JSX.Element;

/**
 * @public
 * @deprecated use LinkButton instead
 */
export const Button = LinkButton;

/**
 * @public
 * @deprecated use LinkButtonProps instead
 */
export type ButtonProps = LinkButtonProps;
