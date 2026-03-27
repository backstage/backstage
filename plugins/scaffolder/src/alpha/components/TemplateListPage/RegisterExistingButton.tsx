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

import { ShadcnButton as Button } from '@backstage/core-components';
import { PlusCircle } from 'lucide-react';
import { Link as RouterLink, LinkProps } from 'react-router-dom';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
import { usePermission } from '@backstage/plugin-permission-react';

/**
 * Properties for {@link RegisterExistingButton}
 *
 * @alpha
 */
export type RegisterExistingButtonProps = {
  title: string;
} & Partial<Pick<LinkProps, 'to'>>;

/**
 * A button that helps users to register an existing component.
 * @alpha
 */
export const RegisterExistingButton = (props: RegisterExistingButtonProps) => {
  const { title, to } = props;
  const { allowed } = usePermission({
    permission: catalogEntityCreatePermission,
  });
  if (!to || !allowed) {
    return null;
  }

  return (
    <>
      {/* Mobile: icon-only button, visible on small screens */}
      <Button
        variant="ghost"
        size="icon"
        asChild
        className="md:hidden"
        aria-label={title}
      >
        <RouterLink to={to}>
          <PlusCircle />
        </RouterLink>
      </Button>
      {/* Desktop: full text button, visible on medium+ screens */}
      <Button variant="outline" asChild className="hidden md:inline-flex">
        <RouterLink to={to}>{title}</RouterLink>
      </Button>
    </>
  );
};
