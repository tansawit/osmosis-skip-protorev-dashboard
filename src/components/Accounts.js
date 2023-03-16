import { getProtoRevData } from '../utils/query';
import { useState, useEffect } from 'react';

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Link from '@mui/material/Link';
import { EXPLORER, NETWORK } from '../utils/constants';

async function getAccounts() {
  const developerAccount = await getProtoRevData('developer_account');
  const adminAccount = await getProtoRevData('admin_account');
  const accounts = [
    { name: 'Developer Account', address: developerAccount['developer_account'] },
    { name: 'Admin Account', address: adminAccount['admin_account'] },
  ];
  return accounts;
}

export default function Accounts() {
  const [accounts, setAccounts] = useState('');

  useEffect(() => {
    getAccounts().then((data) => setAccounts(data));
  }, []);

  return (
    <div style={{ width: '50%' }}>
      <h1>Accounts</h1>
      {accounts && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="table">
            <TableHead>
              <TableRow>
                <TableCell>Account</TableCell>
                <TableCell align="right">Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((account) => {
                return (
                  <TableRow
                    key={account.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {account.name}
                    </TableCell>
                    <TableCell align="right">
                      <Link href={`${EXPLORER[NETWORK]}/account/${account.address}`}>
                        {account.address}
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
