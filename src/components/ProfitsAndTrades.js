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

import { getAssetData } from '../utils/assets';
import TradesByBlocks from './charts/TradesByBlocks';
import ProfitsBydenom from './charts/ProfitsByDenom';

async function getRouteStats() {
  const routeStats = await getProtoRevData('all_route_statistics');
  return routeStats['statistics'];
}

export default function Trades() {
  const [baseDenoms, setBaseDenoms] = useState({});
  const [tradeCount, setTradeCount] = useState('');
  const [allProfits, setAllProfits] = useState([]);
  const [routeStats, setRouteStats] = useState([]);

  useEffect(() => {
    const getDenom = async () => {
      const data = await getProtoRevData('base_denoms');
      const result = await Promise.all(
        data['base_denoms'].map(async (denom) => {
          return await getAssetData('osmo-test-4', denom);
        })
      );

      const denoms = data['base_denoms'].reduce((acc, cur, index) => {
        acc[cur['denom']] = result[index];
        return acc;
      }, {});
      setBaseDenoms(denoms);
    };

    // getProtoRevData('base_denoms').then((data) => {
    //   console.log('denoms', data);
    //   let denoms = {};
    //   data['base_denoms'].map(async (denom) => {
    //     const assetData = await getAssetData('osmo-test-4', denom);
    //     denoms[denom[['denom']]] = assetData;
    //   });
    //   setBaseDenoms(denoms);
    // });
    getDenom();
    getProtoRevData('number_of_trades').then((data) => setTradeCount(data['number_of_trades']));
    getProtoRevData('all_profits').then((data) => setAllProfits(data['profits']));
    getRouteStats().then((data) => setRouteStats(data));
  }, []);

  return (
    <div style={{ width: '60%' }}>
      <h1>Trades</h1>
      <p>Total Number of Trades: {tradeCount}</p>
      <TradesByBlocks />
      <h2>Profits by Asset</h2>
      {allProfits && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="table">
            <TableHead>
              <TableRow>
                <TableCell>Asset</TableCell>
                <TableCell align="right">Cumulative Profit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allProfits.map((profit) => {
                return (
                  <TableRow
                    key={profit.denom}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    {baseDenoms[profit.denom] ? (
                      <>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{ display: 'flex', alignItems: 'center' }}
                        >
                          <img
                            src={baseDenoms[profit.denom].logo}
                            width="20px"
                            style={{ marginRight: '5px' }}
                          />
                          {baseDenoms[profit.denom].symbol}
                        </TableCell>
                        <TableCell align="right">
                          {profit.amount / Math.pow(10, baseDenoms[profit.denom].precision)}
                        </TableCell>
                      </>
                    ) : null}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {<ProfitsBydenom />}
      <h2>Profits by Route</h2>
      {routeStats.length > 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="table">
            <TableHead>
              <TableRow>
                <TableCell>Route</TableCell>
                <TableCell align="right">Number of Trades</TableCell>
                <TableCell align="right">Route Profit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {routeStats.map((route) => {
                return (
                  <TableRow
                    key={route.route.toString()}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {route.route.toString()}
                    </TableCell>
                    <TableCell align="right">{route.number_of_trades}</TableCell>
                    <TableCell align="right">
                      {baseDenoms[route.profits[0].denom] ? (
                        <div
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}
                        >
                          <img
                            src={baseDenoms[route.profits[0].denom].logo}
                            alt={'denom logo'}
                            width="20px"
                            style={{ marginRight: '5px' }}
                          />
                          {route.profits[0].amount /
                            Math.pow(10, baseDenoms[route.profits[0].denom].precision)}{' '}
                          {baseDenoms[route.profits[0].denom].symbol}
                        </div>
                      ) : null}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
    </div>
  );
}