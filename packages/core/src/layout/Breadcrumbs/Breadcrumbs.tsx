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

import React, { Fragment } from 'react';
import {
  Typography,
  Breadcrumbs as MUIBreadcrumbs,
  Popover,
  withStyles,
} from '@material-ui/core';

type BreadcrumbsProps = {
  children?: React.ReactNode;
};

const UnderlinedText = withStyles({ root: { textDecoration: 'underline' } })(
  Typography,
);

const StyledBreadcrumbs = withStyles({
  root: {},
  li: { textDecoration: 'underline' },
})(MUIBreadcrumbs);

export const Breadcrumbs = ({ children }: BreadcrumbsProps) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  if (children instanceof Array) {
    const [firstPage, secondPage, ...expandablePages] = children;
    const currentPage = children[children.length - 1];
    const hasHiddenBreadcrumbs = children.length > 3;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    return (
      <Fragment>
        <StyledBreadcrumbs aria-label="breadcrumb">
          {children.length > 1 && firstPage}
          {children.length > 2 && secondPage}
          {hasHiddenBreadcrumbs && (
            <UnderlinedText onClick={handleClick}>...</UnderlinedText>
          )}
          {currentPage}
        </StyledBreadcrumbs>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          The content of the Popover.
        </Popover>
      </Fragment>
    );
  }
  return (
    <StyledBreadcrumbs aria-label="breadcrumb">{children}</StyledBreadcrumbs>
  );
};
