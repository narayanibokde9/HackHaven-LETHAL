"use client";

import createPolyRecord from "@/functions/createPolyRecord";
import Image from "next/image";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAccount } from "wagmi";

import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { WCM } from "@/contracts/WCM";
import HashAndError from "@/components/HashAndError";
import { useRouter } from "next/navigation";

function Verify() {
	const account = useAccount();
	const router = useRouter();
	const [userType, setUserType] = useState("res");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [location, setLocation] = useState("");
	const [age, setAge] = useState("");
	const [post, setPost] = useState("");
	const [processing, setProcessing] = useState(false);
	const [processed, setProcessed] = useState(false);
	const [failed,setFailed] = useState(false)

	const { data: hash, error, isPending, writeContract } = useWriteContract();

	const { isLoading: isConfirming, isSuccess: isConfirmed } =
		useWaitForTransactionReceipt({
			hash,
		});

	const user = useSelector((state) => state.push.user);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setProcessing(true); // Start processing

		try {
			if (userType === "res") {
				await writeContract({
					address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
					abi: WCM.abi,
					functionName: "addResident",
					args: [name, age, email, location],
				});
				await createPolyRecord("Resident", account, [
					account.address,
					name,
					email,
					location,
					age,
				]);
				setProcessing(false); // End processing
				setProcessed(true);
				{
					processed && router.push(`/profile/resident/${account.address}`);
				}
			} else {
				await writeContract({
					address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
					abi: WCM.abi,
					functionName: "addEmployee",
					args: [name, age, email, location],
				});
				await createPolyRecord("Employee", account, [
					account.address,
					name,
					email,
					location,
					post,
					age,
				]);
				setProcessed(true);
				setProcessing(false); // End processing
				{processed && router.push(`/profile/employee/${account.address}`)};
			}
		} catch (error) {
			console.error("Error processing transaction:", error);
			setProcessing(false);
			setFailed(true);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		if (name === "name") {
			setName(value);
		}
		if (name === "email") {
			setEmail(value);
		}
		if (name === "location") {
			setLocation(value);
		}
		if (name === "age") {
			setAge(value);
		}
		if (name === "post") {
			setPost(value);
		}
	};

	return (
		<>
			{userType === "res" ? (
				<div className="flex justify-center items-center transition duration-150">
					<div className="hero min-h-screen bg-base-200">
						<div className="hero-content flex-col lg:flex-row-reverse">
							<div className="w-full shadow-2xl bg-base-100">
								<form className="card-body">
									<div className="flex flex-col gap-4 p-16">
										<label className="input input-bordered flex items-center gap-2">
											Name
											<input
												type="text"
												className="grow"
												placeholder="name"
												name="name"
												value={name}
												onChange={handleInputChange}
											/>
										</label>
										<label className="input input-bordered flex items-center gap-2">
											Email Address
											<input
												type="text"
												className="grow"
												placeholder="abc@xyz.com"
												name="email"
												value={email}
												onChange={handleInputChange}
											/>
										</label>
										<label className="input input-bordered flex items-center gap-2">
											Location
											<input
												type="text"
												className="grow"
												placeholder="India"
												name="location"
												value={location}
												onChange={handleInputChange}
											/>
										</label>
										<label className="input input-bordered flex items-center gap-2">
											Age
											<input
												type="text"
												className="grow"
												placeholder="25"
												name="age"
												value={age}
												onChange={handleInputChange}
											/>
										</label>
										<div className="form-control mt-6">
											<button
												className="btn btn-info"
												disabled={isPending}
												onClick={handleSubmit}
											>
												{isPending ? "Confirming..." : "Submit"}
											</button>
											{/* <div>{processing && <div>Processing...</div>}</div> */}
											<div className="text-center mt-4">
												<HashAndError
													failed = {failed}
													processed={processed}
													processing={processing}
													hash={hash}
													isConfirming={isConfirming}
													isConfirmed={isConfirmed}
													error={error}
												/>
											</div>
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
										Verify your identity as a resident of the society and get
										access to all the features of the website.
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
				<div className="flex justify-center items-center transition duration-150">
					<div className="hero min-h-screen bg-base-200">
						<div className="hero-content flex-col lg:flex-row-reverse">
							<div className="text-center lg:text-left ml-4">
								<Image
									src={"/government.png"}
									height="180"
									width="180"
									className="mb-4"
								/>
								<h1 className="text-5xl font-bold">
									{" "}
									Verify as Govt. Employee
								</h1>
								<p className="py-6">
									Verify your identity as a Govt. Employee and get access to all
									the features of the website.
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
											<input
												type="text"
												className="grow"
												placeholder="Name"
												name="name"
												value={name}
												onChange={handleInputChange}
											/>
										</label>
										<label className="input input-bordered flex items-center gap-2">
											Email Address
											<input
												type="text"
												className="grow"
												placeholder="abc@xyz.com"
												name="email"
												value={email}
												onChange={handleInputChange}
											/>
										</label>
										<label className="input input-bordered flex items-center gap-2">
											Location
											<input
												type="text"
												className="grow"
												placeholder="Location"
												name="location"
												value={location}
												onChange={handleInputChange}
											/>
										</label>
										<select
											className="select select-bordered w-full max-w-xs"
											name="post"
											value={post}
											onChange={handleInputChange}
										>
											<option disabled>Select your post</option>
											<option>Public Grievance Officer</option>
											<option>Ombudsman</option>
											<option>Complaints Officer</option>
											<option>Customer Service Representative</option>
										</select>
										<label className="input input-bordered flex items-center gap-2">
											Age
											<input
												type="text"
												className="grow"
												placeholder="25"
												name="age"
												value={age}
												onChange={handleInputChange}
											/>
										</label>
										<div className="form-control mt-6">
											<button
												className="btn btn-info"
												disabled={isPending}
												onClick={handleSubmit}
											>
												{isPending ? "Confirming..." : "Submit"}
											</button>
											<div className="text-center mt-4">
												<HashAndError
													processed={processed}
													processing={processing}
													hash={hash}
													isConfirming={isConfirming}
													isConfirmed={isConfirmed}
													error={error}
												/>
											</div>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
export default Verify;
