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

async function getWeights() {
  const poolWeights = await getProtoRevData('pool_weights');
  const weights = [
    { type: 'Balancer Pools', weight: poolWeights['pool_weights']['balancer_weight'] },
    { type: 'StableSwap Pool', weight: poolWeights['pool_weights']['stable_weight'] },
    { type: 'Concentrated Pools', weight: poolWeights['pool_weights']['concentrated_weight'] },
  ];
  return weights;
}

export default function PoolWeights() {
  const [poolWeights, setPoolWeights] = useState('');
  const [maxPoolPointPerTx, setMaxPoolPointPerTx] = useState(0);
  const [maxPoolPointPerBlock, setMaxPoolPointPerBlock] = useState(0);

  useEffect(() => {
    getWeights().then((data) => setPoolWeights(data));
    getProtoRevData('max_pool_points_per_tx').then((data) =>
      setMaxPoolPointPerTx(data['max_pool_points_per_tx'])
    );
    getProtoRevData('max_pool_points_per_block').then((data) =>
      setMaxPoolPointPerBlock(data['max_pool_points_per_block'])
    );
  }, [poolWeights, maxPoolPointPerBlock, maxPoolPointPerTx]);

  return (
    <div style={{ width: '50%' }}>
      <h1>Pool Data</h1>
      <h2>Pool Points</h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="table">
          <TableHead>
            <TableRow>
              <TableCell>Pool Point Type</TableCell>
              <TableCell align="right">Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={'tx'} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {'Max Pool Point Per Tx'}
              </TableCell>
              <TableCell align="right">{maxPoolPointPerTx}</TableCell>
            </TableRow>
            <TableRow key={'block'} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {'Max Pool Point Per Block'}
              </TableCell>
              <TableCell align="right">{maxPoolPointPerBlock}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <h2>Pool Weights</h2>
      {poolWeights && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="table">
            <TableHead>
              <TableRow>
                <TableCell>Pool Type</TableCell>
                <TableCell align="right">Weight</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {poolWeights.map((pool) => {
                return (
                  <TableRow
                    key={pool.type}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {pool.type}
                    </TableCell>
                    <TableCell align="right">{pool.weight}</TableCell>
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
