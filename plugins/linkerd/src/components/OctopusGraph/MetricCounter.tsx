/*
 * Copyright 2021 Spotify AB
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
import { makeStyles } from '@material-ui/core/styles';
import { BackstageTheme } from '@backstage/theme';

const useStyles = makeStyles((theme: BackstageTheme) => ({
  root: {
    fontSize: 12,
  },
  positive: {
    color: theme.palette.success.dark,
  },
  negative: {
    color: theme.palette.error.dark,
  },
}));
export const MetricCounter = ({
  number,
  suffix,
  lessIsMore,
}: {
  number: number;
  suffix: string;
  lessIsMore?: boolean;
}) => {
  const [currentNumber, setCurrentNumber] = useState(number);
  const [diff, setDiff] = useState(0);
  const styles = useStyles();

  const diffNumbers = (a: number, b: number) => {
    return a > b ? a - b : b - a;
  };

  useEffect(() => {
    setDiff(diffNumbers(currentNumber, number));
    setCurrentNumber(number);
  }, [number]);

  const generateDiff = () => {
    if (diff === 0) {
      return null;
    }

    if (diff > 0) {
      return `+${diff}`;
    }

    return `${diff}`;
  };

  const getClassName = () => {
    if (!lessIsMore) {
      return diff > 0 ? styles.positive : styles.negative;
    }

    return diff > 0 ? styles.negative : styles.positive;
  };

  return (
    <>
      <span className={getClassName()}>{generateDiff()}</span>
      <span>
        {currentNumber}
        {suffix}
      </span>
    </>
  );
};
