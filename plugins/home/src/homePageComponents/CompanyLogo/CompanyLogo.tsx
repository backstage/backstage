/*
 * Copyright 2021 The Backstage Authors
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
import { Typography } from '@material-ui/core';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import React from 'react';

type CompanyLogoProps = {
  logo?: React.ReactNode;
  className?: string;
};

/**
 * A component to display a company logo for the user.
 *
 * @public
 */
export const CompanyLogo = (props: CompanyLogoProps) => {
  const { logo, className } = props;
  const configApi = useApi(configApiRef);

  return (
    <div className={className}>
      {logo ? (
        <>{logo}</>
      ) : (
        <Typography variant="h1">{configApi.getString('app.title')}</Typography>
      )}
    </div>
  );
};
