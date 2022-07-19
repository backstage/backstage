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
import { CodeClimateData } from '../../api';
import { Link } from '@backstage/core-components';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';

const letterStyle = {
  color: 'white',
  border: 0,
  borderRadius: '3px',
  fontSize: '40px',
  padding: '5px 20px',
};

const fontSize = {
  fontSize: '25px',
};

const letterColor = (letter: string) => {
  if (letter === 'A') {
    return '#45d298';
  } else if (letter === 'B') {
    return '#a5d86e';
  } else if (letter === 'C') {
    return '#f1ce0c';
  } else if (letter === 'D') {
    return '#f29141';
  } else if (letter === 'F') {
    return '#df5869';
  }

  return '#45d298';
};

const useStyles = makeStyles<
  BackstageTheme,
  {
    maintainabilityLetter: string;
    testCoverageLetter: string;
  }
>({
  spaceAround: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  spaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  maintainabilityLetterColor: {
    ...letterStyle,
    backgroundColor: props => letterColor(props.maintainabilityLetter),
  },
  testCoverageLetterColor: {
    ...letterStyle,
    backgroundColor: props => letterColor(props.testCoverageLetter),
  },
  fontSize: {
    ...fontSize,
  },
  letterDetails: {
    ...fontSize,
    paddingLeft: '10px',
  },
  paddingSides20: {
    padding: '0px 20px',
  },
});

export const CodeClimateTable = ({
  codeClimateData,
}: {
  codeClimateData: CodeClimateData;
}) => {
  const {
    repoID,
    maintainability: {
      letter: maintainabilityLetter,
      value: maintainabilityValue,
    },
    testCoverage: { letter: testCoverageLetter, value: testCoverageValue },
    numberOfCodeSmells,
    numberOfDuplication,
    numberOfOtherIssues,
  } = codeClimateData;

  const classes = useStyles({ maintainabilityLetter, testCoverageLetter });

  if (!codeClimateData) {
    return null;
  }

  return (
    <>
      <div className={classes.spaceAround}>
        <div>
          <Typography variant="h6" component="p">
            Maintainability
          </Typography>
          <div className={classes.spaceBetween}>
            <Typography
              className={classes.maintainabilityLetterColor}
              variant="body2"
              component="p"
            >
              {maintainabilityLetter}
            </Typography>
            <Link to={`https://codeclimate.com/repos/${repoID}`}>
              <Typography
                className={classes.letterDetails}
                variant="body2"
                component="p"
              >
                {maintainabilityValue}
              </Typography>
            </Link>
          </div>
        </div>
        <div>
          <Typography variant="h6" component="p">
            Test Coverage
          </Typography>
          <div className={classes.spaceBetween}>
            <Typography
              className={classes.testCoverageLetterColor}
              variant="body2"
              component="p"
            >
              {testCoverageLetter}
            </Typography>
            <Link to={`https://codeclimate.com/repos/${repoID}`}>
              <Typography
                className={classes.letterDetails}
                variant="body2"
                component="p"
              >
                {testCoverageValue}%
              </Typography>
            </Link>
          </div>
        </div>
      </div>
      <Box className={classes.spaceAround} paddingTop="30px">
        <div>
          <Typography variant="h6" component="p">
            Code Smells:
          </Typography>
          <Link
            to={`https://codeclimate.com/repos/${repoID}/issues?category%5B%5D=complexity&status%5B%5D=&status%5B%5D=open&status%5B%5D=confirmed`}
          >
            <Typography
              className={classes.fontSize}
              variant="body2"
              component="p"
            >
              {numberOfCodeSmells}
            </Typography>
          </Link>
        </div>
        <Box paddingLeft="20" paddingRight="20">
          <Typography variant="h6" component="p">
            Duplication:
          </Typography>
          <Link
            to={`https://codeclimate.com/repos/${repoID}/issues?category%5B%5D=duplication&status%5B%5D=&status%5B%5D=open&status%5B%5D=confirmed`}
          >
            <Typography
              className={classes.fontSize}
              variant="body2"
              component="p"
            >
              {numberOfDuplication}
            </Typography>
          </Link>
        </Box>
        <div>
          <Typography variant="h6" component="p">
            Other Issues:
          </Typography>
          <Link
            to={`https://codeclimate.com/repos/${repoID}/issues?category%5B%5D=bugrisk&status%5B%5D=&status%5B%5D=open&status%5B%5D=confirmed`}
          >
            <Typography
              className={classes.fontSize}
              variant="body2"
              component="p"
            >
              {numberOfOtherIssues}
            </Typography>
          </Link>
        </div>
      </Box>
    </>
  );
};
