import { TonConnectButton } from "@tonconnect/ui-react";
import './App.css';
import { useMainContract } from "../src/hooks/useMainContract";
import { useTonConnect } from "../src/hooks/useTonConnect";
import { fromNano } from "@ton/core";

// EQAm9XSwEyoVGq36jZwISZfJJWmPeTRa-5MzSnNhJ5ye_Haa

function App() {

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
      
      <div>
        <TonConnectButton/>
      </div>

      <div className="Card">
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

      {connected && (
        <a
          onClick={() => {
            sendIncrement();
          }}
        >
          Increment by 3
        </a>
      )}

      <br/>

      {connected && (
        <a
          onClick={() => {
            sendDeposit();
          }}
        >
          Send deposit of 1 TON
        </a>
      )}

      <br/>

      {connected && (
        <a
          onClick={() => {
            requestWithdrawal();
          }}
        >
          Request Withdrawal
        </a>
)}
    </>
  )
}

export default App
