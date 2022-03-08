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

import React, { PropsWithChildren } from 'react';
import { Grid, makeStyles } from '@material-ui/core';

import { BackstageTheme } from '@backstage/theme';
import { CompoundEntityRef } from '@backstage/catalog-model';
import { TechDocsReaderContent } from '@backstage/plugin-techdocs-mkdocs';

import { TechDocsSearch } from '../../../search';

import { EntityDocsProvider } from '../TechDocsEntityDocs';
import { EntityDocsSyncProvider } from '../TechDocsEntityDocsSync';
import { TechDocsStateIndicator } from '../TechDocsStateIndicator';
import { TechDocsNotFound } from '../TechDocsNotFound';

import { useTechDocsReader, TechDocsReaderProvider } from './context';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  searchBar: {
    maxWidth: 'calc(100% - 16rem * 2 - 2.4rem)',
    marginTop: 0,
    marginBottom: theme.spacing(1),
    marginLeft: 'calc(16rem + 1.2rem)',
    '@media screen and (max-width: 76.1875em)': {
      marginLeft: '0',
      maxWidth: '100%',
    },
  },
}));

type TechDocsReaderPageProps = PropsWithChildren<{
  withSearch?: boolean;
}>;

const TechDocsReaderPage = ({
  withSearch = true,
  children = <TechDocsReaderContent />,
}: TechDocsReaderPageProps) => {
  const classes = useStyles();
  const { entityRef, contentErrorMessage } = useTechDocsReader();

  return (
    <Grid container>
      <Grid xs={12} item>
        <TechDocsStateIndicator />
      </Grid>
      {withSearch && (
        <Grid className={classes.searchBar} xs={12} item>
          <TechDocsSearch entityId={entityRef} />
        </Grid>
      )}
      <Grid xs={12} item>
        {contentErrorMessage ? (
          <TechDocsNotFound errorMessage={contentErrorMessage} />
        ) : (
          children
        )}
      </Grid>
    </Grid>
  );
};

/**
 * Props for {@link Reader}
 *
 * @public
 */
export type ReaderProps = PropsWithChildren<{
  entityRef: CompoundEntityRef;
  withSearch?: boolean;
  onReady?: () => void;
}>;

/**
 * Component responsible for rendering TechDocs documentation
 *
 * @public
 */
export const Reader = (props: ReaderProps) => {
  const { entityRef, onReady, ...rest } = props;
  return (
    <EntityDocsProvider entityRef={entityRef}>
      <EntityDocsSyncProvider entityRef={entityRef}>
        <TechDocsReaderProvider entityRef={entityRef} onReady={onReady}>
          <TechDocsReaderPage {...rest} />
        </TechDocsReaderProvider>
      </EntityDocsSyncProvider>
    </EntityDocsProvider>
  );
};
