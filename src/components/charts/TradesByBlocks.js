import { XAxis, YAxis, Area, AreaChart, Tooltip, BarChart, Bar } from 'recharts';

import { useEffect, useState } from 'react';
import { getHistoricalTrades } from '../../utils/query';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export default function TradesByBlocks() {
  const [trades, setTrades] = useState([]);
  const [tradeDelta, setTradeDelta] = useState([]);

  useEffect(() => {
    getHistoricalTrades().then((data) => {
      let delta = [];
      delta.push({
        block_height: data[0]['block_height'],
        count: 0,
        block: { timestamp: data[0]['block']['timestamp'] },
      });
      for (var i = 1; i < data.length; i++) {
        delta.push({
          block_height: data[i]['block_height'],
          count: data[i]['count'] - data[i - 1]['count'],
          block: { timestamp: data[i]['block']['timestamp'] },
        });
      }
      setTradeDelta(delta);
      setTrades(data);
    });
  }, []);

  function CustomTooltip({ payload, label, active }) {
    if (active) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Block Height: ${label}`}</p>
          <p className="label">{`Timestamp: ${dayjs
            .utc(payload[0]['payload']['block']['timestamp'])
            .toDate()}`}</p>
          <p className="label">{`Trade Count: ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  }

  return (
    <div>
      <h2>Trade Statistics</h2>
      <h3>Trade Growth</h3>
      <AreaChart
        width={1200}
        height={300}
        data={trades}
        margin={{
          right: 30,
          left: 20,
        }}
      >
        <XAxis dataKey="block_height" padding={{ top: 10000 }}></XAxis>
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Area dataKey="count" fill="#801ded" />
      </AreaChart>
      {/*       <h3>Trade by Block</h3>
      <BarChart
        width={1200}
        height={300}
        data={tradeDelta}
        margin={{
          right: 30,
          left: 20,
        }}
      >
        <XAxis dataKey="block_height" padding={{ top: 10000 }}></XAxis>
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" fill="#ffb32c" />
      </BarChart> */}
    </div>
  );
}
