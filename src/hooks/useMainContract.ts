import { useEffect, useState } from "react";
import { MainContract } from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract, toNano } from "@ton/core";
import { useTonConnect } from "./useTonConnect";

export function useMainContract() {
    const client = useTonClient();
    
    const [contractData, setContractData] = useState<null | {
        counter_value: number;
        recent_sender: Address;
        owner_address: Address;
    }>();

    const [balance, setBalance] = useState<null | number>(0);

    const { sender } = useTonConnect();
    
    const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

    const mainContract = useAsyncInitialize(
        async () => {
            if (!client) return;

            const contract = new MainContract(
                Address.parse("EQAm9XSwEyoVGq36jZwISZfJJWmPeTRa-5MzSnNhJ5ye_Haa")
            );

            return client.open(contract) as OpenedContract<MainContract>;
        },
        [client]
    );

    useEffect(() => {
        async function getValue() {
            if(!mainContract) return;

            setContractData(null);
            const val = await mainContract.getData();
            const {balance} = await mainContract.getBalance();

            setContractData({
                counter_value: val.number,
                recent_sender: val.recentSender,
                owner_address: val.ownerAddress
            });

            setBalance(balance);

            await sleep(5000); // sleep 5 seconds and poll value again
            getValue();
        }

        getValue();
    }, [mainContract]);

    return {
        contractAddress: mainContract?.address.toString(),
        contractBalance: balance,
        ...contractData,
        sendIncrement: () => {
            return mainContract?.sendIncrement(sender, toNano(0.05), 3);
        },
        sendDeposit: () => {
            return mainContract?.sendDeposit(sender, toNano("1"));
        },
        requestWithdrawal: () => {
            return mainContract?.sendWithdrawalRequest(sender, toNano("0.05"), toNano("0.7"));
        }
    }
}