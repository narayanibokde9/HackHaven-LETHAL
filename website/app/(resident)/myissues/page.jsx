"use client";

import { polybase } from "@/data/polybase/polybase";
import usePolybaseSigner from "@/hooks/usePolybaseSigner";
import { useAccount } from "wagmi";

function MyIssues() {
    const account = useAccount();
    if (account.connector) usePolybaseSigner(account);
    const issueReference = polybase.collection("Issue");
    let recordData;
    const myIssues = async () => {
        console.log(account.address);
        recordData = await issueReference
            .where("id", "==", `${account.address}`)
            .get();
        const { data } = recordData;
        console.log(data);
        console.log("Now deleting record");
        const deletedRecord = await issueReference
            .record(`${account.address}`)
            .call("del");
        console.log("Deleted:", deletedRecord);
    };
    return (
        <>
            {recordData?.map((issue) => {
                console.log(issue);
                return <div>GOT {issue}</div>;
            })}
            <button
                onClick={async () => await myIssues()}
                className='btn btn-info'
            >
                CLICK ME TO GET ISSUES
            </button>
            <div>MyIssues</div>
        </>
    );
}
export default MyIssues;
