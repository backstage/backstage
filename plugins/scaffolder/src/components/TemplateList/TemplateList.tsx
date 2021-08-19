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

import React from 'react';
import { TemplateEntityV1beta2 } from '@backstage/catalog-model';
import {
  ItemCardGrid,
  Progress,
  WarningPanel,
} from '@backstage/core-components';
import { useEntityListProvider } from '@backstage/plugin-catalog-react';
import { Link, Typography } from '@material-ui/core';
import { TemplateCard, TemplateCardProps } from '../TemplateCard';

export type Props = TemplateCardProps;

export type TemplateListProps = {
  TemplateCardComponent?: (props: Props) => JSX.Element | null;
};

export const TemplateList = ({ TemplateCardComponent }: TemplateListProps) => {
  const { loading, error, entities } = useEntityListProvider();
  return (
    <>
      {loading && <Progress />}

      {error && (
        <WarningPanel title="Oops! Something went wrong loading the templates">
          {error.message}
        </WarningPanel>
      )}

      {!error && !loading && !entities.length && (
        <Typography variant="body2">
          No templates found that match your filter. Learn more about{' '}
          <Link href="https://backstage.io/docs/features/software-templates/adding-templates">
            adding templates
          </Link>
          .
        </Typography>
      )}

      <ItemCardGrid>
        {entities &&
          entities?.length > 0 &&
          entities.map((template, i) =>
            TemplateCardComponent ? (
              <TemplateCardComponent
                key={i}
                template={template as TemplateEntityV1beta2}
              />
            ) : (
              <TemplateCard
                key={i}
                template={template as TemplateEntityV1beta2}
              />
            ),
          )}
      </ItemCardGrid>
    </>
  );
};
