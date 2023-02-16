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
  Chip,
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
  const [adrList, setAdrList] = useState<
    { name: string; title?: string; status?: string; date?: string }[]
  >([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const scmIntegrations = useApi(scmIntegrationsApiRef);
  const adrApi = useApi(adrApiRef);
  const entityHasAdrs = isAdrAvailable(entity);

  const { value, loading, error } = useAsync(async () => {
    const url = getAdrLocationUrl(entity, scmIntegrations);
    return adrApi.listAdrs(url);
  }, [entity, scmIntegrations]);

  const selectedAdr =
    adrList.find(adr => adr.name === searchParams.get('record'))?.name ?? '';
  useEffect(() => {
    if (adrList.length && !selectedAdr) {
      searchParams.set('record', adrList[0].name);
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
      .map(({ name, title, status, date }) => ({ name, title, status, date }));

    setAdrList(adrs);
  }, [filePathFilterFn, value]);

  const getChipColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'primary';
      case 'rejected' || 'deprecated':
        return 'secondary';
      default:
        return 'default';
    }
  };

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
                    to={`${rootLink()}?record=${adr.name}`}
                    selected={selectedAdr === adr.name}
                  >
                    <ListItemText
                      primaryTypographyProps={{
                        style: { whiteSpace: 'normal' },
                      }}
                      primary={adr.title ?? adr?.name.replace(/\.md$/, '')}
                      secondary={adr.date}
                    />
                    {adr.status && (
                      <Chip
                        label={adr.status}
                        size="small"
                        variant="outlined"
                        color={getChipColor(adr.status)}
                      />
                    )}
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
