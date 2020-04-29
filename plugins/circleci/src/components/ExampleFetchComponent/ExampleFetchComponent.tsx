/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in wr iting, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { FC, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// import Alert from '@material-ui/lab/Alert';
import { useAsync } from 'react-use';
// import { Progress } from '@backstage/core';

import { CircleCI, GitType, CircleCIOptions, BuildSummary } from 'circleci-api';

// const CIRCLECI_TOKEN: string = '943aa82531ccaab192b4c4bc614507dff31c094c';

// Configure the factory with some defaults

// const api = new CircleCI(options);

// api
//   .builds()
//   .then(d => console.log('token is valid', d))
//   .catch(() => console.error('invalid token'));

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  avatar: {
    height: 32,
    width: 32,
    borderRadius: '50%',
  },
});

type User = {
  gender: string; // "male"
  name: {
    title: string; // "Mr",
    first: string; // "Duane",
    last: string; // "Reed"
  };
  location: object; // {street: {number: 5060, name: "Hickory Creek Dr"}, city: "Albany", state: "New South Wales",…}
  email: string; // "duane.reed@example.com"
  login: object; // {uuid: "4b785022-9a23-4ab9-8a23-cb3fb43969a9", username: "blackdog796", password: "patch",…}
  dob: object; // {date: "1983-06-22T12:30:23.016Z", age: 37}
  registered: object; // {date: "2006-06-13T18:48:28.037Z", age: 14}
  phone: string; // "07-2154-5651"
  cell: string; // "0405-592-879"
  id: {
    name: string; // "TFN",
    value: string; // "796260432"
  };
  picture: { medium: string }; // {medium: "https://randomuser.me/api/portraits/men/95.jpg",…}
  nat: string; // "AU"
};

type DenseTableProps = {
  users: User[];
};

export const DenseTable: FC<DenseTableProps> = ({ users }) => {
  const classes = useStyles();

  return (
    <TableContainer>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Avatar</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Nationality</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.email}>
              <TableCell>
                <img
                  src={user.picture.medium}
                  className={classes.avatar}
                  alt={user.name.first}
                />
              </TableCell>
              <TableCell>
                {user.name.first} {user.name.last}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.nat}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
const options: Partial<CircleCIOptions> = {
  // Required for all requests
  // token: CIRCLECI_TOKEN, // Set your CircleCi API token

  // Optional
  // Anything set here can be overriden when making the request

  // Git information is required for project/build/etc endpoints
  vcs: {
    type: GitType.GITHUB, // default: github
    owner: 'CircleCITest3',
    repo: 'circleci-test',
  },

  // Optional query params for requests
  // options: {
  //   branch: "master", // default: master
  // }
};

const BuildList: React.FC<{ builds: BuildSummary[] }> = ({ builds }) => (
  <ul>
    {builds.map(build => (
      <li key={`build-${build.build_num}`}>
        #{build.build_num} ({build.subject})
      </li>
    ))}
  </ul>
);
const ExampleFetchComponent: FC<{ token: string }> = ({ token }) => {
  const api = useRef<CircleCI | null>(null);
  useEffect(() => {
    if (token !== '') api.current = new CircleCI({ ...options, token });
  }, [token]);

  const { value, loading, error } = useAsync(() => {
    if (api.current) return api.current.builds();
    return Promise.reject('Api token not provided');
  }, [token]);

  if (loading) return <div>loading</div>;
  if (error) return <div>{JSON.stringify(error, null, 2)}</div>;

  return <BuildList builds={value || []} />;
};

export default ExampleFetchComponent;
