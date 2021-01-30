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

import { Tooltip } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  title: string | number | boolean;
  width?: string;
  children?: React.ReactNode;
};

export const OverflowTooltip = (props: Props) => {
  const { title, width, children } = props;

  const divElementRef = useRef<HTMLDivElement>(null);
  const [hoverStatus, setHover] = useState(false);

  const compareSize = () => {
    const textElement = divElementRef.current;
    if (textElement) {
      const compare = textElement.scrollWidth > textElement.clientWidth;
      setHover(compare);
    }
  };

  // compare once and add resize listener on "componentDidMount"
  useEffect(() => {
    compareSize();
    window.addEventListener('resize', compareSize);
  }, []);

  // remove resize listener again on "componentWillUnmount"
  useEffect(
    () => () => {
      window.removeEventListener('resize', compareSize);
    },
    [],
  );

  return (
    <Tooltip
      title={title}
      placement="bottom-start"
      disableHoverListener={!hoverStatus}
    >
      <div
        ref={divElementRef}
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: width ?? '12rem',
        }}
      >
        {children}
      </div>
    </Tooltip>
  );
};
