import { CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';

import { useEffect, useState } from 'react';
import { getProfitsByDenom, getProtoRevData } from '../../utils/query';
import { getAssetData } from '../../utils/assets';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export default function ProfitsBydenom() {
  const [profits, setProfits] = useState([]);

  useEffect(() => {
    const getProfits = async () => {
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
      let profits = [];
      for (const [key, value] of Object.entries(denoms)) {
        let denomProfit = await getProfitsByDenom(key, 6);
        denomProfit = denomProfit.map((v) => ({
          ...v,
          symbol: value['symbol'],
          amount: Number(v['amount']),
        }));

        profits.push({ profitData: denomProfit, assetData: value });
      }
      setProfits(profits);
    };
    getProfits();
  }, []);

  function CustomTooltip({ payload, label, active }) {
    if (active) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Block Height: ${label}`}</p>
          <p className="label">{`Timestamp: ${dayjs
            .utc(payload[0]['payload']['block']['timestamp'])
            .toDate()}`}</p>
          <p className="label">
            {`Cumulative Profit: ${payload[0].value}`} {payload[0].payload.symbol}
          </p>
        </div>
      );
    }

    return null;
  }

  return (
    <>
      <h2>Profits Statistics</h2>
      <h3>Profits by Base Asset</h3>
      {profits.map((data) => {
        return (
          <>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                style={{ marginRight: '2px' }}
                src={data['assetData']['logo']}
                width="20px"
                height="20px"
              />
              <h4>{data['assetData']['symbol']}</h4>
            </div>
            <AreaChart
              width={1200}
              height={300}
              data={data['profitData']}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis dataKey="block_height" />
              <YAxis type="number" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="linear" dataKey="amount" fill="#801ded" />
            </AreaChart>
          </>
        );
      })}
    </>
  );
}
