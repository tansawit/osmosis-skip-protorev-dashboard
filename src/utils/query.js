import axios from 'axios';
import { LCD, PROTOREV, CELATONE_API, NETWORK } from './constants';

export async function getProtoRevData(path) {
  const endpoint = `${LCD[NETWORK]}/${PROTOREV}/${path}`;
  const { data } = await axios.get(`${endpoint}`);
  return data;
}

export async function getAssets() {
  const { data } = await axios.get(`${CELATONE_API}/assets/osmosis/osmo-test-4/prices`);
  return data;
}

export async function getHistoricalTrades() {
  var data = JSON.stringify({
    query: `query test{
      trades(order_by:{block_height:desc}){
          count
          block_height
          block {
              timestamp
          }
      }
  }`,
    variables: {},
  });

  var config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://osmosis-testnet-graphql.alleslabs.dev/v1/graphql',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  let response = await axios(config);
  let trades = response.data.data.trades;
  for (let i = 0; i < trades.length; i++) {
    trades[i]['timestamp'] = new Date(trades[i]['block']['timestamp']);
  }
  return trades.reverse();
}

export async function getProfitsByDenom(denom, precision) {
  var data = JSON.stringify({
    query: `query test{
      profit_by_denoms(where:{denom:{_eq:"${denom}"}}, order_by:{block_height:desc}){
        denom
        amount
        block_height
        block {
          timestamp
        }
      }
  }`,
    variables: {},
  });

  var config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://osmosis-testnet-graphql.alleslabs.dev/v1/graphql',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  let response = await axios(config);
  let profitByDenom = response.data.data.profit_by_denoms;
  for (let i = 0; i < profitByDenom.length; i++) {
    profitByDenom[i]['amount'] = Number(profitByDenom[i]['amount'] / 10 ** precision).toFixed(2);
  }
  return profitByDenom.reverse();
}
