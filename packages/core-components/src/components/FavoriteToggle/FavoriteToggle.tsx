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
import { Star } from 'lucide-react';
import { Button, type ButtonProps } from '../ui/button';
import {
  ShadcnTooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '../ui/tooltip';
import { cn } from '../../lib/utils';

/**
 * @public
 */
export type FavoriteToggleIconClassKey = 'icon' | 'iconBorder';

/**
 * Icon used in FavoriteToggle component.
 *
 * Can be used independently, useful when used as an action in data tables.
 *
 * @public
 */
export function FavoriteToggleIcon(props: { isFavorite: boolean }) {
  const { isFavorite } = props;
  return (
    <span
      className={cn(
        'inline-flex cursor-pointer',
        isFavorite ? 'text-[#f3ba37]' : 'text-inherit',
      )}
    >
      <Star
        className={cn('h-5 w-5', isFavorite ? 'fill-current' : 'fill-none')}
      />
    </span>
  );
}

/**
 * Props for the {@link FavoriteToggle} component.
 *
 * @public
 */
export type FavoriteToggleProps = ButtonProps & {
  id: string;
  title: string;
  isFavorite: boolean;
  onToggle: (value: boolean) => void;
};

/**
 * Toggle encapsulating logic for marking something as favorite,
 * primarily used in various instances of entity lists and cards but can be used elsewhere.
 *
 * This component can only be used in as a controlled toggle and does not keep internal state.
 *
 * @public
 */
export function FavoriteToggle(props: FavoriteToggleProps) {
  const {
    id,
    title,
    isFavorite: value,
    onToggle: onChange,
    ...buttonProps
  } = props;
  return (
    <TooltipProvider>
      <ShadcnTooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={title}
            id={id}
            onClick={() => onChange(!value)}
            {...buttonProps}
          >
            <FavoriteToggleIcon isFavorite={value} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{title}</TooltipContent>
      </ShadcnTooltip>
    </TooltipProvider>
  );
}
