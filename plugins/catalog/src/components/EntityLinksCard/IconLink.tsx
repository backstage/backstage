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

import { Globe } from 'lucide-react';
import { IconComponent } from '@backstage/core-plugin-api';

export function IconLink(props: {
  href: string;
  text?: string;
  Icon?: IconComponent;
}) {
  const { href, text, Icon } = props;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 hover:border-foreground hover:bg-accent w-full text-foreground"
    >
      <span className="text-muted-foreground group-hover:text-foreground">
        {Icon ? <Icon /> : <Globe />}
      </span>
      <span className="truncate flex-1">{text ?? href}</span>
    </a>
  );
}
