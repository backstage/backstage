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

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Chip from '@material-ui/core/Chip';
import React, { ReactNode } from 'react';
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
 * This card type has been deprecated. Instead use plain Material UI Card and helpers
 * where appropriate.
 *
 *  @example
 * ```
 *   <Card>
 *     <CardMedia>
 *       <ItemCardHeader title="My Card" subtitle="neat!" />
 *     </CardMedia>
 *     <CardContent>
 *        Some text
 *     </CardContent>
 *     <CardActions>
 *       <Button color="primary" to="https://backstage.io">
 *         Get Started
 *       </Button>
 *     </CardActions>
 *   </Card>
 * ```
 *
 * @deprecated Use plain Material UI `<Card>` and composable helpers instead.
 * @see https://v4.mui.com/components/cards/
 */
export function ItemCard(props: ItemCardProps) {
  const { description, tags, title, type, subtitle, label, onClick, href } =
    props;
  return (
    <Card>
      <CardMedia>
        <ItemCardHeader title={title} subtitle={subtitle || type} />
      </CardMedia>
      <CardContent>
        {tags?.length ? (
          <Box>
            {tags.map((tag, i) => (
              <Chip size="small" label={tag} key={i} />
            ))}
          </Box>
        ) : null}
        {description}
      </CardContent>
      <CardActions>
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
      </CardActions>
    </Card>
  );
}
