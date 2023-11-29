/*
 * Copyright 2023 The Backstage Authors
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
import React, { FC, useMemo, useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core';
import { useSearchParams } from 'react-router-dom';

import { Entry, Quadrant, Ring } from '../../types';

import { getVisibleEntries } from './layout/entries';
import { useEntryLayout } from './layout/hooks';
import RadarFilters, { EntryFilter } from './RadarFilters';
import RadarLegend from './RadarLegend';
import RadarPlot from './RadarPlot';
import RadarQuadrantSelect from './RadarQuadrantSelect';

const filtered = ({ lifecycle, category, title, vendor }: Entry, filters: EntryFilter) => {
  if (filters.searchTerm) {
    const search = filters.searchTerm.trim().toLowerCase();
    if (!title.toLowerCase().includes(search) && !vendor?.includes(search)) {
      return true;
    }
  }

  if (filters.category && category !== filters.category) {
    return true;
  }

  return !!filters.lifecycle && lifecycle !== filters.lifecycle;
};

const filterByDiscipline = ({ discipline }: Entry, filters: EntryFilter) => {
  return !filters.discipline || discipline.includes(filters.discipline);
};

interface RadarDisplayProps {
  entries: Entry[];
  quadrants: Quadrant[];
  rings: Ring[];
  size: number;
  radius: number;
  svgProps: any;
  activeQuadrant?: Quadrant;
  onQuadrantSelect: (quadrant?: Quadrant) => void;
}

const useQuadrantViewStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: theme.spacing(3),
    '@media (min-width: 1260px)': {
      flexWrap: 'nowrap',
    },
  },
  legendContainer: {
    flex: '1 1 auto',
    paddingLeft: theme.spacing(3),
  },
  quadrantSelect: {
    paddingRight: theme.spacing(2),
  },
  quadrantSvg: {
    overflow: 'visible',
  },
}));

interface ViewProps extends RadarDisplayProps {
  radarEntries: Entry[];
  legendEntries: Entry[];
}

const QuadrantView: FC<ViewProps> = ({
  size,
  svgProps,
  radius,
  radarEntries,
  legendEntries,
  quadrants,
  rings,
  activeQuadrant,
  onQuadrantSelect,
}) => {
  const classes = useQuadrantViewStyles();

  if (!activeQuadrant) return null;

  return (
    <div className={classes.container}>
      <div className={classes.quadrantSelect}>
        <RadarQuadrantSelect
          quadrants={quadrants}
          activeQuadrant={activeQuadrant}
          onQuadrantSelect={onQuadrantSelect}
        />
      </div>
      <div>
        <svg className={classes.quadrantSvg} width={size} height={size} {...svgProps}>
          <RadarPlot size={size} radius={radius} entries={radarEntries} quadrants={[activeQuadrant]} rings={rings} />
        </svg>
      </div>
      <div className={classes.legendContainer}>
        <RadarLegend quadrants={[activeQuadrant]} rings={rings} entries={legendEntries} />
      </div>
    </div>
  );
};

const useRadarViewStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
  },
  radarSvg: {
    display: 'block',
    margin: '0 auto',
    marginBottom: theme.spacing(3),
  },
  quadrantSelect: {
    position: 'absolute',
    top: 0,
    right: theme.spacing(2),
  },
}));

const RadarView: FC<ViewProps> = ({
  size,
  svgProps,
  radius,
  radarEntries,
  legendEntries,
  quadrants,
  rings,
  activeQuadrant,
  onQuadrantSelect,
}) => {
  const classes = useRadarViewStyles();
  return (
    <div className={classes.container}>
      <svg width={size} height={size} className={classes.radarSvg} {...svgProps}>
        <RadarPlot size={size} radius={radius} entries={radarEntries} quadrants={quadrants} rings={rings} />
      </svg>
      <div className={classes.quadrantSelect}>
        <RadarQuadrantSelect
          quadrants={quadrants}
          activeQuadrant={activeQuadrant}
          onQuadrantSelect={onQuadrantSelect}
        />
      </div>
      <RadarLegend quadrants={quadrants} rings={rings} entries={legendEntries} />
    </div>
  );
};

const RadarDisplay: FC<RadarDisplayProps> = props => {
  const { activeQuadrant, onQuadrantSelect, entries, quadrants } = props;
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<EntryFilter>(() => {
    const f = searchParams.get('filters') ?? '{}';

    try {
      return JSON.parse(f);
    } catch (err) {
      console.error(err);
      return {}; // fallback if fail to parse
    }
  });

  // persist filters in searchParams for future visits
  useEffect(() => {
    setSearchParams(
      {
        filters: JSON.stringify(filters),
      },
      {
        replace: true,
      },
    );
  }, [filters, setSearchParams]);

  const filteredEntries = useMemo(
    () =>
      entries
        .map(entry => ({
          ...entry,
          inactive: filtered(entry, filters),
        }))
        .filter(entry => {
          return filterByDiscipline(entry, filters) && (!activeQuadrant || activeQuadrant.id === entry.category);
        }),
    [entries, filters, activeQuadrant],
  );

  const visibleEntries = useMemo(
    () => getVisibleEntries(filteredEntries, activeQuadrant ? 60 : 30),
    [filteredEntries, activeQuadrant],
  );

  const layedOutRadarEntries = useEntryLayout(visibleEntries, !!activeQuadrant);

  const handleQuadrantSelect = (quadrant?: Quadrant) => {
    setFilters({
      ...filters,
      category: quadrant?.id,
    });
    onQuadrantSelect(quadrant);
  };

  return (
    <>
      <RadarFilters value={filters} onChange={setFilters} activeQuadrant={activeQuadrant} />
      {activeQuadrant && (
        <QuadrantView
          {...props}
          quadrants={quadrants}
          onQuadrantSelect={handleQuadrantSelect}
          radarEntries={visibleEntries}
          legendEntries={filteredEntries}
        />
      )}
      {!activeQuadrant && (
        <RadarView
          {...props}
          quadrants={quadrants}
          onQuadrantSelect={handleQuadrantSelect}
          radarEntries={layedOutRadarEntries}
          legendEntries={filteredEntries}
        />
      )}
    </>
  );
};

export default RadarDisplay;
