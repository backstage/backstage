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

import React from 'react';
import {
  Link,
  Typography,
  Breadcrumbs as MUIBreadcrumbs,
  Popover,
  withStyles,
} from '@material-ui/core';

type BreadcrumbPage = {
  href: string;
  name: string;
};

type BreadcrumbsProps = {
  pages: (BreadcrumbPage | BreadcrumbPage)[];
};

const UnderlinedText = withStyles({ root: { textDecoration: 'underline' } })(
  Typography,
);

const Breadcrumb = ({ page }: { page: BreadcrumbPage }) => (
  <Link
    underline={page.href ? 'always' : 'none'}
    color="inherit"
    href={page.href}
  >
    {page.name}
  </Link>
);

// Should propbably take Routes instead, to work with the react-router
export const Breadcrumbs = ({ pages }: BreadcrumbsProps) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const hasHiddenBreadcrumbs = pages.length > 3;
  const [firstPage, secondPage, ...expandablePages] = pages;
  const currentPage = pages[pages.length - 1];

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <MUIBreadcrumbs aria-label="breadcrumb">
      {firstPage && pages.length > 1 && <Breadcrumb page={firstPage} />}
      {secondPage && pages.length > 2 && <Breadcrumb page={secondPage} />}
      {hasHiddenBreadcrumbs && (
        <UnderlinedText onClick={handleClick}>...</UnderlinedText>
      )}
      {currentPage && <Typography>{currentPage.name}</Typography>}
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
    </MUIBreadcrumbs>
  );
};
