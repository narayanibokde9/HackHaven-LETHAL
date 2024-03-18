"use client";

import {
	ArrowLeftStartOnRectangleIcon,
	ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/solid";
import { Button } from "@material-tailwind/react";
import { useAccount, useDisconnect } from "wagmi";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/slice/pushSlice";
import { useRouter } from "next/navigation";
import usePush from "@/hooks/usePush";

import useEthersSigner from "@/hooks/useEthersSigner";
import data from "../../issuelist/data.json";

export default function page({ params }) {
	const { disconnect } = useDisconnect();
	const account = useAccount();
	const signer = useEthersSigner({ chainId: account.chainId });
	// console.log(signer);

	const dispatch = useDispatch();
	const router = useRouter();
	const { streamChat } = usePush();
	const stream = useSelector((state) => state.push.stream);
	const id = params.chatid;
	const findIssueById = (id) => {
		return data.find((issue) => issue.id == id);
	};

	const issueToDisplay = findIssueById(id);
	// console.log(issueToDisplay, data);

	return (
		<div className="h-screen w-screen flex items-center justify-center bg-base-200">
			<div className="w-[400px] border-[1px] border-white/30 rounded-3xl flex flex-col items-center p-5 pb-7">
				<ChatBubbleBottomCenterTextIcon className="h-20 w-20 mb-2" />
				<h1 className="font-bold text-4xl align-middle">
					Join Chat for {issueToDisplay && issueToDisplay.title}
				</h1>
				<h3>Messenger</h3>

				{useAccount().isConnected && (
					<>
						<Button
							className="w-full mt-10 rounded-2xl flex items-center justify-center"
							size="lg"
							onClick={async () => {
								const user = await PushAPI.initialize(signer, {
									env: CONSTANTS.ENV.STAGING,
								});
								if (user) {
									if (!user.readMode) {
										dispatch(setUser(user));
										streamChat(user);
										console.log("hello", user);
										// router.push("/dashboard");
									}
								}
							}}
						>
							Initiate Push{" "}
							<ChatBubbleBottomCenterTextIcon className="h-5 w-5 ml-1" />
						</Button>
						<Button
							className="w-full mt-5 rounded-2xl flex items-center justify-center"
							size="lg"
							onClick={() => {
								if (stream) stream.disconnect();
								disconnect();
							}}
						>
							Disconnect{" "}
							<ArrowLeftStartOnRectangleIcon className="h-5 w-5 ml-1 -mt-0.5" />
						</Button>
					</>
				)}
			</div>
		</div>
	);
}
