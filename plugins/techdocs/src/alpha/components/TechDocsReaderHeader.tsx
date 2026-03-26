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

import Helmet from 'react-helmet';
import { Header, ButtonLink } from '@backstage/ui';
import { RiCodeLine } from '@remixicon/react';
import { TechDocsAddonLocations as locations } from '@backstage/plugin-techdocs-react';
import { TechDocsReaderSearch } from './TechDocsReaderSearch';
import { useTechDocsReaderHeaderData } from '../../hooks/useTechDocsReaderHeaderData';

export type TechDocsReaderHeaderProps = {
  withSearch?: boolean;
};

export const TechDocsReaderHeader = (props: TechDocsReaderHeaderProps) => {
  const { withSearch = true } = props;
  const {
    title,
    entityRef,
    tabTitle,
    hidden,
    showSourceLink,
    sourceLink,
    addons,
  } = useTechDocsReaderHeaderData();

  if (hidden) return null;

  return (
    <>
      <Helmet titleTemplate="%s">
        <title>{tabTitle}</title>
      </Helmet>
      <Header
        title={title || ''}
        customActions={
          <>
            {withSearch && <TechDocsReaderSearch entityId={entityRef} />}
            {showSourceLink && (
              <ButtonLink
                href={sourceLink!}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="small"
                iconStart={<RiCodeLine />}
                aria-label="View source"
              />
            )}
            {addons.renderComponentsByLocation(locations.Header)}
          </>
        }
      />
    </>
  );
};
