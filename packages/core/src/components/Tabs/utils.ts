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
import { useState, useEffect } from 'react';

export const chunkArray = (myArray: any[], chunkSize: number) => {
  const results = [];
  while (myArray.length) {
    results.push(myArray.splice(0, chunkSize));
  }
  return results;
};

export const useWindowWidth = () => {
  const isClient = typeof window === 'object';
  const getWidth = () => (isClient ? window.innerWidth : undefined);
  const [windowWidth, setWindowWidth] = useState(getWidth);

  useEffect((): any => {
    if (!isClient) {
      return false;
    }

    const handleResize = () => setWindowWidth(getWidth());

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowWidth;
};
