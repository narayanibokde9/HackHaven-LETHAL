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
const createGroup = async (signer) => {
	const user = await initUser(signer);
	const groupName = "Example Group";
	const groupDescription = "This is an example group.";
	const groupImage = "data:image/png;base64,iVBORw0K..."; // example base64 encoded image string
	const walletAddress1 = "0x6a0B3538d8ab0d40A9d49769384e57847Bbe763c";
	const walletAddress2 = "0xba74dc8AC37A833c316b2d705d7FB37b843A9caF";
	// const walletAddress3 = "0xb422822d8a526816E06330Fd2495bee348fD9Eb9";

	const newGroup = await user.chat.group.create(groupName, {
		description: groupDescription,
		image: groupImage,
		members: [walletAddress2],
		admins: [],
		private: false,
		rules: {
			entry: { conditions: [] },
			chat: { conditions: [] },
		},
	});
	return newGroup;
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

const getChats = async (signer) => {
	/** Get Group Info */
	const user = await initUser(signer);
	const groupInfo = await user.chat.group.info(
		"87e029ad9825b78b871710daf12b9700b845b7c39ef1c447304a3d89defc525d"
	);
	return groupInfo;
};

function GroupChat() {
	const account = useAccount();
	const signer = useEthersSigner({ chainId: account.chainId });

	const [chat, setChat] = useState(null);
	const [chatList, setChatList] = useState(null);
	return (
		<>
			<button
				onClick={async () => {
					const res = await createGroup(signer);
					setChat(res);
				}}
			>
				Create Group
			</button>
			<br />
			<button
				onClick={async () => {
					const res = await getChats(signer);
					setChat(res);
					console.log("list", res);
				}}
			>
				Get Groups
			</button>
			<br />
			<button
				onClick={async () => {
					const res = await fetchChats(signer);
					// setChatList(res);
					console.log(res);
				}}
			>
				Get Chats
			</button>
			<br />
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
			{chat && (
				<PushChatComponent chat={chat} signer={signer} account={account} />
			)}
		</>
	);
}
export default GroupChat;
