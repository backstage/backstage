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

import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Alert from '@material-ui/lab/Alert';
import { useAsync } from 'react-use';
import { Progress } from '@spotify-backstage/core';

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

const ExampleFetchComponent: FC<{}> = () => {
  const { value, loading, error } = useAsync(async (): Promise<User[]> => {
    const response = await fetch('https://randomuser.me/api/?results=20');
    const data = await response.json();
    return data.results;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <DenseTable users={value || []} />;
};

export default ExampleFetchComponent;
