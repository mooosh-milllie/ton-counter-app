import { useEffect, useState } from "react";
import { TonConnectButton } from "@tonconnect/ui-react";
import './App.css';
import { useMainContract } from "../src/hooks/useMainContract";
import { useTonConnect } from "../src/hooks/useTonConnect";
import { fromNano } from "@ton/core";
import WebApp from '@twa-dev/sdk'
// EQAm9XSwEyoVGq36jZwISZfJJWmPeTRa-5MzSnNhJ5ye_Haa


function showAlert() {
  WebApp.showAlert('Hey there!');
}

function App() {

  const [initData, setInitData] = useState('')
  const [userId, setUserId] = useState('')
  const [startParam, setStartParam] = useState('')

  useEffect(() => {
    const initWebApp = async () => {
      if (typeof window !== 'undefined') {
        const WebApp = (await import('@twa-dev/sdk')).default;
        WebApp.ready();
        setInitData(WebApp.initData);
        setUserId(WebApp.initDataUnsafe.user?.id.toString() || '');
        setStartParam(WebApp.initDataUnsafe.start_param || '');
      }
    };

    initWebApp();
  }, [])

  const {
    counter_value,
    contractAddress,
    contractBalance,
    sendIncrement,
    sendDeposit,
    requestWithdrawal
  } = useMainContract();

  const { connected } = useTonConnect();

  return (
    <>

      <div style={{display: "flex"}}>
        <p>USER ID: {userId}</p>
        <p>INIT DATA: {initData}</p>
        <p>START PARAM: {startParam}</p>
      </div>
      
      <div>
        <TonConnectButton/>
      </div>

      <div className="Card">
        <b>{WebApp.platform}</b>
        <br />
        <b>Our Contract Address</b>
        <div className="Mint">
          {contractAddress?.slice(0,30) + "..."}
        </div>
        <b>Our Contract Balance</b>
        {contractBalance && 
        <div className="Mint">
          {fromNano(contractBalance)}
        </div>}
      </div>
      <div className="Card">
        <b>Counter Value</b>
        <div className="Mint">
          {counter_value ?? "loading..."}
        </div>
      </div>

    <a
      onClick={() => {
        showAlert();
      }}
    >
      <button>Show Telegram Alert</button>
    </a>
    <br />
      {connected && (
        <a
          onClick={() => {
            sendIncrement();
          }}
        >
          <button>Increment by 3</button>
        </a>
      )}

      <br/>

      {connected && (
        <a
          onClick={() => {
            sendDeposit();
          }}
        >
          <button>Send deposit of 1 TON</button>
        </a>
      )}

      <br/>

      {connected && (
        <a
          onClick={() => {
            requestWithdrawal();
          }}
        >
          <button>Request Withdrawal</button>  
        </a>
)}
    </>
  )
}

export default App
