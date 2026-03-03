/*
 * Copyright 2021 The Backstage Authors
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

import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

/** @public */
export type ItemCardHeaderClassKey = 'root';

/** @public */
export type ItemCardHeaderProps = {
  /**
   * A large title to show in the header, providing the main heading.
   *
   * Use this if you want to have the default styling and placement of a title.
   */
  title?: ReactNode;
  /**
   * A slightly smaller title to show in the header, providing additional
   * details.
   *
   * Use this if you want to have the default styling and placement of a
   * subtitle.
   */
  subtitle?: ReactNode;
  /**
   * Custom children to draw in the header.
   *
   * If the title and/or subtitle were specified, the children are drawn below
   * those.
   */
  children?: ReactNode;
  /**
   * Override or extend the styles applied to the component.
   * The key 'root' applies to the header container element.
   */
  classes?: Partial<Record<ItemCardHeaderClassKey, string>>;
  /**
   * Additional CSS class name for the header container.
   */
  className?: string;
};

/**
 * A simple card header, rendering a default look for "item cards" - cards that
 * are arranged in a grid for users to select among several options.
 *
 * @remarks
 * Styles for the header can be overridden using the `classes` prop, e.g.:
 *
 * `<ItemCardHeader title="Hello" classes={{ root: myClassName }} />`
 *
 * @public
 */
export function ItemCardHeader(props: ItemCardHeaderProps) {
  const { title, subtitle, children, classes, className } = props;
  return (
    <div
      className={cn(
        'bg-primary text-primary-foreground px-4 pt-4 pb-6 bg-cover bg-[position:0]',
        classes?.root,
        className,
      )}
    >
      {subtitle && (
        <h3 className="text-sm font-medium opacity-80">{subtitle}</h3>
      )}
      {title && <h4 className="text-lg font-semibold">{title}</h4>}
      {children}
    </div>
  );
}
