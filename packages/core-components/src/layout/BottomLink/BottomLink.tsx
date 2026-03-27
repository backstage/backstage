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

import { ArrowRight } from 'lucide-react';
import { MouseEvent } from 'react';
import { Link } from '../../components/Link';
import { cn } from '../../lib/utils';
import { Separator } from '../../components/ui/separator';

/** @public */
export type BottomLinkClassKey = 'root' | 'boxTitle' | 'arrow';

/** @public */
export type BottomLinkProps = {
  link: string;
  title: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

/**
 * Footer with link used in  {@link InfoCard } and {@link TabbedCard}
 *
 * @public
 *
 */
export function BottomLink(props: BottomLinkProps) {
  const { link, title, onClick } = props;

  return (
    <div>
      <Separator />
      <Link
        to={link}
        onClick={onClick}
        className={cn('no-underline hover:no-underline')}
      >
        <div className={cn('flex items-center w-fit py-4 pr-4 pl-5')}>
          <div className={cn('m-2 text-muted-foreground')}>
            <strong>{title}</strong>
          </div>
          <ArrowRight className={cn('text-muted-foreground')} size={20} />
        </div>
      </Link>
    </div>
  );
}
