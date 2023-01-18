/*
 * Copyright 2022 The Backstage Authors
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

import React, { useMemo } from 'react';
import {
  InfoCard,
  MarkdownContent,
  Progress,
  WarningPanel,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { scmIntegrationsApiRef } from '@backstage/integration-react';
import { getAdrLocationUrl } from '@backstage/plugin-adr-common';
import { useEntity } from '@backstage/plugin-catalog-react';

import { adrDecoratorFactories } from './decorators';
import { AdrContentDecorator } from './types';
import { adrApiRef } from '../../api';
import useAsync from 'react-use/lib/useAsync';

/**
 * Component to fetch and render an ADR.
 *
 * @public
 */
export const AdrReader = (props: {
  adr: string;
  decorators?: AdrContentDecorator[];
}) => {
  const { adr, decorators } = props;
  const { entity } = useEntity();
  const scmIntegrations = useApi(scmIntegrationsApiRef);
  const adrApi = useApi(adrApiRef);
  const adrLocationUrl = getAdrLocationUrl(entity, scmIntegrations);

  const url = `${adrLocationUrl.replace(/\/$/, '')}/${adr}`;
  const { value, loading, error } = useAsync(
    async () => adrApi.readAdr(url),
    [url],
  );

  const adrContent = useMemo(() => {
    if (!value?.data) {
      return '';
    }
    const adrDecorators = decorators ?? [
      adrDecoratorFactories.createRewriteRelativeLinksDecorator(),
      adrDecoratorFactories.createRewriteRelativeEmbedsDecorator(),
    ];

    return adrDecorators.reduce(
      (content, decorator) =>
        decorator({ baseUrl: adrLocationUrl, content }).content,
      value.data,
    );
  }, [adrLocationUrl, decorators, value]);

  return (
    <InfoCard>
      {loading && <Progress />}

      {!loading && error && (
        <WarningPanel title="Failed to fetch ADR" message={error?.message} />
      )}

      {!loading && !error && value?.data && (
        <MarkdownContent content={adrContent} linkTarget="_blank" />
      )}
    </InfoCard>
  );
};

AdrReader.decorators = adrDecoratorFactories;
