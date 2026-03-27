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
import { Globe } from 'lucide-react';

import { IconComponent } from '@backstage/core-plugin-api';
import { cn, Link } from '@backstage/core-components';

/**
 * Props for the {@link IconLink} component.
 *
 * @remarks
 * Defines an icon-accompanied hyperlink with optional text label.
 * The `Icon` prop accepts any Backstage `IconComponent`. When omitted,
 * the component renders the default Globe icon from lucide-react.
 */
export type IconLinkProps = {
  /** URL the link points to */
  href: string;
  /** Display text — falls back to `href` when omitted */
  text?: string;
  /** Optional icon component rendered before the link text */
  Icon?: IconComponent;
  /** Anchor target attribute (e.g. `"_blank"`) */
  target?: string;
  /** Anchor rel attribute (e.g. `"noopener noreferrer"`) */
  rel?: string;
};

/**
 * Default prop values for {@link IconLink}.
 *
 * @remarks
 * Supplies a Globe icon as the default icon via lucide-react, cast to
 * the Backstage `IconComponent` contract.
 */
export const defaultIconLinkProps: Omit<IconLinkProps, 'href' | 'text'> = {
  Icon: Globe as unknown as IconComponent,
};

/**
 * A compact icon + label link component used in scaffolder dry-run results.
 *
 * @remarks
 * Renders an inline flex row containing an optional icon followed by a
 * clickable link. Uses Tailwind CSS utility classes for layout instead
 * of MUI Grid, and the Backstage `Link` component for routing-aware
 * navigation.
 */
export const IconLink = (props: IconLinkProps) => {
  const { href, text, Icon, ...linkProps } = props;

  return (
    <div className={cn('flex flex-row items-center gap-2')}>
      <span
        className={cn(
          'inline-block',
          '[&_svg]:inline-block [&_svg]:text-[inherit] [&_svg]:align-baseline',
        )}
      >
        {Icon ? <Icon /> : <Globe />}
      </span>
      <span className="text-sm">
        <Link to={href} {...linkProps}>
          {text || href}
        </Link>
      </span>
    </div>
  );
};
