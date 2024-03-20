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

const joinGroup = async (user, chatId) => {
	const joinGroup = await user.chat.group.join(chatId);
	return joinGroup;
};

//CHANNEL NOTIFICATIONS
const fetchNotifications = async (user) => {
	// userAlice.notification.list(type, {options?})
	const inboxNotifications = await user.notification.list("INBOX");
	console.log("fetch notifs", inboxNotifications);
	return inboxNotifications;
};

const sendNotification = async (user) => {
	const sendNotifRes = await user.channel.send(["*"], {
		notification: { title: "test", body: "test" },
	});
	console.log("sent", sendNotifRes);
	return sendNotifRes;
};

const fetchSubs = async (user) => {
	// userAlice.notification.subscriptions({options?})
	const subChannels = await user.notification.subscriptions();

	return subChannels;
};

const GroupChat = ({ params }) => {
	const chatId = params.chatId;

	const account = useAccount();
	const dispatch = useDispatch();

	const [chat, setChat] = useState(null);
	const [history, setHistory] = useState([]);

	const signer = useEthersSigner({ chainId: account.chainId });
	const user = useSelector((state) => state.push.user);

	const [notifications, setNotifications] = useState([]);

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

					const fetchChatHistoryData = async () => {
						try {
							const chatHistory = await fetchChatHistory(chatId, user);
							setHistory(chatHistory);
						} catch (error) {
							console.error("Error fetching chat history:", error);
						}
					};

					fetchChatHistoryData();
					const fetchNotifications = async () => {
						try {
							// Assuming user.notification.list returns an array of notifications
							const inboxNotifications = await user.notification.list("INBOX");
							setNotifications(inboxNotifications);
						} catch (error) {
							console.error("Error fetching notifications:", error);
						}
					};

					fetchNotifications();
					// console.log("notif", notifications);
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
		console.log(chatId);
		const res = await joinGroup(user, chatId);
		console.log("Joined group:", res);
	};

	const handleFetchHistory = async () => {
		if (!user) return;

		const res = await fetchChatHistory(chatId, user);
		setHistory(res);
	};

	const handleFetchNotif = async () => {
		if (!user) return;

		const res = await fetchNotifications(user);
		setNotifications(res);
	};
	const [message, setMessage] = useState("");

	return (
		<div className="bg-gradient-to-r from-indigo-500  from-10% via-sky-500 via-30% to-emerald-500 to-90%">
			<div className="grid grid-cols-2 items-stretch backdrop-blur-2xl ">
				<div className="flex flex-col">
					<div className="bg-blue-200 p-4 flex justify-between items-center shadow-xl border-blue-500">
						<div className="text-black text-lg font-semibold">
							Notifications
						</div>
					</div>
					<div className=" ">
						<button className="btn m-2" onClick={handleFetchNotif}>
							Fetch Notifs
						</button>
						<div className="m-4 flex flex-col gap-2">
							{notifications &&
								notifications.map((notification, index) => (
									<NotificationComponent
										key={index}
										notification={notification}
									/>
								))}
						</div>
					</div>
				</div>
				<div class="border border-gray-300 h-screen flex flex-col">
					{chat && <ChatHeader chat={chat} />}

					<div class="bg-gray-200 shadow-md p-4">
						<button class="btn btn-primary mr-4" onClick={fetchChats}>
							Fetch Chats
						</button>
						{chatId && (
							<button class="btn btn-primary mr-4" onClick={handleJoinGroup}>
								Join Group
							</button>
						)}
						<button class="btn btn-primary" onClick={handleFetchHistory}>
							Fetch History
						</button>
					</div>

					<div class="flex-grow overflow-y-auto bg-white">
						<div class="chat-history-container p-4">
							{history.length > 0 && (
								<ChatHistory user={user} messages={history} />
							)}
						</div>
					</div>

					<div class="flex items-center border-t border-gray-300 bg-white p-4">
						<input
							type="text"
							placeholder="Type your message..."
							value={message}
							onChange={handleMessageChange}
							class="flex-grow outline-none px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none"
						/>
						<button
							onClick={sendMessageText}
							class="bg-blue-500 text-white font-semibold px-6 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none"
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
	// console.log("for chat", user);
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
							className={`chat text-gray-200 ${
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
								className={`chat-footer text-xs opacity-80 mt-1 text-white`}
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

const NotificationComponent = ({ notification }) => {
	return (
		<div className="alert bg-white text-black">
			<span>{notification.title}</span>
			<span>{notification.message}</span>
		</div>
	);
};

export default GroupChat;
