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

import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Content,
  ContentHeader,
  MissingAnnotationEmptyState,
  Progress,
  SupportButton,
  WarningPanel,
} from '@backstage/core-components';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import { scmIntegrationsApiRef } from '@backstage/integration-react';
import {
  AdrFilePathFilterFn,
  ANNOTATION_ADR_LOCATION,
  getAdrLocationUrl,
  isAdrAvailable,
  madrFilePathFilter,
} from '@backstage/plugin-adr-common';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';

import { rootRouteRef } from '../../routes';
import { AdrContentDecorator, AdrReader } from '../AdrReader';
import { adrApiRef } from '../../api';
import useAsync from 'react-use/lib/useAsync';

const useStyles = makeStyles((theme: Theme) => ({
  adrMenu: {
    backgroundColor: theme.palette.background.paper,
  },
}));

/**
 * Component for browsing ADRs on an entity page.
 * @public
 */
export const EntityAdrContent = (props: {
  contentDecorators?: AdrContentDecorator[];
  filePathFilterFn?: AdrFilePathFilterFn;
}) => {
  const { contentDecorators, filePathFilterFn } = props;
  const classes = useStyles();
  const { entity } = useEntity();
  const rootLink = useRouteRef(rootRouteRef);
  const [adrList, setAdrList] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const scmIntegrations = useApi(scmIntegrationsApiRef);
  const adrApi = useApi(adrApiRef);
  const entityHasAdrs = isAdrAvailable(entity);

  const url = getAdrLocationUrl(entity, scmIntegrations);
  const { value, loading, error } = useAsync(
    async () => adrApi.listAdrs(url),
    [url],
  );

  const selectedAdr =
    adrList.find(adr => adr === searchParams.get('record')) ?? '';
  useEffect(() => {
    if (adrList.length && !selectedAdr) {
      searchParams.set('record', adrList[0]);
      setSearchParams(searchParams, { replace: true });
    }
  });

  useEffect(() => {
    if (!value?.data) {
      return;
    }

    const adrs = value.data
      .filter(
        (item: { type: string; name: string }) =>
          item.type === 'file' &&
          (filePathFilterFn
            ? filePathFilterFn(item.name)
            : madrFilePathFilter(item.name)),
      )
      .map(({ name }: { name: string }) => name);

    setAdrList(adrs);
  }, [filePathFilterFn, value]);

  return (
    <Content>
      <ContentHeader title="Architecture Decision Records">
        <SupportButton />
      </ContentHeader>

      {!entityHasAdrs && (
        <MissingAnnotationEmptyState annotation={ANNOTATION_ADR_LOCATION} />
      )}

      {loading && <Progress />}

      {entityHasAdrs && !loading && error && (
        <WarningPanel title="Failed to fetch ADRs" message={error?.message} />
      )}

      {entityHasAdrs &&
        !loading &&
        !error &&
        (adrList.length ? (
          <Grid container direction="row">
            <Grid item xs={3}>
              <List className={classes.adrMenu} dense>
                {adrList.map((adr, idx) => (
                  <ListItem
                    key={idx}
                    button
                    component={Link}
                    to={`${rootLink()}?record=${adr}`}
                    selected={selectedAdr === adr}
                  >
                    <ListItemText
                      secondaryTypographyProps={{ noWrap: true }}
                      secondary={adr.replace(/\.md$/, '')}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={9}>
              <AdrReader adr={selectedAdr} decorators={contentDecorators} />
            </Grid>
          </Grid>
        ) : (
          <Typography>No ADRs found</Typography>
        ))}
    </Content>
  );
};
