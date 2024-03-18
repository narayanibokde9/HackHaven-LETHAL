"use client";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import useEthersSigner from "@/hooks/useEthersSigner";
import { useAccount } from "wagmi";
import { useState } from "react";

const initUser = async (signer) => {
	const user = await PushAPI.initialize(signer, {
		env: CONSTANTS.ENV.STAGING,
	});
	const response = await user.info();
	console.log("no", response);
	return user;
};
const fetchChats = async (signer) => {
	// console.log("Sig", signer);
	const user = await initUser(signer);
	const chats = await user.chat.list("CHATS");
	console.log("Chats", chats);
	return chats;
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

const joinGroup = async (signer) => {
	// await userAlice.chat.group.join(chatid)
	const user = await initUser(signer);
	const joinGroup = await user.chat.group.join(
		"87e029ad9825b78b871710daf12b9700b845b7c39ef1c447304a3d89defc525d"
	);
	return joinGroup;
};

const getChats = async (signer, chatId) => {
	/** Get Group Info */
	const user = await initUser(signer);
	const groupInfo = await user.chat.group.info(chatId);
	return groupInfo;
};

function GroupChat({ params }) {
	const chatId = params.chatId;
	const account = useAccount();
	const signer = useEthersSigner({ chainId: account.chainId });

	const [chat, setChat] = useState(null);
	const [chatList, setChatList] = useState(null);
	return (
		<>
			{/* {chat && <ChatHeader chatname={chat.groupName} />} */}
			<button
				onClick={async () => {
					const res = await getChats(signer, chatId);
					setChat(res);
					console.log("grp info", res);
					console.log(res.groupName);
				}}
			>
				Get Group Info
			</button>
			<br />
			{/* <button
				onClick={async () => {
					const res = await fetchChats(signer, chatId);
					// setChatList(res);
					console.log(res);
				}}
			>
				Get Chats
			</button>
			<br /> */}
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
					const res = await joinGroup(signer);
					console.log(res);
				}}
			>
				Join group
			</button>
		</>
	);
}

const ChatHeader = ({ chatName }) => {
	return (
		<div className="bg-blue-200 p-4 flex justify-between items-center">
			<div className="text-black text-lg font-semibold">{chatName}</div>
			{/* Add any additional buttons or elements on the right side if needed */}
		</div>
	);
};

export default GroupChat;
