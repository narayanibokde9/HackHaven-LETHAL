import React from "react";
import UpdateIssueStatus from "@/components/UpdateIssueStatus";
import data from "../../../(resident)/issuelist/data.json";

const App = ({ params }) => {
	const id = params.issueid;
	console.log(id);
	console.log("hello");
	const findIssueById = (id) => {
		return data.find((issue) => issue.id == id);
	};

	// Find the item in data array based on the title
	const issueToDisplay = findIssueById(id);
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
			{issueToDisplay && (
				<UpdateIssueStatus
					title={issueToDisplay.title}
					message={issueToDisplay.message}
					images={issueToDisplay.images}
					upvotes={issueToDisplay.upvotes}
					id={issueToDisplay.id}
					tags={issueToDisplay.tags}
				/>
			)}
		</div>
	);
};

export default App;
