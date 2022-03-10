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
import {
  EntityTagFilter,
  // EntityTextFilter,
  useEntityList,
  useStarredEntities,
} from '@backstage/plugin-catalog-react';
import { capitalize } from 'lodash';
import React, { useState } from 'react';
import { CatalogGridItem } from './types';
import {
  ContentHeader,
  InfoCard,
  Progress,
  Content,
} from '@backstage/core-components';
import {
  Grid,
  Typography,
  IconButton,
  TablePagination,
  makeStyles,
  Chip,
  FormControl,
  InputLabel,
  Input,
} from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import { useDefaultCatalogTableActions } from '../defaultActions';
import { CatalogError } from '../CatalogError';
import { entityTransformer } from '../CatalogTable/CatalogTable';
import { Entity } from '@backstage/catalog-model';
import { CardTitle, CardTitleOptions } from './CardTitle';
import { CatalogGridAction, GridActions } from './GridActions';

const useCatalogGridStyles = makeStyles({
  card: {
    height: '100%',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  description: {
    minHeight: '3rem',
  },
});

export interface CatalogGridProps<T extends CatalogGridItem> {
  actions?: CatalogGridAction<T>[];
  options?: CardTitleOptions;
}

/** @public */
export function CatalogGrid<T extends CatalogGridItem>(
  props: CatalogGridProps<T>,
) {
  const classes = useCatalogGridStyles();
  const { actions } = props;
  const { isStarredEntity, toggleStarredEntity } = useStarredEntities();
  const { updateFilters, loading, error, entities, filters } = useEntityList();
  const { defaultActions } = useDefaultCatalogTableActions<CatalogGridItem>({
    isStarredEntity,
    toggleStarredEntity,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [textFilter, setTextFilter] = useState('');
  const titlePreamble = capitalize(filters.user?.value ?? 'all');

  if (error) {
    return <CatalogError error={error} />;
  }
  if (loading) {
    return <Progress />;
  }

  const textFilteredEntities = entities.filter(
    entity =>
      !textFilter ||
      textFilter === '' ||
      entity?.metadata?.name
        ?.toLocaleLowerCase()
        .includes(textFilter?.toLocaleLowerCase()),
  );

  const showPagination =
    props.options?.alwaysShowPagination ||
    textFilteredEntities.length > rowsPerPage;

  const rows = textFilteredEntities
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map(entityTransformer);

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const subheaderForEntity = (entity: Entity) => {
    if (!entity) return null;
    const subheading: string[] = [];
    if (entity.spec) {
      if (entity.spec.type) subheading.push(entity.spec.type.toString());
      if (entity.spec.lifecycle) subheading.push(`(${entity.spec.lifecycle})`);
    }
    if (!subheading.length) return null;
    return subheading.filter(it => it && it.length).join(' ');
  };

  return (
    <Content className="grid-view">
      <ContentHeader
        title={`${titlePreamble} (${textFilteredEntities.length})`}
      >
        <Grid container spacing={1} alignItems="flex-end">
          <Grid item>
            <FilterListIcon />
          </Grid>
          <Grid item>
            <FormControl>
              <InputLabel htmlFor="search-filter">Filter</InputLabel>
              <Input
                id="search-filter"
                type="search"
                value={filters?.text?.value}
                // onChange={e => updateFilters({ text: new EntityTextFilter(e.target.value) })}
                onChange={e => setTextFilter(e.target.value)}
              />
            </FormControl>
          </Grid>
        </Grid>
      </ContentHeader>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
      >
        {rows.map((row, i) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={row.entity.metadata.uid ?? `entity-${i}`}
          >
            <InfoCard
              title={<CardTitle entity={row.entity} options={props.options} />}
              subheader={subheaderForEntity(row.entity)}
              actions={
                <GridActions actions={actions || defaultActions} row={row} />
              }
              className={classes.card}
              cardClassName={classes.cardContent}
            >
              <Typography className={classes.description}>
                {row?.entity?.metadata?.description}
              </Typography>

              {row.entity?.metadata?.tags && (
                <Grid>
                  {(row.entity?.metadata?.tags || []).map(t => (
                    <Chip
                      key={t}
                      size="small"
                      label={t}
                      onClick={() =>
                        updateFilters({
                          tags: new EntityTagFilter([
                            ...new Set(
                              filters.tags?.values?.concat([t]) || [t],
                            ),
                          ]),
                        })
                      }
                    />
                  ))}
                </Grid>
              )}
            </InfoCard>
          </Grid>
        ))}
      </Grid>
      {showPagination && (
        <TablePagination
          component="div"
          count={textFilteredEntities.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Content>
  );
}
