"use client";

import { BrowserProvider, JsonRpcSigner } from "ethers";
import { useMemo } from "react";
import { useConnectorClient } from "wagmi";
function clientToSigner(client) {
    const { account, chain, transport } = client;
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    };
    const provider = new BrowserProvider(transport, network);
    const signer = new JsonRpcSigner(provider, account.address);
    return signer;
}
/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
const useEthersSigner = ({ chainId } = {}) => {
    const { data: client } = useConnectorClient({ chainId });
    return useMemo(
        () => (client ? clientToSigner(client) : undefined),
        [client]
    );
}

export default useEthersSigner;
