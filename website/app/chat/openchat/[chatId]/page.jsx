"use client";
import useEthersSigner from "@/hooks/useEthersSigner";
import { useAccount } from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setUser } from "@/redux/slice/pushSlice";
import { initUser } from "@/functions/initUser";
import "./styles.css";

const fetchChats = async (user) => {
	const chats = await user.chat.list("CHATS");
	console.log("Chats", chats);
	return chats;
};

const profileInfo = async (user) => {
	const response = await user.profile.info();
	console.log("profile", response);
	return response;
};

const fetchChatHistory = async (chatId, user) => {
	const history = await user.chat.history(chatId);
	console.log("History", history);
	return history;
};

const sendMessage = async (chatId, content, user) => {
	console.log("Sending text");
	const txt = await user.chat.send(chatId, {
		type: "Text",
		content: content,
	});
	console.log("Sent message:", txt);
	return txt;
};

const joinGroup = async (user) => {
	const joinGroup = await user.chat.group.join(
		"87e029ad9825b78b871710daf12b9700b845b7c39ef1c447304a3d89defc525d"
	);
	return joinGroup;
};

const GroupChat = ({ params }) => {
	const chatId = params.chatId;

	const account = useAccount();
	const dispatch = useDispatch();

	const [chat, setChat] = useState(null);
	const [history, setHistory] = useState([]);

	const signer = useEthersSigner({ chainId: account.chainId });
	const user = useSelector((state) => state.push.user);
	// console.log("From Redux", user.chat.account);

	useEffect(() => {
		let isMounted = true;

		const fetchData = async () => {
			try {
				if (!signer || !account) return;

				if (!user) {
					const newUser = await initUser(signer);
					if (newUser && !newUser.readMode) {
						dispatch(setUser(newUser));
					}
				}

				if (!chat) {
					const groupInfo = await user.chat.group.info(chatId);
					if (isMounted) {
						setChat(groupInfo);
					}

					// Fetch chat history immediately after setting the chat
					const history = await user.chat.history(chatId);
					if (isMounted) {
						setHistory(history);
					}
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();

		return () => {
			isMounted = false;
		};
	}, [account, signer, chatId, user, chat]); // Added 'chat' to dependencies

	// Rest of the component code remains the same

	const handleMessageChange = (event) => {
		setMessage(event.target.value);
	};

	const sendMessageText = async () => {
		if (!user) return;

		const res = await sendMessage(chatId, message, user);

		const updatedHistory = await user.chat.history(chatId);
		setHistory(updatedHistory);

		setMessage("");
	};

	const handleJoinGroup = async () => {
		if (!user) return;

		const res = await joinGroup(user);
		console.log("Joined group:", res);
	};

	const handleFetchHistory = async () => {
		if (!user) return;

		const res = await fetchChatHistory(chatId, user);
		setHistory(res);
	};
	const [message, setMessage] = useState("");

	return (
		<div className="">
			<div className="grid grid-cols-2 items-stretch">
				<div className="flex flex-col gap-4 w-52">
					<div className="skeleton h-32 w-full"></div>
					<div className="skeleton h-4 w-28"></div>
					<div className="skeleton h-4 w-full"></div>
					<div className="skeleton h-4 w-full"></div>
				</div>
				<div>
					{chat && <ChatHeader chat={chat} />}
					<div className="border bg-gray-200 shadow-2xl">
						<button className="btn btn-info m-2" onClick={fetchChats}>
							Fetch Chats
						</button>
						<button className="btn btn-info m-2" onClick={handleJoinGroup}>
							Join Group
						</button>
						<button className="btn btn-info m-2" onClick={handleFetchHistory}>
							Fetch History
						</button>
					</div>
					<div className="chat-history-container bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
						{history.length > 0 && (
							<ChatHistory user={user} messages={history} />
						)}
					</div>
					<div className="flex items-center border border-gray-300 rounded-md p-2">
						<input
							type="text"
							placeholder="Type your message..."
							value={message}
							onChange={handleMessageChange}
							className="flex-grow outline-none px-2 py-1"
						/>
						<button
							onClick={sendMessageText}
							className="ml-2 bg-blue-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
						>
							Send
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

const ChatHeader = ({ chat }) => {
	return (
		<div className="bg-blue-200 p-4 flex justify-between items-center shadow-xl border-blue-500">
			<div className="text-black text-lg font-semibold">{chat.groupName}</div>
		</div>
	);
};

const ChatHistory = ({ user, messages }) => {
	console.log("for chat", user);
	const reversedMessages = [...messages].reverse();

	return (
		<div className="">
			{reversedMessages.map((message, index) => {
				const normalizedUserID = message.fromCAIP10.startsWith("eip155:")
					? message.fromCAIP10.slice(9)
					: message.fromCAIP10;
				const normalizedCID = user.chat.account.startsWith("0x")
					? user.chat.account.slice(2)
					: user.chat.account;
				const date = new Date(message.timestamp);
				const month = date.toLocaleString("default", {
					month: "short",
				});
				const day = date.getDate();
				const hours = String(date.getHours()).padStart(2, "0");
				const minutes = String(date.getMinutes()).padStart(2, "0");
				const formattedTime = `${hours}:${minutes}, ${month} ${day} `;

				// console.log(formattedTime);
				return (
					<div className="flex flex-col gap-2">
						<div
							key={index}
							className={`chat text-gray-300 ${
								normalizedUserID === normalizedCID ? "chat-end" : "chat-start"
							}`}
						>
							{normalizedUserID !== normalizedCID ? (
								<div className="chat-header">{normalizedUserID}</div>
							) : (
								<div></div>
							)}
							<div className="chat-bubble bg-gray-200 text-black">
								{message.messageObj.content}
							</div>
							<time
								className={`chat-footer text-xs opacity-50 mt-1 ${
									normalizedUserID === normalizedCID ? "text-white" : " "
								}`}
							>
								at {formattedTime}
							</time>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default GroupChat;
