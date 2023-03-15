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
import useAsync from 'react-use/lib/useAsync';

import groupBy from 'lodash/groupBy';

import {
  Content,
  ContentHeader,
  InfoCard,
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
  Box,
  Chip,
  Collapse,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import FolderIcon from '@material-ui/icons/Folder';

import { adrApiRef, AdrFileInfo } from '../../api';
import { rootRouteRef } from '../../routes';
import { AdrContentDecorator, AdrReader } from '../AdrReader';

const useStyles = makeStyles((theme: Theme) => ({
  adrMenu: {
    backgroundColor: theme.palette.background.paper,
  },
  adrContainerTitle: {
    color: theme.palette.grey[700],
    marginBottom: theme.spacing(1),
  },
  adrChip: {
    position: 'absolute',
    right: 0,
  },
}));

const AdrListContainer = (props: {
  adrs: AdrFileInfo[];
  selectedAdr: string;
  title: string;
}) => {
  const { adrs, selectedAdr, title } = props;
  const classes = useStyles();
  const rootLink = useRouteRef(rootRouteRef);
  const [open, setOpen] = React.useState(true);

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

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      {title && (
        <ListItem
          button
          className={classes.adrContainerTitle}
          onClick={handleClick}
        >
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary={title} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
      )}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List dense>
          {adrs.map((adr, idx) => (
            <ListItem
              button
              component={Link}
              key={idx}
              selected={selectedAdr === adr.path}
              to={`${rootLink()}?record=${adr.path}`}
            >
              <ListItemText
                primary={adr.title ?? adr?.name.replace(/\.md$/, '')}
                primaryTypographyProps={{
                  style: { whiteSpace: 'normal' },
                }}
                secondary={
                  <Box>
                    {adr.date}
                    {adr.status && (
                      <Chip
                        color={getChipColor(adr.status)}
                        label={adr.status}
                        size="small"
                        variant="outlined"
                        className={classes.adrChip}
                      />
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );
};

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
  const [adrList, setAdrList] = useState<AdrFileInfo[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const scmIntegrations = useApi(scmIntegrationsApiRef);
  const adrApi = useApi(adrApiRef);
  const entityHasAdrs = isAdrAvailable(entity);

  const { value, loading, error } = useAsync(async () => {
    const url = getAdrLocationUrl(entity, scmIntegrations);
    return adrApi.listAdrs(url);
  }, [entity, scmIntegrations]);

  const selectedAdr =
    adrList.find(adr => adr.path === searchParams.get('record'))?.path ?? '';

  const adrSubDirectoryFunc = (adr: AdrFileInfo) => {
    return adr.path.split('/').slice(0, -1).join('/');
  };

  useEffect(() => {
    if (adrList.length && !selectedAdr) {
      searchParams.set('record', adrList[0].path);
      setSearchParams(searchParams, { replace: true });
    }
  });

  useEffect(() => {
    if (!value?.data) {
      return;
    }

    const adrs: AdrFileInfo[] = value.data.filter(
      (item: AdrFileInfo) =>
        item.type === 'file' &&
        (filePathFilterFn
          ? filePathFilterFn(item.path)
          : madrFilePathFilter(item.path)),
    );

    setAdrList(adrs);
  }, [filePathFilterFn, value]);

  const adrListGrouped = Object.entries(
    groupBy(adrList, adrSubDirectoryFunc),
  ).sort();

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
              <InfoCard>
                <List className={classes.adrMenu} dense>
                  {adrListGrouped.map(([title, adrs], idx) => (
                    <AdrListContainer
                      adrs={adrs}
                      key={idx}
                      selectedAdr={selectedAdr}
                      title={title}
                    />
                  ))}
                </List>
              </InfoCard>
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
