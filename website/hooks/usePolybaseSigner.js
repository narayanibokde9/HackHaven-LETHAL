"use client"
import { polybase } from "@/data/polybase/polybase";
import { useAccount } from "wagmi";

function usePolybaseSigner() {
    const account = useAccount();
    polybase.signer(async (data) => {
        const sig = await signMessage(config, {
            account: account.address,
            message: data,
        });
        return {
            h: "eth-personal-sign",
            sig: sig,
        };
    });
}
export default usePolybaseSigner;
