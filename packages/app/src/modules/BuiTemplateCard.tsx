/*
 * Copyright 2026 The Backstage Authors
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

import { useMemo } from 'react';
import { RELATION_OWNED_BY } from '@backstage/catalog-model';
import { useAnalytics } from '@backstage/frontend-plugin-api';
import {
  EntityRefLink,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import {
  Box,
  Button,
  Card,
  CardFooter,
  CardHeader,
  Flex,
  Tag,
  TagGroup,
  Text,
} from '@backstage/ui';
import type { TemplateCardComponentProps } from '@backstage/plugin-scaffolder-react/alpha';
import styles from './BuiTemplateCard.module.css';

const MAX_TAGS = 4;

export function BuiTemplateCard(props: TemplateCardComponentProps) {
  const { template, onSelected } = props;
  const analytics = useAnalytics();

  const {
    spec: { type },
    metadata: { tags, description, name, title },
  } = template;

  const visibleTags = useMemo(
    () =>
      Array.from(new Set([type, ...(tags ?? [])].filter(Boolean))).slice(
        0,
        MAX_TAGS,
      ),
    [type, tags],
  );

  const owner = getEntityRelations(template, RELATION_OWNED_BY)[0];

  const handleRun = () => {
    analytics.captureEvent('click', 'Template has been opened');
    onSelected?.();
  };

  return (
    <Card className={styles.templateCard}>
      <CardHeader>
        <Text
          as="h3"
          variant="body-medium"
          weight="bold"
          color="primary"
          className={styles.templateName}
        >
          {title ?? name}
        </Text>
      </CardHeader>
      <Box px="3" className={styles.templateBody}>
        {description && (
          <Text
            as="p"
            variant="body-small"
            color="secondary"
            className={styles.templateDescription}
          >
            {description}
          </Text>
        )}
        {visibleTags.length > 0 && (
          <TagGroup>
            {visibleTags.map(t => (
              <Tag key={t}>{t!}</Tag>
            ))}
          </TagGroup>
        )}
      </Box>
      <CardFooter>
        <Flex justify="between" align="end">
          <Button size="small" variant="secondary" onPress={handleRun}>
            Run
          </Button>
          {owner && (
            <Flex gap="0" direction="column" align="end">
              <Text variant="body-x-small" color="secondary">
                Created by
              </Text>
              <Text variant="body-x-small" color="primary">
                <EntityRefLink entityRef={owner} hideIcon />
              </Text>
            </Flex>
          )}
        </Flex>
      </CardFooter>
    </Card>
  );
}
