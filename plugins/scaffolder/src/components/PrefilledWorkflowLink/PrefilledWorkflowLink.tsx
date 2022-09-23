/*
 * Copyright 2022 The Backstage Authors
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
import React from 'react';
import type { ReactNode } from 'react';
import type { PrefilledWorkflowProps } from './types';
import { usePrefilledWorkflowHref } from './usePrefilledWorkflowHref';
import { Link } from '@backstage/core-components';
import type { LinkProps } from '@backstage/core-components';

type PrefilledWorkflowLinkProps = PrefilledWorkflowProps &
  Omit<LinkProps, 'to'> & {
    children: ReactNode;
  };

export function PrefilledWorkflowLink({
  children,
  templateName,
  namespace,
  formData,
  ...linkProps
}: PrefilledWorkflowLinkProps): JSX.Element {
  const href = usePrefilledWorkflowHref({ templateName, namespace, formData });

  return (
    <Link {...linkProps} to={href}>
      {children}
    </Link>
  );
}
