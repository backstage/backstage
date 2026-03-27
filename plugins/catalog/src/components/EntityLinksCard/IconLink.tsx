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
import { Link } from '@backstage/core-components';
import { IconComponent } from '@backstage/core-plugin-api';

export function IconLink(props: {
  href: string;
  text?: string;
  Icon?: IconComponent;
}) {
  const { href, text, Icon } = props;

  return (
    <div className="flex items-start gap-2">
      <div className="inline-flex shrink-0 [&_svg]:inline-block [&_svg]:text-[inherit] [&_svg]:align-baseline">
        <div>{Icon ? <Icon /> : <Globe />}</div>
      </div>
      <div className="min-w-0 flex-1">
        <Link to={href} target="_blank" rel="noopener">
          {text || href}
        </Link>
      </div>
    </div>
  );
}
