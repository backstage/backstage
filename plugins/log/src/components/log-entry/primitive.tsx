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

import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  number: {
    color: '#6753e3',
  },
  bigint: {
    color: '#6753e3',
  },
  boolean: {
    color: '#6753e3',
  },
  symbol: {
    color: '#c41a16',
  },
  null: {
    color: '#6753e3',
  },
  undefined: {
    color: '#6753e3',
  },
  reclaimed: {
    color: '#881391',
    fontStyle: 'italics',
  },
}));

export function isPrimitive(
  t: any,
): t is string | number | bigint | boolean | symbol | null | undefined {
  return (
    t === null ||
    t === undefined ||
    typeof t === 'string' ||
    typeof t === 'number' ||
    typeof t === 'bigint' ||
    typeof t === 'boolean' ||
    typeof t === 'symbol'
  );
}

export function Primitive({
  value,
}: {
  value: string | number | bigint | boolean | symbol | null | undefined;
}) {
  const classes = useStyles();

  const type = typeof value;
  const textualValue =
    typeof value === 'symbol' ? `Symbol(${value.description})` : `${value}`;

  return (
    <span className={classes[type as keyof typeof classes] ?? ''}>
      {textualValue}
    </span>
  );
}

export function Reclaimed({ value }: { value: string }) {
  const classes = useStyles();

  return <span className={classes.reclaimed}>{value}</span>;
}
