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

import { ReactNode } from 'react';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardFooter } from '../../components/ui/card';
import { LinkButton } from '../../components/LinkButton/LinkButton';
import { ItemCardHeader } from './ItemCardHeader';

type ItemCardProps = {
  description?: string;
  tags?: string[];
  title: string;
  /** @deprecated Use subtitle instead */
  type?: string;
  subtitle?: ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
};

/**
 * This card type has been deprecated. Instead use shadcn Card and composable helpers
 * where appropriate.
 *
 *  @example
 * ```
 *   <Card>
 *     <ItemCardHeader title="My Card" subtitle="neat!" />
 *     <CardContent>
 *        Some text
 *     </CardContent>
 *     <CardFooter>
 *       <Button variant="default" asChild>
 *         <a href="https://backstage.io">Get Started</a>
 *       </Button>
 *     </CardFooter>
 *   </Card>
 * ```
 *
 * @deprecated Use shadcn `<Card>` and composable helpers instead.
 */
export function ItemCard(props: ItemCardProps) {
  const { description, tags, title, type, subtitle, label, onClick, href } =
    props;
  return (
    <Card>
      <ItemCardHeader title={title} subtitle={subtitle || type} />
      <CardContent>
        {tags?.length ? (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.map((tag, i) => (
              <Badge variant="secondary" key={i}>
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
        {description}
      </CardContent>
      <CardFooter>
        {!href && (
          <LinkButton to="#" onClick={onClick} color="primary">
            {label}
          </LinkButton>
        )}
        {href && (
          <LinkButton to={href} color="primary">
            {label}
          </LinkButton>
        )}
      </CardFooter>
    </Card>
  );
}
