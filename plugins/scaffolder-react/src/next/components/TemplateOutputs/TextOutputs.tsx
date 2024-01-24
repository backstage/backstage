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
import { IconComponent, useApp } from '@backstage/core-plugin-api';
import { Button } from '@material-ui/core';
import DescriptionIcon from '@material-ui/icons/Description';
import React from 'react';
import { ScaffolderTaskOutput } from '../../../api';

export const TextOutputs = (props: {
  output: ScaffolderTaskOutput;
  index?: number;
  setIndex?: (index: number | undefined) => void;
}) => {
  const {
    output: { text = [] },
    index,
    setIndex,
  } = props;

  const app = useApp();

  const iconResolver = (key?: string): IconComponent =>
    app.getSystemIcon(key!) ?? DescriptionIcon;

  return (
    <>
      {text
        .filter(({ content }) => content !== undefined)
        .map(({ title, icon }, i) => {
          const Icon = iconResolver(icon);
          return (
            <Button
              key={i}
              startIcon={<Icon />}
              component="div"
              color="primary"
              onClick={() => {
                if (index !== i) {
                  setIndex?.(i);
                }
              }}
              variant={index === i ? 'outlined' : undefined}
            >
              {title}
            </Button>
          );
        })}
    </>
  );
};
