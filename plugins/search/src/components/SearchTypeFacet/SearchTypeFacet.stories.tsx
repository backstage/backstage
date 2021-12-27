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
import React, { useState } from 'react';
import CatalogIcon from '@material-ui/icons/MenuBook';
import DocsIcon from '@material-ui/icons/Description';

import { SearchTypeFacet } from '../index';
import { SearchContext } from '../SearchContext';

export default {
  title: 'Plugins/Search/SearchTypeFacet',
  component: SearchTypeFacet,
};

export const Default = () => {
  const [types, setTypes] = useState<string[]>([]);

  return (
    <SearchContext.Provider
      value={{ types, setTypes, setPageCursor: () => {} } as any}
    >
      <SearchTypeFacet
        name="Result Type"
        defaultValue="software-catalog"
        types={[
          {
            value: 'software-catalog',
            name: 'Software Catalog',
            icon: <CatalogIcon />,
          },
          { value: 'techdocs', name: 'Documentation', icon: <DocsIcon /> },
        ]}
      />
    </SearchContext.Provider>
  );
};
