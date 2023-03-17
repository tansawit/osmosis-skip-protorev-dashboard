import { CELATONE_API } from './constants';
import axios from 'axios';

export async function getPoolData(network, asset) {
  let assetData = {
    name: 'POOL',
    id: 0,
  };
  try {
    const { data } = await axios.get(`${CELATONE_API}/assets/osmosis/${network}/${asset['denom']}`);
    assetData['symbol'] = data['symbol'];
    assetData['precision'] = data['precision'];
    assetData['logo'] = data['logo'];
  } catch {
    if (asset['denom'].startsWith('ibc/')) {
      assetData['symbol'] =
        asset['denom'].split('/')[0] +
        '/' +
        asset['denom'].split('/')[1].slice(0, 3) +
        '...' +
        asset['denom'].split('/')[1].slice(-3);
    }
  }

  return assetData;
}
