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

import React, { useState, useEffect } from 'react';

import { useMountedState } from 'react-use';

const oncePerUrl = new Map<string, Promise<string | undefined>>();
const findValidImageUrlOnce = (url: string) => {
  let image = oncePerUrl.get(url);
  if (!image) {
    image = findValidImageUrl(url);
    oncePerUrl.set(url, image);
  }
  return image;
};

export interface FavIconProps {
  url: string;
  width?: number;
  className?: string;
}

export function FavIcon({ url, width = 20, className }: FavIconProps) {
  const [imageUrl, setImageUrl] = useState<string | undefined>();

  const isMounted = useMountedState();
  useEffect(() => {
    (async () => {
      const validImageUrl = await findValidImageUrlOnce(url);

      if (isMounted()) {
        setImageUrl(validImageUrl);
      }
    })();
  });

  return !imageUrl ? null : (
    <img
      src={imageUrl}
      {...(className && { className })}
      alt="favicon"
      width={width}
      height={width}
    />
  );
}

async function findValidImageUrl(url: string): Promise<string | undefined> {
  const urls = [
    new URL('/favicon.ico', url).href,
    new URL('/favicon.png', url).href,
    new URL('/favicons/favicon.png', url).href,
    new URL('/favicon/favicon.png', url).href,
  ];
  return new Promise<string | undefined>(resolve => {
    Promise.all(
      urls
        .map(imageUrl => ensureValidImageUrl(imageUrl))
        .map(promiseUrl => {
          promiseUrl.then(imageUrl => imageUrl && resolve(imageUrl));
          return promiseUrl;
        }),
    ).then(() => resolve(undefined));
  });
}

async function ensureValidImageUrl(url: string): Promise<string | undefined> {
  const img = new Image();
  return new Promise<string | undefined>(resolve => {
    img.onload = () => resolve(url);
    img.onerror = () => resolve(undefined);
    img.src = url;
  });
}
