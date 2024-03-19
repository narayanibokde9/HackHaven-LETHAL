import Link from "next/link";
import React from "react";
import { BiUpvote } from "react-icons/bi";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { GrStatusUnknown } from "react-icons/gr";
import updates from "../app/(resident)/issuelist/update.json";

const UpdateIssueStatus = ({ title, message, images, upvotes, id, tags }) => {
	const filteredUpdates = updates.filter((update) => update.issueId === id);

	// Group filtered updates by issueId
	const groupedUpdates = filteredUpdates.reduce((acc, update) => {
		if (!acc[update.issueId]) {
			acc[update.issueId] = [];
		}
		acc[update.issueId].push(update);
		return acc;
	}, {});
	console.log(filteredUpdates);
	return (
		<div className="grid items-stretch grid-cols-2 gap-4 place-content-evenly">
			<div className="col-span-2 self-stretch md:col-span-1 border">
				<div className=" self-center max-w-md mx-auto rounded-xl shadow-md overflow-hidden md:max-w-2xl">
					<div className="p-8 bg-white self-stretch">
						<div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
							Grievance
						</div>
						<h2 className="mt-2 text-xl font-semibold text-gray-800">
							{title}
						</h2>
						<p className="mt-2 text-gray-600">{message}</p>
						{tags && (
							<div className="mt-4 flex flex-wrap">
								{tags.map((tag, index) => (
									<div
										key={index}
										className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs mr-2 mb-2"
									>
										{tag}
									</div>
								))}
							</div>
						)}
						<div className="mt-4 flex justify-between">
							<div className="btn flex items-center">
								<BiUpvote className="h-6 w-6" />
								<span>{upvotes}</span>
								<span className="text-gray-600 pl-2 hidden sm:block">
									Upvotes
								</span>
							</div>

							<Link href={`/chat/${id}`} className="btn flex items-center">
								<IoChatboxEllipsesOutline className="h-6 w-6" />
								<div className="text-gray-600 pl-2 hidden sm:block">
									Discuss here
								</div>
							</Link>
						</div>
					</div>
				</div>
			</div>
			<div className="col-span-2 md:col-span-1 border">
				<div className="carousel">
					{images &&
						images.map((image, index) => (
							<div key={index} className="carousel-item">
								<img src={image} className="" alt="Image" />
							</div>
						))}
				</div>
			</div>

			<div className="col-span-2 md:col-span-1 border p-8 bg-white shadow-xl">
				<h1 className="text-xl font-semibold text-gray-800">Current Status</h1>
				<ul className="timeline timeline-vertical lg:timeline-horizontal">
					{filteredUpdates.map((issueUpdate) => (
						<TimelineItem key={issueUpdate.id} update={issueUpdate} />
					))}
				</ul>
			</div>

			<div className="col-span-2 md:col-span-1 border bg-white shadow-xl">
				<form className="card-body">
					<div className="flex flex-col gap-4">
						<h1 className="font-bold text-4xl text-center text-gray-800">
							Update Status
						</h1>
						<label className="input input-bordered flex items-center gap-2">
							Update Title
							<input type="text" className="grow" placeholder="Update No. X" />
						</label>
						<label className="input input-bordered flex items-center gap-2">
							Update Details
							<input type="text" className="grow" placeholder="abc xyz" />
						</label>
						<div className="form-control mt-6">
							<button className="btn btn-info">Update</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};
const TimelineItem = ({ update }) => {
	// Extracting year and event from the update data
	const year = new Date(update.time).toLocaleString();
	const event = update.title;

	console.log(update);
	return (
		<li>
			<div className="collapse">
				{/* <div className="text-xl font-medium">Click me to show/hide content</div> */}

				<div className="timeline-start">{year}</div>
				<div className="timeline-middle">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						className="w-5 h-5"
					>
						<path
							fillRule="evenodd"
							// d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
							clipRule="evenodd"
						/>
					</svg>
				</div>
				<input type="checkbox" />
				<div className="collapse-title timeline-end timeline-box">{event}</div>
				<div className="collapse-content">
					<p>{update.message}</p>
				</div>
			</div>
			<hr />
		</li>
	);
};

export default UpdateIssueStatus;
