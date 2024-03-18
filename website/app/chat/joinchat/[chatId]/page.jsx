"use client";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import useEthersSigner from "@/hooks/useEthersSigner";
import { useAccount } from "wagmi";
import { useState } from "react";
import { PushChatComponent } from "@/components/PushChatComponent";

const initUser = async (signer) => {
	const user = await PushAPI.initialize(signer, {
		env: CONSTANTS.ENV.STAGING,
	});
	const response = await user.info();
	console.log("no", response);
	return user;
};
const sendMessage = async (signer) => {
	const user = await initUser(signer);
	console.log("Sending text");
	const txt = await user.chat.send(
		"87e029ad9825b78b871710daf12b9700b845b7c39ef1c447304a3d89defc525d",
		{
			type: "Text",
			content: "Hello Bob!",
		}
	);
	return txt;
};

const joinGroup = async (signer, chatId) => {
	const user = await initUser(signer);
	const joinGroup = await user.chat.group.join(chatId);
	return joinGroup;
};

function GroupChat({ params }) {
	const account = useAccount();
	const signer = useEthersSigner({ chainId: account.chainId });
	const chatId = params.chatId;
	const [chat, setChat] = useState(null);
	return (
		<>
			<button
				onClick={async () => {
					const res = await sendMessage(signer);
					// setChatList(res);
					console.log(res);
				}}
			>
				Send txt
			</button>
			<br />
			<button
				onClick={async () => {
					const res = await joinGroup(signer, chatId);
					console.log(res);
				}}
			>
				Join group
			</button>
			{chat && (
				<PushChatComponent chat={chat} signer={signer} account={account} />
			)}
		</>
	);
}
export default GroupChat;
