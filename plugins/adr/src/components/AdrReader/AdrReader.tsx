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

const imageUrlsRegExp =
  /(!\[[^\[\]]*\])\((https?:\/\/.*?\.png|\.jpg|\.jpeg|\.gif|\.webp.*)\)/gim;
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

  const adrFileLocationUrl = getAdrLocationUrl(entity, scmIntegrations, adr);

  const { value, loading, error } = useAsync(
    async () => adrApi.readAdr(adrFileLocationUrl),
    [adrFileLocationUrl],
  );

  const adrElements = useMemo(() => {
    const elements: { reducedAdrContent: string; imageUrls: string[] } = {
      reducedAdrContent: '',
      imageUrls: [],
    };
    if (!value?.data) {
      return elements;
    }
    const adrDecorators = decorators ?? [
      adrDecoratorFactories.createRewriteRelativeLinksDecorator(),
      adrDecoratorFactories.createRewriteRelativeEmbedsDecorator(),
      adrDecoratorFactories.createFrontMatterFormatterDecorator(),
    ];

    elements.reducedAdrContent = adrDecorators.reduce(
      (content, decorator) =>
        decorator({ baseUrl: adrLocationUrl, content }).content,
      value.data,
    );
    let imageUrlsArray = imageUrlsRegExp.exec(elements.reducedAdrContent);
    while (imageUrlsArray !== null) {
      elements.imageUrls.push(imageUrlsArray[2]);
      imageUrlsArray = imageUrlsRegExp.exec(elements.reducedAdrContent);
    }

    return elements;
  }, [adrLocationUrl, decorators, value]);

  const {
    value: adrImagesBase64,
    loading: adrImagesBase64Loading,
    error: adrImagesBase64Error,
  } = useAsync(async () => {
    if (!adrElements?.imageUrls) {
      return [];
    }
    const adrBase64Images = adrElements.imageUrls.map(imageUrl => {
      return adrApi.imageAdr(imageUrl);
    });
    return await Promise.all(adrBase64Images);
  }, [adrElements.imageUrls]);

  const adrContent = useMemo(() => {
    if (typeof adrImagesBase64 === 'undefined') {
      return '';
    }
    let imageIterator = -1;
    return adrElements.reducedAdrContent.replace(imageUrlsRegExp, (_, p1) => {
      imageIterator += 1;
      return `${p1}(${adrImagesBase64[imageIterator]?.data})`;
    });
  }, [adrImagesBase64, adrElements.reducedAdrContent]);

  return (
    <InfoCard>
      {loading && adrImagesBase64Loading && <Progress />}

      {!loading && error && (
        <WarningPanel title="Failed to fetch ADR" message={error?.message} />
      )}

      {!adrImagesBase64Loading && adrImagesBase64Error && (
        <WarningPanel
          title="Failed to fetch ADR images"
          message={adrImagesBase64Error?.message}
        />
      )}

      {!loading &&
        !adrImagesBase64Loading &&
        !error &&
        !adrImagesBase64Error &&
        value?.data && (
          <MarkdownContent content={adrContent} linkTarget="_blank" />
        )}
    </InfoCard>
  );
};

AdrReader.decorators = adrDecoratorFactories;
