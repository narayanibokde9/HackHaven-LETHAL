"use client"

import React, { useState } from "react";
import UpdateIssueStatus from "@/components/UpdateIssueStatus";
import { useAccount } from "wagmi";
import { polybase } from "@/data/polybase/polybase";
import usePolybaseSigner from "@/hooks/usePolybaseSigner";
import IssueStatus from "@/components/IssueStatus";

const App = ({ params }) => {
	const id = params.issueid;

    const [issue, setIssue] = useState();

    const account = useAccount();
    if (account.connector) usePolybaseSigner(account);
    const issueReference = polybase.collection("Issue");
    let recordData;
    const findIssueById = async (issueId) => {
        // console.log(account.address,"\n",id);
		const decodedString = decodeURIComponent(issueId);
        recordData = await issueReference.where("id", "==", `${decodedString}`).get();
        const { data } = recordData;
        // console.log(data[0].data);
        setIssue(data[0].data);
    };
    // console.log(account);
    // Find the item in data array based on the id
    findIssueById(id);
	// Render IssueComponent if item is found
	// console.log(issueToDisplay.images);
	return (
		<div className="bg-cover min-h-screen bg-base-200 px-4 py-8">
			<h1 className="font-bold text-4xl mx-8 mb-8 text-center text-gray-800">
				<span className="bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">
					Grievance
				</span>{" "}
				Status
			</h1>
			{issue && (
				<UpdateIssueStatus
					title={issue.title}
					message={issue.message}
					images={issue.images}
					upvotes={issue.upvotes}
					id={issue.id}
					tags={issue.tags}
				/>
			)}
		</div>
	);
};

export default App;
