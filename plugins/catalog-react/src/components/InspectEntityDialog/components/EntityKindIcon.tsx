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

import { parseEntityRef } from '@backstage/catalog-model';
import { useApp } from '@backstage/core-plugin-api';
import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

const DEFAULT_ICON = SvgIcon;

function getKind(
  kind: string | undefined,
  entityRef: string | undefined,
): string | undefined {
  if (kind) {
    return kind.toLocaleLowerCase('en-US');
  }

  if (entityRef) {
    try {
      return parseEntityRef(entityRef).kind.toLocaleLowerCase('en-US');
    } catch {
      return undefined;
    }
  }

  return undefined;
}

function useIcon(kind: string | undefined, entityRef: string | undefined) {
  const app = useApp();

  const actualKind = getKind(kind, entityRef);
  if (!actualKind) {
    return DEFAULT_ICON;
  }

  const icon = app.getSystemIcon(`kind:${actualKind}`);
  return icon || DEFAULT_ICON;
}

export function EntityKindIcon(props: {
  kind?: string;
  entityRef?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  className?: string;
}) {
  const { kind, entityRef, ...otherProps } = props;
  const Icon = useIcon(kind, entityRef);
  return <Icon {...otherProps} />;
}
