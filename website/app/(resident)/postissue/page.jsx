"use client";
import React, { useState } from "react";
import { TagsInput } from "react-tag-input-component";

function PostIssue() {
	const [selected, setSelected] = useState([]);
	return (
		<div className="flex justify-center items-center">
			<div className="hero min-h-screen bg-base-200">
				<div className="hero-content flex-col lg:flex-row-reverse">
					<div className="text-center lg:text-left ml-4">
						<h1 className="text-5xl font-bold"> Issue a Grievance</h1>
						<p className="py-6">
							Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
							excepturi exercitationem quasi. In deleniti eaque aut repudiandae
							et a id nisi.
						</p>
					</div>
					<div className="w-full shadow-2xl bg-base-100">
						<form className="card-body">
							<div className="flex flex-col gap-4 p-16">
								<label className="input input-bordered flex items-center gap-2">
									Issue Title
									<input
										type="text"
										className="grow"
										placeholder="My Grievance"
									/>
								</label>
								<div>
									<TagsInput
										value={selected}
										onChange={setSelected}
										name="Tags"
										placeHolder="Enter relevant Tags"
									/>
								</div>
								<div className="">
									<textarea
										placeholder="Elaborate"
										className="textarea textarea-bordered textarea-lg w-full"
									></textarea>
								</div>
								<label className="input input-bordered flex items-center gap-2">
									<input type="text" className="grow" placeholder="Search" />
									<span className="badge badge-info">Optional</span>
								</label>
								<input
									type="file"
									className="file-input file-input-bordered file-input-info w-full max-w-xs"
								/>
								<div className="form-control mt-6">
									<button className="btn btn-info">Submit</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PostIssue;
