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
export const currentToDeclaredResourceToPerc = (
  current: number | string,
  resource: number | string,
): number => {
  if (Number(resource) === 0) return 0;

  if (typeof current === 'number' && typeof resource === 'number') {
    return Math.round((current / resource) * 100);
  }

  const numerator: bigint = BigInt(
    typeof current === 'number' ? Math.round(current) : Number(current),
  );
  const denominator: bigint = BigInt(
    typeof resource === 'number' ? Math.round(resource) : Number(resource),
  );

  return Number((numerator * BigInt(100)) / denominator);
};

export const bytesToMiB = (value: string | number): string => {
  return `${(parseFloat(value.toString()) / 1024 / 1024).toFixed(0)}MiB`;
};

export const formatMillicores = (value: string | number): string => {
  return `${(parseFloat(value.toString()) * 1000).toFixed(0)}m`;
};
