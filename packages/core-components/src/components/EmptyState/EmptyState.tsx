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

import { cn } from '../../lib/utils';
import { EmptyStateImage } from './EmptyStateImage';

/** @public */
export type EmptyStateClassKey = 'root' | 'action' | 'imageContainer';

type Props = {
  title: string;
  description?: string | JSX.Element;
  missing: 'field' | 'info' | 'content' | 'data' | { customImage: JSX.Element };
  action?: JSX.Element;
};

/**
 * Various placeholder views for empty state pages
 *
 * @public
 *
 */
export function EmptyState(props: Props) {
  const { title, description, missing, action } = props;
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 gap-4 items-start justify-around',
        'bg-background pt-4',
      )}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description && (
          <p className="text-base text-muted-foreground">{description}</p>
        )}
        {action && <div className="mt-4">{action}</div>}
      </div>
      <div className="relative">
        {typeof missing === 'string' ? (
          <EmptyStateImage missing={missing} />
        ) : (
          missing.customImage
        )}
      </div>
    </div>
  );
}
