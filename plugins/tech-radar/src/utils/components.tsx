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
import React from 'react';
import { Link } from '@backstage/core-components';

type WithLinkProps = {
  url?: string;
  urlTarget?: string;
  className: string;
  children: React.ReactNode;
};

export const WithLink = ({
  url,
  urlTarget,
  className,
  children,
}: WithLinkProps): JSX.Element =>
  isValidUrl(url) ? (
    <Link target={urlTarget} className={className} to={url}>
      {children}
    </Link>
  ) : (
    <>{children}</>
  );

export const isValidUrl = (url: String) => {
  return (url && url !== '#' && url.length > 0)
}