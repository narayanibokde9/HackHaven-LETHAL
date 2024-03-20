"use client";
import { useState, useRef } from "react";
import { TagsInput } from "react-tag-input-component";
import { setUser } from "@/redux/slice/pushSlice";
import useEthersSigner from "@/hooks/useEthersSigner";
import { useAccount } from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import { initUser } from "@/functions/initUser";
import { uploadFile } from "@/functions/uploadFile";
import { channelgroupimg } from "@/public/community";
import { polybase } from "@/data/polybase/polybase";
import usePolybaseSigner from "@/hooks/usePolybaseSigner";

import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { WCM } from "@/contracts/WCM";
import HashAndError from "@/components/HashAndError";
import { useRouter } from "next/navigation";

function PostIssue() {
	const [files, setFiles] = useState([]);
	const [uploading, setUploading] = useState(false);

	const [issueTitle, setIssueTitle] = useState("");
	const [location, setLocation] = useState("");
	const [tags, setTags] = useState([]);
	const [description, setDescription] = useState("");

	const [processing, setProcessing] = useState(false);
	const [processed, setProcessed] = useState(false);
	const [failed, setFailed] = useState(false);

	const router = useRouter();

	const inputFile = useRef(null);

	const user = useSelector((state) => state.push.user);
	// console.log(user);
	const dispatch = useDispatch();

	const account = useAccount();
	if (account.connector)
		console.log(account.connector), usePolybaseSigner(account);
	const signer = useEthersSigner({ chainId: account.chainId });

	const { data: hash, error, isPending, writeContract } = useWriteContract();

	const createGroup = async (user, groupName, groupDescription) => {
		if (!user || !user.chat) {
			console.error("User or chat object is null or undefined");
			return null; // Handle the error condition appropriately
		}

		const newGroup = await user.chat.group.create(groupName, {
			description: groupDescription,
			image: channelgroupimg,
			members: [],
			admins: [],
			private: false,
			rules: {
				entry: { conditions: [] },
				chat: { conditions: [] },
			},
		});
		console.log(newGroup);
		return newGroup;
	};
	const handleChange = (e) => {
		const selectedFiles = e.target.files;
		setFiles(selectedFiles);
	};
	const handleSubmit = async (event) => {
		setProcessing(true);
		try {
			event.preventDefault();
			let cids = [];
			for (let i = 0; i < files.length; i++) {
				try {
					setUploading(true);
					const newCid = await uploadFile(files[i]);
					cids.push(newCid);
					console.log(cids);
				} catch (error) {
					console.error(error);
				}
			}
			let chatId;
			try {
				const group = await createGroup(user, issueTitle, description);
				chatId = group.chatId;
			} catch (error) {
				console.log("Error in creating Push Group", error);
			}
			try {
				const residentReference = polybase.collection("Issue");
				const timestamp = Date.now();
				const dateString = new Date(timestamp).toString();
				const recordData = await residentReference.create([
					dateString,
					account.address,
					issueTitle,
					[...tags],
					location,
					chatId,
					cids,
					description,
					0,
					true,
				]);
				console.log(recordData);
			} catch (error) {
				console.log("Error in creating Poly Record", error);
			}
			setUploading(false);
			writeContract({
				address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
				abi: WCM.abi,
				functionName: "raiseGrievance",
				args: [chatId, issueTitle, tags, description, location, cids],
			});
			setProcessing(false);
			setProcessed(true);
			router.push("/issuelist");
		} catch (e) {
			setFailed(true);
		}
	};

	const { isLoading: isConfirming, isSuccess: isConfirmed } =
		useWaitForTransactionReceipt({
			hash,
		});

	return (
		<>
			<div className="flex justify-center items-center">
				<div className="hero min-h-screen bg-base-200">
					<div className="hero-content flex-col lg:flex-row-reverse">
						<div className="text-center lg:text-left ml-4">
							<h1 className="text-5xl font-bold">Issue a Grievance</h1>
							<p className="py-6">
								If you have encountered any issues or concerns, we encourage you
								to issue a grievance. Your feedback is invaluable to a better
								community. Please provide details of your grievance, including
								any relevant images, so that we can address it promptly and
								effectively.
							</p>
							{!user && (
								<button
									className="btn btn-info mb-4"
									size="lg"
									onClick={async () => {
										const user = await initUser(signer);
										if (user) {
											if (!user.readMode) {
												dispatch(setUser(user));
											}
										}
									}}
								>
									Initiate Push{" "}
								</button>
							)}
							{useAccount().isConnected && (
								<>
									<div className="w-full shadow-2xl bg-base-100">
										<form className="card-body" onSubmit={handleSubmit}>
											<div className="flex flex-col gap-4 p-16">
												<label className="input input-bordered flex items-center gap-2">
													Issue Title
													<input
														type="text"
														className="grow"
														placeholder="My Grievance"
														value={issueTitle}
														onChange={(e) => {
															setIssueTitle(e.target.value);
														}}
													/>
												</label>
												<label className="input input-bordered flex items-center gap-2">
													Location
													<input
														type="text"
														className="grow"
														placeholder="location"
														value={location}
														onChange={(e) => {
															setLocation(e.target.value);
														}}
													/>
												</label>
												<div>
													<TagsInput
														value={tags}
														onChange={setTags}
														name="Tags"
														placeHolder="Enter relevant Tags"
													/>
												</div>
												<div className="">
													<textarea
														placeholder="Elaborate"
														className="textarea textarea-bordered textarea-lg w-full"
														value={description}
														onChange={(event) =>
															setDescription(event.target.value)
														}
													></textarea>
												</div>
												<input
													type="file"
													id="file"
													ref={inputFile}
													className="file-input file-input-bordered file-input-info w-full max-w-xs"
													onChange={handleChange}
													accept="image/*" // Restricts selection to only image files
													multiple // Allows multiple files to be selected
												/>
												<div className="form-control mt-6">
													<button
														disabled={uploading || !user}
														type="submit"
														className="btn btn-info"
													>
														{uploading ? "Uploading" : "Submit"}
													</button>
													<div className="text-center mt-4">
														<HashAndError
															failed={failed}
															processed={processed}
															processing={processing}
															hash={hash}
															isConfirming={isConfirming}
															isConfirmed={isConfirmed}
															error={error}
														/>
													</div>
												</div>
												{
													!user && (
														<p className="bg-slate-500 rounded-xl w-full text-white text-bold text-center p-4">
															Please initiate Push
														</p>
													) // Show this message if the user is not connected
												}
											</div>
										</form>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default PostIssue;
