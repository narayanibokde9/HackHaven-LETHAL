"use client";

import IssueComponent from "@/components/IssueComponent";
import { polybase } from "@/data/polybase/polybase";
import usePolybaseSigner from "@/hooks/usePolybaseSigner";
import Image from "next/image";
import { useState } from "react";
import { useAccount } from "wagmi";

function MyIssues() {
    const [issues, setIssues] = useState([]);
    const account = useAccount();
    if (account.connector) usePolybaseSigner(account);
    const issueReference = polybase.collection("Issue");
    let recordData;
    const myIssues = async () => {
        console.log(account.address);
        recordData = await issueReference
            .where("walletId", "==", `${account.address}`)
            .get();
        const { data } = recordData;
        data.map((issue) => {
            setIssues((prev) => [...prev, issue.data]);
            // console.log(issue.data);
        });
    };
    const deleteIssue = async (id) => {
        console.log("Now deleting record");
        const deletedRecord = await issueReference.record(`${id}`).call("del");
        console.log("Deleted:", deletedRecord);
    };

    return (
        <>
            {issues?.map((issue) => {
                console.log(issue);
                return (
                    <>
                        <IssueComponent title={issue.title} message={issue.message} imageUrl={issue.images} upvotes={issue.upvotes} id={issue.walletId} tags={issue.tags} />
                    </>
                );
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
