"use client";

import { polybase } from "@/data/polybase/polybase";
import usePolybaseSigner from "@/hooks/usePolybaseSigner";
import { useAccount } from "wagmi";

async function createRecord(account) {
    console.log(account.address);
    console.log(process.env.NEXT_PUBLIC_POLYBASE_NAMESPACE);
    const residentReference = polybase.collection("Resident");
    // assign public key to polybase
    usePolybaseSigner();
    const recordData = await residentReference.create([
        "2",
        "Shaurya",
        "shaun@gmail.com",
        account.address,
        "kandivali",
        "5",
    ]);
    console.log(recordData);
}

function TestPage() {
    // get account using wagmi
    const account = useAccount();
    return (
        <>
            <button onClick={() => createRecord(account)}>Create Record</button>
        </>
    );
}
export default TestPage;
