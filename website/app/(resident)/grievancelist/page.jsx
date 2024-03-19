"use client";
import React, { useState } from "react";
import IssueComponent from "@/components/GrievanceComponent";
import data from "./data.json";
import Link from "next/link";

const App = () => {
	// Get all unique tags from the data
	const tags = [...new Set(data.flatMap((issue) => issue.tags))];

	// State to keep track of selected tags for filtering
	const [selectedTags, setSelectedTags] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");

	// Filter issues based on selected tags or search term
	const filteredIssues = data.filter((issue) => {
		const hasSelectedTags =
			selectedTags.length === 0 || // Show all if no tags selected
			selectedTags.some((tag) => issue.tags.includes(tag));

		const matchesSearchTerm =
			searchTerm === "" || // Show all if search term is empty
			issue.title.toLowerCase().includes(searchTerm.toLowerCase());

		return hasSelectedTags && matchesSearchTerm;
	});

	return (
		<div className="mx-auto py-8 bg-base-200">
			{/* Search input and button */}
			<div className="sticky top-0 flex justify-center -mt-4 mx-8 mb-4 gap-4 border border-blue-400 p-4 rounded-full bg-blue-100 shadow-xl">
				<Link
					href="/postissue"
					className="btn bg-blue-500 text-white border rounded-3xl"
				>
					Post an Issue
				</Link>

				<input
					type="text"
					className="border-gray-300 border rounded-3xl p-2 pl-8"
					placeholder="Search by tag or title..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				{/* <button className="bg-blue-400 text-white rounded-3xl px-4 py-2">
					Clear Field
				</button> */}
				<button
					className="btn btn-circle btn-outline border-blue-500 hover:bg-blue-500 hover:border-blue-500 hover:text-white"
					onClick={() => setSearchTerm("")}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6 text-blue-500 hover:text-white"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			{/* Tags row */}
			<div className="flex justify-center mb-4">
				{tags.map((tag) => (
					<button
						key={tag}
						className={`mx-2 px-4 py-2 rounded-md ${
							selectedTags.includes(tag)
								? "bg-blue-500 text-white"
								: "bg-gray-300 text-gray-800"
						}`}
						onClick={() => {
							// Toggle tag selection
							if (selectedTags.includes(tag)) {
								setSelectedTags(
									selectedTags.filter((selectedTag) => selectedTag !== tag)
								);
							} else {
								setSelectedTags([...selectedTags, tag]);
							}
						}}
					>
						{tag}
					</button>
				))}
			</div>

			{/* Render filtered issues or display "No relevant items" */}
			{filteredIssues.length > 0 ? (
				filteredIssues.map((issue, index) => (
					<div key={index} className="m-2">
						<IssueComponent
							title={issue.title}
							message={issue.message}
							imageUrl={issue.imageUrl}
							upvotes={issue.upvotes}
							id={issue.id}
							tags={issue.tags}
						/>
					</div>
				))
			) : (
				<div className="text-center text-gray-600">No relevant items</div>
			)}
		</div>
	);
};

export default App;
