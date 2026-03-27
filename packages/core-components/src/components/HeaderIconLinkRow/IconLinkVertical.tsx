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
import { ReactNode, MouseEventHandler } from 'react';
import { cn } from '../../lib/utils';
import { Link2 as LinkIcon } from 'lucide-react';
import { Link } from '../Link';

export type IconLinkVerticalProps = {
  color?: 'primary' | 'secondary';
  disabled?: boolean;
  href?: string;
  icon?: ReactNode;
  label: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  title?: string;
};

/** @public */
export type IconLinkVerticalClassKey =
  | 'link'
  | 'disabled'
  | 'primary'
  | 'secondary'
  | 'label';

/** @public */
export function IconLinkVertical({
  color = 'primary',
  disabled = false,
  href = '#',
  icon = <LinkIcon />,
  label,
  onClick,
  title,
}: IconLinkVerticalProps) {
  if (disabled) {
    return (
      <div
        title={title}
        className={cn(
          'grid justify-items-center gap-1 text-center',
          'text-muted-foreground cursor-default',
        )}
      >
        {icon}
        <span className="uppercase font-bold tracking-wider text-xs">
          {label}
        </span>
      </div>
    );
  }

  return (
    <Link
      title={title}
      className={cn(
        'grid justify-items-center gap-1 text-center no-underline',
        color === 'primary' ? 'text-primary' : 'text-secondary-foreground',
      )}
      to={href}
      onClick={onClick}
    >
      {icon}
      <span className="uppercase font-bold tracking-wider text-xs">
        {label}
      </span>
    </Link>
  );
}
