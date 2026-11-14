/*
 * Copyright 2021 The Backstage Authors
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

import { MarkdownContent } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { Card, CardBody, CardHeader, Text } from '@backstage/ui';

import { catalogImportTranslationRef } from '../../translation';

/**
 * Props for {@link PreviewPullRequestComponent}.
 *
 * @public
 */
export interface PreviewPullRequestComponentProps {
  title: string;
  description: string;
  classes?: { card?: string; cardContent?: string };
}

/**
 * Previews a pull request.
 *
 * @public
 */
export const PreviewPullRequestComponent = (
  props: PreviewPullRequestComponentProps,
) => {
  const { title, description, classes } = props;
  const { t } = useTranslationRef(catalogImportTranslationRef);
  return (
    <Card className={classes?.card}>
      <CardHeader>
        <Text as="h3" variant="title-small" weight="bold">
          {title}
        </Text>
        <Text as="p" variant="body-large" color="secondary">
          {t('stepPrepareCreatePullRequest.previewPr.subheader')}
        </Text>
      </CardHeader>
      <CardBody className={classes?.cardContent}>
        <MarkdownContent content={description} />
      </CardBody>
    </Card>
  );
};
