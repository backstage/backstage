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
import { cn } from '../../lib/utils';

/** Style class keys for the BackstageSignInPage component. */
export type SignInPageClassKey = 'container' | 'item';

/**
 * Returns Tailwind CSS utility class strings for the SignInPage layout.
 *
 * @remarks
 * Previously a MUI `makeStyles` hook; now returns static Tailwind CSS class
 * name strings so consuming code can assign them via the `className` prop or
 * pass them through a `classes` object. Retained for backward compatibility
 * with any consumers that reference `useStyles`.
 *
 * @deprecated Use Tailwind utility classes directly instead of this hook.
 * @public
 */
export const useStyles = () => ({
  container: cn('p-0', 'list-none'),
  item: cn('flex', 'flex-col', 'w-full', 'max-w-[400px]', 'm-0', 'p-0'),
});

/**
 * Grid item wrapper for SignInPage provider tiles.
 *
 * Renders a semantic `<li>` element with a constrained flex-column layout
 * (max-width 400 px) so each sign-in provider tile is consistently sized
 * within the parent grid.
 */
export const GridItem = ({ children }: { children: JSX.Element }) => {
  return (
    <li
      className={cn(
        'flex',
        'flex-col',
        'w-full',
        'max-w-[400px]',
        'm-0',
        'p-0',
      )}
    >
      {children}
    </li>
  );
};
