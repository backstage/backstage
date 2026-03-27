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

import { ComponentType } from 'react';
import { IconComponent } from '@backstage/core-plugin-api';
import {
  Building2,
  ImageOff,
  LayoutGrid,
  FolderPlus,
  FileText,
  Search,
  MessageCircle,
  LayoutDashboard,
  Mail,
  Puzzle,
  Github,
  HelpCircle,
  MapPin,
  Cpu,
  BookOpen,
  Users,
  User,
  AlertTriangle,
  Database,
  ListVideo,
  Star,
  StarOff,
  ExternalLink,
} from 'lucide-react';

/**
 * Maps Backstage's MUI-derived fontSize values to Lucide numeric pixel sizes.
 * "inherit" is intentionally omitted — when fontSize is "inherit" or absent,
 * the Lucide icon renders at its default 24px size.
 */
const fontSizeToPixels: Record<string, number> = {
  small: 16,
  medium: 24,
  large: 36,
};

/**
 * Wraps a Lucide icon component as a Backstage IconComponent.
 *
 * Lucide icons accept LucideProps (size, strokeWidth, className, etc.) while
 * Backstage's IconComponent expects { fontSize?: 'medium' | 'large' | 'small' | 'inherit' }.
 * This adapter maps the fontSize prop to a numeric size value and assigns
 * a displayName for easier debugging in React DevTools.
 */
const wrapIcon = (
  LucideIcon: ComponentType<{ className?: string; size?: number | string }>,
): IconComponent => {
  const Wrapped: IconComponent = ({ fontSize }) => (
    <LucideIcon
      size={
        fontSize && fontSize !== 'inherit'
          ? fontSizeToPixels[fontSize]
          : undefined
      }
    />
  );
  Wrapped.displayName = `Wrapped(${
    LucideIcon.displayName || LucideIcon.name || 'Icon'
  })`;
  return Wrapped;
};

export const icons = {
  brokenImage: wrapIcon(ImageOff),
  // To be confirmed: see https://github.com/backstage/backstage/issues/4970
  catalog: wrapIcon(BookOpen),
  scaffolder: wrapIcon(FolderPlus),
  techdocs: wrapIcon(FileText),
  search: wrapIcon(Search),
  chat: wrapIcon(MessageCircle),
  dashboard: wrapIcon(LayoutDashboard),
  docs: wrapIcon(FileText),
  email: wrapIcon(Mail),
  github: wrapIcon(Github),
  group: wrapIcon(Users),
  help: wrapIcon(HelpCircle),
  'kind:api': wrapIcon(Puzzle),
  'kind:component': wrapIcon(Cpu),
  'kind:domain': wrapIcon(Building2),
  'kind:group': wrapIcon(Users),
  'kind:location': wrapIcon(MapPin),
  'kind:system': wrapIcon(LayoutGrid),
  'kind:user': wrapIcon(User),
  'kind:resource': wrapIcon(Database),
  'kind:template': wrapIcon(ListVideo),
  user: wrapIcon(User),
  warning: wrapIcon(AlertTriangle),
  star: wrapIcon(Star),
  unstarred: wrapIcon(StarOff),
  externalLink: wrapIcon(ExternalLink),
};
