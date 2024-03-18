"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function Verify() {
	const [userType, setUserType] = useState("res");
	return userType === "res" ? (
		<div className="flex justify-center items-center transition duration-150">
			<div className="hero min-h-screen bg-base-200">
				<div className="hero-content flex-col lg:flex-row-reverse">
					<div className="w-full shadow-2xl bg-base-100">
						<form className="card-body">
							<div className="flex flex-col gap-4 p-16">
								<label className="input input-bordered flex items-center gap-2">
									Name
									<input type="text" className="grow" placeholder="name" />
								</label>
								<label className="input input-bordered flex items-center gap-2">
									Email Address
									<input
										type="text"
										className="grow"
										placeholder="abc@xyz.com"
									/>
								</label>
								<label className="input input-bordered flex items-center gap-2">
									Location
									<input type="text" className="grow" placeholder="India" />
								</label>
								<label className="input input-bordered flex items-center gap-2">
									Age
									<input type="text" className="grow" placeholder="25" />
								</label>
								<div className="form-control mt-6">
									<button className="btn btn-info">Submit</button>
								</div>
							</div>
						</form>
					</div>
					<div className="text-right lg:text-right mr-4">
						<div className="flex flex-col items-end">
							<Image
								src={"/people.png"}
								height="180"
								width="180"
								className="mb-4"
							/>
							<h1 className="text-5xl font-bold">Verify as Resident</h1>
							<p className="py-6">
								Verify your identity as a resident of the society and get access
								to all the features of the website.
							</p>
							<button
								onClick={() => setUserType("gov")}
								className="btn btn-info flex items-center"
							>
								<div className="text-black">Verify as Govt. Employee</div>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	) : (
		<div className="flex justify-center items-center">
			<div className="hero min-h-screen bg-base-200">
				<div className="hero-content flex-col lg:flex-row-reverse">
					<div className="text-center lg:text-left ml-4">
						<Image
							src={"/government.png"}
							height="180"
							width="180"
							className="mb-4"
						/>
						<h1 className="text-5xl font-bold"> Verify as Govt. Employee</h1>
						<p className="py-6">
							Verify your identity as a Govt. Employee and get access to all the
							features of the website.
						</p>
						<button
							onClick={() => setUserType("res")}
							className="btn btn-info flex items-center w-64"
						>
							<div className="text-black">Verify as Resident</div>
						</button>
					</div>
					<div className="w-full shadow-2xl bg-base-100">
						<form className="card-body">
							<div className="flex flex-col gap-4 p-16">
								<label className="input input-bordered flex items-center gap-2">
									Name
									<input type="text" className="grow" placeholder="Name" />
								</label>
								<label className="input input-bordered flex items-center gap-2">
									Email Address
									<input
										type="text"
										className="grow"
										placeholder="abc@xyz.com"
									/>
								</label>
								<label className="input input-bordered flex items-center gap-2">
									Location
									<input type="text" className="grow" placeholder="Location" />
								</label>
								<select className="select select-bordered w-full max-w-xs">
									<option disabled selected>
										Select your post
									</option>
									<option>Public Grievance Officer</option>
									<option>Ombudsman</option>
									<option>Complaints Officer</option>
									<option>Customer Service Representative</option>
								</select>
								<label className="input input-bordered flex items-center gap-2">
									Age
									<input type="text" className="grow" placeholder="25" />
								</label>
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
export default Verify;
