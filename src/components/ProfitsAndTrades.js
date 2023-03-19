import { getPools, getProtoRevData } from '../utils/query';
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
import { getValue } from '../utils/price';

async function getRouteStats() {
  const routeStats = await getProtoRevData('all_route_statistics');
  return routeStats['statistics'];
}

export default function Trades() {
  const [baseDenoms, setBaseDenoms] = useState({});
  const [tradeCount, setTradeCount] = useState('');
  const [allProfits, setAllProfits] = useState([]);
  const [routeStats, setRouteStats] = useState([]);
  const [pools, setPools] = useState([]);

  useEffect(() => {
    const getDenom = async () => {
      const data = await getProtoRevData('base_denoms');
      const result = await Promise.all(
        data['base_denoms'].map(async (denom) => {
          return await getAssetData('osmosis-1', denom);
        })
      );

      const denoms = data['base_denoms'].reduce((acc, cur, index) => {
        acc[cur['denom']] = result[index];
        return acc;
      }, {});
      setBaseDenoms(denoms);
    };

    const getPoolData = async () => {
      const data = await getPools();
      let poolData = {};
      data.map((pool) => {
        return (poolData[pool['id']] = pool);
      });
      setPools(poolData);
    };

    getDenom();
    getPoolData();
    getProtoRevData('number_of_trades').then((data) => setTradeCount(data['number_of_trades']));
    getProtoRevData('all_profits').then((data) => setAllProfits(data['profits']));
    getRouteStats().then((data) =>
      setRouteStats(
        data.sort((a, b) => (Number(a.number_of_trades) > Number(b.number_of_trades) ? -1 : 1))
      )
    );
  }, []);

  const prettifyRoute = (route) => {
    let outputRoute = [];
    route.map((pool) => {
      if (Number(pool) in pools) {
        outputRoute.push(pools[Number(pool)]['name'] + ' (Pool ' + pool + ')');
      } else {
        outputRoute.push('Pool ' + pool);
      }
      return outputRoute;
    });
    return outputRoute.join(' --> ');
  };

  return (
    <div style={{ width: '60%' }}>
      <h1>Summary</h1>
      <h2>Trades</h2>
      <p>Total Number of Trades: {tradeCount}</p>
      <h2>Profits</h2>
      <p>
        Total Profits: $
        {allProfits.reduce((acc, cur) => {
          if (baseDenoms[cur.denom]) {
            return (
              Number(acc) +
              Number(
                getValue(cur.amount, baseDenoms[cur.denom].precision, baseDenoms[cur.denom].price)
              )
            );
          } else {
            return Number(acc);
          }
        }, 0)}
      </p>
      {allProfits && (
        <>
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
                            {profit.amount / Math.pow(10, baseDenoms[profit.denom].precision)}{' '}
                            {baseDenoms[profit.denom].symbol} ($
                            {getValue(
                              profit.amount,
                              baseDenoms[profit.denom].precision,
                              baseDenoms[profit.denom].price
                            )}
                            )
                          </TableCell>
                        </>
                      ) : null}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      <TradesByBlocks />
      <h2>Profits</h2>
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
                      {prettifyRoute(route.route)}
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
                          ($
                          {getValue(
                            route.profits[0].amount,
                            baseDenoms[route.profits[0].denom].precision,
                            baseDenoms[route.profits[0].denom].price
                          )}
                          )
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
