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

import {
  Divider,
  Link,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import grey from '@material-ui/core/colors/grey';
import ArrowIcon from '@material-ui/icons/ArrowForward';
import React, { FC } from 'react';
import { BackstageTheme } from '../../theme/theme';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  root: {
    maxWidth: 'fit-content',
    padding: theme.spacing(2, 2, 2, 2.5),
  },
  boxTitle: {
    margin: 0,
    color: grey[900],
  },
}));

export type Props = {
  link: string;
  title: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

const BottomLink: FC<Props> = ({ link, title, onClick }) => {
  const classes = useStyles();

  return (
    <div>
      <Divider />
      <Link href={link} onClick={onClick}>
        <ListItem className={classes.root}>
          <ListItemText>
            <Box className={classes.boxTitle} fontWeight="fontWeightBold" m={1}>
              {title}
            </Box>
          </ListItemText>
          <ListItemIcon>
            <ArrowIcon />
          </ListItemIcon>
        </ListItem>
      </Link>
    </div>
  );
};

export default BottomLink;
