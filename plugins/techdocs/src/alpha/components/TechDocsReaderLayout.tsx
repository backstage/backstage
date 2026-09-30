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

import { Container } from '@backstage/ui';
import { TechDocsReaderHeader } from './TechDocsReaderHeader';
import { TechDocsReaderEntityCard } from './TechDocsReaderEntityCard';
import { TechDocsReaderPageSubheader } from '../../reader/components/TechDocsReaderPageSubheader';
import { TechDocsReaderContent } from './TechDocsReaderContent';

export type TechDocsReaderLayoutProps = {
  /** Show or hide the reader header, defaults to true. */
  withHeader?: boolean;
  /** Show or hide the documentation search, defaults to true. */
  withSearch?: boolean;
  withFeedbackLink?: boolean;
  /** The documentation path to navigate to on the initial render. */
  defaultPath?: string;
  /** Maps documentation search result URLs before navigating to them. */
  searchResultUrlMapper?: (url: string) => string;
};

export const TechDocsReaderLayout = (props: TechDocsReaderLayoutProps) => {
  const { withSearch = true, withHeader = true, withFeedbackLink } = props;
  return (
    <>
      {withHeader && (
        <TechDocsReaderHeader
          withSearch={withSearch}
          searchResultUrlMapper={props.searchResultUrlMapper}
        />
      )}
      <Container mt="6">
        <TechDocsReaderEntityCard
          withSearch={!withHeader && withSearch}
          searchResultUrlMapper={props.searchResultUrlMapper}
        />
        <TechDocsReaderPageSubheader />
        <TechDocsReaderContent
          defaultPath={props.defaultPath}
          withFeedbackLink={withFeedbackLink}
        />
      </Container>
    </>
  );
};
