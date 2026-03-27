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
export type ItemCardGridClassKey = 'root';

/** @public */
export type ItemCardGridProps = {
  /**
   * The Card items of the grid.
   */
  children?: ReactNode;
  /**
   * Override or extend the styles applied to the component.
   * The key 'root' applies to the grid container element.
   */
  classes?: Partial<Record<ItemCardGridClassKey, string>>;
  /**
   * Additional CSS class name for the grid container.
   */
  className?: string;
  /**
   * Pass-through HTML attributes for the grid container div.
   */
  [key: string]: unknown;
};

/**
 * A default grid to use when arranging "item cards" - cards that let users
 * select among several options.
 *
 * @remarks
 * The immediate children are expected to be Card components.
 *
 * Styles for the grid can be overridden using the `classes` prop, e.g.:
 *
 * `<ItemCardGrid title="Hello" classes={{ root: myClassName }} />`
 *
 * This can be useful for e.g. overriding gridTemplateColumns to adapt the
 * minimum size of the cells to fit the content better.
 *
 * @public
 */
export function ItemCardGrid(props: ItemCardGridProps) {
  const { children, classes, className, ...otherProps } = props;
  return (
    <div
      className={cn(
        'grid grid-cols-[repeat(auto-fill,minmax(22em,1fr))] auto-rows-fr gap-4',
        classes?.root,
        className,
      )}
      {...otherProps}
    >
      {children}
    </div>
  );
}
