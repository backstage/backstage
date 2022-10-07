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
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import React from 'react';
import { WithLink } from '../../utils/components';
import { RadarDescription } from '../RadarDescription';

type RadarLegendLinkProps = {
  url?: string;
  description?: string;
  title?: string;
  classes: ClassNameMap<string>;
};

export const RadarLegendLink = ({
  url,
  description,
  title,
  classes,
}: RadarLegendLinkProps) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const toggle = () => {
    setOpen(!open);
  };

  if (description) {
    return (
      <>
        <span
          className={classes.entryLink}
          onClick={handleClickOpen}
          role="button"
          tabIndex={0}
          onKeyPress={toggle}
        >
          <span className={classes.entry}>{title}</span>
        </span>
        {open && (
          <RadarDescription
            open={open}
            onClose={handleClose}
            title={title ? title : 'no title'}
            url={url}
            description={description}
          />
        )}
      </>
    );
  }
  return (
    <WithLink url={url} className={classes.entryLink}>
      <span className={classes.entry}>{title}</span>
    </WithLink>
  );
};
