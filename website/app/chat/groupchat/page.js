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
	return user;
};
const createGroup = async (signer) => {
	const user = await initUser(signer);
	const groupName = "Example Group";
	const groupDescription = "This is an example group.";
	const groupImage = "data:image/png;base64,iVBORw0K..."; // example base64 encoded image string
	const walletAddress1 = "0x27A4906Aa1F27Fb6968fB21f81d4c0B185642a00";
	const walletAddress2 = "0xf23d703D85ff26B2168E9662502870530D4005E2";
	const walletAddress3 = "0xb422822d8a526816E06330Fd2495bee348fD9Eb9";

	const newGroup = await user.chat.group.create(groupName, {
		description: groupDescription,
		image: groupImage,
		members: [walletAddress2, walletAddress3],
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

const getChats = async (signer) => {
	/** Get Group Info */
	const user = await initUser(signer);
	const groupInfo = await user.chat.group.info(
		"c619cd4b542c5012b48b89bf64198700e8ea1ea64e9eef8b8026017852a7aee5"
	);
	// const chatList = await user.chat.list("CHATS");
	return groupInfo;
};

function GroupChat() {
	const account = useAccount();
	const signer = useEthersSigner({ chainId: account.chainId });

	const [chat, setChat] = useState(null);
	const [chatList, setChatList] = useState(null);
	console.log(chatList);

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
					setChatList(res);
					console.log(res);
				}}
			>
				Get Groups
			</button>
			{chatList && (
				<PushChatComponent chat={chatList} signer={signer} account={account} />
			)}
		</>
	);
}
export default GroupChat;
