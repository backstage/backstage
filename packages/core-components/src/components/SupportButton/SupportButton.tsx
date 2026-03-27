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

import { configApiRef, useApi, useApp } from '@backstage/core-plugin-api';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Button } from '../ui/button';
import { HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import React, { type ReactNode, Children, useState } from 'react';
import { SupportItem, SupportItemLink, useSupportConfig } from '../../hooks';
import { Link } from '../Link';
import { coreComponentsTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

type SupportButtonProps = {
  title?: string;
  items?: SupportItem[];
  children?: ReactNode;
};

/** @public */
export type SupportButtonClassKey = 'popoverList';

/**
 * Renders the appropriate icon for a support item.
 * Falls back to HelpCircle (lucide-react) when no system icon is found.
 */
const SupportIcon = ({ icon }: { icon: string | undefined }) => {
  const app = useApp();
  const Icon = icon ? app.getSystemIcon(icon) ?? HelpCircle : HelpCircle;
  return <Icon className="h-4 w-4" />;
};

/** Renders a support link using the Backstage Link component. */
const SupportLink = ({ link }: { link: SupportItemLink }) => (
  <Link to={link.url}>{link.title ?? link.url}</Link>
);

/**
 * Renders a single support list item with icon, title, and links.
 * Replaces MUI MenuItem + ListItemIcon + ListItemText with
 * Tailwind-styled flex layout for consistent spacing and alignment.
 */
const SupportListItem = ({ item }: { item: SupportItem }) => {
  return (
    <div className={cn('flex items-start gap-3 px-3 py-2 whitespace-normal')}>
      <span className="mt-0.5 shrink-0 text-muted-foreground">
        <SupportIcon icon={item.icon} />
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{item.title}</span>
        <span className="text-sm text-muted-foreground">
          {item.links?.reduce<React.ReactNode[]>(
            (prev, link, idx) => [
              ...prev,
              idx > 0 && <br key={idx} />,
              <SupportLink link={link} key={link.url} />,
            ],
            [],
          )}
        </span>
      </div>
    </div>
  );
};

/**
 * Support button component providing contextual help via a popover panel.
 * Displays support links and custom content sourced from app configuration
 * (`app.support` config key) or passed directly via props.
 *
 * @remarks
 * Migrated from MUI Popover / IconButton / Button / MenuList / MenuItem to
 * shadcn/ui Popover (Radix UI) + Button with Tailwind CSS styling.
 *
 * Responsive behavior:
 * - Small screens: compact button showing icon only
 * - Medium+ screens: button with icon and translated title text
 *
 * Uses a single PopoverTrigger with a responsive `<span>` for the title
 * text, ensuring exactly one `data-testid="support-button"` element in the
 * DOM for test compatibility.
 *
 * @public
 */
export function SupportButton(props: SupportButtonProps) {
  const { t } = useTranslationRef(coreComponentsTranslationRef);
  const { title, items, children } = props;
  const { items: configItems } = useSupportConfig();

  const [popoverOpen, setPopoverOpen] = useState(false);
  const supportConfig = useApi(configApiRef).getOptionalConfig('app.support');

  if (!supportConfig) {
    return null;
  }

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <div className={cn('flex ml-1')}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            data-testid="support-button"
            aria-label="Support"
          >
            <HelpCircle />
            <span className="hidden md:inline">{t('supportButton.title')}</span>
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent
        data-testid="support-button-popover"
        align="end"
        className={cn('min-w-[260px] max-w-[400px] p-0')}
      >
        <div className="flex flex-col">
          {title && (
            <div className="px-3 py-2 whitespace-normal">
              <span className="text-sm font-semibold">{title}</span>
            </div>
          )}
          {Children.map(children, (child, i) => (
            <div key={`child-${i}`} className="px-3 py-2 whitespace-normal">
              {child}
            </div>
          ))}
          {(items ?? configItems).map((item, i) => (
            <SupportListItem item={item} key={`item-${i}`} />
          ))}
        </div>
        <div className={cn('flex justify-end p-2 border-t border-border')}>
          <Button
            variant="ghost"
            onClick={() => setPopoverOpen(false)}
            aria-label="Close"
          >
            {t('supportButton.close')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
