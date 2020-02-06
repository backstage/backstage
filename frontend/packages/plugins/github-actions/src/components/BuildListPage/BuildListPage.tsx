import React, { FC } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
} from '@material-ui/core';
import { RelativeEntityLink } from '@backstage/core';

const BuildListPage: FC<{}> = () => {
  const rows = [
    { message: 'Fixed a Bar', commit: 'fb46ca3dfbd7af5bc43da', id: 165 },
    { message: 'Fixed a Foo', commit: 'd7af5bc43dafb46ca3dfb', id: 164 },
  ];
  return (
    <TableContainer component={Paper}>
      <Table aria-label="CI/CD builds table">
        <TableHead>
          <TableRow>
            <TableCell>Message</TableCell>
            <TableCell>Commit</TableCell>
            <TableCell>Build ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.commit}>
              <TableCell>{row.message}</TableCell>
              <TableCell>{row.commit}</TableCell>
              <TableCell>
                <RelativeEntityLink view={`builds/${row.id}`}>
                  {row.commit}
                </RelativeEntityLink>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BuildListPage;
