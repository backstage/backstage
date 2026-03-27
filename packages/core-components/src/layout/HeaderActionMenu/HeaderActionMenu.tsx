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

import { MouseEvent, ReactElement, ReactNode } from 'react';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../../components/ui/dropdown-menu';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';

/**
 * @public
 */
export type HeaderActionMenuItem = {
  label?: ReactNode;
  secondaryLabel?: ReactNode;
  icon?: ReactElement;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};

const ActionItem = ({
  label,
  secondaryLabel,
  icon,
  disabled = false,
  onClick,
}: HeaderActionMenuItem) => {
  return (
    <DropdownMenuItem
      data-testid="header-action-item"
      disabled={disabled}
      onSelect={event => {
        // Prevent menu from closing on click to match original behavior
        event.preventDefault();
        if (onClick) {
          /* Radix onSelect provides a native Event; the legacy prop expects
             React.MouseEvent<HTMLElement>. Create a minimal adapter that
             satisfies the caller rather than an unsafe double-cast. */
          const syntheticEvent = {
            ...event,
            currentTarget: event.currentTarget as HTMLElement,
            target: event.target as HTMLElement,
          } as unknown as MouseEvent<HTMLElement>;
          onClick(syntheticEvent);
        }
      }}
      className={cn(
        'flex items-center gap-2 px-4 py-2 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      {icon && (
        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
          {icon}
        </span>
      )}
      <div className="flex flex-col">
        {label && <span className="text-sm">{label}</span>}
        {secondaryLabel && (
          <span className="text-xs text-muted-foreground">
            {secondaryLabel}
          </span>
        )}
      </div>
    </DropdownMenuItem>
  );
};

/**
 * @public
 */
export type HeaderActionMenuProps = {
  actionItems: HeaderActionMenuItem[];
};

/**
 * @public
 */
export function HeaderActionMenu(props: HeaderActionMenuProps) {
  const { actionItems } = props;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          data-testid="header-action-menu"
          className={cn(
            'text-inherit h-14 w-14 -mr-1 p-0',
            'hover:bg-white/10 focus-visible:ring-white/50',
          )}
        >
          <MoreVertical className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        {actionItems.map((actionItem, i) => (
          <ActionItem key={`header-action-menu-${i}`} {...actionItem} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
