import { Contract, Cell, Address, beginCell, contractAddress, ContractProvider, Sender, SendMode } from "@ton/core";

export type MainContractConfig = {
    number: number,
    address: Address,
    ownerAddress: Address
}

export function mainContractConfigToCell(config:MainContractConfig) {
    return beginCell().storeUint(config.number, 32).storeAddress(config.address).storeAddress(config.ownerAddress).endCell();
}

export class MainContract implements Contract {
    constructor(readonly address: Address, readonly init?: {code: Cell, data: Cell} ) {

    }

    static createFromConfig(config:MainContractConfig, code: Cell, workChain = 0) {
        const data = mainContractConfigToCell(config);
        const init = {code, data};
        const address = contractAddress(workChain, init);
        return new MainContract(address, init);
    }

    async sendDeploy(provider:ContractProvider, via: Sender, value:bigint) {
        await provider.internal(via, {
            value: value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(2, 32).endCell()
        })
    }

    async sendIncrement(
        provider: ContractProvider,
        sender: Sender,
        value: bigint,
        increment_by: number
    ) {
        const msg_body = beginCell().storeUint(1, 32).storeUint(increment_by, 32).endCell();
        await provider.internal(sender, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body
        });
    }

    async sendDeposit(provider: ContractProvider, sender: Sender, value: bigint) {
        var msg_body = beginCell()
        .storeUint(2, 32) //opCode
        .endCell();

        await provider.internal(sender, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body
        })
    }

    async sendNoCodeDeposit(provider: ContractProvider, sender: Sender, value: bigint) {
        var msg_body = beginCell().endCell();

        await provider.internal(sender, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body
        });
    }

    async sendWithdrawalRequest(provider: ContractProvider, sender: Sender, value: bigint, amount: bigint) {
        var msg_body = beginCell()
        .storeUint(3, 32)
        .storeCoins(amount)
        .endCell();

        await provider.internal(sender, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body
        });
    }

    async getData(provider: ContractProvider) {
        const {stack} = await provider.get("get_contract_storage_data", []);

        return {
            number: stack.readNumber(),
            recentSender: stack.readAddress(),
            ownerAddress: stack.readAddress()
        };
    }

    async getBalance(provider: ContractProvider) {
        const {stack} = await provider.get("balance", []);
        return {balance: stack.readNumber()};
    }
}