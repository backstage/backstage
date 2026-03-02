/*
 * Copyright 2023 The Backstage Authors
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

import { IconComponent } from '@backstage/core-plugin-api';
import { defaultEntityPresentation } from '@backstage/plugin-catalog-react';
import { HumanDuration } from '@backstage/types';
import {
  Building2,
  LayoutGrid,
  Puzzle,
  List,
  MapPin,
  Cpu,
  Users,
  User,
  Database,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { DefaultEntityPresentationApiRenderer } from './DefaultEntityPresentationApi';

/**
 * Wraps a Lucide icon component to satisfy the Backstage IconComponent type contract.
 * LucideIcon accepts SVGProps (fontSize?: string | number) while IconComponent
 * restricts fontSize to 'medium' | 'large' | 'small' | 'inherit'.
 */
const wrapIcon = (Icon: LucideIcon): IconComponent => {
  const Wrapped = (props: {
    fontSize?: 'medium' | 'large' | 'small' | 'inherit';
  }) => <Icon {...props} />;
  return Wrapped;
};

export const DEFAULT_CACHE_TTL: HumanDuration = { seconds: 10 };

export const DEFAULT_BATCH_DELAY: HumanDuration = { milliseconds: 50 };

export const DEFAULT_ICONS: Record<string, IconComponent> = {
  api: wrapIcon(Puzzle),
  component: wrapIcon(Cpu),
  system: wrapIcon(LayoutGrid),
  resource: wrapIcon(Database),
  domain: wrapIcon(Building2),
  location: wrapIcon(MapPin),
  user: wrapIcon(User),
  group: wrapIcon(Users),
  template: wrapIcon(List),
};

export function createDefaultRenderer(options: {
  async: boolean;
}): DefaultEntityPresentationApiRenderer {
  return {
    async: options.async,

    render: ({ entityRef, entity, context }) => {
      const presentation = defaultEntityPresentation(
        entity || entityRef,
        context,
      );
      return {
        snapshot: presentation,
        loadEntity: options.async,
      };
    },
  };
}
