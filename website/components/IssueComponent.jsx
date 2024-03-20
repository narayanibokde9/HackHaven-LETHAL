"use client";
import Link from "next/link";
import React from "react";
import { BiUpvote } from "react-icons/bi";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { GrStatusUnknown } from "react-icons/gr";
import useEthersSigner from "@/hooks/useEthersSigner";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { setUser } from "@/redux/slice/pushSlice";
import usePush from "@/hooks/usePush";
import { useAccount } from "wagmi";
import { CONSTANTS, PushAPI } from "@pushprotocol/restapi";
import Image from "next/image";

const IssueComponent = ({ title, message, imageUrl, upvotes, id, chatId, tags }) => {
	const account = useAccount();
	const signer = useEthersSigner({ chainId: account.chainId });

	const dispatch = useDispatch();
	const router = useRouter();
	const { streamChat } = usePush();
	const stream = useSelector((state) => state.push.stream);

	return (
		<div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl w-full mb-4">
			<div className="md:flex">
				{imageUrl && (
					<div className="md:flex-shrink-0">
						<Image
							className="h-48 w-full object-cover md:w-48"
							src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${imageUrl[0]}?pinataGatewayToken=${process.env.NEXT_PUBLIC_PINATA_GATEWAY_TOKEN}`}
							width={500}
							height={500}
							alt={title}
							priority
						/>
					</div>
				)}
				<div className="p-8">
					<div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
						Issue
					</div>
					<h2 className="mt-2 text-xl font-semibold text-gray-800">{title}</h2>
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
					<div className="mt-4 flex justify-between items-center">
						<div className="btn flex items-center">
							<BiUpvote className="h-6 w-6" />
							<span>{upvotes}</span>
							<span className="text-gray-600 pl-2 hidden sm:block">
								Upvotes
							</span>
						</div>

						{useAccount().isConnected == true ? (
							<div
								className="text-gray-600"
								size="lg"
							>
								 <Link href={`/chat/openchat/${chatId}`}>
                                    <div className='btn flex items-center space-x-2'>
                                        <IoChatboxEllipsesOutline className='h-6 w-6' />
                                        <span className='text-gray-600 pl-2 hidden sm:block'>
                                            Join discussion
                                        </span>
                                    </div>
                                </Link>
							</div>
						) : (
							<div className="text-gray-600" size="lg">
								<div className="btn btn-disabled flex items-center space-x-2">
									<IoChatboxEllipsesOutline className="h-6 w-6" />
									<span className="text-gray-600 pl-2 hidden sm:block">
										Connect Wallet to discuss
									</span>
								</div>
							</div>
						)}
						{/* <div className="mt-4 flex justify-between items-center"> */}
						<Link href={`/issuelist/${id}`} className="text-gray-600">
							<div className="btn flex items-center">
								<GrStatusUnknown className="h-6 w-6" />
								<span className="text-gray-600 pl-2 hidden sm:block">
									Check Status
								</span>
							</div>
						</Link>
						<Link href={`/updateissue/${id}`} className="text-gray-600">
							<div className="btn flex items-center">
								<GrStatusUnknown className="h-6 w-6" />
								<span className="text-gray-600 pl-2 hidden sm:block">
									Post update{" "}
									{/*Add a controller to add this employee to the list of employees that have taken up the task for this issue */}
								</span>
							</div>
						</Link>
						{/* </div> */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default IssueComponent;
