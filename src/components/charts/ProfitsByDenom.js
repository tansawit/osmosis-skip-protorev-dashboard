import { CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';

import { useEffect, useState } from 'react';
import { getProfitsByDenom } from '../../utils/query';

export default function ProfitsBydenom() {
  const [profit, setProfit] = useState([]);

  useEffect(() => {
    getProfitsByDenom('uosmo', 6).then((data) => {
      setProfit(data);
    });
  }, []);

  function CustomTooltip({ payload, label, active }) {
    if (active) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Block Height: ${label}`}</p>
          <p className="label">{`Timestamp: ${Date(
            payload[0]['payload']['block']['timestamp']
          )}`}</p>
          <p className="label">{`Cumulative Profit: ${payload[0].value} OSMO`}</p>
        </div>
      );
    }

    return null;
  }

  return (
    <>
      <h3>OSMO</h3>
      <AreaChart
        width={1200}
        height={300}
        data={profit}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="block_height"
          label={{ value: 'Block Height', position: 'end', textAnchor: 'middle' }}
        />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Area type="linear" dataKey="amount" fill="#801ded" />
      </AreaChart>
    </>
  );
}
