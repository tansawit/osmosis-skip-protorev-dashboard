import { CELATONE_API } from './constants';
import axios from 'axios';

export async function getAssetData(network, asset) {
  let assetData = {
    symbol: 'ASSET',
    precision: 0,
    logo: 'https://ui-avatars.com/api/?name=unknown&background=9793F3&color=fff&rounded=true',
  };
  try {
    const { data } = await axios.get(`${CELATONE_API}/assets/osmosis/${network}/${asset['denom']}`);
    assetData['symbol'] = data['symbol'];
    assetData['precision'] = data['precision'];
    assetData['logo'] = data['logo'];
    assetData['price'] = data['price'];
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
