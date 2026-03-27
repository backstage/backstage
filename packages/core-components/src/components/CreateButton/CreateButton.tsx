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

import { Link as RouterLink, LinkProps } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

/**
 * Properties for {@link CreateButton}
 *
 * @public
 */
export type CreateButtonProps = {
  title: string;
} & Partial<Pick<LinkProps, 'to'>>;

/**
 * Responsive Button giving consistent UX for creation of different things
 *
 * @public
 */
export function CreateButton(props: CreateButtonProps) {
  const { title, to } = props;

  if (!to) {
    return null;
  }

  return (
    <>
      {/* Mobile: icon-only button (visible below sm breakpoint) */}
      <Button asChild variant="ghost" size="icon" className={cn('sm:hidden')}>
        <RouterLink to={to} title={title}>
          <Plus />
        </RouterLink>
      </Button>
      {/* Desktop: full text button (visible at sm breakpoint and above) */}
      <Button asChild className={cn('hidden sm:inline-flex')}>
        <RouterLink to={to}>{title}</RouterLink>
      </Button>
    </>
  );
}
