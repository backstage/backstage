/*
 * Copyright 2020 Spotify AB
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

import { ExploreTool } from '@backstage/plugin-explore-react';
import { BackstageTheme } from '@backstage/theme';
import { makeStyles } from '@material-ui/core';
import React from 'react';
import { ToolCard } from './ToolCard';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 296px)',
    gridGap: theme.spacing(3),
    marginBottom: theme.spacing(6),
  },
}));

type ToolCardGridProps = {
  tools: ExploreTool[];
};

export const ToolCardGrid = ({ tools }: ToolCardGridProps) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {tools.map((card: ExploreTool, ix: any) => (
        <ToolCard card={card} key={ix} />
      ))}
    </div>
  );
};
