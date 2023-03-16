import './App.css';
import Accounts from './components/Accounts';
import Pool from './components/Pool';
import ProfitsAndTrades from './components/ProfitsAndTrades';

function App() {
  return (
    <div style={{ marginLeft: '1%' }}>
      <>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.svg"
            alt="osmosis logo"
            width="50px"
          />
          <img
            src="https://pbs.twimg.com/profile_images/1558992554347085825/yiBiZXOQ_400x400.jpg"
            alt="skip logo"
            width="50px"
            height="50px"
          />
          <h1>Osmosis-Skip ProtoRev Module Dashboard</h1>
        </div>
        <p>
          Powered by <a href="https://celat.one">Celatone</a> &{' '}
          <a href="https://twitter.com/alleslabs">Alles Labs</a>
        </p>
      </>
      <ProfitsAndTrades />
      <Accounts />
      <Pool />
    </div>
  );
}

export default App;
