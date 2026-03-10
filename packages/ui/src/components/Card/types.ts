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

import type { ReactNode } from 'react';
import type { ButtonProps as RAButtonProps } from 'react-aria-components';

/** @public */
export type CardBaseProps = { children?: ReactNode; className?: string };

/** @public */
export type CardButtonVariant = {
  /** Handler called when the card is pressed. Makes the card interactive as a button. */
  onPress: NonNullable<RAButtonProps['onPress']>;
  href?: never;
  /** Accessible label announced by screen readers for the interactive card. */
  label: string;
  target?: never;
  rel?: never;
  download?: never;
};

/** @public */
export type CardLinkVariant = {
  /** URL to navigate to. Makes the card interactive as a link. */
  href: string;
  onPress?: never;
  /** Accessible label announced by screen readers for the interactive card. */
  label: string;
  /** Specifies where to open the linked URL (e.g. `_blank` for a new tab). */
  target?: string;
  /** Relationship between the current document and the linked URL (e.g. `noopener`). */
  rel?: string;
  /** Prompts the user to save the linked URL. Pass `true` for default filename or a string for a custom filename. */
  download?: boolean | string;
};

/** @public */
export type CardStaticVariant = {
  onPress?: never;
  href?: never;
  label?: never;
  target?: never;
  rel?: never;
  download?: never;
};

/**
 * Props for the Card component.
 *
 * @public
 */
export type CardProps = CardBaseProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> &
  (CardButtonVariant | CardLinkVariant | CardStaticVariant);

/**
 * Flat own-props shape used by the component definition system.
 * Derived from the Card variant types so it automatically stays in sync with CardProps.
 * @public
 */
export type CardOwnProps = Pick<
  CardBaseProps & (CardButtonVariant | CardLinkVariant | CardStaticVariant),
  | 'children'
  | 'className'
  | 'onPress'
  | 'href'
  | 'label'
  | 'target'
  | 'rel'
  | 'download'
>;

/** @public */
export type CardHeaderOwnProps = {
  children?: ReactNode;
  className?: string;
};

/**
 * Props for the CardHeader component.
 *
 * @public
 */
export interface CardHeaderProps
  extends CardHeaderOwnProps,
    React.HTMLAttributes<HTMLDivElement> {}

/** @public */
export type CardBodyOwnProps = {
  children?: ReactNode;
  className?: string;
};

/**
 * Props for the CardBody component.
 *
 * @public
 */
export interface CardBodyProps
  extends CardBodyOwnProps,
    React.HTMLAttributes<HTMLDivElement> {}

/** @public */
export type CardFooterOwnProps = {
  children?: ReactNode;
  className?: string;
};

/**
 * Props for the CardFooter component.
 *
 * @public
 */
export interface CardFooterProps
  extends CardFooterOwnProps,
    React.HTMLAttributes<HTMLDivElement> {}
